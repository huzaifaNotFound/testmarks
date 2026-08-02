import os
import sys
import time
import traceback
from pathlib import Path

from pypdf import PdfReader

OUT = Path(__file__).parent / "txt"

SOURCES = [
    (Path(r"D:\Downloads\jemh1dd"), "jemh101.pdf", "c10/jemh101.txt"),
    (Path(r"D:\Downloads\jemh1dd"), "jemh102.pdf", "c10/jemh102.txt"),
    (Path(r"D:\Downloads\jemh1dd"), "jemh103.pdf", "c10/jemh103.txt"),
    (Path(r"D:\Downloads\jemh1dd"), "jemh104.pdf", "c10/jemh104.txt"),
    (Path(r"D:\Downloads\jemh1dd"), "jemh105.pdf", "c10/jemh105.txt"),
    (Path(r"D:\Downloads\jemh1dd"), "jemh106.pdf", "c10/jemh106.txt"),
    (Path(r"D:\Downloads\jemh1dd"), "jemh107.pdf", "c10/jemh107.txt"),
    (Path(r"D:\Downloads\jemh1dd"), "jemh108.pdf", "c10/jemh108.txt"),
    (Path(r"D:\Downloads\jemh1dd"), "jemh109.pdf", "c10/jemh109.txt"),
    (Path(r"D:\Downloads\jemh1dd"), "jemh110.pdf", "c10/jemh110.txt"),
    (Path(r"D:\Downloads\jemh1dd"), "jemh111.pdf", "c10/jemh111.txt"),
    (Path(r"D:\Downloads\jemh1dd"), "jemh112.pdf", "c10/jemh112.txt"),
    (Path(r"D:\Downloads\jemh1dd"), "jemh113.pdf", "c10/jemh113.txt"),
    (Path(r"D:\Downloads\jemh1dd"), "jemh114.pdf", "c10/jemh114.txt"),
    (Path(r"D:\Downloads\jesc1dd"), "jesc101.pdf", "c10/jesc101.txt"),
    (Path(r"D:\Downloads\jesc1dd"), "jesc102.pdf", "c10/jesc102.txt"),
    (Path(r"D:\Downloads\jesc1dd"), "jesc103.pdf", "c10/jesc103.txt"),
    (Path(r"D:\Downloads\jesc1dd"), "jesc104.pdf", "c10/jesc104.txt"),
    (Path(r"D:\Downloads\jesc1dd"), "jesc105.pdf", "c10/jesc105.txt"),
    (Path(r"D:\Downloads\jesc1dd"), "jesc106.pdf", "c10/jesc106.txt"),
    (Path(r"D:\Downloads\jesc1dd"), "jesc107.pdf", "c10/jesc107.txt"),
    (Path(r"D:\Downloads\jesc1dd"), "jesc108.pdf", "c10/jesc108.txt"),
    (Path(r"D:\Downloads\jesc1dd"), "jesc109.pdf", "c10/jesc109.txt"),
    (Path(r"D:\Downloads\jesc1dd"), "jesc110.pdf", "c10/jesc110.txt"),
    (Path(r"D:\Downloads\jesc1dd"), "jesc111.pdf", "c10/jesc111.txt"),
    (Path(r"D:\Downloads\jesc1dd"), "jesc112.pdf", "c10/jesc112.txt"),
    (Path(r"D:\Downloads\jesc1dd"), "jesc113.pdf", "c10/jesc113.txt"),
    (Path(r"D:\Downloads\jesc1dd"), "jesc1an.pdf", "c10/answers-science.txt"),
    (Path(r"D:\projects\test-mark\books\drive-download-20260801T103925Z-1-001"), "NCERT-Class-11-Physics-Part-1.pdf", "c11/physics-p1.txt"),
    (Path(r"D:\projects\test-mark\books\drive-download-20260801T103925Z-1-001"), "NCERT-Class-11-Physics-Part-2.pdf", "c11/physics-p2.txt"),
    (Path(r"D:\projects\test-mark\books\drive-download-20260801T103925Z-1-001"), "NCERT-Class-11-Chemistry-Part-1.pdf", "c11/chemistry-p1.txt"),
    (Path(r"D:\projects\test-mark\books\drive-download-20260801T103925Z-1-001"), "NCERT-Class-11-Chemistry-Part-2.pdf", "c11/chemistry-p2.txt"),
    (Path(r"D:\projects\test-mark\books\drive-download-20260801T103925Z-1-001"), "ncert-books-for-class-11-maths.pdf", "c11/maths.txt"),
    (Path(r"D:\projects\test-mark\books\drive-download-20260801T103925Z-1-001"), "NCERT-Class-11-Biology.pdf", "c11/biology.txt"),
    (Path(r"D:\projects\test-mark\books\drive-download-20260801T104950Z-1-001"), "NCERT-Class-12-Physics-Part-1.pdf", "c12/physics-p1.txt"),
    (Path(r"D:\projects\test-mark\books\drive-download-20260801T104950Z-1-001"), "NCERT-Class-12-Physics-Part-2.pdf", "c12/physics-p2.txt"),
    (Path(r"D:\projects\test-mark\books\drive-download-20260801T104950Z-1-001"), "NCERT-Class-12-Chemistry-Part-1.pdf", "c12/chemistry-p1.txt"),
    (Path(r"D:\projects\test-mark\books\drive-download-20260801T104950Z-1-001"), "NCERT-Class-12-Chemistry-Part-2.pdf", "c12/chemistry-p2.txt"),
    (Path(r"D:\projects\test-mark\books\drive-download-20260801T104950Z-1-001"), "Mathematics-Part1-Class-12.pdf", "c12/maths.txt"),
    (Path(r"D:\projects\test-mark\books\drive-download-20260801T104950Z-1-001"), "NCERT-Class-12-Biology.pdf", "c12/biology.txt"),
]


def extract(pdf: Path, rel: str, out: Path) -> int:
    """Extract with live per-page progress so the process never looks frozen."""
    reader = PdfReader(str(pdf))
    total = len(reader.pages)
    chunks = []
    start = time.time()
    print(f"  ... {rel}: opened, {total} pages", flush=True)
    for i, page in enumerate(reader.pages):
        chunks.append(page.extract_text() or "")
        if (i + 1) % 20 == 0 or (i + 1) == total:
            pct = int((i + 1) / total * 100)
            print(f"  ... {rel}: page {i + 1}/{total} ({pct}%) elapsed {int(time.time() - start)}s", flush=True)
    text = "\n".join(chunks)
    out.write_text(text, encoding="utf-8")
    return len(text)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    done = 0
    skipped = 0
    failed = 0
    for src_dir, name, rel in SOURCES:
        dst = OUT / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        if dst.exists() and dst.stat().st_size > 5000:
            skipped += 1
            continue
        pdf = src_dir / name
        print(f"[{done + 1}/{len(SOURCES)}] extracting {name}", flush=True)
        try:
            n = extract(pdf, rel, dst)
            done += 1
            print(f"OK   {rel} chars={n}", flush=True)
        except Exception as exc:
            failed += 1
            print(f"FAIL {rel}: {exc}", flush=True)
            traceback.print_exc(file=sys.stdout)
    print(f"DONE extraction: {done} new, {skipped} skipped, {failed} failed", flush=True)


if __name__ == "__main__":
    main()
