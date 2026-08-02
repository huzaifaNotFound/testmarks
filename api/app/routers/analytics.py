from fastapi import APIRouter

from app.services.engine import compute_analytics

router = APIRouter(tags=["analytics"])


@router.get("/analytics/{user_id}")
def get_analytics(user_id: str):
    return compute_analytics(user_id)
