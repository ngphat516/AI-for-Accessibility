
import { useHotkeys } from 'react-hotkeys-hook';

export const useNotesHotkeys = (searchRef: React.RefObject<HTMLInputElement | null>) => {
  useHotkeys('/', (e) => {
    e.preventDefault();
    searchRef.current?.focus();
  });
};
