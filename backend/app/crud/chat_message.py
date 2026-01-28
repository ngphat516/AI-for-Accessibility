from sqlalchemy.orm import Session
from app.models import ChatMessage
from app.schemas import ChatMessageCreate

def create_message(db: Session, data: ChatMessageCreate):
    msg = ChatMessage(**data.dict())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
