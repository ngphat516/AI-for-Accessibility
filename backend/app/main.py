from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import conversation, chat_message, note, note_message_source, voice
from app.routers import gemini_live_router
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Chat Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(conversation.router)
app.include_router(chat_message.router)
app.include_router(note.router)
app.include_router(note_message_source.router)
app.include_router(voice.router)
app.include_router(gemini_live_router.router)
