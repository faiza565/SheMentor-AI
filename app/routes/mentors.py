from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/mentors", tags=["mentors"])


@router.get("", response_model=list[schemas.MentorOut])
def list_mentors(
    skill: Optional[str] = Query(None, description="Filter by a skill/expertise keyword"),
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    db: Session = Depends(get_db),
):
    query = (
        db.query(models.MentorProfile, models.User)
        .join(models.User, models.User.id == models.MentorProfile.user_id)
        .filter(models.MentorProfile.verification_status == "verified")
    )

    if skill:
        query = query.filter(models.MentorProfile.expertise.ilike(f"%{skill}%"))
    if min_rating is not None:
        query = query.filter(models.MentorProfile.rating >= min_rating)

    results = []
    for profile, user in query.all():
        results.append(
            schemas.MentorOut(
                user_id=user.id,
                name=user.name,
                profession=profile.profession,
                company=profile.company,
                expertise=profile.expertise,
                experience_years=profile.experience_years,
                rating=profile.rating or 0.0,
            )
        )
    return results


@router.get("/{mentor_id}", response_model=schemas.MentorOut)
def get_mentor(mentor_id: int, db: Session = Depends(get_db)):
    profile = db.query(models.MentorProfile).filter(models.MentorProfile.user_id == mentor_id).first()
    user = db.query(models.User).filter(models.User.id == mentor_id).first()
    if not profile or not user:
        return None
    return schemas.MentorOut(
        user_id=user.id,
        name=user.name,
        profession=profile.profession,
        company=profile.company,
        expertise=profile.expertise,
        experience_years=profile.experience_years,
        rating=profile.rating or 0.0,
    )
