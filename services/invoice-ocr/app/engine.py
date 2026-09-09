from __future__ import annotations

import gc
import importlib.metadata
import os
import re
import threading
import time
from collections.abc import Iterable
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

from .contracts import OcrBlock, OcrDocument, OcrEngineInfo, OcrPage, OcrTable

LANGUAGE_MODELS = {
    "auto": "arabic_PP-OCRv5_mobile_rec",
    "en": "en_PP-OCRv5_mobile_rec",
    "ar": "arabic_PP-OCRv5_mobile_rec",
    "mixed": "arabic_PP-OCRv5_mobile_rec",
}


class _TableParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.rows: list[list[str]] = []
        self._row: list[str] | None = None
        self._cell: list[str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        del attrs
        if tag.lower() == "tr":
            self._row = []
        elif tag.lower() in {"td", "th"} and self._row is not None:
            self._cell = []

    def handle_data(self, data: str) -> None:
        if self._cell is not None:
            self._cell.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() in {"td", "th"} and self._row is not None and self._cell is not None:
            self._row.append(" ".join("".join(self._cell).split()))
            self._cell = None
        elif tag.lower() == "tr" and self._row is not None:
            if any(self._row):
                self.rows.append(self._row)
            self._row = None


def _table_rows(content: str) -> list[list[str]]:
    if "<tr" in content.lower():
        parser = _TableParser()
        parser.feed(content)
        return parser.rows[:300]
    rows: list[list[str]] = []
    for line in content.splitlines():
        if "|" not in line:
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if cells and not all(re.fullmatch(r":?-{2,}:?", cell) for cell in cells):
            rows.append(cells)
    return rows[:300]


def _plain(value: Any) -> Any:
    if isinstance(value, dict):
        return {str(key): _plain(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_plain(item) for item in value]
    if hasattr(value, "tolist"):
        return _plain(value.tolist())
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    return str(value)


def _result_json(result: Any) -> dict[str, Any]:
    value = getattr(result, "json", result)
    if callable(value):
        value = value()
    value = _plain(value)
    if isinstance(value, dict) and isinstance(value.get("res"), dict):
        return value["res"]
    if not isinstance(value, dict):
        raise TypeError("PP-StructureV3 returned a malformed page result")
    return value


def _box(value: Any) -> list[float] | None:
    flattened: list[float] = []
    source = _plain(value)
    if not isinstance(source, list):
        return None
    for item in source:
        if isinstance(item, list):
            flattened.extend(float(number) for number in item if isinstance(number, (int, float)))
        elif isinstance(item, (int, float)):
            flattened.append(float(item))
    return flattened[:8] or None


def normalize_pp_structure_results(
    results: Iterable[Any],
    *,
    language: str,
    recognition_model: str,
    duration_ms: float,
) -> OcrDocument:
    pages: list[OcrPage] = []
    warnings: list[str] = []
    for fallback_index, result in enumerate(results):
        data = _result_json(result)
        ocr = data.get("overall_ocr_res") or {}
        texts = ocr.get("rec_texts") or []
        scores = ocr.get("rec_scores") or []
        boxes = ocr.get("rec_boxes") or ocr.get("rec_polys") or []
        blocks: list[OcrBlock] = []
        for index, text in enumerate(texts[:1_000]):
            if not str(text).strip():
                continue
            score = float(scores[index]) if index < len(scores) else None
            blocks.append(OcrBlock(
                text=str(text).strip(),
                confidence=score,
                label="text",
                order=index,
                bbox=_box(boxes[index]) if index < len(boxes) else None,
            ))

        tables: list[OcrTable] = []
        table_results = data.get("table_res_list") or []
        for table in table_results[:100]:
            html = table.get("pred_html") if isinstance(table, dict) else None
            if not html:
                continue
            table_ocr = table.get("table_ocr_pred") or {}
            table_scores = table_ocr.get("rec_scores") or []
            confidence = sum(float(score) for score in table_scores) / len(table_scores) if table_scores else None
            rows = _table_rows(str(html))
            if rows:
                tables.append(OcrTable(rows=rows, confidence=confidence, bbox=_box(table.get("cell_box_list"))))

        if not tables:
            for block in (data.get("parsing_res_list") or [])[:1_000]:
                if not isinstance(block, dict) or str(block.get("block_label", "")).lower() != "table":
                    continue
                rows = _table_rows(str(block.get("block_content", "")))
                if rows:
                    page_average = sum(item.confidence or 0 for item in blocks) / len(blocks) if blocks else None
                    tables.append(OcrTable(rows=rows, confidence=page_average, bbox=_box(block.get("block_bbox"))))

        if not blocks:
            warnings.append(f"Page {fallback_index + 1} contained no recognized text")
        pages.append(OcrPage(
            pageIndex=int(data.get("page_index") if data.get("page_index") is not None else fallback_index),
            pageCount=int(data["page_count"]) if data.get("page_count") else None,
            blocks=blocks,
            tables=tables,
        ))

    if not pages:
        raise ValueError("PP-StructureV3 returned no document pages")
    pages.sort(key=lambda page: page.page_index)
    if len(pages) > 50:
        raise ValueError("Invoice exceeds the 50-page safety limit")
    return OcrDocument(
        engine=OcrEngineInfo(
            paddleocrVersion=importlib.metadata.version("paddleocr"),
            recognitionModel=recognition_model,
            language=language,
        ),
        durationMs=duration_ms,
        pages=pages,
        warnings=warnings,
    )


class PaddleStructureEngine:
    def __init__(self) -> None:
        self._pipelines: dict[str, Any] = {}
        self._pipeline_lock = threading.Lock()
        self._inference_lock = threading.Lock()

    def _pipeline(self, recognition_model: str) -> Any:
        with self._pipeline_lock:
            if recognition_model in self._pipelines:
                return self._pipelines[recognition_model]
            # English and Arabic each require the complete document pipeline.
            # Retain only one language pipeline so a mixed workload does not
            # permanently double the worker's already substantial memory use.
            self._pipelines.clear()
            gc.collect()
            from paddleocr import PPStructureV3

            pipeline = PPStructureV3(
                device=os.getenv("NEXUS_OCR_DEVICE", "cpu"),
                layout_detection_model_name="PP-DocLayout-S",
                text_detection_model_name="PP-OCRv5_mobile_det",
                text_recognition_model_name=recognition_model,
                wired_table_structure_recognition_model_name="SLANet_plus",
                wireless_table_structure_recognition_model_name="SLANet_plus",
                use_doc_orientation_classify=True,
                use_doc_unwarping=True,
                use_textline_orientation=True,
                use_seal_recognition=False,
                use_table_recognition=True,
                use_formula_recognition=False,
                use_chart_recognition=False,
                use_region_detection=False,
            )
            self._pipelines[recognition_model] = pipeline
            return pipeline

    def extract(self, path: Path, language: str) -> OcrDocument:
        effective_language = language if language in LANGUAGE_MODELS else "auto"
        if effective_language == "auto":
            configured = os.getenv("NEXUS_OCR_DEFAULT_LANGUAGE", "ar")
            effective_language = configured if configured in LANGUAGE_MODELS else "ar"
        recognition_model = LANGUAGE_MODELS[effective_language]
        started = time.perf_counter()
        # Paddle's process-local inference objects are not documented as
        # thread-safe, so predictions are serialized while models stay warm.
        with self._inference_lock:
            pipeline = self._pipeline(recognition_model)
            results = list(pipeline.predict(input=str(path)))
        duration_ms = (time.perf_counter() - started) * 1_000
        return normalize_pp_structure_results(
            results,
            language=language,
            recognition_model=recognition_model,
            duration_ms=duration_ms,
        )
