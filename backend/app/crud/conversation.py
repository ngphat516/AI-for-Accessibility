from sqlalchemy.orm import Session
from app.models import Conversation
from app.schemas import ConversationCreate, ConversationUpdate


def create_conversation(db: Session, data: ConversationCreate):
    conv = Conversation(**data.dict())
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv


def get_conversations(db: Session):
    return db.query(Conversation).all()


def get_conversation(db: Session, conversation_id: int):
    return db.query(Conversation).filter(
        Conversation.id == conversation_id
    ).first()


def get_conversations_by_user(db: Session, user_id: int):
    return db.query(Conversation).filter(
        Conversation.user_id == user_id
    ).all()


def update_conversation(db: Session, conversation_id: int, data: ConversationUpdate):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id
    ).first()

    if not conv:
        return None

    for key, value in data.dict(exclude_unset=True).items():
        setattr(conv, key, value)

    db.commit()
    db.refresh(conv)
    return conv


def delete_conversation(db: Session, conversation_id: int):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id
    ).first()

    if not conv:
        return None

    db.delete(conv)
    db.commit()
    return conv