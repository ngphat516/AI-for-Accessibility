from pydantic import BaseModel
from typing import Optional

class ConversationCreate(BaseModel):
    user_id: int
    title: str


class ConversationUpdate(BaseModel):
    title: Optional[str] = None


class ConversationOut(ConversationCreate):
    id: int

    class Config:
        from_attributes = True