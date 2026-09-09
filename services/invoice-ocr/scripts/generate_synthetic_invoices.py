"""Generate non-private OCR evaluation invoices outside Git.

The fixtures deliberately vary layout and image quality. They contain invented
suppliers and references only; no customer or production data is used.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

WIDTH, HEIGHT = 1654, 2339
FONT_CANDIDATES = (
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
)


def font(size: int) -> ImageFont.FreeTypeFont:
    path = next((candidate for candidate in FONT_CANDIDATES if Path(candidate).exists()), None)
    if path is None:
        raise RuntimeError("Install Arial or DejaVu Sans to generate the synthetic OCR fixtures")
    return ImageFont.truetype(path, size)


def invoice_page(*, supplier: str, reference: str, language: str = "en", unusual: bool = False) -> Image.Image:
    image = Image.new("RGB", (WIDTH, HEIGHT), "white")
    draw = ImageDraw.Draw(image)
    heading, body, small = font(68), font(42), font(34)
    rtl = language == "ar"
    text_options = {"direction": "rtl", "language": "ar"} if rtl else {}
    anchor = "ra" if rtl else "la"
    left = WIDTH - 100 if rtl else 100
    draw.text((left, 100), supplier, fill="black", font=heading, anchor=anchor, **text_options)
    labels = (
        ["فاتورة ضريبية", f"رقم الفاتورة: {reference}", "تاريخ الفاتورة: ٠٩/٠٩/٢٠٢٦", "العملة: درهم"]
        if rtl
        else ["TAX INVOICE", f"Invoice No: {reference}", "Invoice Date: 09/09/2026", "Currency: AED"]
    )
    for index, line in enumerate(labels):
        draw.text((left, 230 + index * 62), line, fill="black", font=body, anchor=anchor, **text_options)

    x = [100, 700, 880, 1060, 1300, 1550]
    top, row_height = 560, 92
    headers = (["Qty", "Description", "Unit Price", "Unit", "Line Total"] if unusual else
               (["المبلغ", "سعر الوحدة", "الوحدة", "الكمية", "الوصف"] if rtl else
                ["Description", "Qty", "Unit", "Unit Price", "Line Total"]))
    rows = (
        [["١٨٠٫٠٠", "١٨٫٠٠", "كجم", "١٠", "دجاج Chicken"], ["٤٠٫٠٠", "٢٠٫٠٠", "حبة", "٢", "زيت Oil"]]
        if rtl else
        ([ ["10", "Chicken Breast", "18.00", "kg", "180.00"], ["2", "Olive Oil", "20.00", "unit", "40.00"] ] if unusual else
         [["Chicken Breast", "10", "kg", "18.00", "180.00"], ["Olive Oil", "2", "unit", "20.00", "40.00"]])
    )
    for boundary in x:
        draw.line((boundary, top, boundary, top + row_height * 3), fill="black", width=3)
    draw.line((100, top, 1550, top), fill="black", width=3)
    for row_index in range(1, 4):
        draw.line((100, top + row_index * row_height, 1550, top + row_index * row_height), fill="black", width=3)
    for column, value in enumerate(headers):
        draw.text((x[column] + 15, top + 22), value, fill="black", font=small)
    for row_index, row in enumerate(rows, 1):
        for column, value in enumerate(row):
            draw.text((x[column] + 15, top + row_index * row_height + 22), value, fill="black", font=small)

    totals = (["المجموع الفرعي: ٢٢٠٫٠٠ درهم", "ضريبة القيمة المضافة: ١١٫٠٠ درهم", "الإجمالي النهائي: ٢٣١٫٠٠ درهم"]
              if rtl else ["Subtotal: AED 220.00", "VAT: AED 11.00", "Grand Total: AED 231.00"])
    for index, line in enumerate(totals):
        draw.text((left, 920 + index * 62), line, fill="black", font=body, anchor=anchor, **text_options)
    return image


def generate(output: Path) -> None:
    output.mkdir(parents=True, exist_ok=True)
    clean = invoice_page(supplier="Synthetic Gulf Foods LLC", reference="SYN-EN-1001")
    clean.save(output / "01-clean-english.png")

    photographed = clean.rotate(2.2, expand=False, fillcolor=(232, 225, 208))
    photographed = ImageEnhance.Contrast(photographed).enhance(0.82)
    photographed.save(output / "02-photographed.jpg", quality=74)

    table_heavy = clean.copy()
    draw = ImageDraw.Draw(table_heavy)
    for index in range(10):
        draw.text((120, 1260 + index * 64), f"Synthetic item {index + 3}     {index + 1} unit     {12 + index}.00 AED", fill="black", font=font(32))
    table_heavy.save(output / "03-table-heavy.png")

    second = invoice_page(supplier="Synthetic Gulf Foods LLC", reference="SYN-PDF-2001")
    clean.save(output / "04-multi-page.pdf", save_all=True, append_images=[second], resolution=150)

    arabic = invoice_page(supplier="شركة أغذية الخليج التجريبية", reference="SYN-AR-3001", language="ar")
    arabic.save(output / "05-arabic.png")

    mixed = invoice_page(supplier="شركة Synthetic Gulf Foods", reference="SYN-MIX-4001", language="ar")
    mixed.save(output / "06-mixed-arabic-english.webp", quality=90)

    low_quality = clean.resize((827, 1169)).filter(ImageFilter.GaussianBlur(1.3))
    low_quality = ImageEnhance.Contrast(low_quality).enhance(0.62)
    low_quality.save(output / "07-low-quality.jpg", quality=38)

    invoice_page(supplier="Synthetic Layout Foods", reference="SYN-ODD-5001", unusual=True).save(
        output / "08-unusual-table.png"
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path, help="Directory for generated fixtures (prefer /tmp)")
    generate(parser.parse_args().output)
