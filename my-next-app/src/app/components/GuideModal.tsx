
import React, { useState, useMemo } from 'react';
import { useGuideModalHotkeys } from './useGuideModalHotkeys';

interface GuideModalProps {
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  const sections = [
    {
      title: 'Global',
      items: [
        { desc: 'Điều hướng tuần tự (Khu vực)', keys: ['H', 'J', 'K', 'L'] },
        { desc: 'Mở/Đóng hướng dẫn', keys: ['F1'] },
        { desc: 'Thoát chế độ nhập liệu', keys: ['Alt', 'Q'] },
      ]
    },
    {
      title: 'Chat & Văn bản',
      items: [
        { desc: 'Chuyển tin nhắn / Focus text', keys: ['↑', '↓'] },
        { desc: 'Duyệt từng từ', keys: ['←', '→'] },
        { desc: 'Nhảy nhanh tới ô Chat', keys: ['F'] },
        { desc: 'Thực thi / Chọn', keys: ['Enter'] },
      ]
    },
    {
      title: 'Ghi chú',
      items: [
        { desc: 'Tạo ghi chú mới', keys: ['Alt', 'N'] },
        { desc: 'Tìm kiếm', keys: ['/'] },
        { desc: 'Đóng/Mở Sidebar ghi chú', keys: ['D'] },
      ]
    }
  ];

  const totalItems = useMemo(() => {
    let count = 2;
    sections.forEach(s => count += s.items.length);
    return count;
  }, [sections]);

  const [internalFocusIdx, setInternalFocusIdx] = useState(totalItems - 1);

  useGuideModalHotkeys({
    totalItems,
    setInternalFocusIdx,
    onClose
  });

  let currentShortcutIdx = 1;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div 
        className="bg-[#1a1a1a] w-full max-w-[420px] rounded-lg shadow-2xl border border-white/10 overflow-hidden text-white animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Phím tắt hệ thống</h2>
            <button 
              onClick={onClose} 
              className={`p-1 rounded transition-all outline-none ${internalFocusIdx === 0 ? 'bg-white text-black ring-4 ring-white/20 scale-110' : 'text-gray-500 hover:text-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {sections.map((section, sIdx) => (
              <div key={sIdx}>
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">{section.title}</h3>
                <div className="space-y-1">
                  {section.items.map((item, iIdx) => {
                    const isFocused = internalFocusIdx === currentShortcutIdx;
                    currentShortcutIdx++;
                    return (
                      <div 
                        key={iIdx} 
                        className={`flex justify-between items-center p-2 rounded-md transition-all duration-150
                          ${isFocused ? 'bg-white/10 ring-1 ring-white/20' : 'opacity-60'}`}
                      >
                        <span className={`text-[13px] transition-colors ${isFocused ? 'text-white font-bold' : 'text-gray-300'}`}>
                          {item.desc}
                        </span>
                        <div className="flex gap-1.5">
                          {item.keys.map((key, kIdx) => (
                            <kbd 
                              key={kIdx} 
                              className={`min-w-[24px] h-6 px-1.5 flex items-center justify-center border rounded text-[10px] font-mono shadow-sm transition-colors
                                ${isFocused ? 'bg-white text-black border-white' : 'bg-[#2d2d2d] border-white/10 text-gray-300'}`}
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#222] p-4 flex justify-between items-center border-t border-white/5">
          <span className="text-[10px] text-gray-500 italic">H-J-K-L để duyệt dòng</span>
          <button 
            onClick={onClose}
            className={`text-[11px] font-bold px-6 py-2 rounded uppercase transition-all outline-none
              ${internalFocusIdx === totalItems - 1 ? 'bg-white text-black shadow-lg scale-105 ring-4 ring-white/10' : 'text-gray-400 hover:text-white'}`}
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
