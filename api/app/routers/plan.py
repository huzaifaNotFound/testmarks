from fastapi import APIRouter

from app.data.streams import STREAMS
from app.models.schemas import PlanRequest
from app.services.ai_provider import provider
from app.services.engine import WEAK_THRESHOLD
from app.services.store import get_attempts

router = APIRouter(tags=["plan"])


@router.post("/plan")
def get_plan(req: PlanRequest):
    attempts = get_attempts(req.user_id)
    if not attempts:
        return {
            "recommendations": [],
            "message": "No attempts yet. Take a diagnostic test first to get a personalised plan.",
        }

    raw: dict = {}
    for a in attempts:
        for t in a["per_topic"]:
            key = (a["stream"], t["subject"], t["topic"])
            raw.setdefault(key, {"correct": 0, "total": 0})
            raw[key]["correct"] += t["correct"]
            raw[key]["total"] += t["total"]

    weak = []
    for (stream, subject, topic), d in raw.items():
        accuracy = round(d["correct"] / d["total"] * 100)
        if accuracy < WEAK_THRESHOLD:
            weak.append({
                "stream": stream, "subject": subject, "topic": topic,
                "accuracy": accuracy, "correct": d["correct"], "total": d["total"],
            })
    weak.sort(key=lambda w: w["accuracy"])
    weak = weak[:3]

    recs = []
    for w in weak:
        stream = next((s for s in STREAMS if s["id"] == w["stream"]), None)
        recs.append(
            {
                "topic": w["topic"],
                "subject": w["subject"],
                "stream": w["stream"],
                "reason": (
                    f"Your accuracy in {w['topic']} is {w['accuracy']}% — below the 60% safety line "
                    f"{'in ' + stream['name'] if stream else 'for this stream'}. These are the easiest "
                    "marks to recover."
                ),
                "advice": provider.generate_recommendations([w], w["stream"])[0]["advice"],
                "tests": provider.generate_recommendations([w], w["stream"])[0]["tests"],
            }
        )
    return {"recommendations": recs}
