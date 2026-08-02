import json
import os
import urllib.request

env = open(r"D:\projects\test-mark\api\.env", encoding="utf-8").read()
key = [l.split("=", 1)[1].strip().strip('"') for l in env.splitlines() if l.startswith("OPENCODE_API_KEY=")][0]
excerpt = open(r"D:\projects\test-mark\api\tools\extracted\jemh101.txt", encoding="utf-8").read()[:6000]
sys_p = 'You write CBSE Class 10 board-pattern MCQ questions from NCERT book text. Return STRICT JSON only, no markdown, no prose: {"chapters":[{"chapter":"<name>","questions":[{"question":"...","options":["a","b","c","d"],"correct":0,"explanation":"1-2 sentence teaching explanation"}]}]}'
usr = ('Using ONLY facts from the NCERT excerpt below, write EXACTLY 6 multiple-choice questions. '
       '4-5 easy, 1-2 medium. 4 options each, correct index 0-3, plausible distractors, real 1-2 sentence '
       'explanation, plain ASCII math. The chapter field must be exactly "Real Numbers". Strict JSON only.\n\n' + excerpt)
for mt in (1600, 4096):
    body = {"model": "mimo-v2.5-free",
            "messages": [{"role": "system", "content": sys_p}, {"role": "user", "content": usr}],
            "max_tokens": mt}
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
    print(f"--- max_tokens={mt} finish={d['choices'][0].get('finish_reason')} content_len={len(c)} reasoning_len={len(m.get('reasoning') or '')}")
    print("content tail:", repr(c[-200:]))
