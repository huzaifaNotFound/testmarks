"""Generate the CBSE Class 10 question bank.

For each chapter: send the extracted NCERT text to the live LLM and ask for
strict JSON with 6 MCQs. Falls back to hand-written questions when the API
fails so the bank is never missing a chapter.

Results are cached per chapter in tools/cache_cbse10.json so the run can be
interrupted and resumed.
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fallback_questions import FALLBACK  # noqa: E402

API_URL = "https://opencode.ai/zen/v1/chat/completions"
MODEL = "mimo-v2.5-free"

HERE = os.path.dirname(os.path.abspath(__file__))
EXTRACT_DIR = os.path.join(HERE, "extracted")
CACHE_PATH = os.path.join(HERE, "cache_cbse10.json")
BANK_PATH = os.path.join(
    os.path.dirname(HERE), "app", "data", "banks", "cbse_10.py"
)

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
    "You are an expert CBSE Class 10 examiner who writes NCERT-board-pattern MCQ question banks. "
    "You ALWAYS respond with strict JSON only: no prose, no markdown fences, no comments. "
    'The JSON must be exactly: {"questions": [{"question": "...", "options": ["a","b","c","d"], '
    '"correct": <0-3>, "difficulty": "easy"|"medium", "explanation": "..."}]}'
)

USER_PROMPT = (
    "Using ONLY facts from the NCERT Class 10 {subject} chapter '{title}' excerpt below, "
    "write EXACTLY 6 multiple-choice questions. Requirements:\n"
    "- 4 to 5 questions must be 'easy' and 1 to 2 must be 'medium' (never trivial, always "
    "board-pattern NCERT level; include numericals where the chapter has them; use correct "
    "scientific/terminology facts straight from NCERT).\n"
    "- Each question has exactly 4 options, exactly one correct answer (its index in 'correct', "
    "0-3), and a real 1-2 sentence teaching explanation.\n"
    "- Wrong options must be genuine plausible distractors, never obviously silly.\n"
    "- Do not repeat the same question.\n"
    "- Math notation: use plain ASCII - 'sin 30 degrees' (NOT sin 30°), 'sqrt(2)' (NOT the √ symbol), "
    "'^' for powers like 'x^2', '1/2' for fractions, 'pi' for π.\n"
    "- Respond with the strict JSON object only.\n\n"
    "CHAPTER EXCERPT (first {limit} characters):\n\n{excerpt}"
)


def load_api_key():
    env_path = os.path.join(os.path.dirname(HERE), ".env")
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("OPENCODE_API_KEY="):
                return line.split("=", 1)[1].strip()
    raise SystemExit("OPENCODE_API_KEY not found in .env")


def call_llm(api_key, excerpt, title, subject, limit):
    user_prompt = USER_PROMPT.format(
        subject=subject, title=title, limit=limit, excerpt=excerpt[:limit]
    )
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": 4096,
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
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    msg = data["choices"][0]["message"]
    content = msg.get("content") or ""
    if not content.strip():
        reasoning = msg.get("reasoning") or ""
        if '{"questions"' in reasoning:
            content = reasoning
    return content


def extract_json(text):
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text)
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("no JSON object found in response")
    return json.loads(text[start : end + 1])


def sanitize(s):
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


def validate_questions(data):
    if not isinstance(data, dict) or "questions" not in data:
        raise ValueError("missing 'questions' key")
    qs = data["questions"]
    if not isinstance(qs, list) or len(qs) != 6:
        raise ValueError(f"expected 6 questions, got {len(qs) if isinstance(qs, list) else type(qs)}")
    out = []
    for q in qs:
        if not isinstance(q, dict):
            raise ValueError("question is not an object")
        question = sanitize(str(q.get("question", "")))
        options = [sanitize(str(o)) for o in q.get("options", [])]
        correct = q.get("correct")
        difficulty = str(q.get("difficulty", "easy")).lower()
        explanation = sanitize(str(q.get("explanation", "")))
        if not question or len(question) < 10:
            raise ValueError("question text too short")
        if len(options) != 4 or any(not o for o in options):
            raise ValueError("need exactly 4 non-empty options")
        if not isinstance(correct, int) or correct not in (0, 1, 2, 3):
            raise ValueError(f"bad correct index: {correct!r}")
        if difficulty not in ("easy", "medium"):
            difficulty = "easy"
        if not explanation or len(explanation) < 15:
            raise ValueError("explanation too short")
        out.append({
            "question": question,
            "options": options,
            "correct": correct,
            "difficulty": difficulty,
            "explanation": explanation,
        })
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


def generate_for_chapter(api_key, chapter_id, subject, title, stem):
    text_path = os.path.join(EXTRACT_DIR, f"{stem}.txt")
    if os.path.exists(text_path):
        with open(text_path, "r", encoding="utf-8") as f:
            excerpt = f.read()
    else:
        excerpt = ""
    errors = []
    for limit in (14000, 8000):
        try:
            content = call_llm(api_key, excerpt, title, subject, limit)
            data = extract_json(content)
            return validate_questions(data)
        except Exception as e:
            errors.append(f"limit={limit}: {type(e).__name__}: {e}")
            time.sleep(2)
    print(f"  LLM failed for {chapter_id}: {' | '.join(errors)}", file=sys.stderr)
    fallback = FALLBACK.get(chapter_id)
    if fallback:
        print(f"  Using hand-written fallback for {chapter_id}", file=sys.stderr)
        return validate_questions({"questions": fallback})
    return None


def build_bank(api_key, only=None):
    cache = {}
    if os.path.exists(CACHE_PATH):
        with open(CACHE_PATH, "r", encoding="utf-8") as f:
            cache = json.load(f)
    for chapter_id, subject, title, stem in CHAPTERS:
        if only and chapter_id not in only:
            continue
        if chapter_id in cache:
            print(f"SKIP (cached): {chapter_id} {title}")
            continue
        print(f"GEN: {chapter_id} {title} ...")
        questions = generate_for_chapter(api_key, chapter_id, subject, title, stem)
        if questions is None:
            raise SystemExit(f"no questions at all for {chapter_id} — aborting")
        cache[chapter_id] = {"subject": subject, "title": title, "questions": questions}
        with open(CACHE_PATH, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, indent=1)
        print(f"  done: {len(questions)} questions")
        time.sleep(1)
    return cache


def write_bank(cache):
    bank = []
    for chapter_id, subject, title, stem in CHAPTERS:
        if chapter_id not in cache:
            continue
        info = cache[chapter_id]
        num = chapter_id.split("-")[1]
        subj = chapter_id.split("-")[0][-1]
        for i, q in enumerate(info["questions"], start=1):
            bank.append({
                "id": f"c10{subj}-{num}-{i}",
                "subject": info["subject"],
                "topic": info["title"],
                "difficulty": q.get("difficulty", "easy"),
                "question": q["question"],
                "options": q["options"],
                "correct": q["correct"],
                "explanation": q["explanation"],
            })
    lines = ["from typing import Any, Dict, List", "", "CBSE_10_BANK: List[Dict[str, Any]] = ["]
    for q in bank:
        lines.append("    {")
        for k, v in q.items():
            if k == "options":
                opts = ", ".join(json.dumps(o, ensure_ascii=False) for o in v)
                lines.append(f"        \"options\": [{opts}],")
            else:
                lines.append(f"        {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)},")
        lines.append("    },")
    lines.append("]")
    lines.append("")
    os.makedirs(os.path.dirname(BANK_PATH), exist_ok=True)
    with open(BANK_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    return bank


def main():
    api_key = load_api_key()
    only = None
    if len(sys.argv) > 1:
        only = set(sys.argv[1:])
    cache = build_bank(api_key, only)
    bank = write_bank(cache)
    print(f"\nBank written to {BANK_PATH} with {len(bank)} questions.")


if __name__ == "__main__":
    main()
