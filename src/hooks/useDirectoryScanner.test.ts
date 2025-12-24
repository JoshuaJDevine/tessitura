import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDirectoryScanner, ScannedItem } from './useDirectoryScanner';

// Mock the store
const mockAddInstrument = vi.fn();

vi.mock('@/store/instrumentStore', () => ({
  useInstrumentStore: vi.fn(() => ({
    addInstrument: mockAddInstrument,
  })),
}));

// Mock window.electronAPI
declare global {
  interface Window {
    electronAPI?: {
      selectDirectory: () => Promise<string | null>;
      scanDirectory: (
        path: string
      ) => Promise<Array<{ name: string; path: string; isDirectory: boolean }>>;
    };
  }
}

describe('useDirectoryScanner', () => {
  beforeEach(() => {
    mockAddInstrument.mockClear();
    delete (window as any).electronAPI;
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete (window as any).electronAPI;
  });

  describe('initial state', () => {
    it('should have initial state values', () => {
      const { result } = renderHook(() => useDirectoryScanner());

      expect(result.current.isScanning).toBe(false);
      expect(result.current.isAutoScanning).toBe(false);
      expect(result.current.scanProgress).toEqual({
        current: 0,
        total: 0,
        path: '',
        found: 0,
      });
    });

    it('should expose all hook functions', () => {
      const { result } = renderHook(() => useDirectoryScanner());

      expect(typeof result.current.handleAutoScan).toBe('function');
      expect(typeof result.current.handleScan).toBe('function');
      expect(typeof result.current.importInstruments).toBe('function');
    });
  });

  describe('handleAutoScan', () => {
    it('should throw error when Electron API is not available', async () => {
      const { result } = renderHook(() => useDirectoryScanner());
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(async () => {
        await act(async () => {
          await result.current.handleAutoScan();
        });
      }).rejects.toThrow('Electron API not available');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[DirectoryScanner]',
        expect.stringContaining('Electron API not available')
      );

      consoleErrorSpy.mockRestore();
    });

    it('should successfully scan default paths and return scanned items', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([
        { name: 'Plugin1.vst3', path: 'C:\\VST3\\Plugin1.vst3', isDirectory: false },
        { name: 'Folder1', path: 'C:\\VST3\\Folder1', isDirectory: true },
      ]);

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      let scannedItems: ScannedItem[] = [];
      await act(async () => {
        scannedItems = await result.current.handleAutoScan();
      });

      // handleAutoScan scans multiple default paths, so items will be multiplied
      expect(scannedItems.length).toBeGreaterThanOrEqual(2);
      expect(mockScanDirectory).toHaveBeenCalled();
      expect(result.current.isAutoScanning).toBe(false);
      expect(result.current.scanProgress).toEqual({
        current: 0,
        total: 0,
        path: '',
        found: 0,
      });
    });

    it('should filter for .vst3 files and directories only', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([
        { name: 'Plugin.vst3', path: 'C:\\VST3\\Plugin.vst3', isDirectory: false },
        { name: 'Other.dll', path: 'C:\\VST3\\Other.dll', isDirectory: false },
        { name: 'Folder', path: 'C:\\VST3\\Folder', isDirectory: true },
      ]);

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      let scannedItems: ScannedItem[] = [];
      await act(async () => {
        scannedItems = await result.current.handleAutoScan();
      });

      // Should only include .vst3 file and directory, not .dll
      expect(scannedItems.length).toBeGreaterThanOrEqual(2);
      expect(scannedItems.some((item) => item.name === 'Plugin.vst3')).toBe(true);
      expect(scannedItems.some((item) => item.name === 'Folder')).toBe(true);
      expect(scannedItems.some((item) => item.name === 'Other.dll')).toBe(false);
    });

    it('should throw error when no plugins found', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([]);

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(async () => {
        await act(async () => {
          await result.current.handleAutoScan();
        });
      }).rejects.toThrow('No plugins found in default VST3 directories.');

      consoleErrorSpy.mockRestore();
    });

    it('should update progress state during scanning', async () => {
      const mockScanDirectory = vi
        .fn()
        .mockResolvedValue([
          { name: 'Plugin1.vst3', path: 'C:\\VST3\\Plugin1.vst3', isDirectory: false },
        ]);

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      act(() => {
        result.current.handleAutoScan();
      });

      // Progress should be updated during scan
      await waitFor(() => {
        expect(result.current.isAutoScanning).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isAutoScanning).toBe(false);
      });

      // Progress should be reset after scan
      expect(result.current.scanProgress).toEqual({
        current: 0,
        total: 0,
        path: '',
        found: 0,
      });
    });

    it('should handle inaccessible paths gracefully', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const mockScanDirectory = vi
        .fn()
        .mockRejectedValueOnce(new Error('Path not found'))
        .mockResolvedValueOnce([
          { name: 'Plugin.vst3', path: 'C:\\VST3\\Plugin.vst3', isDirectory: false },
        ]);

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      let scannedItems: ScannedItem[] = [];
      await act(async () => {
        scannedItems = await result.current.handleAutoScan();
      });

      // Should continue scanning other paths and return results
      expect(scannedItems.length).toBeGreaterThan(0);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should parse VST3 filenames correctly', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([
        {
          name: 'Manufacturer - Plugin Name.vst3',
          path: 'C:\\VST3\\Manufacturer - Plugin Name.vst3',
          isDirectory: false,
        },
      ]);

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      let scannedItems: ScannedItem[] = [];
      await act(async () => {
        scannedItems = await result.current.handleAutoScan();
      });

      const item = scannedItems[0];
      expect(item.parsed?.developer).toBe('Manufacturer');
      expect(item.parsed?.instrumentName).toBe('Plugin Name');
    });

    it('should detect host from path and name', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([
        {
          name: 'Kontakt Library',
          path: 'C:\\VST3\\Kontakt\\Library',
          isDirectory: true,
        },
      ]);

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      let scannedItems: ScannedItem[] = [];
      await act(async () => {
        scannedItems = await result.current.handleAutoScan();
      });

      expect(scannedItems[0].parsed?.host).toBe('Kontakt');
    });

    it('should detect category from name', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([
        {
          name: 'Orchestral Strings',
          path: 'C:\\VST3\\Orchestral Strings',
          isDirectory: true,
        },
      ]);

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      let scannedItems: ScannedItem[] = [];
      await act(async () => {
        scannedItems = await result.current.handleAutoScan();
      });

      expect(scannedItems[0].parsed?.category).toBe('Orchestral');
    });

    it('should reset state after error', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([]); // No plugins found
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      try {
        await act(async () => {
          await result.current.handleAutoScan();
        });
      } catch (error) {
        // Expected error
      }

      // State should be reset even after error
      expect(result.current.isAutoScanning).toBe(false);
      expect(result.current.scanProgress).toEqual({
        current: 0,
        total: 0,
        path: '',
        found: 0,
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('handleScan', () => {
    it('should throw error when Electron API is not available', async () => {
      const { result } = renderHook(() => useDirectoryScanner());
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(async () => {
        await act(async () => {
          await result.current.handleScan('/some/path');
        });
      }).rejects.toThrow('Electron API not available');

      consoleErrorSpy.mockRestore();
    });

    it('should successfully scan selected directory', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([
        {
          name: 'Developer - Instrument',
          path: '/path/Developer - Instrument',
          isDirectory: true,
        },
      ]);

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      let scannedItems: ScannedItem[] = [];
      await act(async () => {
        scannedItems = await result.current.handleScan('/selected/path');
      });

      expect(scannedItems).toHaveLength(1);
      expect(mockScanDirectory).toHaveBeenCalledWith('/selected/path');
      expect(scannedItems[0].parsed?.developer).toBe('Developer');
      expect(scannedItems[0].parsed?.instrumentName).toBe('Instrument');
      expect(result.current.isScanning).toBe(false);
    });

    it('should filter for directories only', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([
        { name: 'Directory', path: '/path/Directory', isDirectory: true },
        { name: 'File.txt', path: '/path/File.txt', isDirectory: false },
      ]);

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      let scannedItems: ScannedItem[] = [];
      await act(async () => {
        scannedItems = await result.current.handleScan('/path');
      });

      expect(scannedItems).toHaveLength(1);
      expect(scannedItems[0].name).toBe('Directory');
    });

    it('should update isScanning state during scan', async () => {
      const mockScanDirectory = vi
        .fn()
        .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve([]), 100)));

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      act(() => {
        result.current.handleScan('/path');
      });

      expect(result.current.isScanning).toBe(true);

      await waitFor(() => {
        expect(result.current.isScanning).toBe(false);
      });
    });

    it('should parse folder names correctly', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([
        {
          name: 'Spitfire Audio - BBC Symphony Orchestra',
          path: '/path/Spitfire Audio - BBC Symphony Orchestra',
          isDirectory: true,
        },
      ]);

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      let scannedItems: ScannedItem[] = [];
      await act(async () => {
        scannedItems = await result.current.handleScan('/path');
      });

      expect(scannedItems[0].parsed?.developer).toBe('Spitfire Audio');
      expect(scannedItems[0].parsed?.instrumentName).toBe('BBC Symphony Orchestra');
    });

    it('should handle folder names with single dash', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([
        {
          name: 'Arturia-Pigments',
          path: '/path/Arturia-Pigments',
          isDirectory: true,
        },
      ]);

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      let scannedItems: ScannedItem[] = [];
      await act(async () => {
        scannedItems = await result.current.handleScan('/path');
      });

      expect(scannedItems[0].parsed?.developer).toBe('Arturia');
      expect(scannedItems[0].parsed?.instrumentName).toBe('Pigments');
    });

    it('should use full name when no separator found', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([
        {
          name: 'SomeSynth',
          path: '/path/SomeSynth',
          isDirectory: true,
        },
      ]);

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      let scannedItems: ScannedItem[] = [];
      await act(async () => {
        scannedItems = await result.current.handleScan('/path');
      });

      expect(scannedItems[0].parsed?.instrumentName).toBe('SomeSynth');
      expect(scannedItems[0].parsed?.developer).toBeUndefined();
    });

    it('should handle scan errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockScanDirectory = vi.fn().mockRejectedValue(new Error('Scan failed'));

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      await expect(async () => {
        await act(async () => {
          await result.current.handleScan('/path');
        });
      }).rejects.toThrow('Scan failed');

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result.current.isScanning).toBe(false);

      consoleErrorSpy.mockRestore();
    });

    it('should reset isScanning state after error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockScanDirectory = vi.fn().mockRejectedValue(new Error('Scan failed'));

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      try {
        await act(async () => {
          await result.current.handleScan('/path');
        });
      } catch (error) {
        // Expected error
      }

      expect(result.current.isScanning).toBe(false);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('importInstruments', () => {
    it('should add instruments to store for items with parsed data', () => {
      const { result } = renderHook(() => useDirectoryScanner());

      const scannedItems: ScannedItem[] = [
        {
          name: 'BBC Symphony',
          path: '/path/bbc',
          isDirectory: true,
          parsed: {
            developer: 'Spitfire Audio',
            instrumentName: 'BBC Symphony',
            host: 'Kontakt',
            category: 'Orchestral',
          },
        },
        {
          name: 'Pigments',
          path: '/path/pigments',
          isDirectory: true,
          parsed: {
            developer: 'Arturia',
            instrumentName: 'Pigments',
            host: 'VST3',
            category: 'Synth',
          },
        },
      ];

      act(() => {
        result.current.importInstruments(scannedItems);
      });

      expect(mockAddInstrument).toHaveBeenCalledTimes(2);
      expect(mockAddInstrument).toHaveBeenCalledWith({
        name: 'BBC Symphony',
        developer: 'Spitfire Audio',
        host: 'Kontakt',
        category: 'Orchestral',
        tags: [],
        notes: 'Imported from: /path/bbc',
        color: '#3b82f6',
        pairings: [],
      });
      expect(mockAddInstrument).toHaveBeenCalledWith({
        name: 'Pigments',
        developer: 'Arturia',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: 'Imported from: /path/pigments',
        color: '#3b82f6', // Default color from hook (not category-based)
        pairings: [],
      });
    });

    it('should skip items without parsed data', () => {
      const { result } = renderHook(() => useDirectoryScanner());

      const scannedItems: ScannedItem[] = [
        {
          name: 'BBC Symphony',
          path: '/path/bbc',
          isDirectory: true,
          parsed: {
            developer: 'Spitfire Audio',
            instrumentName: 'BBC Symphony',
            host: 'Kontakt',
            category: 'Orchestral',
          },
        },
        {
          name: 'Unknown',
          path: '/path/unknown',
          isDirectory: true,
          // No parsed data
        },
      ];

      act(() => {
        result.current.importInstruments(scannedItems);
      });

      // Should only import items with parsed data
      expect(mockAddInstrument).toHaveBeenCalledTimes(1);
      expect(mockAddInstrument).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'BBC Symphony',
        })
      );
    });

    it('should use item name as fallback when parsed instrumentName is missing', () => {
      const { result } = renderHook(() => useDirectoryScanner());

      const scannedItems: ScannedItem[] = [
        {
          name: 'Some Instrument',
          path: '/path/instrument',
          isDirectory: true,
          parsed: {
            developer: 'Developer',
            host: 'VST3',
            category: 'Synth',
            // instrumentName missing
          },
        },
      ];

      act(() => {
        result.current.importInstruments(scannedItems);
      });

      expect(mockAddInstrument).toHaveBeenCalledWith({
        name: 'Some Instrument',
        developer: 'Developer',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: 'Imported from: /path/instrument',
        color: '#3b82f6', // Default color from hook
        pairings: [],
      });
    });

    it('should use "Unknown" as fallback when parsed developer is missing', () => {
      const { result } = renderHook(() => useDirectoryScanner());

      const scannedItems: ScannedItem[] = [
        {
          name: 'Instrument',
          path: '/path/instrument',
          isDirectory: true,
          parsed: {
            instrumentName: 'Instrument',
            host: 'VST3',
            category: 'Synth',
            // developer missing
          },
        },
      ];

      act(() => {
        result.current.importInstruments(scannedItems);
      });

      expect(mockAddInstrument).toHaveBeenCalledWith({
        name: 'Instrument',
        developer: 'Unknown',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: 'Imported from: /path/instrument',
        color: '#3b82f6', // Default color from hook
        pairings: [],
      });
    });

    it('should use default values for missing host and category', () => {
      const { result } = renderHook(() => useDirectoryScanner());

      const scannedItems: ScannedItem[] = [
        {
          name: 'Instrument',
          path: '/path/instrument',
          isDirectory: true,
          parsed: {
            developer: 'Developer',
            instrumentName: 'Instrument',
            // host and category missing
          },
        },
      ];

      act(() => {
        result.current.importInstruments(scannedItems);
      });

      expect(mockAddInstrument).toHaveBeenCalledWith({
        name: 'Instrument',
        developer: 'Developer',
        host: 'Other',
        category: 'Other',
        tags: [],
        notes: 'Imported from: /path/instrument',
        color: '#3b82f6', // Default color from hook
        pairings: [],
      });
    });

    it('should handle empty array', () => {
      const { result } = renderHook(() => useDirectoryScanner());

      act(() => {
        result.current.importInstruments([]);
      });

      expect(mockAddInstrument).not.toHaveBeenCalled();
    });
  });

  describe('integration', () => {
    it('should handle full workflow: scan -> import', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([
        {
          name: 'Developer - Instrument',
          path: '/path/instrument',
          isDirectory: true,
        },
      ]);

      (window as any).electronAPI = {
        scanDirectory: mockScanDirectory,
      };

      const { result } = renderHook(() => useDirectoryScanner());

      // Scan
      let scannedItems: ScannedItem[] = [];
      await act(async () => {
        scannedItems = await result.current.handleScan('/path');
      });

      expect(scannedItems).toHaveLength(1);

      // Import
      act(() => {
        result.current.importInstruments(scannedItems);
      });

      expect(mockAddInstrument).toHaveBeenCalledTimes(1);
      expect(mockAddInstrument).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Instrument',
          developer: 'Developer',
        })
      );
    });
  });
});
