from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import ConversationCreate, ConversationOut, ConversationUpdate
from app.crud.conversation import (
    create_conversation,
    get_conversations,
    get_conversation,
    get_conversations_by_user,
    update_conversation,
    delete_conversation
)

router = APIRouter(prefix="/conversations", tags=["Conversations"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[ConversationOut])
def read_conversations(db: Session = Depends(get_db)):
    return get_conversations(db)


@router.get("/user/{user_id}", response_model=list[ConversationOut])
def list_by_user(user_id: int, db: Session = Depends(get_db)):
    return get_conversations_by_user(db, user_id)


@router.get("/{id}", response_model=ConversationOut)
def read_conversation(id: int, db: Session = Depends(get_db)):
    conv = get_conversation(db, id)

    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return conv


@router.post("/", response_model=ConversationOut)
def create(data: ConversationCreate, db: Session = Depends(get_db)):
    return create_conversation(db, data)


@router.put("/{id}", response_model=ConversationOut)
def update(id: int, data: ConversationUpdate, db: Session = Depends(get_db)):
    conv = update_conversation(db, id, data)

    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return conv


@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    conv = delete_conversation(db, id)

    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return {"message": "Deleted successfully"}