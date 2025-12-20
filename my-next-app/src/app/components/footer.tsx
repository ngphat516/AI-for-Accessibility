
import React from 'react';

interface FooterProps {
  isMicActive: boolean;
  onToggleMic: () => void;
  onToggleNotes: () => void;
  onShowGuide: () => void;
  isFocused?: boolean;
  focusedIndex?: number;
}

const Footer: React.FC<FooterProps> = ({ 
  isMicActive, 
  onToggleMic, 
  onToggleNotes, 
  onShowGuide,
  isFocused,
  focusedIndex 
}) => {
  const buttons = [
    { label: 'HƯỚNG DẪN (F1)', action: onShowGuide, id: 0 },
    { label: isMicActive ? 'MIC ON' : 'MIC (SPACE)', action: onToggleMic, id: 1, special: isMicActive },
    { label: 'GHI CHÚ (D)', action: onToggleNotes, id: 2 },
    { label: 'BÁO CÁO TẠI ĐÂY', action: () => {}, id: 3, side: 'right' }
  ];

  return (
    <footer className={`h-16 flex items-center justify-center px-6 gap-4 shrink-0 transition-colors ${isFocused ? 'bg-gray-400' : 'bg-gray-300'}`}>
      <div className="flex-1"></div>
      
      <div className="flex gap-4">
        {buttons.filter(b => !b.side).map((btn) => (
          <button 
            key={btn.id}
            onClick={btn.action}
            className={`px-6 py-1.5 rounded-full text-xs font-bold uppercase transition-all shadow-md
              ${btn.special ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-400 text-black'}
              ${isFocused && focusedIndex === btn.id ? 'bg-gray-800 text-white block-focused' : 'hover:bg-gray-500'}
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex justify-end">
        {buttons.filter(b => b.side === 'right').map((btn) => (
          <button 
            key={btn.id}
            onClick={btn.action}
            className={`px-6 py-1.5 rounded-full text-xs font-bold uppercase transition-all
              ${isFocused && focusedIndex === btn.id ? 'bg-gray-800 text-white block-focused' : 'bg-gray-400 text-black hover:bg-gray-500'}
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
