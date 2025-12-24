import { useState } from 'react';
import { useInstrumentStore } from '@/store/instrumentStore';
import { Host, Category } from '@/types';

// Default VST3 paths for Windows
// TODO: Add platform detection for Mac paths in Phase 2
const DEFAULT_VST_PATHS = [
  'C:\\Program Files\\Common Files\\VST3\\',
  'C:\\Program Files\\VSTPlugins\\',
  'C:\\Program Files (x86)\\Common Files\\VST3\\',
];

export interface ScannedItem {
  name: string;
  path: string;
  isDirectory: boolean;
  parsed?: {
    developer?: string;
    instrumentName?: string;
    host?: Host;
    category?: Category;
  };
}

const parseFolderName = (name: string): ScannedItem['parsed'] => {
  // Heuristics to parse common patterns:
  // "Spitfire Audio - BBC Symphony Orchestra"
  // "Native Instruments - Kontakt Factory Library"
  // "Arturia - Pigments"

  const parts = name.split(' - ');
  if (parts.length >= 2) {
    return {
      developer: parts[0].trim(),
      instrumentName: parts.slice(1).join(' - ').trim(),
    };
  }

  // Try other patterns
  const dashIndex = name.indexOf('-');
  if (dashIndex > 0) {
    return {
      developer: name.substring(0, dashIndex).trim(),
      instrumentName: name.substring(dashIndex + 1).trim(),
    };
  }

  return {
    instrumentName: name,
  };
};

const detectHost = (path: string, name: string): Host => {
  const lowerPath = path.toLowerCase();
  const lowerName = name.toLowerCase();

  if (lowerPath.includes('kontakt') || lowerName.includes('kontakt')) return 'Kontakt';
  if (lowerPath.includes('soundbox') || lowerName.includes('soundbox')) return 'Soundbox';
  if (lowerPath.includes('sine') || lowerName.includes('sine')) return 'SINE';
  if (lowerPath.includes('opus') || lowerName.includes('opus')) return 'Opus';
  if (lowerPath.includes('vst') || lowerName.includes('vst')) return 'VST3';
  if (lowerPath.includes('.component') || lowerName.includes('au')) return 'AU';

  return 'Other';
};

const detectCategory = (name: string): Category => {
  const lower = name.toLowerCase();

  if (
    lower.includes('orchestr') ||
    lower.includes('string') ||
    lower.includes('brass') ||
    lower.includes('woodwind')
  )
    return 'Orchestral';
  if (lower.includes('synth') || lower.includes('synthesizer')) return 'Synth';
  if (
    lower.includes('drum') ||
    lower.includes('percussion') ||
    lower.includes('kick') ||
    lower.includes('snare')
  )
    return 'Drums';
  if (lower.includes('piano') || lower.includes('key')) return 'Keys';
  if (lower.includes('vocal') || lower.includes('choir') || lower.includes('voice')) return 'Vocal';
  if (lower.includes('world') || lower.includes('ethnic')) return 'World';
  if (
    lower.includes('effect') ||
    lower.includes('reverb') ||
    lower.includes('delay') ||
    lower.includes('eq')
  )
    return 'Effects';

  return 'Other';
};

const parseVST3FileName = (fileName: string): ScannedItem['parsed'] => {
  // Remove .vst3 extension
  const nameWithoutExt = fileName.replace(/\.vst3$/i, '');

  // Try to parse manufacturer and plugin name
  // Common patterns: "Manufacturer - Plugin Name.vst3" or "Manufacturer_Plugin_Name.vst3"
  const parts = nameWithoutExt.split(/[-_]/);
  if (parts.length >= 2) {
    return {
      developer: parts[0].trim(),
      instrumentName: parts.slice(1).join(' ').trim(),
    };
  }

  return {
    instrumentName: nameWithoutExt,
  };
};

export function useDirectoryScanner() {
  const { addInstrument } = useInstrumentStore();
  const [isScanning, setIsScanning] = useState(false);
  const [isAutoScanning, setIsAutoScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0, path: '', found: 0 });

  const handleAutoScan = async (): Promise<ScannedItem[]> => {
    if (!window.electronAPI) {
      const error = new Error(
        'Electron API not available. This feature requires running the Electron app (npm run electron:dev).'
      );
      console.error('[DirectoryScanner]', error.message);
      throw error;
    }

    try {
      setIsAutoScanning(true);
      const allScannedItems: ScannedItem[] = [];

      // Use Windows paths (could detect platform later)
      const pathsToScan = DEFAULT_VST_PATHS;
      let totalFound = 0;

      for (let i = 0; i < pathsToScan.length; i++) {
        const path = pathsToScan[i];
        setScanProgress({ current: i + 1, total: pathsToScan.length, path, found: totalFound });

        try {
          const items = await window.electronAPI.scanDirectory(path);

          // Filter for .vst3 files or directories
          const vstItems: ScannedItem[] = items
            .filter((item) => {
              if (item.isDirectory) return true;
              return item.name.toLowerCase().endsWith('.vst3');
            })
            .map((item) => {
              const parsed = item.isDirectory
                ? parseFolderName(item.name)
                : parseVST3FileName(item.name);

              return {
                ...item,
                parsed: {
                  ...parsed,
                  host: detectHost(item.path, item.name),
                  category: detectCategory(item.name),
                },
              };
            });

          allScannedItems.push(...vstItems);
          totalFound += vstItems.length;
          setScanProgress({ current: i + 1, total: pathsToScan.length, path, found: totalFound });
        } catch (error) {
          // Path doesn't exist or access denied - skip
          console.warn(`[DirectoryScanner] Could not scan path: ${path}`, error);
        }
      }

      if (allScannedItems.length === 0) {
        throw new Error('No plugins found in default VST3 directories.');
      }

      return allScannedItems;
    } catch (error) {
      console.error('[DirectoryScanner] Error auto-scanning directories:', error);
      throw error;
    } finally {
      setIsAutoScanning(false);
      setScanProgress({ current: 0, total: 0, path: '', found: 0 });
    }
  };

  const handleScan = async (dirPath: string): Promise<ScannedItem[]> => {
    if (!window.electronAPI) {
      const error = new Error(
        'Electron API not available. This feature requires running the Electron app (npm run electron:dev).'
      );
      console.error('[DirectoryScanner]', error.message);
      throw error;
    }

    try {
      setIsScanning(true);
      const items = await window.electronAPI.scanDirectory(dirPath);

      // Parse items
      const parsed: ScannedItem[] = items
        .filter((item) => item.isDirectory) // Only directories for now
        .map((item) => {
          const parsed = parseFolderName(item.name);
          return {
            ...item,
            parsed: {
              ...parsed,
              host: detectHost(item.path, item.name),
              category: detectCategory(item.name),
            },
          };
        });

      return parsed;
    } catch (error) {
      console.error('[DirectoryScanner] Error scanning directory:', error);
      throw error;
    } finally {
      setIsScanning(false);
    }
  };

  const importInstruments = (items: ScannedItem[]) => {
    items.forEach((item) => {
      if (item.parsed) {
        addInstrument({
          name: item.parsed.instrumentName || item.name,
          developer: item.parsed.developer || 'Unknown',
          host: item.parsed.host || 'Other',
          category: item.parsed.category || 'Other',
          tags: [],
          notes: `Imported from: ${item.path}`,
          color: '#3b82f6',
          pairings: [],
        });
      }
    });
  };

  return {
    isScanning,
    isAutoScanning,
    scanProgress,
    handleAutoScan,
    handleScan,
    importInstruments,
  };
}
