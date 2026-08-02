import uuid

from fastapi import APIRouter, HTTPException

from app.data.streams import STREAMS_BY_ID
from app.models.schemas import TestGenerateRequest
from app.services.engine import build_test
from app.services.store import register_test

router = APIRouter(tags=["tests"])


@router.post("/tests/generate")
def generate_test(req: TestGenerateRequest):
    if req.stream not in STREAMS_BY_ID:
        raise HTTPException(status_code=404, detail=f"Unknown stream: {req.stream}")
    count = max(1, min(req.count, 50))
    test = build_test(
        req.stream,
        count=count,
        focus_topics=req.focus_topics,
        difficulty=req.difficulty,
        test_id=f"gen-{req.stream}-{uuid.uuid4().hex[:8]}",
    )
    register_test(test)
    return test
