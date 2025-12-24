import { useMemo, useState, useEffect, useCallback } from 'react';
import { useInstrumentStore } from '@/store/instrumentStore';
import { useUIStore } from '@/store/uiStore';
import { InstrumentCard } from './InstrumentCard';
import { CollectionHeader } from './CollectionHeader';
import { Button } from '@/components/ui/button';
import { FolderOpen, Search } from 'lucide-react';
import { useDirectoryScanner, ScannedItem } from '@/hooks/useDirectoryScanner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export function CollectionView() {
  const { instruments, markAsUsed } = useInstrumentStore();
  const { searchQuery, selectedCategories, selectedHosts, collectionView, toggleCardSelection } =
    useUIStore();
  const { isAutoScanning, handleAutoScan, importInstruments } = useDirectoryScanner();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const [gridCols, setGridCols] = useState('grid-cols-4');

  useEffect(() => {
    const updateGridCols = () => {
      const width = window.innerWidth;
      if (width < 1200) setGridCols('grid-cols-3');
      else if (width < 1600) setGridCols('grid-cols-4');
      else if (width < 2000) setGridCols('grid-cols-5');
      else setGridCols('grid-cols-6');
    };

    updateGridCols();
    window.addEventListener('resize', updateGridCols);
    return () => window.removeEventListener('resize', updateGridCols);
  }, []);

  // Filter instruments
  const filteredInstruments = useMemo(() => {
    let filtered = [...instruments];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inst) =>
          inst.name.toLowerCase().includes(query) ||
          inst.developer.toLowerCase().includes(query) ||
          inst.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((inst) => selectedCategories.includes(inst.category));
    }

    // Host filter
    if (selectedHosts.length > 0) {
      filtered = filtered.filter((inst) => selectedHosts.includes(inst.host));
    }

    // Sort instruments
    const sorted = [...filtered].sort((a, b) => {
      switch (collectionView.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return (b.metadata.createdAt?.getTime() || 0) - (a.metadata.createdAt?.getTime() || 0);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'developer':
          return a.developer.localeCompare(b.developer);
        default:
          return 0;
      }
    });

    return sorted;
  }, [instruments, searchQuery, selectedCategories, selectedHosts, collectionView.sortBy]);

  const handleMarkAsUsed = useCallback(
    (id: string) => {
      markAsUsed(id);
    },
    [markAsUsed]
  );

  const handleScanDirectories = useCallback(async () => {
    try {
      const items = await handleAutoScan();
      setScannedItems(items);
      setSelectedItems(new Set(items.map((item) => item.path)));
      setIsPreviewOpen(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to scan directories';
      alert(message);
      console.error('[CollectionView] Scan error:', error);
    }
  }, [handleAutoScan]);

  const handleImport = useCallback(() => {
    const itemsToImport = scannedItems.filter((item) => selectedItems.has(item.path));
    importInstruments(itemsToImport);
    setIsPreviewOpen(false);
    setScannedItems([]);
    setSelectedItems(new Set());
  }, [scannedItems, selectedItems, importInstruments]);

  const toggleItem = useCallback((path: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  // Empty state
  if (filteredInstruments.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <CollectionHeader />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 p-12">
          <div className="text-center space-y-2">
            <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold">No instruments yet</h2>
            <p className="text-muted-foreground max-w-md">
              {instruments.length === 0
                ? "Click 'Scan Directories' to auto-discover your plugins"
                : 'No instruments match your current filters. Try adjusting your search or filters.'}
            </p>
          </div>
          {instruments.length === 0 && (
            <Button
              onClick={handleScanDirectories}
              size="lg"
              className="mt-4"
              disabled={isAutoScanning || !window.electronAPI}
            >
              {isAutoScanning ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Scan Directories
                </>
              )}
            </Button>
          )}

          {!window.electronAPI && instruments.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Note: Directory scanning requires the Electron app. Run{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">npm run electron:dev</code> to
              enable this feature.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <CollectionHeader />
      <div className="flex-1 overflow-y-auto p-8">
        <div className={`grid ${gridCols} gap-6 max-w-7xl mx-auto`}>
          {filteredInstruments.map((instrument) => (
            <InstrumentCard
              key={instrument.id}
              instrument={instrument}
              isSelected={collectionView.selectedCardIds.includes(instrument.id)}
              viewDensity={collectionView.viewDensity}
              onSelect={toggleCardSelection}
              onMarkAsUsed={handleMarkAsUsed}
            />
          ))}
        </div>
      </div>

      {/* Import Preview Dialog */}
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
