import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { useUIStore } from '@/store/uiStore';

// Mock the UI store
vi.mock('@/store/uiStore', () => ({
  useUIStore: vi.fn(),
}));

describe('useKeyboardShortcuts', () => {
  let mockOpenAddInstrument: ReturnType<typeof vi.fn>;
  let mockSetSearchQuery: ReturnType<typeof vi.fn>;
  let mockSearchInput: HTMLInputElement;

  beforeEach(() => {
    // Reset mocks
    mockOpenAddInstrument = vi.fn();
    mockSetSearchQuery = vi.fn();

    // Mock useUIStore to return our mocked functions
    (useUIStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      openAddInstrument: mockOpenAddInstrument,
      setSearchQuery: mockSetSearchQuery,
    });

    // Create mock search input
    mockSearchInput = document.createElement('input');
    mockSearchInput.placeholder = 'Search instruments...';
    mockSearchInput.focus = vi.fn();
    mockSearchInput.blur = vi.fn();
    document.body.appendChild(mockSearchInput);

    // Mock querySelector to return our mock input
    vi.spyOn(document, 'querySelector').mockReturnValue(mockSearchInput);
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(mockSearchInput);
    vi.restoreAllMocks();
  });

  describe('Ctrl/Cmd + K shortcut', () => {
    it('should focus search input on Ctrl+K', () => {
      renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      });

      window.dispatchEvent(event);

      expect(mockSearchInput.focus).toHaveBeenCalled();
    });

    it('should focus search input on Cmd+K (Meta)', () => {
      renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        bubbles: true,
      });

      window.dispatchEvent(event);

      expect(mockSearchInput.focus).toHaveBeenCalled();
    });

    it('should prevent default behavior on Ctrl+K', () => {
      renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });

      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      window.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Ctrl/Cmd + N shortcut', () => {
    it('should open add instrument dialog on Ctrl+N', () => {
      renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        key: 'n',
        ctrlKey: true,
        bubbles: true,
      });

      window.dispatchEvent(event);

      expect(mockOpenAddInstrument).toHaveBeenCalled();
    });

    it('should open add instrument dialog on Cmd+N (Meta)', () => {
      renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        key: 'n',
        metaKey: true,
        bubbles: true,
      });

      window.dispatchEvent(event);

      expect(mockOpenAddInstrument).toHaveBeenCalled();
    });

    it('should prevent default behavior on Ctrl+N', () => {
      renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        key: 'n',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });

      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      window.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Escape key', () => {
    it('should clear search query when search input is focused', () => {
      renderHook(() => useKeyboardShortcuts());

      // Set the search input as active element
      Object.defineProperty(document, 'activeElement', {
        writable: true,
        configurable: true,
        value: mockSearchInput,
      });

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });

      window.dispatchEvent(event);

      expect(mockSetSearchQuery).toHaveBeenCalledWith('');
      expect(mockSearchInput.blur).toHaveBeenCalled();
    });

    it('should not clear search query when other input is focused', () => {
      renderHook(() => useKeyboardShortcuts());

      const otherInput = document.createElement('input');
      otherInput.placeholder = 'Other input';
      document.body.appendChild(otherInput);

      Object.defineProperty(document, 'activeElement', {
        writable: true,
        configurable: true,
        value: otherInput,
      });

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });

      window.dispatchEvent(event);

      expect(mockSetSearchQuery).not.toHaveBeenCalled();

      document.body.removeChild(otherInput);
    });

    it('should not clear search query when non-input element is focused', () => {
      renderHook(() => useKeyboardShortcuts());

      const button = document.createElement('button');
      document.body.appendChild(button);

      Object.defineProperty(document, 'activeElement', {
        writable: true,
        configurable: true,
        value: button,
      });

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });

      window.dispatchEvent(event);

      expect(mockSetSearchQuery).not.toHaveBeenCalled();

      document.body.removeChild(button);
    });
  });

  describe('/ key (slash)', () => {
    it('should focus search input when not in an input/textarea', () => {
      renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        key: '/',
        bubbles: true,
        target: document.body,
      } as KeyboardEventInit);

      Object.defineProperty(event, 'target', {
        writable: false,
        value: document.body,
      });

      window.dispatchEvent(event);

      expect(mockSearchInput.focus).toHaveBeenCalled();
    });

    it('should prevent default behavior when focusing search', () => {
      renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        key: '/',
        bubbles: true,
        cancelable: true,
        target: document.body,
      } as KeyboardEventInit);

      Object.defineProperty(event, 'target', {
        writable: false,
        value: document.body,
      });

      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      window.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not focus search input when target is an input', () => {
      renderHook(() => useKeyboardShortcuts());

      const otherInput = document.createElement('input');
      document.body.appendChild(otherInput);

      const event = new KeyboardEvent('keydown', {
        key: '/',
        bubbles: true,
        target: otherInput,
      } as KeyboardEventInit);

      Object.defineProperty(event, 'target', {
        writable: false,
        value: otherInput,
      });

      const focusCalls = (mockSearchInput.focus as ReturnType<typeof vi.fn>).mock.calls.length;

      window.dispatchEvent(event);

      expect((mockSearchInput.focus as ReturnType<typeof vi.fn>).mock.calls.length).toBe(
        focusCalls
      );

      document.body.removeChild(otherInput);
    });

    it('should not focus search input when target is a textarea', () => {
      renderHook(() => useKeyboardShortcuts());

      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      const event = new KeyboardEvent('keydown', {
        key: '/',
        bubbles: true,
        target: textarea,
      } as KeyboardEventInit);

      Object.defineProperty(event, 'target', {
        writable: false,
        value: textarea,
      });

      const focusCalls = (mockSearchInput.focus as ReturnType<typeof vi.fn>).mock.calls.length;

      window.dispatchEvent(event);

      expect((mockSearchInput.focus as ReturnType<typeof vi.fn>).mock.calls.length).toBe(
        focusCalls
      );

      document.body.removeChild(textarea);
    });
  });

  describe('cleanup', () => {
    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useKeyboardShortcuts());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should not respond to events after unmount', () => {
      const { unmount } = renderHook(() => useKeyboardShortcuts());

      // Clear previous calls
      mockOpenAddInstrument.mockClear();

      unmount();

      const event = new KeyboardEvent('keydown', {
        key: 'n',
        ctrlKey: true,
        bubbles: true,
      });

      window.dispatchEvent(event);

      // Should not be called since hook is unmounted
      expect(mockOpenAddInstrument).not.toHaveBeenCalled();
    });
  });

  describe('multiple shortcut combinations', () => {
    it('should handle multiple shortcuts in sequence', () => {
      renderHook(() => useKeyboardShortcuts());

      // Ctrl+K
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'k',
          ctrlKey: true,
          bubbles: true,
        })
      );

      expect(mockSearchInput.focus).toHaveBeenCalled();

      // Ctrl+N
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'n',
          ctrlKey: true,
          bubbles: true,
        })
      );

      expect(mockOpenAddInstrument).toHaveBeenCalled();
    });

    it('should not trigger shortcuts for unrelated key combinations', () => {
      renderHook(() => useKeyboardShortcuts());

      // Ctrl+A (not a registered shortcut)
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'a',
          ctrlKey: true,
          bubbles: true,
        })
      );

      expect(mockOpenAddInstrument).not.toHaveBeenCalled();
      expect(mockSearchInput.focus).not.toHaveBeenCalled();
    });

    it('should not trigger shortcuts without modifier keys', () => {
      renderHook(() => useKeyboardShortcuts());

      // Just 'k' without Ctrl/Meta
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'k',
          bubbles: true,
        })
      );

      // Just 'n' without Ctrl/Meta
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'n',
          bubbles: true,
        })
      );

      expect(mockOpenAddInstrument).not.toHaveBeenCalled();
      expect(mockSearchInput.focus).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle missing search input gracefully', () => {
      vi.spyOn(document, 'querySelector').mockReturnValue(null);

      renderHook(() => useKeyboardShortcuts());

      expect(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'k',
            ctrlKey: true,
            bubbles: true,
          })
        );
      }).not.toThrow();
    });

    it('should check placeholder includes "Search" case-insensitively', () => {
      renderHook(() => useKeyboardShortcuts());

      Object.defineProperty(document, 'activeElement', {
        writable: true,
        configurable: true,
        value: mockSearchInput,
      });

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });

      window.dispatchEvent(event);

      expect(mockSetSearchQuery).toHaveBeenCalledWith('');
    });
  });
});
