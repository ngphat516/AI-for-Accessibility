import os
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from elevenlabs.client import ElevenLabs

router = APIRouter(prefix="/voice", tags=["Voice"])


VOICE_OPTIONS = {
    1: "JBFqnCBsd6RMkjVDRZzb",
    2: "pNInz6obpgDQGcFmaJgB"
}

def _generate_audio(text: str, voice_option: Optional[int]):
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ElevenLabs API key is not configured")

    client = ElevenLabs(api_key=api_key)

    voice_id = VOICE_OPTIONS.get(voice_option, VOICE_OPTIONS[1])

    try:
        audio_generator = client.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
        )
        
        def audio_stream():
            for chunk in audio_generator:
                if chunk:
                    yield chunk
                    
        return StreamingResponse(audio_stream(), media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def generate_voice_get(text: str, voice_option: Optional[int] = 1):
    return _generate_audio(text, voice_option)
