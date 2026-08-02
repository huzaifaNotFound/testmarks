import os
import sys
import traceback

from pypdf import PdfReader

BASE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(BASE, "extracted")
os.makedirs(OUT_DIR, exist_ok=True)

C11 = r"D:\projects\test-mark\books\drive-download-20260801T103925Z-1-001"
C12 = r"D:\projects\test-mark\books\drive-download-20260801T104950Z-1-001"

BOOKS = [
    ("physics", "11", os.path.join(C11, "NCERT-Class-11-Physics-Part-1.pdf")),
    ("physics", "11", os.path.join(C11, "NCERT-Class-11-Physics-Part-2.pdf")),
    ("chemistry", "11", os.path.join(C11, "NCERT-Class-11-Chemistry-Part-1.pdf")),
    ("chemistry", "11", os.path.join(C11, "NCERT-Class-11-Chemistry-Part-2.pdf")),
    ("mathematics", "11", os.path.join(C11, "ncert-books-for-class-11-maths.pdf")),
    ("biology", "11", os.path.join(C11, "NCERT-Class-11-Biology.pdf")),
    ("physics", "12", os.path.join(C12, "NCERT-Class-12-Physics-Part-1.pdf")),
    ("physics", "12", os.path.join(C12, "NCERT-Class-12-Physics-Part-2.pdf")),
    ("chemistry", "12", os.path.join(C12, "NCERT-Class-12-Chemistry-Part-1.pdf")),
    ("chemistry", "12", os.path.join(C12, "NCERT-Class-12-Chemistry-Part-2.pdf")),
    ("biology", "12", os.path.join(C12, "NCERT-Class-12-Biology.pdf")),
]


def extract_one(subject, cls, path):
    out = os.path.join(OUT_DIR, f"{subject}-{cls}.txt")
    if os.path.exists(out):
        size = os.path.getsize(out)
        if size > 1000:
            print(f"SKIP {subject}-{cls} (already extracted, {size} bytes)")
            return
    print(f"EXTRACT {subject}-{cls} {os.path.basename(path)} ...")
    sys.stdout.flush()
    try:
        reader = PdfReader(path)
        chunks = []
        n = len(reader.pages)
        for i, page in enumerate(reader.pages):
            try:
                chunks.append(page.extract_text() or "")
            except Exception:
                chunks.append("")
            if (i + 1) % 100 == 0:
                print(f"  {subject}-{cls}: {i+1}/{n} pages")
                sys.stdout.flush()
        text = "\n".join(chunks)
        with open(out, "a", encoding="utf-8", errors="replace") as f:
            f.write("\n\n<<< BOOK PART SEPARATOR >>>\n\n")
            f.write(text)
        print(f"  DONE {subject}-{cls} (+{len(text)} chars)")
        sys.stdout.flush()
    except Exception:
        traceback.print_exc()
        print(f"  FAILED {subject}-{cls}")


def main():
    for subject, cls, path in BOOKS:
        extract_one(subject, cls, path)


if __name__ == "__main__":
    main()
