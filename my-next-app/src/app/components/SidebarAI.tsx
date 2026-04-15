"use client";

import React, { useEffect, useRef } from 'react';

interface SidebarAIProps {
  isFocused?: boolean;
  focusedIndex?: number;
}

const SidebarAI: React.FC<SidebarAIProps> = ({ isFocused, focusedIndex }) => {
  const items = [
    { title: 'TÀI LIỆU', desc: '.' },
    { title: 'TÀI LIỆU', desc: '.' },
    { title: 'TÀI LIỆU', desc: '.' }
  ];

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isFocused && focusedIndex !== undefined) {
      const idx = focusedIndex % items.length;
      itemRefs.current[idx]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isFocused, focusedIndex, items.length]);

  return (
    <div className={`h-full border-r border-gray-300 flex flex-col w-80 shrink-0 transition-colors ${isFocused ? 'bg-gray-200' : 'bg-gray-100'}`}>
      <div className="p-5 border-b border-gray-300 flex justify-between items-center bg-gray-200/50">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Nơi AI render docs</h2>
        {isFocused && <span className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></span>}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
        {items.map((item, idx) => (
          <div 
            key={idx}
            ref={el => { itemRefs.current[idx] = el; }}
            className={`p-5 rounded-[24px] border-2 transition-all duration-300 cursor-pointer
              ${isFocused && (focusedIndex ?? 0) % items.length === idx 
                ? 'border-gray-800 bg-white block-focused shadow-xl z-10' 
                : 'border-transparent bg-gray-300/30 opacity-100'}`}
          >
            <div className="text-[10px] font-bold uppercase mb-2 text-gray-800">{item.title}</div>
            <div className="text-[8px] font-bold uppercase text-gray-400 leading-tight">{item.desc}</div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-200/50 border-t border-gray-300 text-center">
        <span className="text-[9px] font-bold uppercase text-gray-400">NHẤN L/J ĐỂ DUYỆT TIẾP</span>
      </div>
    </div>
  );
};

export default SidebarAI;
