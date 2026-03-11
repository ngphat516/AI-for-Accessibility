from pydantic import BaseModel
from typing import Optional


class NoteCreate(BaseModel):
    user_id: int
    title: str
    content: Optional[str] = None


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class NoteOut(NoteCreate):
    id: int

    class Config:
        from_attributes = True