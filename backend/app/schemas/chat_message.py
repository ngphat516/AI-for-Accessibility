from pydantic import BaseModel
from typing import Optional
from enum import Enum

class SenderType(str, Enum):
    user = "user"
    ai = "ai"

class ChatMessageCreate(BaseModel):
    conversation_id: int
    sender_type: SenderType
    content: str
    generated_links: Optional[list[dict]] = None
    audio_url: Optional[str] = None

class ChatMessageUpdate(BaseModel):
    content: Optional[str] = None
    generated_links: Optional[list[dict]] = None
    audio_url: Optional[str] = None

class ChatMessageOut(ChatMessageCreate):
    id: int

    class Config:
        from_attributes = True