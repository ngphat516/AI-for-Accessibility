
import { useHotkeys } from 'react-hotkeys-hook';
import { Note } from '../../types';

interface NoteModalHotkeysProps {
  isOpen: boolean;
  totalItems: number;
  internalFocusIdx: number;
  setInternalFocusIdx: React.Dispatch<React.SetStateAction<number>>;
  onSave: (note: Partial<Note>) => void;
  onClose: () => void;
  formData: Partial<Note>;
}

export const useNoteModalHotkeys = ({
  isOpen,
  totalItems,
  internalFocusIdx,
  setInternalFocusIdx,
  onSave,
  onClose,
  formData,
}: NoteModalHotkeysProps) => {
  useHotkeys('up, down, left, right', (e) => {
    if (isOpen) e.preventDefault();
  }, { enabled: isOpen, enableOnFormTags: true });

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
    if (internalFocusIdx === 5) {
      onSave(formData);
      onClose();
    } else if (internalFocusIdx === 4 || internalFocusIdx === 0) {
      onClose();
    }
  }, { enabled: isOpen, enableOnFormTags: true });

  useHotkeys('esc', (e) => {
    if (!isOpen) return;
    e.preventDefault();
    onClose();
  }, { enabled: isOpen, enableOnFormTags: true });
};
