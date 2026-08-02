from typing import List, Optional

from pydantic import BaseModel


class Answer(BaseModel):
    question_id: str
    chosen: int


class AttemptRequest(BaseModel):
    user_id: str
    test_id: str
    answers: List[Answer]
    time_taken_sec: int = 0


class TestGenerateRequest(BaseModel):
    user_id: str
    stream: str
    focus_topics: Optional[List[str]] = None
    difficulty: Optional[str] = None
    count: int = 10


class PlanRequest(BaseModel):
    user_id: str
