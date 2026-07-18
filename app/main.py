from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import auth, users, mentors, matching, goals, sessions, chat

# Creates tables on startup for local/dev use.
# For production, switch to Alembic migrations instead of create_all().
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SheMentor API",
    description="AI-powered mentorship platform for women — backend API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to the deployed frontend origin before shipping
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(mentors.router)
app.include_router(matching.router)
app.include_router(goals.router)
app.include_router(sessions.router)
app.include_router(chat.router)


@app.get("/")
def health_check():
    return {"status": "SheMentor API is running"}
