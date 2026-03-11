
import { useHotkeys } from 'react-hotkeys-hook';

interface GuideModalHotkeysProps {
  totalItems: number;
  setInternalFocusIdx: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
}

export const useGuideModalHotkeys = ({
  totalItems,
  setInternalFocusIdx,
  onClose,
}: GuideModalHotkeysProps) => {
  useHotkeys('up, down, left, right', (e) => {
    e.preventDefault();
  }, { enableOnFormTags: true });

  useHotkeys('j, l', (e) => {
    e.preventDefault();
    setInternalFocusIdx(prev => (prev + 1) % totalItems);
  }, { enableOnFormTags: true });

  useHotkeys('k, h', (e) => {
    e.preventDefault();
    setInternalFocusIdx(prev => (prev - 1 + totalItems) % totalItems);
  }, { enableOnFormTags: true });

  useHotkeys('enter', (e) => {
    e.preventDefault();
    onClose();
  }, { enableOnFormTags: true });

  useHotkeys('esc', (e) => {
    e.preventDefault();
    onClose();
  }, { enableOnFormTags: true });
};
