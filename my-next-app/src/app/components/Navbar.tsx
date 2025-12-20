
import React from 'react';
import { AppTab } from '../../types';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isFocused?: boolean;
  focusedIndex?: number;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, isFocused, focusedIndex }) => {
  const tabs = Object.values(AppTab);

  return (
    <header className="bg-gray-200 border-b border-gray-300 flex justify-between items-center px-4 shrink-0 h-14">
      <nav className="flex h-full">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 h-full text-xs font-bold uppercase tracking-tight transition-all relative
              ${activeTab === tab 
                ? 'bg-gray-400 text-white shadow-inner' 
                : 'hover:bg-gray-300'
              }
              ${isFocused && focusedIndex === idx ? 'bg-gray-800 text-white block-focused z-10' : ''}
            `}
          >
            {tab}
            {isFocused && focusedIndex === idx && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white animate-pulse"></div>
            )}
          </button>
        ))}
      </nav>
      <div className="hidden md:block">
        <button 
           onClick={() => setActiveTab(AppTab.ACCOUNT)}
           className={`px-6 h-14 text-xs font-bold uppercase transition-all 
            ${activeTab === AppTab.ACCOUNT ? 'bg-gray-400 text-white' : 'hover:bg-gray-300'}
            ${isFocused && focusedIndex === tabs.length ? 'bg-gray-800 text-white block-focused' : ''}
           `}
        >
          TÀI KHOẢN
        </button>
      </div>
    </header>
  );
};

export default Header;
