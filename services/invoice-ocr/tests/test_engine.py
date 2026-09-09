from app.engine import _table_rows, normalize_pp_structure_results


def fake_page(page_index: int = 0):
    return {
        "res": {
            "page_index": page_index,
            "page_count": 2,
            "overall_ocr_res": {
                "rec_texts": ["Acme Foods LLC", "Invoice No: INV-42"],
                "rec_scores": [0.97, 0.91],
                "rec_boxes": [[0, 0, 100, 20], [0, 30, 100, 50]],
            },
            "table_res_list": [{
                "pred_html": "<table><tr><th>Item</th><th>Qty</th></tr><tr><td>Oil</td><td>2</td></tr></table>",
                "table_ocr_pred": {"rec_scores": [0.9, 0.8]},
                "cell_box_list": [[0, 0, 100, 100]],
            }],
        }
    }


def test_normalizes_pp_structure_pages_and_tables(monkeypatch):
    monkeypatch.setattr("importlib.metadata.version", lambda _: "3.7.0")
    document = normalize_pp_structure_results(
        [fake_page(1), fake_page(0)],
        language="en",
        recognition_model="en_PP-OCRv5_mobile_rec",
        duration_ms=123.4,
    )
    assert [page.page_index for page in document.pages] == [0, 1]
    assert document.pages[0].blocks[0].text == "Acme Foods LLC"
    assert document.pages[0].blocks[0].confidence == 0.97
    assert document.pages[0].tables[0].rows[1] == ["Oil", "2"]
    assert document.engine.paddleocr_version == "3.7.0"


def test_parses_markdown_table_without_separator_row():
    rows = _table_rows("| Item | Qty |\n|---|---|\n| Oil | 2 |")
    assert rows == [["Item", "Qty"], ["Oil", "2"]]


def test_rejects_empty_model_output(monkeypatch):
    monkeypatch.setattr("importlib.metadata.version", lambda _: "3.7.0")
    try:
        normalize_pp_structure_results([], language="ar", recognition_model="arabic_PP-OCRv5_mobile_rec", duration_ms=1)
    except ValueError as error:
        assert "no document pages" in str(error)
    else:
        raise AssertionError("Empty PaddleOCR output should fail")

