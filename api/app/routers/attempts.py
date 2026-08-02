import uuid
from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.data.questions import BANKS
from app.data.streams import STREAMS_BY_ID
from app.models.schemas import AttemptRequest
from app.services.ai_provider import provider
from app.services.engine import resolve_stream_from_test_id, score_attempt
from app.services.store import get_test, save_attempt

router = APIRouter(tags=["attempts"])


@router.post("/attempts", status_code=201)
def submit_attempt(req: AttemptRequest):
    test = get_test(req.test_id)
    if test is None:
        stream_id = resolve_stream_from_test_id(req.test_id)
        if stream_id is None:
            raise HTTPException(status_code=404, detail=f"Unknown test: {req.test_id}")
        test = {"test_id": req.test_id, "stream": stream_id, "questions": BANKS[stream_id]}

    result = score_attempt(test, [a.model_dump() for a in req.answers])
    result["coach_message"] = provider.generate_coach_message(result["weak_areas"], result["score"], result["total"])

    attempt = {
        "id": f"att-{uuid4_hex()}",
        "user_id": req.user_id,
        "test_id": req.test_id,
        "stream": test["stream"],
        "date": datetime.now().date().isoformat(),
        "score": result["score"],
        "total": result["total"],
        "accuracy": result["accuracy"],
        "time_taken_sec": req.time_taken_sec,
        "per_topic": result["per_topic"],
    }
    save_attempt(req.user_id, attempt)
    return result


def uuid4_hex() -> str:
    return uuid.uuid4().hex[:8]
