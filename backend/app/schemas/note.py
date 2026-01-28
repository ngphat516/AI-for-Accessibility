from pydantic import BaseModel

class NoteCreate(BaseModel):
    user_id: int
    title: str
    content: str | None = None

class NoteOut(NoteCreate):
    id: int

    class Config:
        from_attributes = True
