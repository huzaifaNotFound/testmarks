import sys
import time
import traceback
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from pypdf import PdfReader

OUT = Path(__file__).parent / "txt"

TARGETS = [
    (Path(r"D:\Downloads\jesc1dd"), "jesc108.pdf", "c10/jesc108.txt"),
    (Path(r"D:\projects\test-mark\books"), "Mathematics-Part1-Class-12.pdf", "c12/maths.txt"),
    (Path(r"D:\projects\test-mark\books\drive-download-20260801T104950Z-1-001"), "NCERT-Class-12-Biology.pdf", "c12/biology.txt"),
]


def extract_one(src_dir: Path, name: str, rel: str) -> str:
    dst = OUT / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(str(src_dir / name))
    total = len(reader.pages)
    chunks = []
    start = time.time()
    for i, page in enumerate(reader.pages):
        try:
            chunks.append(page.extract_text() or "")
        except Exception:
            chunks.append("")
        if (i + 1) % 40 == 0 or (i + 1) == total:
            pct = int((i + 1) / total * 100)
            print(f"  [{rel}] page {i + 1}/{total} ({pct}%) {int(time.time() - start)}s", flush=True)
    text = "\n".join(chunks)
    dst.write_text(text, encoding="utf-8")
    return f"OK   {rel} chars={len(text)}"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    todo = [(s, n, r) for s, n, r in TARGETS if not (OUT / r).exists() or (OUT / r).stat().st_size <= 5000]
    if not todo:
        print("Nothing to do — all target files present.")
        return
    print(f"Extracting {len(todo)} files in parallel (4 workers)...", flush=True)
    with ThreadPoolExecutor(max_workers=4) as pool:
        futs = {pool.submit(extract_one, s, n, r): r for s, n, r in todo}
        for fut in as_completed(futs):
            rel = futs[fut]
            try:
                print(fut.result(), flush=True)
            except Exception as exc:
                print(f"FAIL {rel}: {exc}", flush=True)
                traceback.print_exc(file=sys.stdout)
    print("DONE", flush=True)


if __name__ == "__main__":
    main()
