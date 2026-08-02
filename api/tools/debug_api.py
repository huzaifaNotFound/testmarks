import json
import os
import urllib.request

key = None
for line in open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"), encoding="utf-8"):
    line = line.strip()
    if line.startswith("OPENCODE_API_KEY="):
        key = line.split("=", 1)[1].strip()

body = json.dumps({
    "model": "mimo-v2.5-free",
    "messages": [
        {"role": "system", "content": 'Return STRICT JSON only: {"questions":[{"question":"q","options":["a","b","c","d"],"correct":0}]}'},
        {"role": "user", "content": "Give 1 MCQ on Newton first law."},
    ],
    "max_tokens": 500,
}).encode()
req = urllib.request.Request(
    "https://opencode.ai/zen/v1/chat/completions",
    data=body,
    headers={
        "Authorization": "Bearer " + key,
        "Content-Type": "application/json",
        "User-Agent": "TestMarksAI/1.0",
        "Accept": "application/json",
    },
)
with urllib.request.urlopen(req, timeout=120) as r:
    data = json.loads(r.read().decode())
msg = data["choices"][0]["message"]
print("message keys:", list(msg.keys()))
print("---content---")
print(repr(msg.get("content"))[:2000])
print("---reasoning---")
print(repr(msg.get("reasoning"))[:2000])
