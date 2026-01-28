from pydantic import BaseModel

class ConversationCreate(BaseModel):
    user_id: int
    title: str

class ConversationOut(ConversationCreate):
    id: int

    class Config:
        from_attributes = True
