
import { useHotkeys } from 'react-hotkeys-hook';

interface ChatHotkeysProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  isModalOpen?: boolean;
  isInputFocused: boolean;
  canNav: boolean;
  globalWordIdx: number;
  messageCount: number;
  moveWord: (idx: number) => void;
  flattenedWords: any[];
}

export const useChatHotkeys = ({
  inputRef,
  isModalOpen,
  isInputFocused,
  canNav,
  globalWordIdx,
  messageCount,
  moveWord,
  flattenedWords,
}: ChatHotkeysProps) => {
  useHotkeys('f', (e) => {
    if (isModalOpen) return;
    e.preventDefault();
    inputRef.current?.focus();
  });

  useHotkeys('alt+q', (e) => {
    if (isInputFocused) {
      e.preventDefault();
      inputRef.current?.blur();
    }
  }, { enableOnFormTags: true });

  useHotkeys('left', (e) => {
    if (!canNav) return;
    e.preventDefault();
    moveWord(Math.max(0, globalWordIdx - 1));
  }, { enabled: canNav });

  useHotkeys('right', (e) => {
    if (!canNav) return;
    e.preventDefault();
    moveWord(Math.min(flattenedWords.length - 1, globalWordIdx + 1));
  }, { enabled: canNav });

  useHotkeys('up', (e) => {
    if (!canNav) return;
    e.preventDefault();
    const currMsg = flattenedWords[globalWordIdx].msgIdx;
    if (currMsg > 0) {
      const first = flattenedWords.findIndex(w => w.msgIdx === currMsg - 1);
      if (first !== -1) moveWord(first);
    }
  }, { enabled: canNav });

  useHotkeys('down', (e) => {
    if (!canNav) return;
    e.preventDefault();
    const currMsg = flattenedWords[globalWordIdx].msgIdx;
    if (currMsg < messageCount - 1) {
      const first = flattenedWords.findIndex(w => w.msgIdx === currMsg + 1);
      if (first !== -1) moveWord(first);
    }
  }, { enabled: canNav });
};
