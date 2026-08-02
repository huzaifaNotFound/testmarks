import os
import sys

from pypdf import PdfReader

BASE_MATH = r"D:\Downloads\jemh1dd"
BASE_SCI = r"D:\Downloads\jesc1dd"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "extracted")

CHAPTERS = [
    ("jemh101", "Mathematics", "Real Numbers"),
    ("jemh102", "Mathematics", "Polynomials"),
    ("jemh103", "Mathematics", "Pair of Linear Equations in Two Variables"),
    ("jemh104", "Mathematics", "Quadratic Equations"),
    ("jemh105", "Mathematics", "Arithmetic Progressions"),
    ("jemh106", "Mathematics", "Triangles"),
    ("jemh107", "Mathematics", "Coordinate Geometry"),
    ("jemh108", "Mathematics", "Introduction to Trigonometry"),
    ("jemh109", "Mathematics", "Some Applications of Trigonometry"),
    ("jemh110", "Mathematics", "Circles"),
    ("jemh111", "Mathematics", "Constructions"),
    ("jemh112", "Mathematics", "Areas Related to Circles"),
    ("jemh113", "Mathematics", "Surface Areas and Volumes"),
    ("jemh114", "Mathematics", "Statistics"),
    ("jesc101", "Science", "Chemical Reactions and Equations"),
    ("jesc102", "Science", "Acids Bases and Salts"),
    ("jesc103", "Science", "Metals and Non-Metals"),
    ("jesc104", "Science", "Carbon and its Compounds"),
    ("jesc105", "Science", "Life Processes"),
    ("jesc106", "Science", "Control and Coordination"),
    ("jesc107", "Science", "How do Organisms Reproduce"),
    ("jesc108", "Science", "Heredity"),
    ("jesc109", "Science", "Light Reflection and Refraction"),
    ("jesc110", "Science", "The Human Eye and the Colourful World"),
    ("jesc111", "Science", "Electricity"),
    ("jesc112", "Science", "Magnetic Effects of Electric Current"),
    ("jesc113", "Science", "Our Environment"),
]

MATH_TITLES = ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables",
               "Quadratic Equations", "Arithmetic Progressions", "Triangles",
               "Coordinate Geometry", "Introduction to Trigonometry",
               "Some Applications of Trigonometry", "Circles", "Constructions",
               "Areas Related to Circles", "Surface Areas and Volumes", "Statistics"]
SCI_TITLES = ["Chemical Reactions and Equations", "Acids Bases and Salts",
              "Metals and Non-Metals", "Carbon and its Compounds", "Life Processes",
              "Control and Coordination", "How do Organisms Reproduce", "Heredity",
              "Light Reflection and Refraction", "The Human Eye and the Colourful World",
              "Electricity", "Magnetic Effects of Electric Current", "Our Environment"]


def extract_pdf(path):
    try:
        reader = PdfReader(path)
        parts = []
        for page in reader.pages:
            try:
                t = page.extract_text() or ""
                parts.append(t)
            except Exception:
                parts.append("")
        text = "\n".join(parts)
        return text
    except Exception as e:
        print(f"ERROR reading {path}: {e}", file=sys.stderr)
        return ""


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    failed = []
    for stem, subject, title in CHAPTERS:
        base = BASE_MATH if subject == "Mathematics" else BASE_SCI
        out_path = os.path.join(OUT_DIR, f"{stem}.txt")
        if os.path.exists(out_path):
            print(f"SKIP: {stem} (exists)")
            continue
        path = os.path.join(base, f"{stem}.pdf")
        text = extract_pdf(path)
        text = text.replace("\u0000", "")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(f"CHAPTER TITLE: {title}\nSUBJECT: {subject}\nFILE: {path}\n\n")
            f.write(text)
        if len(text.strip()) < 200:
            failed.append((stem, title, len(text.strip())))
            print(f"WARNING: low text for {stem} ({title}): {len(text.strip())} chars")
        else:
            print(f"OK: {stem} ({title}): {len(text.strip())} chars")
    print("\nFAILED/EMPTY:", failed if failed else "none")


if __name__ == "__main__":
    main()
