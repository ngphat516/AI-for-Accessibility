from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import ConversationCreate, ConversationOut
from app.crud.conversation import create_conversation, get_conversations_by_user

router = APIRouter(prefix="/conversations", tags=["Conversations"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ConversationOut)
def create(data: ConversationCreate, db: Session = Depends(get_db)):
    return create_conversation(db, data)

@router.get("/user/{user_id}", response_model=list[ConversationOut])
def list_by_user(user_id: int, db: Session = Depends(get_db)):
    return get_conversations_by_user(db, user_id)
