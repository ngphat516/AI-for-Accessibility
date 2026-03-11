from sqlalchemy import Column, BigInteger, String, Enum, DateTime, ForeignKey, Text, JSON, func
from app.database import Base
import enum

class SenderType(str, enum.Enum):
    user = "user"
    ai = "ai"

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(BigInteger, primary_key=True, index=True)
    conversation_id = Column(
        BigInteger,
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False
    )
    sender_type = Column(Enum(SenderType), nullable=False)
    content = Column(Text, nullable=False)
    generated_links = Column(JSON, nullable=True)
    audio_url = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
