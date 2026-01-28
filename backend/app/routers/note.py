from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import NoteCreate, NoteOut
from app.crud.note import create_note

router = APIRouter(prefix="/notes", tags=["Notes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=NoteOut)
def create(data: NoteCreate, db: Session = Depends(get_db)):
    return create_note(db, data)
