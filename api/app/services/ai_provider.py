import json
import os
import urllib.error
import urllib.request
from pathlib import Path
from typing import List, Optional

PROVIDER = "opencode"

PAYMENT_API_KEY = None  # payment API key will be provided later
PAYMENT_GATEWAY = None  # no payment gateway implemented yet


def _load_env() -> None:
    env_path = Path(__file__).resolve().parents[2] / ".env"
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                os.environ.setdefault(k.strip(), v.strip())


_load_env()

MODEL = os.environ.get("OPENCODE_MODEL", "mimo-v2.5-free")
BASE_URL = os.environ.get("OPENCODE_BASE_URL", "https://opencode.ai/v1")
API_KEY = os.environ.get("OPENCODE_API_KEY", "")


def _call_llm(system_prompt: str, user_prompt: str, max_tokens: int = 1024) -> Optional[str]:
    if not API_KEY:
        return None
    payload = json.dumps(
        {
            "model": MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "max_tokens": max_tokens,
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL.rstrip('/')}/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "TestMarksAI/1.0",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            msg = data["choices"][0]["message"]
            return (msg.get("content") or msg.get("reasoning") or "").strip() or None
    except (urllib.error.URLError, KeyError, IndexError, json.JSONDecodeError, TimeoutError, OSError):
        return None


def _topic_list(weak_areas) -> str:
    return ", ".join(f"{w['topic']} ({w['accuracy']}%)" for w in weak_areas)


class AIProvider:
    def generate_coach_message(self, weak_areas, score: int, total: int) -> str:
        if weak_areas:
            user_prompt = (
                f"Student scored {score}/{total} in a mock test. Weak areas: {_topic_list(weak_areas)}. "
                "Write a short, motivating, specific coach message (max 90 words): what to fix first, "
                "how to study it this week, and one encouraging line. Use the student's weak topics by name."
            )
        else:
            user_prompt = (
                f"Student scored {score}/{total} in a mock test with no weak areas. "
                "Write a short, motivating coach message (max 70 words) praising the result and advising "
                "how to convert accuracy into speed and rank."
            )
        llm = _call_llm(
            "You are an expert NEET/JEE/CBSE academic coach inside a mock-test app. "
            "Be warm, specific, and concise. Never mention that you are an AI.",
            user_prompt,
        )
        if llm:
            return llm
        if not weak_areas:
            return (
                f"Strong showing — {score}/{total} correct with no topic below 60%. "
                "Your foundations are solid. This week, lock in the gains with two timed "
                "full-length mocks and push for speed; the top few percentile now comes "
                "from accuracy under time pressure, not from new topics."
            )
        lead = weak_areas[0]["topic"]
        return (
            f"You scored {score}/{total}. Your clearest gaps are in {_topic_list(weak_areas)}. "
            f"Start with {lead}: revise the core concepts, then drill 10 NCERT-and-previous-year "
            "questions on it daily for three days before attempting any new material. Bookmark "
            "the questions you miss and retake the diagnostic next week — I expect that gap to close "
            "first. Topics already above 60% can wait; every minute there buys less than a minute in "
            f"{lead}."
        )

    def generate_recommendations(self, weak_areas, stream_id: str) -> list:
        recs = []
        for i, w in enumerate(weak_areas):
            slug = w["topic"].lower().replace(" ", "-").replace("/", "-")
            recs.append(
                {
                    "topic": w["topic"],
                    "reason": (
                        f"Accuracy of {w['accuracy']}% in {w['topic']} ({(w['total'] - w['correct'])} "
                        f"of {w['total']} missed) is below the 60% safety line and is costing you "
                        "guaranteed marks."
                    ),
                    "advice": (
                        f"Revise {w['topic']} concepts in 2 focused sessions, then complete the "
                        f"topic's question bank and one mixed practice test. Re-evaluate with the "
                        "diagnostic after 4-5 days."
                    ),
                    "tests": [f"diag-{stream_id}", f"gen-{stream_id}-focus-{slug}", f"gen-{stream_id}-mixed-{i + 1}"],
                }
            )
        return recs


provider = AIProvider()
