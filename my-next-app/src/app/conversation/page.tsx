"use client";
import "./conversation.css";
import { useEffect, useState } from "react";
export default function ConversationPage() {
  const [openRightPanel, setOpenRightPanel] = useState(false);

  useEffect(() => {
    function attach() {
      const btn = document.getElementById("open-note-btn");
      if (!btn) return;

      const handler = () => setOpenRightPanel((prev) => !prev);
      btn.addEventListener("click", handler);

      return () => btn.removeEventListener("click", handler);
    }

    const timer = setInterval(() => {
      const cleanup = attach();
      if (cleanup) {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  });

  return (
    <div className="conversation-wrapper">
      <div className="conversation-bar">
        <h2>TIÊU ĐỀ CHAT</h2>
      </div>

      <div className="conversation-body">
        <div className="left-panel">
          <div className="conversation-main">
            <div className="title"></div>
            <div className="content"></div>
          </div>

          <div className="conversation-input-row">
            <div className="input-wrapper">
              <input
                type="text"
                className="conversation-text"
                placeholder="NHẬP"
              />
              <button className="conversation-btn">TỔ HỢP PHÍM RUN</button>
            </div>
          </div>
        </div>

        <div
          className={`right-panel bg-gray-200 rounded-xl overflow-y-auto transition-all duration-300 flex 
                            ${openRightPanel ? "w-[350px]" : "w-0"} 
                    `}
        >
          <div className="right-panel-wrapper">
            <h3 className="text-[14px] px-8 py-2 w-full"> GHI CHÚ </h3>
            <input
              type="text"
              placeholder="TÌM KIẾM"
              className="bg-gray-400 h-7 rounded-full w-[80%] mt-4 border border-gray-400 pl-4 justify-center"
            />
            <button className="mt-3 bg-gray-400 px-4 py-1 rounded-xl text-sm">
              LOC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
