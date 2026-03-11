from sqlalchemy import Column, BigInteger, ForeignKey
from app.database import Base


class NoteMessageSource(Base):
    __tablename__ = "note_message_sources"

    note_id = Column(
        BigInteger,
        ForeignKey("notes.id", ondelete="CASCADE"),
        primary_key=True
    )

    chat_message_id = Column(
        BigInteger,
        ForeignKey("chat_messages.id", ondelete="CASCADE"),
        primary_key=True
    )