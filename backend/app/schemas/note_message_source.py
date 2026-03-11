from pydantic import BaseModel


class NoteMessageSourceCreate(BaseModel):
    note_id: int
    chat_message_id: int


class NoteMessageSourceOut(NoteMessageSourceCreate):
    class Config:
        from_attributes = True