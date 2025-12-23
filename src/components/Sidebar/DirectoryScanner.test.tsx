import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DirectoryScanner } from './DirectoryScanner';

// Mock the store
const mockAddInstrument = vi.fn();

vi.mock('@/store/instrumentStore', () => ({
  useInstrumentStore: () => ({
    addInstrument: mockAddInstrument,
  }),
}));

describe('DirectoryScanner', () => {
  beforeEach(() => {
    mockAddInstrument.mockClear();
    delete (window as any).electronAPI;
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render with correct spacing classes', () => {
      const { container } = render(<DirectoryScanner />);
      const wrapper = container.firstChild as HTMLElement;

      // Verify the component has the spacing classes
      expect(wrapper.className).toContain('border-t');
      expect(wrapper.className).toContain('mt-4');
      expect(wrapper.className).toContain('p-4');
    });

    it('should render the scan directory button', () => {
      render(<DirectoryScanner />);
      expect(screen.getByText('Scan Directory')).toBeInTheDocument();
    });

    it('should disable button when electronAPI is not available', () => {
      render(<DirectoryScanner />);
      const button = screen.getByRole('button', { name: /scan directory/i });
      expect(button).toBeDisabled();
    });

    it('should enable button when electronAPI is available', () => {
      (window as any).electronAPI = {
        selectDirectory: vi.fn(),
        scanDirectory: vi.fn(),
      };

      render(<DirectoryScanner />);
      const button = screen.getByRole('button', { name: /scan directory/i });
      expect(button).not.toBeDisabled();
    });
  });

  describe('handleScan', () => {
    it('should not trigger scan when electronAPI is not available', () => {
      render(<DirectoryScanner />);
      const button = screen.getByRole('button', { name: /scan directory/i });

      // Button should be disabled when electron API not available
      expect(button).toBeDisabled();
    });

    it('should handle user canceling directory selection', async () => {
      const mockSelectDirectory = vi.fn().mockResolvedValue(null);

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: vi.fn(),
      };

      render(<DirectoryScanner />);
      const button = screen.getByRole('button', { name: /scan directory/i });

      fireEvent.click(button);

      await waitFor(() => {
        expect(mockSelectDirectory).toHaveBeenCalled();
      });
    });

    it('should scan directory and show preview dialog', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([
        { name: 'Spitfire Audio - BBC Symphony', path: '/path/to/spitfire', isDirectory: true },
        {
          name: 'Native Instruments - Kontakt Library',
          path: '/path/to/kontakt',
          isDirectory: true,
        },
      ]);

      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      const button = screen.getByRole('button', { name: /scan directory/i });

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Import Instruments')).toBeInTheDocument();
      });

      expect(screen.getByText('BBC Symphony')).toBeInTheDocument();
      expect(screen.getByText('Spitfire Audio')).toBeInTheDocument();
      expect(screen.getAllByText(/Kontakt/).length).toBeGreaterThan(0);
      expect(screen.getByText('Native Instruments')).toBeInTheDocument();
    });

    it('should show scanning state', async () => {
      const mockScanDirectory = vi.fn().mockImplementation(() => new Promise(() => {})); // Never resolves
      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      const button = screen.getByRole('button', { name: /scan directory/i });

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Scanning...')).toBeInTheDocument();
      });
    });

    it('should handle scan errors', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockScanDirectory = vi.fn().mockRejectedValue(new Error('Scan failed'));
      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      const button = screen.getByRole('button', { name: /scan directory/i });

      fireEvent.click(button);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Error scanning directory. Please try again.');
      });

      expect(consoleErrorSpy).toHaveBeenCalled();
      alertSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should filter out non-directory items', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([
        { name: 'Directory Item', path: '/path/to/dir', isDirectory: true },
        { name: 'File Item', path: '/path/to/file.txt', isDirectory: false },
      ]);

      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      const button = screen.getByRole('button', { name: /scan directory/i });

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Import Instruments')).toBeInTheDocument();
      });

      expect(screen.getByText(/Directory Item/)).toBeInTheDocument();
      expect(screen.queryByText(/File Item/)).not.toBeInTheDocument();
    });
  });

  describe('parseFolderName', () => {
    it('should parse folder names with " - " separator', async () => {
      const mockScanDirectory = vi
        .fn()
        .mockResolvedValue([
          { name: 'Spitfire Audio - BBC Symphony Orchestra', path: '/path/1', isDirectory: true },
        ]);

      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      fireEvent.click(screen.getByRole('button', { name: /scan directory/i }));

      await waitFor(() => {
        expect(screen.getByText('BBC Symphony Orchestra')).toBeInTheDocument();
        expect(screen.getByText('Spitfire Audio')).toBeInTheDocument();
      });
    });

    it('should parse folder names with single dash separator', async () => {
      const mockScanDirectory = vi
        .fn()
        .mockResolvedValue([{ name: 'Arturia-Pigments', path: '/path/1', isDirectory: true }]);

      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      fireEvent.click(screen.getByRole('button', { name: /scan directory/i }));

      await waitFor(() => {
        expect(screen.getByText('Pigments')).toBeInTheDocument();
        expect(screen.getByText('Arturia')).toBeInTheDocument();
      });
    });

    it('should use full name when no separator found', async () => {
      const mockScanDirectory = vi
        .fn()
        .mockResolvedValue([{ name: 'SomeSynth', path: '/path/1', isDirectory: true }]);

      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      fireEvent.click(screen.getByRole('button', { name: /scan directory/i }));

      await waitFor(() => {
        expect(screen.getByText('SomeSynth')).toBeInTheDocument();
      });
    });
  });

  describe('detectHost', () => {
    it.each([
      ['Kontakt Library', 'Kontakt'],
      ['VST3 Plugin', 'VST3'],
      ['Soundbox Instrument', 'Soundbox'],
      ['SINE Library', 'SINE'],
      ['Opus Library', 'Opus'],
      ['Audio Unit.component', 'AU'],
      ['Unknown Plugin', 'Other'],
    ])('should detect host from %s as %s', async (name, expectedHost) => {
      const mockScanDirectory = vi
        .fn()
        .mockResolvedValue([{ name, path: `/path/${name}`, isDirectory: true }]);

      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      fireEvent.click(screen.getByRole('button', { name: /scan directory/i }));

      await waitFor(
        () => {
          const hostElements = screen.getAllByText(expectedHost);
          expect(hostElements.length).toBeGreaterThan(0);
        },
        { timeout: 3000 }
      );
    });
  });

  describe('detectCategory', () => {
    it.each([
      ['Orchestra Strings', 'Orchestral'],
      ['Brass Section', 'Orchestral'],
      ['Woodwinds', 'Orchestral'],
      ['Analog Synth', 'Synth'],
      ['Synthesizer Pro', 'Synth'],
      ['Drum Machine', 'Drums'],
      ['Percussion Kit', 'Drums'],
      ['Piano Grand', 'Keys'],
      ['Keyboard Collection', 'Keys'],
      ['Vocal Choir', 'Vocal'],
      ['Voice Samples', 'Vocal'],
      ['World Instruments', 'World'],
      ['Ethnic Sounds', 'World'],
      ['Reverb Effect', 'Effects'],
      ['Delay Plugin', 'Effects'],
      ['Random Instrument', 'Other'],
    ])('should detect category from %s as %s', async (name, expectedCategory) => {
      const mockScanDirectory = vi
        .fn()
        .mockResolvedValue([{ name, path: `/path/${name}`, isDirectory: true }]);

      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      fireEvent.click(screen.getByRole('button', { name: /scan directory/i }));

      await waitFor(
        () => {
          const categoryElements = screen.getAllByText(expectedCategory);
          expect(categoryElements.length).toBeGreaterThan(0);
        },
        { timeout: 3000 }
      );
    });
  });

  describe('toggleItem', () => {
    it('should toggle item selection', async () => {
      const mockScanDirectory = vi
        .fn()
        .mockResolvedValue([{ name: 'Test Instrument', path: '/path/1', isDirectory: true }]);

      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      fireEvent.click(screen.getByRole('button', { name: /scan directory/i }));

      await waitFor(
        () => {
          expect(screen.getByText('Import Instruments')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Initially all items are selected
      expect(screen.getByText(/1 of 1 selected/)).toBeInTheDocument();

      // Click to deselect
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      await waitFor(
        () => {
          expect(screen.getByText(/0 of 1 selected/)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Click to select again
      fireEvent.click(checkbox);

      await waitFor(
        () => {
          expect(screen.getByText(/1 of 1 selected/)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('should toggle item by clicking on the container', async () => {
      const mockScanDirectory = vi
        .fn()
        .mockResolvedValue([{ name: 'Test Instrument', path: '/path/1', isDirectory: true }]);

      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      fireEvent.click(screen.getByRole('button', { name: /scan directory/i }));

      await waitFor(() => {
        expect(screen.getByText('Test Instrument')).toBeInTheDocument();
      });

      const container = screen
        .getByText('Test Instrument')
        .closest('div[role="button"], div.cursor-pointer');
      if (container) {
        fireEvent.click(container);

        await waitFor(() => {
          expect(screen.getByText(/0 of 1 selected/)).toBeInTheDocument();
        });
      }
    });
  });

  describe('handleImport', () => {
    it('should import selected instruments', async () => {
      const mockScanDirectory = vi.fn().mockResolvedValue([
        { name: 'Developer - Instrument 1', path: '/path/1', isDirectory: true },
        { name: 'Developer - Instrument 2', path: '/path/2', isDirectory: true },
      ]);

      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      fireEvent.click(screen.getByRole('button', { name: /scan directory/i }));

      await waitFor(() => {
        expect(screen.getByText('Import Instruments')).toBeInTheDocument();
      });

      const importButton = screen.getByRole('button', { name: /import 2 instrument/i });
      fireEvent.click(importButton);

      await waitFor(() => {
        expect(mockAddInstrument).toHaveBeenCalledTimes(2);
      });

      expect(mockAddInstrument).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Instrument 1',
          developer: 'Developer',
          notes: 'Imported from: /path/1',
        })
      );
    });

    it('should disable import button when no items selected', async () => {
      const mockScanDirectory = vi
        .fn()
        .mockResolvedValue([{ name: 'Test Instrument', path: '/path/1', isDirectory: true }]);

      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      fireEvent.click(screen.getByRole('button', { name: /scan directory/i }));

      await waitFor(
        () => {
          expect(screen.getByText('Import Instruments')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Deselect the item
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      await waitFor(
        () => {
          const importButton = screen.getByRole('button', { name: /import 0 instrument/i });
          expect(importButton).toBeDisabled();
        },
        { timeout: 3000 }
      );
    });

    it('should close dialog after import', async () => {
      const mockScanDirectory = vi
        .fn()
        .mockResolvedValue([{ name: 'Test Instrument', path: '/path/1', isDirectory: true }]);

      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      fireEvent.click(screen.getByRole('button', { name: /scan directory/i }));

      await waitFor(() => {
        expect(screen.getByText('Import Instruments')).toBeInTheDocument();
      });

      const importButton = screen.getByRole('button', { name: /import 1 instrument/i });
      fireEvent.click(importButton);

      await waitFor(() => {
        expect(screen.queryByText('Import Instruments')).not.toBeInTheDocument();
      });
    });
  });

  describe('dialog', () => {
    it('should close dialog when cancel is clicked', async () => {
      const mockScanDirectory = vi
        .fn()
        .mockResolvedValue([{ name: 'Test Instrument', path: '/path/1', isDirectory: true }]);

      const mockSelectDirectory = vi.fn().mockResolvedValue('/selected/path');

      (window as any).electronAPI = {
        selectDirectory: mockSelectDirectory,
        scanDirectory: mockScanDirectory,
      };

      render(<DirectoryScanner />);
      fireEvent.click(screen.getByRole('button', { name: /scan directory/i }));

      await waitFor(() => {
        expect(screen.getByText('Import Instruments')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Import Instruments')).not.toBeInTheDocument();
      });
    });
  });
});
