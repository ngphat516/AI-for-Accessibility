"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const BACKEND_WS_URL =
  process.env.NEXT_PUBLIC_BACKEND_WS_URL ||
  "ws://localhost:8000/ws/gemini-live";

const INPUT_SAMPLE_RATE = 16000;  // Hz – Gemini Live yêu cầu
const OUTPUT_SAMPLE_RATE = 24000; // Hz – Gemini Live output

export type TranscriptEntry = {
  role: "user" | "gemini";
  text: string;
  timestamp: Date;
};

export type SessionStatus = "idle" | "connecting" | "connected" | "error";

export function useGeminiLive() {
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const micProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const cameraIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const addTranscript = useCallback((role: "user" | "gemini", text: string) => {
    setTranscript((prev) => {
      // Ghép vào entry cuối nếu cùng role (streaming text)
      if (prev.length > 0 && prev[prev.length - 1].role === role) {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: updated[updated.length - 1].text + text,
        };
        return updated;
      }
      return [...prev, { role, text, timestamp: new Date() }];
    });
  }, []);

  // ── Audio output (nhận PCM bytes từ Gemini, phát ra loa) ─────────────────

  const initAudioOutput = useCallback(async () => {
    if (audioCtxRef.current) return;

    const ctx = new AudioContext({ sampleRate: OUTPUT_SAMPLE_RATE });
    audioCtxRef.current = ctx;

    await ctx.audioWorklet.addModule("/pcm-processor.js");
    const workletNode = new AudioWorkletNode(ctx, "pcm-processor");
    workletNode.connect(ctx.destination);
    workletNodeRef.current = workletNode;
  }, []);

  const playAudioChunk = useCallback((data: ArrayBuffer) => {
    if (!workletNodeRef.current) return;
    workletNodeRef.current.port.postMessage({ type: "audio", data });
  }, []);

  const clearAudioBuffer = useCallback(() => {
    workletNodeRef.current?.port.postMessage({ type: "clear" });
  }, []);

  // ── Microphone input (capture → PCM Int16 → WebSocket binary) ────────────

  const startMic = useCallback(async () => {
    if (micStreamRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: INPUT_SAMPLE_RATE,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
    micStreamRef.current = stream;

    const ctx = new AudioContext({ sampleRate: INPUT_SAMPLE_RATE });
    const source = ctx.createMediaStreamSource(stream);
    micSourceRef.current = source;

    // ScriptProcessor để convert Float32 → Int16 PCM
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    micProcessorRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      const float32 = e.inputBuffer.getChannelData(0);
      const int16 = new Int16Array(float32.length);
      for (let i = 0; i < float32.length; i++) {
        int16[i] = Math.max(-32768, Math.min(32767, float32[i] * 32768));
      }
      wsRef.current.send(int16.buffer);
    };

    source.connect(processor);
    processor.connect(ctx.destination);
    setIsMicActive(true);
  }, []);

  const stopMic = useCallback(() => {
    micProcessorRef.current?.disconnect();
    micSourceRef.current?.disconnect();
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micProcessorRef.current = null;
    micSourceRef.current = null;
    micStreamRef.current = null;
    setIsMicActive(false);
  }, []);

  // ── Camera input (capture JPEG frame → base64 → WebSocket JSON) ──────────

  const startCamera = useCallback(
    async (videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) => {
      if (cameraStreamRef.current) return;

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStreamRef.current = stream;
      videoRef.current = videoElement;
      canvasRef.current = canvasElement;
      videoElement.srcObject = stream;
      await videoElement.play();

      // Gửi frame mỗi 800ms
      cameraIntervalRef.current = setInterval(() => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        const ctx2d = canvasElement.getContext("2d");
        if (!ctx2d) return;
        canvasElement.width = 640;
        canvasElement.height = 480;
        ctx2d.drawImage(videoElement, 0, 0, 640, 480);
        const base64 = canvasElement.toDataURL("image/jpeg", 0.7).split(",")[1];
        wsRef.current.send(JSON.stringify({ type: "image", data: base64 }));
      }, 800);

      setIsCameraActive(true);
    },
    []
  );

  const stopCamera = useCallback(() => {
    if (cameraIntervalRef.current) clearInterval(cameraIntervalRef.current);
    cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    cameraStreamRef.current = null;
    cameraIntervalRef.current = null;
    setIsCameraActive(false);
  }, []);

  // ── WebSocket session ─────────────────────────────────────────────────────

  const sendText = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "text", data: text }));
  }, []);

  const startSession = useCallback(async () => {
    if (wsRef.current) return;
    setStatus("connecting");
    setError(null);

    try {
      await initAudioOutput();
    } catch (e) {
      console.error("Không khởi tạo được audio output:", e);
    }

    const ws = new WebSocket(BACKEND_WS_URL);
    wsRef.current = ws;
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      setStatus("connected");
      startMic();
    };

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        // Binary → PCM audio từ Gemini
        playAudioChunk(event.data);
      } else if (typeof event.data === "string") {
        try {
          const msg = JSON.parse(event.data);
          switch (msg.type) {
            case "user":
              if (msg.text) addTranscript("user", msg.text);
              break;
            case "gemini":
              if (msg.text) addTranscript("gemini", msg.text);
              break;
            case "interrupted":
              clearAudioBuffer();
              break;
            case "error":
              setError(msg.error || "Lỗi không xác định");
              break;
            default:
              break;
          }
        } catch (_) {
          /* ignore */
        }
      }
    };

    ws.onerror = () => {
      setStatus("error");
      setError("Không thể kết nối đến máy chủ. Hãy kiểm tra backend đang chạy.");
    };

    ws.onclose = () => {
      setStatus("idle");
      wsRef.current = null;
      stopMic();
      stopCamera();
    };
  }, [
    initAudioOutput,
    startMic,
    stopMic,
    stopCamera,
    playAudioChunk,
    clearAudioBuffer,
    addTranscript,
  ]);

  const stopSession = useCallback(() => {
    stopMic();
    stopCamera();
    wsRef.current?.close();
    wsRef.current = null;
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    workletNodeRef.current = null;
    setStatus("idle");
  }, [stopMic, stopCamera]);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    status,
    transcript,
    error,
    isMicActive,
    isCameraActive,
    startSession,
    stopSession,
    startCamera,
    stopCamera,
    sendText,
  };
}
