from fastapi import APIRouter, HTTPException

from app.data.streams import STREAMS_BY_ID
from app.services.engine import build_test
from app.services.store import register_test

router = APIRouter(tags=["diagnostic"])


@router.get("/diagnostic/{stream_id}")
def get_diagnostic(stream_id: str):
    if stream_id not in STREAMS_BY_ID:
        raise HTTPException(status_code=404, detail=f"Unknown stream: {stream_id}")
    test = build_test(stream_id, count=50, test_id=f"diag-{stream_id}")
    register_test(test)
    return test
