from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import ChatMessageCreate, ChatMessageOut, ChatMessageUpdate
from app.crud.chat_message import (
    create_message,
    get_messages,
    get_message,
    update_message,
    delete_message
)

router = APIRouter(prefix="/messages", tags=["Chat Messages"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[ChatMessageOut])
def read_messages(db: Session = Depends(get_db)):
    return get_messages(db)


@router.get("/{id}", response_model=ChatMessageOut)
def read_message(id: int, db: Session = Depends(get_db)):
    msg = get_message(db, id)

    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")

    return msg


@router.post("/", response_model=ChatMessageOut)
def create(data: ChatMessageCreate, db: Session = Depends(get_db)):
    return create_message(db, data)


@router.put("/{id}", response_model=ChatMessageOut)
def update(id: int, data: ChatMessageUpdate, db: Session = Depends(get_db)):
    msg = update_message(db, id, data)

    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")

    return msg


@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    msg = delete_message(db, id)

    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")

    return {"message": "Deleted successfully"}