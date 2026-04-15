"use client";

import React, { useRef, useEffect } from 'react';
import SidebarNotes from '../components/SideBarNotes';
import { Note } from '../../types';
import { FocusSection } from '../../types';
import { useHistoryHotkeys } from './useHistoryHotkeys';

interface HistoryViewProps {
  isSidebarOpen: boolean;
  notes: Note[];
  onSaveNote: (noteData: Partial<Note>, editingId?: string) => void;
  onDeleteNote: (id: string) => void;
  focus: { section: FocusSection, index: number };
}

const DEFAULT_FOCUS = { section: 'center' as FocusSection, index: 0 };
const HistoryView: React.FC<HistoryViewProps> = ({ isSidebarOpen = false, notes = [], onSaveNote = () => {}, onDeleteNote = () => {}, focus = DEFAULT_FOCUS }) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const historyRefs = useRef<(HTMLDivElement | null)[]>([]);

  const historyItems = Array.from({ length: 6 }).map((_, i) => ({
    id: `${i}`,
    index: i + 1,
    title: `TIÊU ĐỀ CHAT ${i + 1}`,
    date: 'NGÀY TẠO',
    summary: 'TÓM TẮT NỘI DUNG CUỘC TRÒ CHUYỆN'
  }));

  const activeIdx = focus.section === 'center' ? focus.index % historyItems.length : -1;

  useEffect(() => {
    if (activeIdx !== -1) {
      historyRefs.current[activeIdx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeIdx]);

  useHistoryHotkeys(searchRef);

  return (
    <div className="flex-1 flex overflow-hidden w-full">
      <div className="flex-1 flex flex-col p-10 bg-white overflow-y-auto items-center custom-scrollbar">
        <div className="w-full max-w-3xl flex flex-col gap-4">
           <div className="bg-gray-100 rounded-full py-3 px-8 mb-4 border-2 border-gray-200 focus-within:border-gray-800 transition-all">
             <input ref={searchRef} type="text" placeholder="TÌM KIẾM LỊCH SỬ (/)" className="bg-transparent w-full text-xs font-bold uppercase outline-none" />
           </div>
           <div className="border border-gray-300 rounded-3xl overflow-hidden shadow-sm">
             {historyItems.map((item, idx) => (
               <div key={item.id} ref={el => { historyRefs.current[idx] = el; }}
                 className={`p-6 flex flex-col gap-1 transition-all border-gray-200
                   ${idx !== historyItems.length - 1 ? 'border-b' : ''} 
                   ${idx === activeIdx ? 'bg-gray-200 shadow-inner ring-2 ring-gray-400' : 'bg-white opacity-100'}`}>
                 <div className="flex items-center gap-2">
                   <span className="text-xs font-bold">{item.index}.</span>
                   <h3 className="text-xs font-bold uppercase">{item.title}</h3>
                 </div>
                 <p className="text-[10px] font-bold uppercase ml-5 mt-1">{item.summary}</p>
               </div>
             ))}
           </div>
        </div>
      </div>
      <div className={`transition-all duration-300 border-l border-gray-200 overflow-hidden shrink-0 ${isSidebarOpen ? 'w-80' : 'w-0'}`}>
        <div className="w-80 h-full">
           <SidebarNotes notes={notes} onSaveNote={onSaveNote} onDeleteNote={onDeleteNote} isFocused={focus.section === 'right'} focusedIndex={focus.index} />
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
