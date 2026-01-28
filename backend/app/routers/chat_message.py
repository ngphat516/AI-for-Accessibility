from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import ChatMessageCreate, ChatMessageOut
from app.crud.chat_message import create_message

router = APIRouter(prefix="/messages", tags=["Chat Messages"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ChatMessageOut)
def create(data: ChatMessageCreate, db: Session = Depends(get_db)):
    return create_message(db, data)
