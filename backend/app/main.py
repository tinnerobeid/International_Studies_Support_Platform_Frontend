from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import router
from app.core.db import Base, engine

app = FastAPI(title=settings.APP_NAME)

# Create tables if not using alembic yet (safe for early dev)
Base.metadata.create_all(bind=engine)

origins = [o.strip() for o in settings.FRONTEND_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/health")
def health():
    return {"status": "ok"}
