import { useEffect } from 'react';

export const useGlobalHotkeys = (
  setCommandPaletteOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setClipboardDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.altKey && e.code === 'KeyV') {
        e.preventDefault();
        setClipboardDrawerOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen, setClipboardDrawerOpen]);
};
