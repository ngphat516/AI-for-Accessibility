"use client";

import './note-page.css'
import { useState } from 'react';

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


    return(
    <div className="note-wrapper">
        
        
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