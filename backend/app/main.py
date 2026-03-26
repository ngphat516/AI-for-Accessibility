from fastapi import FastAPI
from app.database import engine, Base
from app.routers import conversation, chat_message, note, note_message_source
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Chat Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)


app.include_router(conversation.router)
app.include_router(chat_message.router)
app.include_router(note.router)
app.include_router(note_message_source.router)