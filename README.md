# SheMentor API

FastAPI backend for the SheMentor MVP — authentication, mentor discovery, AI matching,
goal tracking, session booking, and the AI career assistant.

## live demo
http://localhost:5174/

## Setup

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then fill in JWT_SECRET and OPENAI_API_KEY
uvicorn app.main:app --reload
```

The app defaults to a local SQLite file (`shementor.db`) so it runs with zero setup.
Point `DATABASE_URL` in `.env` at a real Postgres instance (e.g. Supabase) when ready.

Interactive API docs: `http://localhost:8000/docs`

## Endpoints implemented (MVP scope)

| Area | Endpoint |
|---|---|
| Auth | `POST /auth/signup`, `POST /auth/login` |
| Users | `GET /users/me`, `PUT /users/me/mentee-profile`, `PUT /users/me/mentor-profile` |
| Mentors | `GET /mentors`, `GET /mentors/{id}` |
| AI Matching | `POST /matching/find` |
| Goals | `GET /goals`, `POST /goals`, `PATCH /goals/{id}/progress` |
| Sessions | `POST /sessions`, `GET /sessions`, `PATCH /sessions/{id}/status` |
| AI Assistant | `POST /chat/message`, `POST /chat/roadmap` |

## Not yet built (from the full architecture doc)

Messaging (Socket.io), community posts/comments, reviews, resources catalog, and
notifications all have table definitions in `models.py` already but no routes yet —
add them the same way the modules above are structured once the MVP core is validated.

## Notes

- Mentor matching (`app/routes/matching.py`) uses skill-overlap scoring for the MVP.
  Swap in embedding similarity once there's a real mentor pool to justify it.
- `Base.metadata.create_all()` is fine for local dev; move to Alembic migrations
  before this touches a shared database.
- CORS is wide open (`allow_origins=["*"]`) — restrict to the deployed frontend
  origin before shipping.
