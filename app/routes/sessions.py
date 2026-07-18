from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..auth_utils import get_current_user

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("", response_model=schemas.SessionOut)
def book_session(
    payload: schemas.SessionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "mentee":
        raise HTTPException(403, "Only mentees can book sessions")

    mentor = db.query(models.User).filter(models.User.id == payload.mentor_id, models.User.role == "mentor").first()
    if not mentor:
        raise HTTPException(404, "Mentor not found")

    session = models.MentorshipSession(
        mentor_id=payload.mentor_id,
        mentee_id=current_user.id,
        date=payload.date,
        status=models.SessionStatus.pending,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    db.add(models.Notification(
        user_id=mentor.id,
        message=f"New session request from {current_user.name} on {payload.date:%Y-%m-%d %H:%M}",
    ))
    db.commit()

    return session


@router.get("", response_model=list[schemas.SessionOut])
def my_sessions(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role == "mentor":
        return db.query(models.MentorshipSession).filter(models.MentorshipSession.mentor_id == current_user.id).all()
    return db.query(models.MentorshipSession).filter(models.MentorshipSession.mentee_id == current_user.id).all()


@router.patch("/{session_id}/status", response_model=schemas.SessionOut)
def update_status(
    session_id: int,
    status: models.SessionStatus,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    session = db.query(models.MentorshipSession).filter(models.MentorshipSession.id == session_id).first()
    if not session:
        raise HTTPException(404, "Session not found")
    if current_user.id not in (session.mentor_id, session.mentee_id):
        raise HTTPException(403, "Not your session")
    session.status = status
    db.commit()
    db.refresh(session)
    return session
