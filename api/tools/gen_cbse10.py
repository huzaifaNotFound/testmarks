"""Step 2+3: generate CBSE Class 10 MCQs via live LLM and write the bank.

- Batches 2 chapter excerpts per LLM call (12 questions per call).
- Strict JSON schema per chapter; retries with a shorter excerpt on failure.
- Hand-written fallback questions if the API still fails (never skips a chapter).
- Writes app/data/banks/cbse_10.py with CBSE_10_BANK.

Run:  .venv\Scripts\python tools\gen_cbse10.py
"""

import json
import os
import re
import sys
import time
import urllib.request

API_URL = "https://opencode.ai/zen/v1/chat/completions"
MODEL = "mimo-v2.5-free"
MAX_TOKENS = 8192
TIMEOUT = 90

HERE = os.path.dirname(os.path.abspath(__file__))
API_DIR = os.path.dirname(HERE)
EXTRACT_DIR = os.path.join(HERE, "extracted")
CACHE_PATH = os.path.join(HERE, "cache_cbse10_v2.json")
BANK_PATH = os.path.join(API_DIR, "app", "data", "banks", "cbse_10.py")

CHAPTERS = [
    ("c10m-01", "Mathematics", "Real Numbers", "jemh101"),
    ("c10m-02", "Mathematics", "Polynomials", "jemh102"),
    ("c10m-03", "Mathematics", "Pair of Linear Equations in Two Variables", "jemh103"),
    ("c10m-04", "Mathematics", "Quadratic Equations", "jemh104"),
    ("c10m-05", "Mathematics", "Arithmetic Progressions", "jemh105"),
    ("c10m-06", "Mathematics", "Triangles", "jemh106"),
    ("c10m-07", "Mathematics", "Coordinate Geometry", "jemh107"),
    ("c10m-08", "Mathematics", "Introduction to Trigonometry", "jemh108"),
    ("c10m-09", "Mathematics", "Some Applications of Trigonometry", "jemh109"),
    ("c10m-10", "Mathematics", "Circles", "jemh110"),
    ("c10m-11", "Mathematics", "Constructions", "jemh111"),
    ("c10m-12", "Mathematics", "Areas Related to Circles", "jemh112"),
    ("c10m-13", "Mathematics", "Surface Areas and Volumes", "jemh113"),
    ("c10m-14", "Mathematics", "Statistics", "jemh114"),
    ("c10s-01", "Science", "Chemical Reactions and Equations", "jesc101"),
    ("c10s-02", "Science", "Acids Bases and Salts", "jesc102"),
    ("c10s-03", "Science", "Metals and Non-Metals", "jesc103"),
    ("c10s-04", "Science", "Carbon and its Compounds", "jesc104"),
    ("c10s-05", "Science", "Life Processes", "jesc105"),
    ("c10s-06", "Science", "Control and Coordination", "jesc106"),
    ("c10s-07", "Science", "How do Organisms Reproduce", "jesc107"),
    ("c10s-08", "Science", "Heredity", "jesc108"),
    ("c10s-09", "Science", "Light Reflection and Refraction", "jesc109"),
    ("c10s-10", "Science", "The Human Eye and the Colourful World", "jesc110"),
    ("c10s-11", "Science", "Electricity", "jesc111"),
    ("c10s-12", "Science", "Magnetic Effects of Electric Current", "jesc112"),
    ("c10s-13", "Science", "Our Environment", "jesc113"),
]

SYSTEM_PROMPT = (
    "You write CBSE Class 10 board-pattern MCQ questions from NCERT book text. "
    'Return STRICT JSON only, no markdown, no prose: {"chapters":[{"chapter":"<name>",'
    '"questions":[{"question":"...","options":["a","b","c","d"],"correct":0,'
    '"explanation":"1-2 sentence teaching explanation"}]}]}'
)


def sanitize(s: str) -> str:
    s = s.replace("\u00a0", " ")
    out = []
    for ch in s:
        o = ord(ch)
        if ch == "\ufffd":
            continue
        if o in (0x00C2, 0x00C3, 0x00E2, 0x0080, 0x009C, 0x009D, 0x0093, 0x0094):
            continue
        out.append(ch)
    s = "".join(out)
    s = s.replace("\u201c", '"').replace("\u201d", '"').replace("\u2018", "'").replace("\u2019", "'")
    s = s.replace("\u2013", "-").replace("\u2014", "-").replace("\u2212", "-")
    s = s.replace("\u00d7", "x").replace("\u00f7", "/").replace("\u2260", "!=")
    s = re.sub(r"\u221a(\d+)", r"sqrt(\1)", s)
    s = s.replace("\u221a", "sqrt ")
    s = s.replace("\u00b2", "^2").replace("\u00b3", "^3").replace("\u00b9", "^1")
    s = s.replace("\u2070", "^0").replace("\u2071", "^1").replace("\u2072", "^2").replace("\u2073", "^3")
    s = s.replace("\u2074", "^4").replace("\u2075", "^5").replace("\u2076", "^6")
    s = s.replace("\u2077", "^7").replace("\u2078", "^8").replace("\u2079", "^9")
    s = s.replace("\u03c0", "pi").replace("\u221e", "infinity")
    s = s.replace("\u2265", ">=").replace("\u2264", "<=")
    return " ".join(s.split())


def load_api_key() -> str:
    env_path = os.path.join(API_DIR, ".env")
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("OPENCODE_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("OPENCODE_API_KEY not found in .env")


def call_llm(api_key: str, chapters: list, limit: int) -> str:
    parts = []
    for chapter_id, subject, title, stem in chapters:
        path = os.path.join(EXTRACT_DIR, f"{stem}.txt")
        excerpt = ""
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                excerpt = f.read()
        excerpt = excerpt[:limit]
        parts.append(f"CHAPTER: {title} (subject: {subject})\n{excerpt}")
    user_prompt = (
        "Using ONLY facts from the NCERT Class 10 textbook chapter excerpts below, "
        f"write EXACTLY 6 multiple-choice questions for EACH of the {len(chapters)} chapters "
        f"({len(chapters) * 6} questions total). Requirements:\n"
        "- Each question object must include a \"difficulty\" field set to \"easy\" or \"medium\"; "
        "per chapter, 4 to 5 questions must be 'easy' and 1 to 2 must be 'medium'. "
        "Never trivial or baby questions: keep them genuinely board-pattern NCERT level "
        "(numericals where the chapter has them, exact NCERT terminology and facts).\n"
        "- Each question has exactly 4 options and exactly one correct answer (its index "
        "in 'correct', 0-3). Wrong options must be plausible distractors.\n"
        "- Give a real 1-2 sentence teaching explanation for every question.\n"
        "- No repeated questions within a chapter.\n"
        "- Math notation in plain ASCII: 'sin 30 degrees', 'sqrt(2)', 'x^2', '1/2', 'pi'.\n"
        "- The 'chapter' field of each entry must be EXACTLY the chapter name given above.\n"
        "- Respond with the strict JSON object only.\n\n"
        + "\n\n".join(parts)
    )
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": MAX_TOKENS,
    }
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "TestMarksAI/1.0",
            "Accept": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    msg = data["choices"][0]["message"]
    content = msg.get("content") or ""
    if not content.strip():
        content = msg.get("reasoning") or ""
    return content


def extract_json(text: str):
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text)
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("no JSON object found in response")
    return json.loads(text[start : end + 1])


def validate_questions(data, chapter_id: str) -> list:
    if not isinstance(data, dict) or "questions" not in data:
        raise ValueError(f"missing 'questions' key for {chapter_id}")
    qs = data["questions"]
    if not isinstance(qs, list) or len(qs) != 6:
        raise ValueError(f"{chapter_id}: expected 6 questions, got {len(qs) if isinstance(qs, list) else type(qs)}")
    out = []
    for q in qs:
        if not isinstance(q, dict):
            raise ValueError(f"{chapter_id}: question is not an object")
        question = sanitize(str(q.get("question", "")))
        options = [sanitize(str(o)) for o in q.get("options", [])]
        correct = q.get("correct", q.get("correct_index", q.get("answer")))
        difficulty = str(q.get("difficulty", "easy")).lower()
        explanation = sanitize(str(q.get("explanation", "")))
        if not question or len(question) < 10:
            raise ValueError(f"{chapter_id}: question text too short")
        if len(options) != 4 or any(not o for o in options):
            raise ValueError(f"{chapter_id}: need exactly 4 non-empty options")
        if not isinstance(correct, int) or correct not in (0, 1, 2, 3):
            raise ValueError(f"{chapter_id}: bad correct index {correct!r}")
        if difficulty not in ("easy", "medium"):
            difficulty = "easy"
        if not explanation or len(explanation) < 15:
            raise ValueError(f"{chapter_id}: explanation too short")
        out.append({
            "question": question,
            "options": options,
            "correct": correct,
            "difficulty": difficulty,
            "explanation": explanation,
        })
    texts = [q["question"] for q in out]
    if len(set(texts)) != len(texts):
        raise ValueError(f"{chapter_id}: duplicate questions in batch")
    easy_count = sum(1 for q in out if q["difficulty"] == "easy")
    if easy_count < 4:
        for q in out:
            if q["difficulty"] == "medium":
                q["difficulty"] = "easy"
                easy_count += 1
                if easy_count == 4:
                    break
    elif easy_count > 5:
        for q in out:
            if q["difficulty"] == "easy":
                q["difficulty"] = "medium"
                easy_count -= 1
                if easy_count == 5:
                    break
    return out


