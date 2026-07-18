"""
MODULE 4: AI Mentor Matching

MVP implementation: keyword/skill-overlap scoring, weighted by experience-level fit.
This keeps the endpoint fast and free to run. Swap `score_mentor()` for an embedding-
similarity model (e.g. sentence-transformers or OpenAI embeddings) once there's a
large enough mentor pool for keyword overlap to stop being a good enough signal.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..auth_utils import get_current_user

router = APIRouter(prefix="/matching", tags=["matching"])


def score_mentor(mentee_skills: set[str], mentee_goal: str, profile: models.MentorProfile) -> tuple[float, list[str]]:
    mentor_skills = {s.strip().lower() for s in (profile.expertise or "").split(",") if s.strip()}
    reasons = []

    overlap = mentee_skills & mentor_skills
    skill_score = min(len(overlap) / max(len(mentee_skills), 1), 1.0) * 60
    if overlap:
        reasons.append(f"Shared skills: {', '.join(sorted(overlap))}")

    goal_score = 0
    if mentee_goal and profile.profession and mentee_goal.lower() in profile.profession.lower():
        goal_score = 25
        reasons.append("Career field matches your goal")

    rating_score = (profile.rating or 0) / 5 * 15

    total = round(skill_score + goal_score + rating_score, 1)
    if not reasons:
        reasons.append("Broad experience relevant to beginners")
    return total, reasons


@router.post("/find", response_model=list[schemas.MatchResult])
def find_matches(
    payload: schemas.MatchRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    mentee_skills = {s.strip().lower() for s in payload.skills.split(",") if s.strip()}

    mentors = (
        db.query(models.MentorProfile, models.User)
        .join(models.User, models.User.id == models.MentorProfile.user_id)
        .filter(models.MentorProfile.verification_status == "verified")
        .all()
    )

    results = []
    for profile, user in mentors:
        score, reasons = score_mentor(mentee_skills, payload.career_goal, profile)
        results.append(schemas.MatchResult(mentor_id=user.id, name=user.name, match_score=score, reasons=reasons))

    results.sort(key=lambda r: r.match_score, reverse=True)
    top_matches = results[:10]

    # log for mentor_matching_history / future model training
    for m in top_matches:
        db.add(models.MentorMatchingHistory(mentee_id=current_user.id, mentor_id=m.mentor_id, match_score=m.match_score))
    db.commit()

    return top_matches
