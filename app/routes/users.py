from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..auth_utils import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
def get_me(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
    }


@router.put("/me/mentee-profile", response_model=schemas.MenteeProfileUpdate)
def update_mentee_profile(
    payload: schemas.MenteeProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "mentee":
        raise HTTPException(403, "Only mentees have a mentee profile")

    profile = db.query(models.MenteeProfile).filter(
        models.MenteeProfile.user_id == current_user.id
    ).first()
    if not profile:
        profile = models.MenteeProfile(user_id=current_user.id)
        db.add(profile)

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile


@router.put("/me/mentor-profile", response_model=schemas.MentorProfileUpdate)
def update_mentor_profile(
    payload: schemas.MentorProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "mentor":
        raise HTTPException(403, "Only mentors have a mentor profile")

    profile = db.query(models.MentorProfile).filter(
        models.MentorProfile.user_id == current_user.id
    ).first()
    if not profile:
        profile = models.MentorProfile(user_id=current_user.id)
        db.add(profile)

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile
