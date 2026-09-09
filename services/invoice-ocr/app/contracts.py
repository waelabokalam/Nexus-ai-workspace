from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class OcrBlock(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    text: str = Field(max_length=10_000)
    confidence: float | None = Field(default=None, ge=0, le=1)
    label: str = Field(default="text", max_length=80)
    order: int | None = Field(default=None, ge=0)
    bbox: list[float] | None = Field(default=None, max_length=8)


class OcrTable(BaseModel):
    rows: list[list[str]] = Field(max_length=300)
    confidence: float | None = Field(default=None, ge=0, le=1)
    bbox: list[float] | None = Field(default=None, max_length=8)


class OcrPage(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    page_index: int = Field(alias="pageIndex", ge=0)
    page_count: int | None = Field(default=None, alias="pageCount", ge=1)
    blocks: list[OcrBlock] = Field(max_length=1_000)
    tables: list[OcrTable] = Field(max_length=100)


class OcrEngineInfo(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: Literal["PP-StructureV3"] = "PP-StructureV3"
    paddleocr_version: str = Field(alias="paddleocrVersion", max_length=30)
    recognition_model: str = Field(alias="recognitionModel", max_length=100)
    language: Literal["auto", "en", "ar", "mixed"]


class OcrDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    engine: OcrEngineInfo
    duration_ms: float = Field(alias="durationMs", ge=0)
    pages: list[OcrPage] = Field(min_length=1, max_length=50)
    warnings: list[str] = Field(default_factory=list, max_length=50)

