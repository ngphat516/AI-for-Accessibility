from sqlalchemy.orm import Session
from app.models import Note
from app.schemas import NoteCreate, NoteUpdate


def create_note(db: Session, data: NoteCreate):
    note = Note(**data.dict())
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def get_notes(db: Session):
    return db.query(Note).all()


def get_note(db: Session, note_id: int):
    return db.query(Note).filter(Note.id == note_id).first()


def get_notes_by_user(db: Session, user_id: int):
    return db.query(Note).filter(Note.user_id == user_id).all()


def update_note(db: Session, note_id: int, data: NoteUpdate):
    note = db.query(Note).filter(Note.id == note_id).first()

    if not note:
        return None

    for key, value in data.dict(exclude_unset=True).items():
        setattr(note, key, value)

    db.commit()
    db.refresh(note)
    return note


def delete_note(db: Session, note_id: int):
    note = db.query(Note).filter(Note.id == note_id).first()

    if not note:
        return None

    db.delete(note)
    db.commit()
    return note