import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FolderOpen, Loader2, Scan } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useDirectoryScanner, ScannedItem } from '@/hooks/useDirectoryScanner';

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

export function DirectoryScanner() {
  const {
    isScanning,
    isAutoScanning,
    scanProgress,
    handleAutoScan,
    handleScan,
    importInstruments,
  } = useDirectoryScanner();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  // Log Electron API availability for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[DirectoryScanner] Electron API available:', !!window.electronAPI);
      if (!window.electronAPI) {
        console.warn(
          '[DirectoryScanner] Electron API not available. Run "npm run electron:dev" to enable directory scanning.'
        );
      }
    }
  }, []);

  const onAutoScan = async () => {
    if (!window.electronAPI) {
      alert(
        'Electron API not available.\n\nThis feature requires the Electron app.\nPlease run: npm run electron:dev'
      );
      return;
    }

    try {
      setIsProgressOpen(true);
      const items = await handleAutoScan();
      setScannedItems(items);
      setSelectedItems(new Set(items.map((item) => item.path)));
      setIsPreviewOpen(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to scan directories';
      alert(message);
      console.error('[DirectoryScanner] Auto-scan error:', error);
    } finally {
      setIsProgressOpen(false);
    }
  };

  const onScan = async () => {
    if (!window.electronAPI) {
      alert(
        'Electron API not available.\n\nThis feature requires the Electron app.\nPlease run: npm run electron:dev'
      );
      return;
    }

    try {
      const dirPath = await window.electronAPI.selectDirectory();
      if (!dirPath) return;

      const items = await handleScan(dirPath);
      setScannedItems(items);
      setSelectedItems(new Set(items.map((item) => item.path)));
      setIsPreviewOpen(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to scan directory';
      alert(message);
      console.error('[DirectoryScanner] Scan error:', error);
    }
  };

  const handleImport = () => {
    const itemsToImport = scannedItems.filter((item) => selectedItems.has(item.path));
    importInstruments(itemsToImport);
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
    <div className="border-t mt-4 p-4 space-y-2">
      <Button
        variant="default"
        className="w-full"
        onClick={onAutoScan}
        disabled={isAutoScanning || !window.electronAPI}
        title={
          !window.electronAPI
            ? 'Requires Electron app. Run: npm run electron:dev'
            : 'Scan default VST3 directories'
        }
      >
        {isAutoScanning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Auto-Scanning...
          </>
        ) : (
          <>
            <Scan className="mr-2 h-4 w-4" />
            Scan Directories
          </>
        )}
      </Button>

      <Button
        variant="outline"
        className="w-full"
        onClick={onScan}
        disabled={isScanning || !window.electronAPI}
        title={
          !window.electronAPI
            ? 'Requires Electron app. Run: npm run electron:dev'
            : 'Choose a directory to scan'
        }
      >
        {isScanning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <FolderOpen className="mr-2 h-4 w-4" />
            Choose Directory
          </>
        )}
      </Button>

      {!window.electronAPI && (
        <p className="text-xs text-muted-foreground mt-2">
          💡 Run <code className="bg-muted px-1 py-0.5 rounded">npm run electron:dev</code> to
          enable directory scanning
        </p>
      )}

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

      {/* Progress Dialog */}
      <Dialog open={isProgressOpen} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scanning Directories</DialogTitle>
            <DialogDescription>Scanning standard VST3 paths for plugins...</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Path {scanProgress.current} of {scanProgress.total}
                </span>
                <span>{scanProgress.found} plugins found</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${scanProgress.total > 0 ? (scanProgress.current / scanProgress.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground truncate">{scanProgress.path}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
