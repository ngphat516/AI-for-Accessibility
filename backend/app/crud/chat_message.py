from sqlalchemy.orm import Session
from app.models import ChatMessage
from app.schemas import ChatMessageCreate, ChatMessageUpdate


def get_messages(db: Session):
    return db.query(ChatMessage).all()


def get_message(db: Session, message_id: int):
    return db.query(ChatMessage).filter(ChatMessage.id == message_id).first()


def create_message(db: Session, data: ChatMessageCreate):
    msg = ChatMessage(**data.dict())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def update_message(db: Session, message_id: int, data: ChatMessageUpdate):
    msg = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()

    if not msg:
        return None

    for key, value in data.dict(exclude_unset=True).items():
        setattr(msg, key, value)

    db.commit()
    db.refresh(msg)
    return msg


def delete_message(db: Session, message_id: int):
    msg = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()

    if not msg:
        return None

    db.delete(msg)
    db.commit()
    return msg