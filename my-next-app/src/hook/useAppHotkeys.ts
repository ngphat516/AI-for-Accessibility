
import { useHotkeys } from 'react-hotkeys-hook';
import { AppTab, FocusSection } from '../types';

interface UseAppHotkeysProps {
  isAnyModalOpen: boolean;
  moveNext: () => void;
  movePrev: () => void;
  toggleSidebar: () => void;
  toggleMic: () => void;
  setIsGuideOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setActiveTab: (tab: AppTab) => void;
  focus: { section: FocusSection; index: number };
}

export const useAppHotkeys = ({
  isAnyModalOpen,
  moveNext,
  movePrev,
  toggleSidebar,
  toggleMic,
  setIsGuideOpen,
  setActiveTab,
  focus,
}: UseAppHotkeysProps) => {
  useHotkeys('j, l', (e) => { 
    if (isAnyModalOpen) return;
    e.preventDefault(); 
    moveNext(); 
  }, { enableOnFormTags: false });

  useHotkeys('k, h', (e) => { 
    if (isAnyModalOpen) return;
    e.preventDefault(); 
    movePrev(); 
  }, { enableOnFormTags: false });

  useHotkeys('d', (e) => { 
    if (isAnyModalOpen) return;
    e.preventDefault(); 
    toggleSidebar(); 
  }, { enableOnFormTags: false });

  useHotkeys('f1', (e) => {
    e.preventDefault();
    setIsGuideOpen(prev => !prev);
  }, { enableOnFormTags: true });

  useHotkeys('space', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      e.preventDefault(); 
      toggleMic();
    }
  }, { enabled: !isAnyModalOpen });

  useHotkeys('enter', (e) => {
    if (isAnyModalOpen) return;
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
    
    e.preventDefault();
    if (focus.section === 'header') {
      const tabs = Object.values(AppTab);
      if (focus.index < tabs.length) setActiveTab(tabs[focus.index]);
    } else if (focus.section === 'footer') {
      if (focus.index === 0) setIsGuideOpen(true);
      if (focus.index === 1) toggleMic();
      if (focus.index === 2) toggleSidebar();
    }
  }, { enabled: !isAnyModalOpen });
};
