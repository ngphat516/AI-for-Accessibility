"use client";

import './note-page.css'
import { useEffect, useState } from 'react';

type Note = {
    id : number;
    text: string;
}


export default function NotePage(){

    const [notes, setNotes] = useState<Note[]>([]);

    const handleAddNote = () => {
        const newNote = {
            id: Date.now(),
            text: "TIÊU ĐỀ",    
        }
        setNotes((prev) => [...prev, newNote]);
    }

    const handleDeleteNote = (id: number) =>{
        setNotes(prev => prev.filter(note => note.id !== id));  
    }

    const[openHelp, setOpenHelp] = useState(false);
    
      useEffect( () => {
          const handler = () => setOpenHelp(prev => !prev);
          window.addEventListener("toggle-help-modal", handler);
          return () => window.removeEventListener("toggle-help-modal", handler);
      },[]);
    

    return(
    <div className="note-wrapper">
        
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

        <div className="note-navbar">
            <h2>TÊN GHI CHÚ CỦA NGƯỜI TA</h2>
        </div>

        <div className="note-main-content">
            
        
            <div className="search-section">

                <input className="note-search" placeholder="TÌM KIẾM"/>            

                <div className="add-note" >
                    <button className="add-btn" onClick={handleAddNote} >
                        <h2 className="add-btn-main"> + THÊM GHI CHÚ  </h2>
                    </button>
                </div>


            </div>
            

            <div className="note-list">
            
                {
                    notes.map((item) => (
                        <div key={item.id} className="note-item">
                            
                            <p className="font-semibold">{item.text}</p>
                        
                            <button className="delete-btn" onClick={() => handleDeleteNote(item.id)}>
                              <p className="absolute text-[12px] top-4 right-4">XÓA</p>
                            </button>
                        `     <p className="absolute text-[12px] top-4 right-12">CHỈNH SỬA</p>
                              <p className="absolute text-[12px] top-10 left-4">THUỘC VỀ ĐOẠN CHAT NÀO</p>
                              <p className="absolute text-[12px] top-15">NGÀY TẠO</p>
                              <p className="absolute text-[16px] top-22 font-semibold">TÓM TẮT</p>

                        </div>
                    ))
                }

            </div>

        </div>

    </div>
    )
}