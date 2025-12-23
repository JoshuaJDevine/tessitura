import { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';

export function useKeyboardShortcuts() {
  const { openAddInstrument, setSearchQuery } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
      }

      // Ctrl/Cmd + N for new instrument
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openAddInstrument();
      }

      // Escape to clear search
      if (e.key === 'Escape') {
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLInputElement && activeElement.placeholder.includes('Search')) {
          setSearchQuery('');
          activeElement.blur();
        }
      }

      // / to focus search
      if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openAddInstrument, setSearchQuery]);
}

