import { useState } from 'react';
import { useInstrumentStore } from '@/store/instrumentStore';
import { Button } from '@/components/ui/button';
import { FolderOpen, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Host, Category } from '@/types';

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

interface ScannedItem {
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

export function DirectoryScanner() {
  const { addInstrument } = useInstrumentStore();
  const [isScanning, setIsScanning] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

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
    if (lower.includes('drum') || lower.includes('percussion')) return 'Drums';
    if (lower.includes('piano') || lower.includes('key')) return 'Keys';
    if (lower.includes('vocal') || lower.includes('choir') || lower.includes('voice'))
      return 'Vocal';
    if (lower.includes('world') || lower.includes('ethnic')) return 'World';
    if (lower.includes('effect') || lower.includes('reverb') || lower.includes('delay'))
      return 'Effects';

    return 'Other';
  };

  const handleScan = async () => {
    if (!window.electronAPI) {
      alert('Electron API not available. This feature requires the Electron app.');
      return;
    }

    try {
      const dirPath = await window.electronAPI.selectDirectory();
      if (!dirPath) return;

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

      setScannedItems(parsed);
      setSelectedItems(new Set(parsed.map((item) => item.path)));
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Error scanning directory:', error);
      alert('Error scanning directory. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleImport = () => {
    const itemsToImport = scannedItems.filter((item) => selectedItems.has(item.path));

    itemsToImport.forEach((item) => {
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

    setIsPreviewOpen(false);
    setScannedItems([]);
    setSelectedItems(new Set());
  };

  const toggleItem = (path: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <div className="border-t mt-4 p-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleScan}
        disabled={isScanning || !window.electronAPI}
      >
        {isScanning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <FolderOpen className="mr-2 h-4 w-4" />
            Scan Directory
          </>
        )}
      </Button>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Instruments</DialogTitle>
            <DialogDescription>
              Review and select instruments to import. {selectedItems.size} of {scannedItems.length}{' '}
              selected.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {scannedItems.map((item) => (
              <div
                key={item.path}
                className={`flex items-center justify-between rounded border p-3 cursor-pointer hover:bg-accent ${
                  selectedItems.has(item.path) ? 'border-primary bg-accent' : ''
                }`}
                onClick={() => toggleItem(item.path)}
              >
                <div className="flex-1">
                  <p className="font-medium">{item.parsed?.instrumentName || item.name}</p>
                  {item.parsed?.developer && (
                    <p className="text-sm text-muted-foreground">{item.parsed.developer}</p>
                  )}
                  <div className="flex gap-2 mt-1">
                    {item.parsed?.host && (
                      <Badge variant="outline" className="text-xs">
                        {item.parsed.host}
                      </Badge>
                    )}
                    {item.parsed?.category && (
                      <Badge variant="outline" className="text-xs">
                        {item.parsed.category}
                      </Badge>
                    )}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.path)}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleItem(item.path);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="ml-4"
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={selectedItems.size === 0}>
              Import {selectedItems.size} Instrument(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
