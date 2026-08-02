import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
EXTRACTED = os.path.join(BASE, "extracted")
RAW = os.path.join(BASE, "raw")
os.makedirs(RAW, exist_ok=True)

SYSTEM = (
    "You write NCERT-based MCQ questions for competitive exam prep. Return STRICT JSON only, no markdown: "
    '{"questions":[{"question":"...","options":["a","b","c","d"],"correct":0,'
    '"explanation":"1-2 sentence real teaching explanation","difficulty":"easy|medium|hard","topic":"<short topic name>"}]}'
)


def load_key():
    env_path = os.path.join(os.path.dirname(BASE), ".env")
    with open(env_path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("OPENCODE_API_KEY="):
                return line.split("=", 1)[1].strip()
    raise SystemExit("OPENCODE_API_KEY not found in .env")


KEY = load_key()
API = "https://opencode.ai/zen/v1/chat/completions"


def call_llm(user_msg, max_tokens=4000, timeout=120):
    body = json.dumps({
        "model": "mimo-v2.5-free",
        "messages": [{"role": "system", "content": SYSTEM}, {"role": "user", "content": user_msg}],
        "max_tokens": max_tokens,
    }).encode("utf-8")
    req = urllib.request.Request(API, data=body, headers={
        "Authorization": "Bearer " + KEY,
        "Content-Type": "application/json",
        "User-Agent": "TestMarksAI/1.0",
        "Accept": "application/json",
    })
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    if "error" in data:
        raise RuntimeError(f"API error: {data['error']}")
    msg = data["choices"][0]["message"]
    return msg.get("content") or msg.get("reasoning") or ""


def extract_json_obj(text):
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    start = text.find("{")
    if start == -1:
        raise ValueError("no { found")
    depth = 0
    in_str = False
    esc = False
    for i in range(start, len(text)):
        ch = text[i]
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                in_str = False
        else:
            if ch == '"':
                in_str = True
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    return text[start:i + 1]
    raise ValueError("unbalanced braces")


def parse_json(text):
    return json.loads(extract_json_obj(text))


FORBIDDEN = set("\u00c2\u00e2\ufffd\u00c3\u00e3\ufffe")


def validate_q(q):
    if not isinstance(q, dict):
        return False
    for k in ("question", "options", "correct", "explanation", "difficulty", "topic"):
        if k not in q:
            return False
    opts = q["options"]
    if not isinstance(opts, list) or len(opts) != 4:
        return False
    if not all(isinstance(o, str) and o.strip() for o in opts):
        return False
    if len(set(opts)) != 4:
        return False
    if not isinstance(q["correct"], int) or not (0 <= q["correct"] <= 3):
        return False
    if q["difficulty"] not in ("easy", "medium", "hard"):
        return False
    for field in ("question", "explanation", "topic"):
        if not isinstance(q[field], str) or not q[field].strip():
            return False
    for field in ("question", "explanation", "topic", *opts):
        if any(ch in FORBIDDEN for ch in field):
            return False
    return True


def get_excerpt(subject, cls, frac, size=12000):
    path = os.path.join(EXTRACTED, f"{subject}-{cls}.txt")
    with open(path, encoding="utf-8", errors="replace") as f:
        text = f.read()
    total = len(text)
    offset = int(total * frac)
    offset = min(offset, max(0, total - size))
    ex = text[offset:offset + size]
    if "<<< BOOK PART SEPARATOR >>>" in ex[:400]:
        offset = min(offset + 6000, max(0, total - size))
        ex = text[offset:offset + size]
    return ex, offset


DIFF_INSTR = {
    "cbse": "Vary the difficulty: roughly 40% easy (direct NCERT fact or simple one-step), 50% medium (two-step or applied), 10% hard (multi-step numerical).",
    "jee_mains": "Difficulty: roughly 20% easy, 60% medium (applied numericals), 20% hard. Application and JEE-level numericals are welcome, but stay true to NCERT concepts.",
    "jee_advanced": "Difficulty: roughly 40% medium, 60% hard. Multi-concept, application-heavy, interlinked concepts, tougher than JEE Mains level.",
    "neet": "Difficulty: roughly 50% easy and 50% medium. Strongly NCERT-aligned, NEET style: single correct answer, direct NCERT facts and simple one-line numericals. No hard questions.",
}


def build_user_msg(bank, subject, cls, frac, n, size):
    ex, offset = get_excerpt(subject, cls, frac, size=size)
    instr = DIFF_INSTR[bank]
    return (
        f"You are generating MCQ questions for the {bank} question bank from the actual NCERT Class {cls} {subject} textbook.\n"
        f"Book excerpt (slice starting at character offset {offset}, {size} chars):\n"
        "=== BEGIN EXCERPT ===\n" + ex + "\n=== END EXCERPT ===\n\n"
        f"Write exactly {n} distinct high-quality MCQs derived from this excerpt and the standard NCERT content of the same chapters. "
        f"The questions must be genuinely Class {cls} level for {subject} - never trivial, never generic fill-in-the-blank trivia. "
        f"{instr}\n"
        "Rules: 'correct' is the 0-based index of the correct option. Options must be 4 distinct short strings. "
        "Use plain ASCII math (sqrt(2), m/s^2, x^2, pi). No Unicode superscripts, no 'Â', no replacement characters, no HTML entities. "
        "Return STRICT JSON only, no markdown, no commentary:\n"
        '{"questions":[{"question":"...","options":["a","b","c","d"],"correct":0,"explanation":"1-2 sentence real teaching explanation","difficulty":"easy|medium|hard","topic":"<short topic name>"}]}'
    )


def run_call(tag, bank, subject, cls, frac, n, size=12000):
    out_path = os.path.join(RAW, f"{tag}.json")
    if os.path.exists(out_path):
        print(f"SKIP {tag} (exists)")
        return
    user = build_user_msg(bank, subject, cls, frac, n, size)
    last_err = None
    for attempt in range(2):
        try:
            resp = call_llm(user)
            with open(os.path.join(RAW, f"{tag}.raw.txt"), "w", encoding="utf-8") as f:
                f.write(resp)
            data = parse_json(resp)
            qs = data.get("questions", [])
            if not isinstance(qs, list) or len(qs) == 0:
                raise ValueError("no questions in response")
            valid = [q for q in qs if validate_q(q)]
            if len(valid) < max(1, n - 2):
                raise ValueError(f"only {len(valid)}/{len(qs)} valid questions")
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump({"tag": tag, "subject": subject, "cls": cls, "n": n, "questions": valid}, f, ensure_ascii=True)
            print(f"OK   {tag}: {len(valid)} questions (attempt {attempt+1})", flush=True)
            return
        except Exception as e:
            last_err = e
            print(f"FAIL {tag} attempt {attempt+1}: {type(e).__name__}: {str(e)[:200]}", flush=True)
            user = build_user_msg(bank, subject, cls, frac, max(3, n - 1), size // 2)
            time.sleep(2)
    print(f"ERROR {tag}: giving up after 2 attempts ({last_err})", flush=True)


PLAN = [
    ("cb11-ph", "cbse", "Physics", "11", [0.02, 0.3, 0.55, 0.85]),
    ("cb11-ch", "cbse", "Chemistry", "11", [0.02, 0.3, 0.55, 0.85]),
    ("cb11-ma", "cbse", "Mathematics", "11", [0.02, 0.3, 0.55, 0.85]),
    ("cb11-bi", "cbse", "Biology", "11", [0.02, 0.3, 0.55, 0.85]),
    ("cb12-ph", "cbse", "Physics", "12", [0.02, 0.3, 0.55, 0.85]),
    ("cb12-ch", "cbse", "Chemistry", "12", [0.02, 0.3, 0.55, 0.85]),
    ("cb12-ma", "cbse", "Mathematics", "12", [0.02, 0.3, 0.55, 0.85]),
    ("cb12-bi", "cbse", "Biology", "12", [0.02, 0.3, 0.55, 0.85]),
    ("jm-ph-11", "jee_mains", "Physics", "11", [0.05]),
    ("jm-ph-12", "jee_mains", "Physics", "12", [0.2, 0.6]),
    ("jm-ch-11", "jee_mains", "Chemistry", "11", [0.05]),
    ("jm-ch-12", "jee_mains", "Chemistry", "12", [0.2, 0.6]),
    ("jm-ma-11", "jee_mains", "Mathematics", "11", [0.05]),
    ("jm-ma-12", "jee_mains", "Mathematics", "12", [0.2, 0.6]),
    ("ja-ph-11", "jee_advanced", "Physics", "11", [0.15]),
    ("ja-ph-12", "jee_advanced", "Physics", "12", [0.4]),
    ("ja-ch-11", "jee_advanced", "Chemistry", "11", [0.15]),
    ("ja-ch-12", "jee_advanced", "Chemistry", "12", [0.4]),
    ("ja-ma-11", "jee_advanced", "Mathematics", "11", [0.15]),
    ("ja-ma-12", "jee_advanced", "Mathematics", "12", [0.4]),
    ("neet-ph-11", "neet", "Physics", "11", [0.25, 0.75]),
    ("neet-ph-12", "neet", "Physics", "12", [0.25, 0.75]),
    ("neet-ch-11", "neet", "Chemistry", "11", [0.25, 0.75]),
    ("neet-ch-12", "neet", "Chemistry", "12", [0.25, 0.75]),
    ("neet-bi-11", "neet", "Biology", "11", [0.25, 0.75]),
    ("neet-bi-12", "neet", "Biology", "12", [0.25, 0.75]),
]


def main():
    tags = sys.argv[1:] if len(sys.argv) > 1 else [p[0] for p in PLAN]
    for tag, bank, subject, cls, fracs in PLAN:
        if tag not in tags:
            continue
        for i, frac in enumerate(fracs):
            run_call(f"{tag}-{i:02d}", bank, subject, cls, frac, 6)
            time.sleep(1)
    print("SUMMARY:", flush=True)
    for tag in tags:
        plan_item = [p for p in PLAN if p[0] == tag]
        if not plan_item:
            continue
        for i in range(len(plan_item[0][4])):
            p = os.path.join(RAW, f"{tag}-{i:02d}.json")
            if os.path.exists(p):
                with open(p, encoding="utf-8") as f:
                    d = json.load(f)
                print(f"  {tag}-{i:02d}: {len(d['questions'])} questions", flush=True)
            else:
                print(f"  {tag}-{i:02d}: MISSING", flush=True)


if __name__ == "__main__":
    main()
