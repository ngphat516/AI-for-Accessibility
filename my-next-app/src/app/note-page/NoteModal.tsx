
import React, { useState, useEffect, useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Note } from '../../types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
  initialData?: Note | null;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Note>>({
    title: '',
    chatContext: '',
    summary: ''
  });

  // 0: Nút X, 1: Title, 2: Context, 3: Summary, 4: Hủy, 5: Lưu
  const [internalFocusIdx, setInternalFocusIdx] = useState(1);
  const totalItems = 6;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ title: '', chatContext: '', summary: '' });
    }
    if (isOpen) setInternalFocusIdx(1); // Reset focus khi mở
  }, [initialData, isOpen]);

  // Chặn phím mũi tên hoàn toàn khi Modal mở
  useHotkeys('up, down, left, right', (e) => {
    if (isOpen) e.preventDefault();
  }, { enabled: isOpen, enableOnFormTags: true });

  // H-J-K-L điều hướng qua các dòng input/button
  useHotkeys('j, l', (e) => {
    if (!isOpen) return;
    e.preventDefault();
    setInternalFocusIdx(prev => (prev + 1) % totalItems);
  }, { enabled: isOpen, enableOnFormTags: true });

  useHotkeys('k, h', (e) => {
    if (!isOpen) return;
    e.preventDefault();
    setInternalFocusIdx(prev => (prev - 1 + totalItems) % totalItems);
  }, { enabled: isOpen, enableOnFormTags: true });

  useHotkeys('enter', (e) => {
    if (!isOpen) return;
    if (internalFocusIdx === 5) { // Nút Lưu
       onSave(formData);
       onClose();
    } else if (internalFocusIdx === 4 || internalFocusIdx === 0) { // Nút Hủy/X
       onClose();
    }
  }, { enabled: isOpen, enableOnFormTags: true });

  useHotkeys('esc', (e) => {
    if (!isOpen) return;
    e.preventDefault();
    onClose();
  }, { enabled: isOpen, enableOnFormTags: true });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/10 text-white animate-in zoom-in-95 duration-200">
        <div className="bg-[#222] px-8 py-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            {initialData ? 'Chỉnh sửa ghi chú' : 'Tạo ghi chú mới'}
          </h2>
          <button 
            onClick={onClose}
            className={`p-1 rounded transition-all outline-none ${internalFocusIdx === 0 ? 'bg-white text-black ring-4 ring-white/20' : 'text-gray-500 hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className={`space-y-1 transition-all ${internalFocusIdx === 1 ? 'scale-[1.02]' : 'opacity-60'}`}>
            <label className="block text-[9px] font-black uppercase text-gray-500 mb-1 ml-1">Tiêu đề</label>
            <input
              autoFocus
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className={`w-full bg-[#2d2d2d] border-2 rounded-xl px-5 py-3 text-xs font-bold uppercase outline-none transition-all
                ${internalFocusIdx === 1 ? 'border-white ring-4 ring-white/10' : 'border-transparent'}`}
              placeholder="NHẬP TIÊU ĐỀ"
            />
          </div>

          <div className={`space-y-1 transition-all ${internalFocusIdx === 2 ? 'scale-[1.02]' : 'opacity-60'}`}>
            <label className="block text-[9px] font-black uppercase text-gray-500 mb-1 ml-1">Ngữ cảnh</label>
            <input
              value={formData.chatContext}
              onChange={e => setFormData({ ...formData, chatContext: e.target.value })}
              className={`w-full bg-[#2d2d2d] border-2 rounded-xl px-5 py-3 text-xs font-bold uppercase outline-none transition-all
                ${internalFocusIdx === 2 ? 'border-white ring-4 ring-white/10' : 'border-transparent'}`}
              placeholder="VÍ DỤ: CUỘC HỌP SÁNG"
            />
          </div>

          <div className={`space-y-1 transition-all ${internalFocusIdx === 3 ? 'scale-[1.02]' : 'opacity-60'}`}>
            <label className="block text-[9px] font-black uppercase text-gray-500 mb-1 ml-1">Nội dung</label>
            <textarea
              rows={4}
              value={formData.summary}
              onChange={e => setFormData({ ...formData, summary: e.target.value })}
              className={`w-full bg-[#2d2d2d] border-2 rounded-xl px-5 py-4 text-xs font-bold uppercase outline-none transition-all resize-none
                ${internalFocusIdx === 3 ? 'border-white ring-4 ring-white/10' : 'border-transparent'}`}
              placeholder="NHẬP TÓM TẮT GHI CHÚ..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase transition-all outline-none
                ${internalFocusIdx === 4 ? 'bg-white/20 text-white ring-4 ring-white/10 scale-105' : 'bg-transparent text-gray-500'}`}
            >
              Hủy (ESC)
            </button>
            <button
              onClick={() => { onSave(formData); onClose(); }}
              className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase transition-all outline-none
                ${internalFocusIdx === 5 ? 'bg-white text-black shadow-xl scale-105 ring-4 ring-white/10' : 'bg-[#2d2d2d] text-gray-400'}`}
            >
              Lưu ghi chú
            </button>
          </div>
        </div>
        
        <div className="bg-[#111] px-8 py-3 text-[9px] text-center text-gray-600 font-bold uppercase tracking-widest">
           Sử dụng H-J-K-L để điều hướng • ENTER để chọn
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
