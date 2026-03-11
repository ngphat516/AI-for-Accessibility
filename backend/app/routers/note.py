from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import NoteCreate, NoteOut, NoteUpdate
from app.crud.note import (
    create_note,
    get_notes,
    get_note,
    get_notes_by_user,
    update_note,
    delete_note
)

router = APIRouter(prefix="/notes", tags=["Notes"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[NoteOut])
def read_notes(db: Session = Depends(get_db)):
    return get_notes(db)


@router.get("/user/{user_id}", response_model=list[NoteOut])
def list_by_user(user_id: int, db: Session = Depends(get_db)):
    return get_notes_by_user(db, user_id)


@router.get("/{id}", response_model=NoteOut)
def read_note(id: int, db: Session = Depends(get_db)):
    note = get_note(db, id)

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    return note


@router.post("/", response_model=NoteOut)
def create(data: NoteCreate, db: Session = Depends(get_db)):
    return create_note(db, data)


@router.put("/{id}", response_model=NoteOut)
def update(id: int, data: NoteUpdate, db: Session = Depends(get_db)):
    note = update_note(db, id, data)

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    return note


@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    note = delete_note(db, id)

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    return {"message": "Deleted successfully"}