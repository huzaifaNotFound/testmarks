import json
import os
import urllib.request

env = open(r"D:\projects\test-mark\api\.env", encoding="utf-8").read()
key = [l.split("=", 1)[1].strip().strip('"') for l in env.splitlines() if l.startswith("OPENCODE_API_KEY=")][0]
excerpt = open(r"D:\projects\test-mark\api\tools\extracted\jemh101.txt", encoding="utf-8").read()[:7000]
sys_p = 'You write CBSE Class 10 board-pattern MCQ questions from NCERT book text. Return STRICT JSON only, no markdown, no prose: {"chapters":[{"chapter":"<name>","questions":[{"question":"...","options":["a","b","c","d"],"correct":0,"explanation":"1-2 sentence teaching explanation"}]}]}'
usr = ('Using ONLY facts from the NCERT Class 10 textbook chapter excerpts below, '
       'write EXACTLY 6 multiple-choice questions for EACH of the 2 chapters (12 questions total). Requirements:\n'
       '- Each question object must include a "difficulty" field set to "easy" or "medium"; per chapter, 4 to 5 questions must be easy and 1 to 2 must be medium.\n'
       '- Each question has exactly 4 options and exactly one correct answer (its index in correct, 0-3).\n'
       '- Wrong options must be plausible distractors. Real 1-2 sentence teaching explanation for every question.\n'
       '- No repeated questions within a chapter. Plain ASCII math.\n'
       '- The chapter field of each entry must be EXACTLY the chapter name given above.\n'
       '- Respond with the strict JSON object only.\n\n'
       'CHAPTER: Real Numbers (subject: Mathematics)\n' + excerpt +
       '\n\nCHAPTER: Polynomials (subject: Mathematics)\n' +
       open(r"D:\projects\test-mark\api\tools\extracted\jemh102.txt", encoding="utf-8").read()[:7000])
body = {"model": "mimo-v2.5-free",
        "messages": [{"role": "system", "content": sys_p}, {"role": "user", "content": usr}],
        "max_tokens": 8192}
req = urllib.request.Request(
    "https://opencode.ai/zen/v1/chat/completions",
    data=json.dumps(body).encode(),
    headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json",
             "User-Agent": "TestMarksAI/1.0", "Accept": "application/json"},
    method="POST")
with urllib.request.urlopen(req, timeout=90) as r:
    d = json.loads(r.read().decode())
m = d["choices"][0]["message"]
c = m.get("content") or ""
print("finish:", d["choices"][0].get("finish_reason"), "content_len:", len(c))
print(repr(c[:800]))
print("....")
print(repr(c[250:750]))
