from fastapi import APIRouter

from app.data.streams import STREAMS

router = APIRouter(tags=["streams"])


@router.get("/streams")
def list_streams():
    return STREAMS
