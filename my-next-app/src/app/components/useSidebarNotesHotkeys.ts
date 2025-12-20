
import { useHotkeys } from 'react-hotkeys-hook';

interface SidebarNotesHotkeysProps {
  isFocused?: boolean;
  editId: string | 'new' | null;
  handleStartCreate: () => void;
  setEditId: (id: string | 'new' | null) => void;
}

export const useSidebarNotesHotkeys = ({
  isFocused,
  editId,
  handleStartCreate,
  setEditId,
}: SidebarNotesHotkeysProps) => {
  useHotkeys('alt+n', (e) => {
    e.preventDefault();
    handleStartCreate();
  }, { enabled: isFocused && !editId });

  useHotkeys('alt+q', (e) => {
    e.preventDefault();
    setEditId(null);
  }, { enableOnFormTags: true });
};
