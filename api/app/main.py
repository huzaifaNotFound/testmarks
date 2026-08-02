from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import analytics, attempts, diagnostic, plan, streams, tests
from app.services import ai_provider

app = FastAPI(
    title="Test Marks AI API",
    description="AI-tutored mock test backend for NEET, JEE and CBSE students.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in (streams.router, diagnostic.router, attempts.router, tests.router, analytics.router, plan.router):
    app.include_router(router, prefix="/api")


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "provider": ai_provider.PROVIDER, "model": ai_provider.MODEL}
