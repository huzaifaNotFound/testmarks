import random
from datetime import date, datetime
from typing import Any, Dict, List, Optional

from app.data.questions import BANKS
from app.data.streams import STREAMS, STREAMS_BY_ID
from app.services import store

WEAK_THRESHOLD = 60
STRONG_THRESHOLD = 60
FOCUS_WEIGHT = 0.7


def _rng() -> random.Random:
    return random.Random()


def pick_by_mix(bank: List[Dict[str, Any]], mix: Dict[str, int], count: int, rng: random.Random) -> List[Dict[str, Any]]:
    picked: List[Dict[str, Any]] = []
    for level, share in mix.items():
        need = round(count * share / 100)
        pool = [q for q in bank if q["difficulty"] == level]
        rng.shuffle(pool)
        picked.extend(pool[:need])
    if len(picked) < count:
        rest = [q for q in bank if q not in picked]
        rng.shuffle(rest)
        picked.extend(rest[: count - len(picked)])
    rng.shuffle(picked)
    return picked[:count]


def build_test(
    stream_id: str,
    count: int = 50,
    focus_topics: Optional[List[str]] = None,
    difficulty: Optional[str] = None,
    test_id: Optional[str] = None,
) -> Dict[str, Any]:
    stream = STREAMS_BY_ID[stream_id]
    bank = BANKS[stream_id]
    pool = [q for q in bank if q["difficulty"] == difficulty] if difficulty else list(bank)
    if not pool:
        pool = list(bank)
    rng = _rng()

    if focus_topics:
        focus = {t.strip().lower() for t in focus_topics if t.strip()}
        focus_qs = [q for q in pool if q["topic"].lower() in focus]
        focus_subjects = {q["subject"] for q in focus_qs}
        subject_qs = [q for q in pool if q["subject"] in focus_subjects and q not in focus_qs]
        rng.shuffle(focus_qs)
        rng.shuffle(subject_qs)
        weak_n = max(1, round(count * FOCUS_WEIGHT))
        picked = focus_qs[:min(weak_n, len(focus_qs))]
        picked.extend(subject_qs[: max(0, min(weak_n - len(picked), len(subject_qs)))])
        rest = [q for q in pool if q not in picked]
        rng.shuffle(rest)
        picked.extend(rest[: count - len(picked)])
    else:
        picked = pick_by_mix(pool, stream["difficultyMix"], count, rng)

    rng.shuffle(picked)
    title = f"{stream['name']} Focus Test" if focus_topics else f"{stream['name']} Diagnostic Test"
    return {
        "test_id": test_id or f"diag-{stream_id}",
        "title": title,
        "stream": stream_id,
        "questions": picked[:count],
    }


def resolve_stream_from_test_id(test_id: str) -> Optional[str]:
    rest = test_id.removeprefix("diag-").removeprefix("gen-")
    for sid in STREAMS_BY_ID:
        if rest == sid or rest.startswith(sid + "-"):
            return sid
    return None


def _percentile_est(accuracy: int) -> int:
    if accuracy >= 95:
        return 98
    if accuracy >= 90:
        return 94
    if accuracy >= 85:
        return 88
    if accuracy >= 80:
        return 82
    if accuracy >= 75:
        return 75
    if accuracy >= 70:
        return 68
    if accuracy >= 60:
        return 55
    if accuracy >= 50:
        return 42
    if accuracy >= 40:
        return 30
    if accuracy >= 30:
        return 20
    return 10


def score_attempt(test: Dict[str, Any], answers: List[Dict[str, str]]) -> Dict[str, Any]:
    by_id = {q["id"]: q for q in test["questions"]}
    correct = 0
    total = len(test["questions"])
    raw: Dict[Any, Dict[str, int]] = {}

    for ans in answers:
        q = by_id.get(ans.get("question_id"))
        if q is None:
            continue
        key = (q["subject"], q["topic"])
        raw.setdefault(key, {"correct": 0, "total": 0})
        raw[key]["total"] += 1
        if ans.get("chosen") == q["correct"]:
            raw[key]["correct"] += 1
            correct += 1

    per_topic = [
        {
            "subject": s,
            "topic": t,
            "correct": d["correct"],
            "total": d["total"],
            "accuracy": round(d["correct"] / d["total"], 4),
        }
        for (s, t), d in sorted(raw.items())
    ]
    weak_areas = sorted([t for t in per_topic if t["accuracy"] < 0.6], key=lambda t: t["accuracy"])[:3]
    strong_areas = sorted([t for t in per_topic if t["accuracy"] >= 0.6], key=lambda t: -t["accuracy"])[:3]
    accuracy = round(correct / total * 100)

    return {
        "score": correct,
        "total": total,
        "accuracy": accuracy,
        "per_topic": per_topic,
        "weak_areas": weak_areas,
        "strong_areas": strong_areas,
        "percentile_est": _percentile_est(accuracy),
    }


