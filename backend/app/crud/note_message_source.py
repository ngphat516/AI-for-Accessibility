from sqlalchemy.orm import Session
from app.models import NoteMessageSource
from app.schemas import NoteMessageSourceCreate


def create_source(db: Session, data: NoteMessageSourceCreate):
    source = NoteMessageSource(**data.dict())
    db.add(source)
    db.commit()
    return source


def get_sources_by_note(db: Session, note_id: int):
    return db.query(NoteMessageSource).filter(
        NoteMessageSource.note_id == note_id
    ).all()


def delete_source(db: Session, note_id: int, chat_message_id: int):
    source = db.query(NoteMessageSource).filter(
        NoteMessageSource.note_id == note_id,
        NoteMessageSource.chat_message_id == chat_message_id
    ).first()

    if not source:
        return None

    db.delete(source)
    db.commit()
    return source