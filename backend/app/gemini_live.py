import asyncio
import inspect
import logging
import traceback

from google import genai
from google.genai import types

logger = logging.getLogger(__name__)

SYSTEM_INSTRUCTION = (
    "Bạn là trợ lý AI thông minh hỗ trợ người khuyết tật. "
    "Hãy luôn trả lời bằng tiếng Việt, ngắn gọn và rõ ràng. "
    "Bạn có thể thấy camera hoặc màn hình của người dùng được chia sẻ theo thời gian thực. "
    "Hãy chủ động nhận xét và hỗ trợ người dùng dựa trên những gì bạn thấy khi được hỏi."
)


class GeminiLive:
    """
    Xử lý tương tác real-time với Gemini Live API qua Google Gen AI Python SDK.
    Hỗ trợ audio, video và text input đồng thời.
    """

    def __init__(
        self,
        api_key: str,
        model: str,
        input_sample_rate: int = 16000,
        tools: list = None,
        tool_mapping: dict = None,
    ):
        """
        Khởi tạo GeminiLive client.

        Args:
            api_key:           Gemini API Key từ Google AI Studio.
            model:             Tên model (vd: "gemini-2.0-flash-live-001").
            input_sample_rate: Sample rate của audio input (Hz). Mặc định 16000.
            tools:             Danh sách tools khai báo với Gemini (optional).
            tool_mapping:      Dict map tên tool → hàm Python (optional).
        """
        self.api_key = api_key
        self.model = model
        self.input_sample_rate = input_sample_rate
        self.client = genai.Client(api_key=api_key)
        self.tools = tools or []
        self.tool_mapping = tool_mapping or {}

    async def start_session(
        self,
        audio_input_queue: asyncio.Queue,
        video_input_queue: asyncio.Queue,
        text_input_queue: asyncio.Queue,
        audio_output_callback,
        audio_interrupt_callback=None,
    ):
        """
        Bắt đầu một Gemini Live session. Là async generator, yield các event:
          - {"type": "user",         "text": "..."}   – transcription từ user
          - {"type": "gemini",       "text": "..."}   – transcription từ Gemini
          - {"type": "turn_complete"}                 – Gemini hoàn thành lượt nói
          - {"type": "interrupted"}                   – AI bị ngắt
          - {"type": "tool_call",    "name": ..., "args": ..., "result": ...}
          - {"type": "error",        "error": "..."}  – lỗi
        """
        config = types.LiveConnectConfig(
            response_modalities=[types.Modality.AUDIO],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name="Aoede"
                    )
                )
            ),
            system_instruction=types.Content(
                parts=[types.Part(text=SYSTEM_INSTRUCTION)]
            ),
            input_audio_transcription=types.AudioTranscriptionConfig(),
            output_audio_transcription=types.AudioTranscriptionConfig(),
            realtime_input_config=types.RealtimeInputConfig(
                turn_coverage="TURN_INCLUDES_ONLY_ACTIVITY",
            ),
            tools=self.tools,
        )

        logger.info(f"Đang kết nối Gemini Live với model={self.model}")
        try:
            async with self.client.aio.live.connect(model=self.model, config=config) as session:
                logger.info("Gemini Live session đã mở thành công")

                # ── Task: Gửi audio input ────────────────────────────────────
                async def send_audio():
                    try:
                        while True:
                            chunk = await audio_input_queue.get()
                            await session.send_realtime_input(
                                audio=types.Blob(
                                    data=chunk,
                                    mime_type=f"audio/pcm;rate={self.input_sample_rate}",
                                )
                            )
                    except asyncio.CancelledError:
                        logger.debug("send_audio task đã dừng")
                    except Exception as e:
                        logger.error(f"send_audio lỗi: {e}\n{traceback.format_exc()}")

                # ── Task: Gửi video input ────────────────────────────────────
                async def send_video():
                    try:
                        while True:
                            chunk = await video_input_queue.get()
                            logger.debug(f"Gửi video frame: {len(chunk)} bytes")
                            await session.send_realtime_input(
                                video=types.Blob(data=chunk, mime_type="image/jpeg")
                            )
                    except asyncio.CancelledError:
                        logger.debug("send_video task đã dừng")
                    except Exception as e:
                        logger.error(f"send_video lỗi: {e}\n{traceback.format_exc()}")

                # ── Task: Gửi text input ─────────────────────────────────────
                async def send_text():
                    try:
                        while True:
                            text = await text_input_queue.get()
                            logger.info(f"Gửi text đến Gemini: {text}")
                            await session.send_realtime_input(text=text)
                    except asyncio.CancelledError:
                        logger.debug("send_text task đã dừng")
                    except Exception as e:
                        logger.error(f"send_text lỗi: {e}\n{traceback.format_exc()}")

                event_queue: asyncio.Queue = asyncio.Queue()

                # ── Task: Nhận response từ Gemini ────────────────────────────
                async def receive_loop():
                    try:
                        while True:
                            async for response in session.receive():
                                logger.debug(f"Nhận response: {response}")

                                if response.go_away:
                                    logger.warning(f"Gemini GoAway: {response.go_away}")

                                if response.session_resumption_update:
                                    logger.info(f"Session resumption: {response.session_resumption_update}")

                                server_content = response.server_content
                                tool_call = response.tool_call

                                if server_content:
                                    # Audio output
                                    if server_content.model_turn:
                                        for part in server_content.model_turn.parts:
                                            if part.inline_data:
                                                if inspect.iscoroutinefunction(audio_output_callback):
                                                    await audio_output_callback(part.inline_data.data)
                                                else:
                                                    audio_output_callback(part.inline_data.data)

                                    # Transcription – user nói gì
                                    if (
                                        server_content.input_transcription
                                        and server_content.input_transcription.text
                                    ):
                                        await event_queue.put(
                                            {"type": "user", "text": server_content.input_transcription.text}
                                        )

                                    # Transcription – Gemini nói gì
                                    if (
                                        server_content.output_transcription
                                        and server_content.output_transcription.text
                                    ):
                                        await event_queue.put(
                                            {"type": "gemini", "text": server_content.output_transcription.text}
                                        )

                                    if server_content.turn_complete:
                                        await event_queue.put({"type": "turn_complete"})

                                    if server_content.interrupted:
                                        if audio_interrupt_callback:
                                            if inspect.iscoroutinefunction(audio_interrupt_callback):
                                                await audio_interrupt_callback()
                                            else:
                                                audio_interrupt_callback()
                                        await event_queue.put({"type": "interrupted"})

                                # Tool calls
                                if tool_call:
                                    function_responses = []
                                    for fc in tool_call.function_calls:
                                        func_name = fc.name
                                        args = fc.args or {}

                                        if func_name in self.tool_mapping:
                                            try:
                                                tool_func = self.tool_mapping[func_name]
                                                if inspect.iscoroutinefunction(tool_func):
                                                    result = await tool_func(**args)
                                                else:
                                                    loop = asyncio.get_running_loop()
                                                    result = await loop.run_in_executor(
                                                        None, lambda: tool_func(**args)
                                                    )
                                            except Exception as e:
                                                result = f"Lỗi: {e}"

                                            function_responses.append(
                                                types.FunctionResponse(
                                                    name=func_name,
                                                    id=fc.id,
                                                    response={"result": result},
                                                )
                                            )
                                            await event_queue.put(
                                                {
                                                    "type": "tool_call",
                                                    "name": func_name,
                                                    "args": args,
                                                    "result": result,
                                                }
                                            )

                                    await session.send_tool_response(function_responses=function_responses)

                            # Receive iterator kết thúc – re-enter để tiếp tục lắng nghe
                            logger.debug("Receive iterator hoàn thành, vào lại vòng lặp")

                    except asyncio.CancelledError:
                        logger.debug("receive_loop task đã dừng")
                    except Exception as e:
                        logger.error(f"receive_loop lỗi: {type(e).__name__}: {e}\n{traceback.format_exc()}")
                        await event_queue.put({"type": "error", "error": f"{type(e).__name__}: {e}"})
                    finally:
                        logger.info("receive_loop thoát")
                        await event_queue.put(None)  # Sentinel để dừng vòng lặp chính

                # Khởi chạy các task song song
                send_audio_task = asyncio.create_task(send_audio())
                send_video_task = asyncio.create_task(send_video())
                send_text_task = asyncio.create_task(send_text())
                receive_task = asyncio.create_task(receive_loop())

                try:
                    while True:
                        event = await event_queue.get()
                        if event is None:
                            break
                        if isinstance(event, dict) and event.get("type") == "error":
                            yield event
                            break
                        yield event
                finally:
                    logger.info("Dọn dẹp Gemini Live session tasks")
                    send_audio_task.cancel()
                    send_video_task.cancel()
                    send_text_task.cancel()
                    receive_task.cancel()

        except Exception as e:
            logger.error(f"Gemini Live session lỗi: {type(e).__name__}: {e}\n{traceback.format_exc()}")
            raise
        finally:
            logger.info("Gemini Live session đã đóng")
