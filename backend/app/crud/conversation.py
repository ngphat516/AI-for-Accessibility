from sqlalchemy.orm import Session
from app.models import Conversation
from app.schemas import ConversationCreate

def create_conversation(db: Session, data: ConversationCreate):
    conv = Conversation(**data.dict())
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv

def get_conversations_by_user(db: Session, user_id: int):
    return db.query(Conversation).filter(Conversation.user_id == user_id).all()
