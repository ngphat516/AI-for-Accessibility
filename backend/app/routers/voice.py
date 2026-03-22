from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
import os

load_dotenv()

router = APIRouter(prefix="/voice", tags=["Voice"])

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

class VoiceRequest(BaseModel):
    text: str = "Xin chào, tôi là thuận phát"
    voice_id: str = "EXAVITQu4vr4xnSDxMaL"  # 
    model_id: str = "eleven_v3" # support Vietnamese

@router.post("/")
def generate_voice(request: VoiceRequest):
    audio_stream = elevenlabs.text_to_speech.convert(
        text=request.text,
        voice_id=request.voice_id,
        model_id=request.model_id,
        output_format="mp3_44100_128",
    )
    
    def iterfile():
        for chunk in audio_stream:
            if chunk:
                yield chunk

    return StreamingResponse(iterfile(), media_type="audio/mpeg")

@router.get("/test")
def test_voice(
    text: str = "Xin chào, tôi là thuận phát", 
    voice_id: str = "EXAVITQu4vr4xnSDxMaL",
    model_id: str = "eleven_v3",
    output_format: str = "mp3_44100_128"
):
    """
    Endpoint dùng phương thức GET để dễ dàng test trực tiếp trên trình duyệt với đầy đủ options
    Ví dụ: /voice/test?text=Xin chào&voice_id=...&model_id=...&output_format=...
    """
    audio_stream = elevenlabs.text_to_speech.convert(
        text=text,
        voice_id=voice_id,
        model_id=model_id,
        output_format=output_format,
    )
    
    def iterfile():
        for chunk in audio_stream:
            if chunk:
                yield chunk

    return StreamingResponse(iterfile(), media_type="audio/mpeg")

@router.get("/list")
def list_voices():
    """
    Lấy danh sách các voice có sẵn từ ElevenLabs
    """
    try:
        response = elevenlabs.voices.get_all()
        # Trích xuất voice_id và name của từng voice
        voices = [{"voice_id": v.voice_id, "name": v.name} for v in response.voices]
        return {"voices": voices}
    except Exception as e:
        return {"error": str(e)}
