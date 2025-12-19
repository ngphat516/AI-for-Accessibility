"use client";
import "./conversation.css";
import { useEffect, useState } from "react";

export default function ConversationPage() {
  const [openRightPanel, setOpenRightPanel] = useState(false);
  

  useEffect(() => {
    const handler = () => setOpenRightPanel(prev => !prev);

    window.addEventListener("toggle-right-panel", handler);

    return () => {
      window.removeEventListener("toggle-right-panel", handler);
    };
  }, []);


  const[openHelp, setOpenHelp] = useState(false);

  useEffect( () => {
      const handler = () => setOpenHelp(prev => !prev);
      window.addEventListener("toggle-help-modal", handler);
      return () => window.removeEventListener("toggle-help-modal", handler);
  },[]);

  return (
    <div className="conversation-wrapper">
      

      {/* Help Modal */}

      {openHelp && (
        <div className="outside-background fixed inset-0 flex bg-black/50 items-center justify-center z-[999]">

        <div className="main-background flex flex-col bg-gray-900 w-[90%] h-[80vh] max-h-[90vh] rounded-xl overflow-auto">
          
          <div className="openHelp-header flex border-b border-gray-500 h-[12%] items-center relative">
            
            <p className=" text-white flex-1 text-2xl font-semibold text-center">Tổ Hợp Phím Tắt</p>

            <button className="top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-black text-lg font-bold bg-gray-300 hover:bg-gray-400 cursor-pointer absolute" onClick={() => setOpenHelp(false)}> X </button>

          </div>


          <div className="openHelp-main-content">


          </div>


        </div>

      </div>
      )}
     
    

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
              <button className="conversation-btn">TỔ HỢP PHÍM RUNa</button>
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
