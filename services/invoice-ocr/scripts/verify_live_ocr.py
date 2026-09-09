"""Exercise the internal HTTP contract against the synthetic fixture set."""

from __future__ import annotations

import argparse
import json
import mimetypes
from pathlib import Path

import httpx

LANGUAGES = {
    "05-arabic.png": "ar",
    "06-mixed-arabic-english.webp": "mixed",
}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--token", required=True)
    parser.add_argument("fixtures", type=Path)
    args = parser.parse_args()
    results = []
    with httpx.Client(timeout=180) as client:
        for path in sorted(args.fixtures.iterdir()):
            if not path.is_file():
                continue
            mime_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
            response = client.post(
                f"{args.url.rstrip('/')}/v1/extract",
                content=path.read_bytes(),
                headers={
                    "authorization": f"Bearer {args.token}",
                    "content-type": mime_type,
                    "x-file-name": path.name,
                    "x-ocr-language": LANGUAGES.get(path.name, "en"),
                },
            )
            record = {"fixture": path.name, "status": response.status_code}
            if response.is_success:
                document = response.json()
                record.update({
                    "durationMs": round(document["durationMs"]),
                    "pages": len(document["pages"]),
                    "blocks": sum(len(page["blocks"]) for page in document["pages"]),
                    "tables": sum(len(page["tables"]) for page in document["pages"]),
                    "tableRows": sum(
                        len(table["rows"])
                        for page in document["pages"]
                        for table in page["tables"]
                    ),
                })
            else:
                record["error"] = response.text[:300]
            results.append(record)
    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
