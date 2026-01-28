from sqlalchemy.orm import Session
from app.models import Note
from app.schemas import NoteCreate

def create_note(db: Session, data: NoteCreate):
    note = Note(**data.dict())
    db.add(note)
    db.commit()
    db.refresh(note)
    return note