STREAM_MAX = {s["id"]: s["maxMarks"] for s in STREAMS}


def _streak(dates: List[date]) -> int:
    days = {d for d in dates}
    streak = 0
    cursor = max(days) if days else None
    if cursor is None:
        return 0
    if cursor < date.today():
        cursor = date.today()  # streak survives until the day ends
    while cursor in days:
        streak += 1
        cursor = cursor.fromordinal(cursor.toordinal() - 1)
    return streak


def _badges(attempts: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    badges: List[Dict[str, str]] = []
    if not attempts:
        return badges
    first = attempts[0]
    badges.append({"id": "first-step", "name": "First Step", "date": first["date"]})
    for a in attempts:
        if a["accuracy"] >= 85:
            badges.append({"id": "sharp-shooter", "name": "Sharp Shooter", "date": a["date"]})
            break
    for a in attempts:
        if a["score"] == a["total"]:
            badges.append({"id": "centurion", "name": "Perfect 100", "date": a["date"]})
            break
    if len(attempts) >= 5:
        badges.append({"id": "marathoner", "name": "Marathoner", "date": attempts[4]["date"]})
    for prev, cur in zip(attempts, attempts[1:]):
        if cur["accuracy"] - prev["accuracy"] >= 15:
            badges.append({"id": "comeback", "name": "Comeback Kid", "date": cur["date"]})
            break
    return badges


def compute_analytics(user_id: str) -> Dict[str, Any]:
    attempts = store.get_attempts(user_id)

    if not attempts:
        return {
            "attempts": 0,
            "avg_score": 0,
            "trend": [],
            "heatmap": {},
            "brain_map": [],
            "predictor": {"expected": 0, "max": 100},
            "streak": 0,
            "xp": 0,
            "level": 1,
            "badges": [],
            "recent_attempts": [],
        }

    accs = [a["accuracy"] for a in attempts]
    avg_score = round(sum(accs) / len(accs))
    trend = [{"date": a["date"], "score": a["accuracy"]} for a in attempts[-10:]]

    heat_raw: Dict[str, Dict[str, List[float]]] = {}
    for a in attempts:
        for t in a["per_topic"]:
            acc = t["accuracy"] / 100.0 if t["accuracy"] > 1.0 else t["accuracy"]
            heat_raw.setdefault(t["subject"], {}).setdefault(t["topic"], []).append(acc)
    heatmap = {s: {t: round(sum(v) / len(v), 4) for t, v in topics.items()} for s, topics in heat_raw.items()}
    brain_map = sorted(
        [{"subject": s, "value": round(sum(t.values()) / len(t.values()), 4)} for s, t in heatmap.items()],
        key=lambda b: -b["value"],
    )

    recent = attempts[-5:]
    mean_acc = sum(a["accuracy"] for a in recent) / len(recent)
    stream_max = STREAM_MAX.get(attempts[-1]["stream"], 100)
    expected = round(mean_acc / 100 * stream_max)

    xp = sum(a["score"] * 10 for a in attempts)
    level = xp // 300 + 1
    dates = [date.fromisoformat(a["date"]) for a in attempts]

    recent_attempts = [
        {
            "id": a["id"],
            "test_id": a["test_id"],
            "stream": a["stream"],
            "date": a["date"],
            "score": a["score"],
            "total": a["total"],
            "accuracy": a["accuracy"],
        }
        for a in attempts[-5:]
    ][::-1]

    return {
        "attempts": len(attempts),
        "avg_score": avg_score,
        "trend": trend,
        "heatmap": heatmap,
        "brain_map": brain_map,
        "predictor": {"expected": expected, "max": stream_max},
        "streak": _streak(dates),
        "xp": xp,
        "level": level,
        "badges": _badges(attempts),
        "recent_attempts": recent_attempts,
    }
