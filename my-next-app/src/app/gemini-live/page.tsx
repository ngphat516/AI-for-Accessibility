"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { useGeminiLive } from "@/hook/useGeminiLive";

export default function GeminiLivePage() {
  const {
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
  } = useGeminiLive();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const [textInput, setTextInput] = useState("");

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const handleToggleSession = () => {
    if (status === "idle" || status === "error") {
      startSession();
    } else {
      stopSession();
    }
  };

  const handleToggleCamera = async () => {
    if (isCameraActive) {
      stopCamera();
    } else if (videoRef.current && canvasRef.current) {
      try {
        await startCamera(videoRef.current, canvasRef.current);
      } catch (e) {
        console.error("Không thể bật camera:", e);
      }
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() && status === "connected") {
      sendText(textInput.trim());
      setTextInput("");
    }
  };

  const isActive = status === "connected" || status === "connecting";

  const statusColors: Record<string, string> = {
    idle: "#6b7280",
    connecting: "#fbbf24",
    connected: "#22c55e",
    error: "#ef4444",
  };

  return (
    <div style={s.page}>
      {/* Ambient background */}
      <div style={s.pageBg} />

      {/* Header */}
      <header style={s.header}>
        <div style={s.logoRow}>
          <span style={s.logoIcon}>✦</span>
          <span style={s.logoText}>Gemini Live</span>
        </div>
        <p style={s.subtitle}>Trợ lý AI thời gian thực – hỗ trợ người khuyết tật</p>
      </header>

      <main style={s.main}>
        {/* ── Left Panel ── */}
        <div style={s.leftPanel}>
          {/* Status card */}
          <div
            style={{
              ...s.statusCard,
              borderColor: statusColors[status] + "55",
              background: statusColors[status] + "12",
            }}
          >
            <div style={{ ...s.statusDot, background: statusColors[status] }} />
            <span style={s.statusText}>
              {status === "idle" && "Chưa kết nối"}
              {status === "connecting" && "Đang kết nối..."}
              {status === "connected" && "Đang hoạt động"}
              {status === "error" && "Lỗi kết nối"}
            </span>
            <div style={s.indicators}>
              {isMicActive && (
                <div style={{ ...s.indicator, background: "rgba(139,92,246,0.25)", color: "#c4b5fd" }}>
                  🎙️
                </div>
              )}
              {isCameraActive && (
                <div style={{ ...s.indicator, background: "rgba(6,182,212,0.2)", color: "#67e8f9" }}>
                  📷
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={s.errorBox}>
              <span style={{ marginRight: 8 }}>⚠️</span>
              {error}
            </div>
          )}

          {/* Start/Stop button */}
          <button
            onClick={handleToggleSession}
            style={{
              ...s.btnMain,
              background: isActive
                ? "linear-gradient(135deg,#be123c,#9f1239)"
                : "linear-gradient(135deg,#7c3aed,#4f46e5)",
              boxShadow: isActive
                ? "0 4px 20px rgba(190,18,60,0.45)"
                : "0 4px 20px rgba(124,58,237,0.45)",
            }}
          >
            {status === "connecting" ? (
              <>
                <div style={s.spinner} />
                Đang kết nối...
              </>
            ) : isActive ? (
              <>⏹&nbsp;&nbsp;Dừng phiên</>
            ) : (
              <>▶&nbsp;&nbsp;Bắt đầu trò chuyện</>
            )}
          </button>

          {/* Camera button */}
          <button
            onClick={handleToggleCamera}
            disabled={!isActive || status === "connecting"}
            style={{
              ...s.btnSecondary,
              ...(isCameraActive
                ? { background: "rgba(6,182,212,0.18)", borderColor: "rgba(6,182,212,0.6)" }
                : {}),
              ...((!isActive || status === "connecting") ? { opacity: 0.35, cursor: "not-allowed" } : {}),
            }}
          >
            📷&nbsp;&nbsp;{isCameraActive ? "Tắt camera" : "Bật camera"}
          </button>

          {/* Camera preview – always rendered so refs work, visibility toggled */}
          <div style={{ ...s.cameraBox, display: isCameraActive ? "block" : "none" }}>
            <video ref={videoRef} autoPlay muted playsInline style={s.cameraVideo} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div style={s.cameraLabel}>
              <span style={s.cameraDot} />
              Camera đang phát
            </div>
          </div>

          {/* Tips */}
          <div style={s.tips}>
            {[
              ["🎙️", "Microphone tự động bật khi kết nối"],
              ["📷", "Bật camera để AI nhìn thấy bạn"],
              ["✍️", "Gõ văn bản để gửi tin nhắn"],
            ].map(([icon, tip]) => (
              <div key={tip} style={s.tipRow}>
                <span style={{ fontSize: 15 }}>{icon}</span>
                <span style={s.tipText}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel (Transcript) ── */}
        <div style={s.rightPanel}>
          <div style={s.transcriptHeader}>
            <h2 style={s.transcriptTitle}>Hội thoại</h2>
            {transcript.length > 0 && (
              <span style={s.transcriptCount}>{transcript.length} lượt</span>
            )}
          </div>

          <div style={s.transcriptArea}>
            {transcript.length === 0 ? (
              <div style={s.emptyState}>
                <div style={{ fontSize: 40 }}>💬</div>
                <p style={s.emptyTitle}>Chưa có hội thoại</p>
                <p style={s.emptySub}>
                  Nhấn <strong>Bắt đầu trò chuyện</strong> và nói chuyện với AI
                </p>
              </div>
            ) : (
              transcript.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    ...s.bubble,
                    flexDirection: entry.role === "user" ? "row-reverse" : "row",
                  }}
                >
                  <div
                    style={{
                      ...s.bubbleAvatar,
                      background:
                        entry.role === "user"
                          ? "rgba(139,92,246,0.2)"
                          : "linear-gradient(135deg,rgba(88,28,253,0.3),rgba(6,182,212,0.2))",
                      border:
                        entry.role === "gemini"
                          ? "1px solid rgba(139,92,246,0.3)"
                          : "none",
                      fontSize: entry.role === "gemini" ? 13 : 16,
                      color: entry.role === "gemini" ? "#c4b5fd" : "inherit",
                    }}
                  >
                    {entry.role === "user" ? "👤" : "✦"}
                  </div>

                  <div
                    style={{
                      ...s.bubbleContent,
                      alignItems: entry.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        ...s.bubbleRole,
                        textAlign: entry.role === "user" ? "right" : "left",
                      }}
                    >
                      {entry.role === "user" ? "BẠN" : "GEMINI AI"}
                    </div>
                    <div
                      style={{
                        ...s.bubbleText,
                        background:
                          entry.role === "user"
                            ? "linear-gradient(135deg,rgba(124,58,237,0.35),rgba(79,70,229,0.3))"
                            : "rgba(255,255,255,0.05)",
                        border:
                          entry.role === "user"
                            ? "1px solid rgba(139,92,246,0.25)"
                            : "1px solid rgba(255,255,255,0.09)",
                        color: entry.role === "user" ? "#ddd6fe" : "#e8e8f0",
                        borderRadius:
                          entry.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                      }}
                    >
                      {entry.text}
                    </div>
                    <div
                      style={{
                        ...s.bubbleTime,
                        textAlign: entry.role === "user" ? "right" : "left",
                      }}
                    >
                      {entry.timestamp.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Text input */}
          <form onSubmit={handleSendText} style={s.inputForm}>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={
                status === "connected"
                  ? "Nhập tin nhắn văn bản..."
                  : "Kết nối để gửi tin nhắn..."
              }
              disabled={status !== "connected"}
              style={{
                ...s.textInput,
                opacity: status !== "connected" ? 0.45 : 1,
                cursor: status !== "connected" ? "not-allowed" : "text",
              }}
            />
            <button
              type="submit"
              disabled={status !== "connected" || !textInput.trim()}
              style={{
                ...s.sendBtn,
                opacity: status !== "connected" || !textInput.trim() ? 0.35 : 1,
                cursor:
                  status !== "connected" || !textInput.trim() ? "not-allowed" : "pointer",
              }}
            >
              Gửi ↑
            </button>
          </form>
        </div>
      </main>

      {/* Keyframe styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body { font-family: 'Inter', -apple-system, sans-serif; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes bubble-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Styles object ────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#e8e8f0",
    fontFamily: "'Inter', -apple-system, sans-serif",
    position: "relative",
    overflow: "auto",
  },
  pageBg: {
    position: "fixed",
    inset: 0,
    background: `
      radial-gradient(ellipse 80% 60% at 20% 10%, rgba(88,28,253,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 80%, rgba(6,182,212,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)
    `,
    pointerEvents: "none",
    zIndex: 0,
  },
  header: {
    position: "relative",
    zIndex: 1,
    padding: "28px 40px 20px",
    borderBottom: "1px solid rgba(139,92,246,0.15)",
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(12px)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  logoIcon: {
    fontSize: 24,
    background: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  logoText: {
    fontSize: 22,
    fontWeight: 700,
    background: "linear-gradient(135deg,#c4b5fd,#67e8f9)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    margin: 0,
  },
  main: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "340px 1fr",
    gap: 24,
    padding: "28px 40px",
    maxWidth: 1200,
    margin: "0 auto",
  },
  leftPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  statusCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid rgba(139,92,246,0.2)",
    backdropFilter: "blur(8px)",
    transition: "all 0.3s ease",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },
  statusText: {
    fontSize: 13,
    fontWeight: 500,
    flex: 1,
  },
  indicators: {
    display: "flex",
    gap: 6,
  },
  indicator: {
    width: 28,
    height: 28,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
  },
  errorBox: {
    display: "flex",
    alignItems: "flex-start",
    padding: "12px 16px",
    borderRadius: 12,
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.25)",
    fontSize: 13,
    color: "#fca5a5",
    lineHeight: 1.5,
  },
  btnMain: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    padding: "16px 24px",
    borderRadius: 16,
    border: "none",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    color: "#fff",
    letterSpacing: "0.2px",
    transition: "all 0.25s ease",
  },
  btnSecondary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "12px 20px",
    borderRadius: 12,
    border: "1px solid rgba(6,182,212,0.3)",
    background: "rgba(6,182,212,0.07)",
    color: "#67e8f9",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  cameraBox: {
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(6,182,212,0.2)",
    background: "rgba(0,0,0,0.3)",
    position: "relative",
    aspectRatio: "4/3",
  },
  cameraVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  cameraLabel: {
    position: "absolute",
    bottom: 10,
    left: 10,
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 20,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(8px)",
    fontSize: 11,
    color: "#67e8f9",
  },
  cameraDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
    animation: "blink 1.5s ease-in-out infinite",
  },
  tips: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: "14px 16px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  tipRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  tipText: {
    fontSize: 12.5,
    color: "#9ca3af",
  },
  rightPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    minHeight: 0,
  },
  transcriptHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  transcriptTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: "#e8e8f0",
    margin: 0,
  },
  transcriptCount: {
    fontSize: 12,
    color: "#6b7280",
    background: "rgba(255,255,255,0.06)",
    padding: "3px 10px",
    borderRadius: 20,
  },
  transcriptArea: {
    flex: 1,
    overflowY: "auto",
    padding: 20,
    borderRadius: 16,
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
    minHeight: 400,
    maxHeight: 520,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(139,92,246,0.3) transparent",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    opacity: 0.5,
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#9ca3af",
    margin: 0,
  },
  emptySub: {
    fontSize: 13,
    color: "#6b7280",
    margin: 0,
  },
  bubble: {
    display: "flex",
    gap: 12,
    animation: "bubble-in 0.3s ease",
  },
  bubbleAvatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  bubbleContent: {
    maxWidth: "75%",
    display: "flex",
    flexDirection: "column",
  },
  bubbleRole: {
    fontSize: 10,
    fontWeight: 700,
    color: "#6b7280",
    marginBottom: 5,
    letterSpacing: "0.5px",
  },
  bubbleText: {
    padding: "12px 16px",
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.6,
  },
  bubbleTime: {
    fontSize: 10.5,
    color: "#4b5563",
    marginTop: 4,
  },
  inputForm: {
    display: "flex",
    gap: 10,
  },
  textInput: {
    flex: 1,
    padding: "13px 18px",
    borderRadius: 12,
    border: "1px solid rgba(139,92,246,0.25)",
    background: "rgba(255,255,255,0.04)",
    color: "#e8e8f0",
    fontSize: 14,
    outline: "none",
  },
  sendBtn: {
    padding: "13px 22px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
};