def fallback_for(chapter_id: str) -> list:
    sys.path.insert(0, HERE)
    from fallback_questions import FALLBACK

    return validate_questions({"questions": FALLBACK[chapter_id]}, chapter_id)


def generate_batch(api_key: str, chapters: list) -> dict:
    result = {}
    errors = []
    for limit in (10000, 7000):
        try:
            content = call_llm(api_key, chapters, limit)
            data = extract_json(content)
            chapters_out = data.get("chapters") if isinstance(data, dict) else None
            if not isinstance(chapters_out, list):
                raise ValueError("no 'chapters' list in response")
            if len(chapters_out) != len(chapters):
                raise ValueError(f"expected {len(chapters)} chapters, got {len(chapters_out)}")
            found = set()
            for entry in chapters_out:
                chapter = str(entry.get("chapter", ""))
                for cid, subject, title, stem in chapters:
                    if chapter.strip().lower() in (title.lower(),) or title.lower().startswith(chapter.strip().lower()):
                        found.add(cid)
                        result[cid] = validate_questions(entry, cid)
            if len(found) != len(chapters):
                missing = [cid for cid, *_ in chapters if cid not in found]
                raise ValueError(f"chapters not matched in response: {missing}")
            return result
        except Exception as e:
            errors.append(f"limit={limit}: {type(e).__name__}: {e}")
            time.sleep(2)
    print(f"  LLM failed for {[c[0] for c in chapters]}: {' | '.join(errors)}", file=sys.stderr)
    for cid, subject, title, stem in chapters:
        print(f"  Using hand-written fallback for {cid} {title}", file=sys.stderr)
        result[cid] = fallback_for(cid)
    return result


def build_and_write(api_key: str) -> None:
    cache = {}
    if os.path.exists(CACHE_PATH):
        with open(CACHE_PATH, "r", encoding="utf-8") as f:
            cache = json.load(f)

    pairs = [CHAPTERS[i : i + 2] for i in range(0, len(CHAPTERS), 2)]
    for pair in pairs:
        key = "+".join(c[0] for c in pair)
        if key in cache:
            print(f"SKIP (cached): {key}")
            continue
        print(f"GEN: {key} ...")
        out = generate_batch(api_key, pair)
        cache[key] = {cid: out[cid] for cid, *_ in pair}
        with open(CACHE_PATH, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, indent=1)
        print(f"  done: {sum(len(v) for v in out.values())} questions")
        time.sleep(1)

    bank = []
    for cid, subject, title, stem in CHAPTERS:
        for key in cache:
            if cid in cache[key]:
                num = cid.split("-")[1]
                subj = cid.split("-")[0][-1]
                for i, q in enumerate(cache[key][cid], start=1):
                    bank.append({
                        "id": f"c10{subj}-{num}-{i}",
                        "subject": subject,
                        "topic": title,
                        "difficulty": q["difficulty"],
                        "question": q["question"],
                        "options": q["options"],
                        "correct": q["correct"],
                        "explanation": q["explanation"],
                    })
                break

    lines = ["from typing import Any, Dict, List", "", "CBSE_10_BANK: List[Dict[str, Any]] = ["]
    for q in bank:
        lines.append("    {")
        for k, v in q.items():
            if k == "options":
                opts = ", ".join(json.dumps(o, ensure_ascii=False) for o in v)
                lines.append(f'        "options": [{opts}],')
            else:
                lines.append(f"        {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)},")
        lines.append("    },")
    lines.append("]")
    lines.append("")
    os.makedirs(os.path.dirname(BANK_PATH), exist_ok=True)
    with open(BANK_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"\nBank written to {BANK_PATH} with {len(bank)} questions.")


def main() -> None:
    api_key = load_api_key()
    build_and_write(api_key)


if __name__ == "__main__":
    main()
