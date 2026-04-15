import asyncio
import base64
import json
import logging
import os

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.gemini_live import GeminiLive

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ws", tags=["Gemini Live"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-live-001")


@router.websocket("/gemini-live")
async def gemini_live_ws(websocket: WebSocket):
    """
    WebSocket endpoint cho Gemini Live API.

    Giao thức client → server:
      - bytes          : Raw PCM audio (16-bit, 16000 Hz, mono)
      - JSON text      : {"type": "image", "data": "<base64 JPEG>"}  – video frame
      - JSON text      : {"type": "text",  "data": "<message>"}      – tin nhắn văn bản
      - plain text     : chuỗi bất kỳ → gửi thẳng làm text input

    Giao thức server → client:
      - bytes          : Raw PCM audio từ Gemini (24000 Hz, mono)
      - JSON text      : {"type": "user",         "text": "..."}   – user transcription
      - JSON text      : {"type": "gemini",       "text": "..."}   – AI transcription
      - JSON text      : {"type": "turn_complete"}
      - JSON text      : {"type": "interrupted"}
      - JSON text      : {"type": "error",        "error": "..."}
    """
    if not GEMINI_API_KEY:
        await websocket.accept()
        await websocket.send_json(
            {"type": "error", "error": "GEMINI_API_KEY chưa được cấu hình trong file .env"}
        )
        await websocket.close()
        return

    await websocket.accept()
    logger.info("WebSocket Gemini Live đã kết nối")

    audio_input_queue: asyncio.Queue = asyncio.Queue()
    video_input_queue: asyncio.Queue = asyncio.Queue()
    text_input_queue: asyncio.Queue = asyncio.Queue()

    async def audio_output_callback(data: bytes):
        """Gửi audio PCM từ Gemini về client dưới dạng bytes."""
        try:
            await websocket.send_bytes(data)
        except Exception as e:
            logger.warning(f"Không thể gửi audio về client: {e}")

    async def audio_interrupt_callback():
        """Xử lý khi Gemini bị ngắt (client bắt đầu nói lại)."""
        pass  # Event 'interrupted' sẽ được forward qua event_queue

    gemini_client = GeminiLive(
        api_key=GEMINI_API_KEY,
        model=GEMINI_MODEL,
        input_sample_rate=16000,
    )

    async def receive_from_client():
        """Nhận dữ liệu từ client và phân loại vào đúng queue."""
        try:
            while True:
                message = await websocket.receive()

                # Binary → audio PCM
                if message.get("bytes"):
                    await audio_input_queue.put(message["bytes"])

                # Text → phân tích JSON hoặc gửi thẳng làm text
                elif message.get("text"):
                    raw = message["text"]
                    try:
                        payload = json.loads(raw)
                        if isinstance(payload, dict):
                            msg_type = payload.get("type")

                            # Video frame
                            if msg_type == "image" and payload.get("data"):
                                logger.debug(
                                    f"Nhận video frame: {len(payload['data'])} ký tự base64"
                                )
                                image_bytes = base64.b64decode(payload["data"])
                                await video_input_queue.put(image_bytes)

                            # Text message
                            elif msg_type == "text" and payload.get("data"):
                                await text_input_queue.put(payload["data"])

                            else:
                                # Fallback: gửi toàn bộ JSON string làm text
                                await text_input_queue.put(raw)
                        else:
                            await text_input_queue.put(raw)
                    except json.JSONDecodeError:
                        # Plain text
                        await text_input_queue.put(raw)

        except WebSocketDisconnect:
            logger.info("WebSocket Gemini Live đã ngắt kết nối")
        except Exception as e:
            logger.error(f"Lỗi nhận dữ liệu từ client: {e}")

    receive_task = asyncio.create_task(receive_from_client())

    try:
        async for event in gemini_client.start_session(
            audio_input_queue=audio_input_queue,
            video_input_queue=video_input_queue,
            text_input_queue=text_input_queue,
            audio_output_callback=audio_output_callback,
            audio_interrupt_callback=audio_interrupt_callback,
        ):
            if event:
                await websocket.send_json(event)

    except Exception as e:
        import traceback
        logger.error(f"Lỗi Gemini session: {type(e).__name__}: {e}\n{traceback.format_exc()}")
        try:
            await websocket.send_json({"type": "error", "error": f"{type(e).__name__}: {e}"})
        except Exception:
            pass
    finally:
        receive_task.cancel()
        try:
            await websocket.close()
        except Exception:
            pass
        logger.info("WebSocket Gemini Live đã đóng")
