"use client";

import './history.css'
import { useEffect, useState } from 'react'

type Note = {
    id : number;
    text: string;
}

export default function HistoryPage(){
    
    const [openRightPanel, setOpenRightPanel] = useState(false);

    useEffect(() => {

        function attach(){  
            const btn = document.getElementById("open-note-btn");
            if(!btn) return;

            const handler = () =>  setOpenRightPanel(prev => !prev);
            btn.addEventListener("click", handler);

            return () => btn.removeEventListener("click", handler);
        }

        const timer = setInterval(() => {
            const cleanup = attach();
            if(cleanup){
                clearInterval(timer);
            }
        }, 50);

        return () => clearInterval(timer);

    }, []);

    const [notes, setNotes] = useState<Note[]>([]);

    const handleDeleteNote = (id: number) =>{
        setNotes(prev => prev.filter(note => note.id !== id));  
    }

    return(
        <div className="history-wrapper">

            <div className="history-navbar">
                TÊN GHI CHÚ CỦA NGƯỜI TA
            </div>

            <div className="history-main-content">

                <div className="left-panel">
                    <input type="text" className="history-search" placeholder="TÌM KIẾM"/>
                </div>

                <div className={`right-panel bg-gray-200 rounded-xl overflow-y-auto transition-all duration-300
                    ${openRightPanel ? "w-[350px]" : "w-0"} h-full`
                }>
                    <div className='right-panel-wrapper'>
                        <h3 className="text-[14px] px-8 py-2 w-full"> GHI CHÚ </h3>    
                        <input type="text" placeholder="TÌM KIẾM" className="bg-gray-400 h-7 rounded-full w-[80%] mt-4 border border-gray-400 pl-4 justify-center" />
                        <button className='mt-3 bg-gray-400 px-4 py-1 rounded-xl text-sm'>
                            LOC
                        </button>
                    </div>
                </div>

            </div>

        </div>
    )
}
