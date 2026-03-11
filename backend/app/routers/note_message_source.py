from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.note_message_source import (
    NoteMessageSourceCreate,
    NoteMessageSourceOut
)
from app.crud.note_message_source import (
    create_source,
    get_sources_by_note,
    delete_source
)

router = APIRouter(
    prefix="/note-sources",
    tags=["NoteMessageSources"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=NoteMessageSourceOut)
def create(data: NoteMessageSourceCreate, db: Session = Depends(get_db)):
    return create_source(db, data)


@router.get("/note/{note_id}", response_model=list[NoteMessageSourceOut])
def get_by_note(note_id: int, db: Session = Depends(get_db)):
    return get_sources_by_note(db, note_id)


@router.delete("/{note_id}/{chat_message_id}")
def delete(note_id: int, chat_message_id: int, db: Session = Depends(get_db)):
    source = delete_source(db, note_id, chat_message_id)

    if not source:
        raise HTTPException(status_code=404, detail="Source not found")

    return {"message": "Deleted successfully"}