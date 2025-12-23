import { useMemo, useState, useEffect } from 'react';
import { useInstrumentStore } from '@/store/instrumentStore';
import { useUIStore } from '@/store/uiStore';
import { InstrumentCard } from './InstrumentCard';
import { CollectionHeader } from './CollectionHeader';
import { Button } from '@/components/ui/button';
import { FolderOpen, Search } from 'lucide-react';

export function CollectionView() {
  const { instruments } = useInstrumentStore();
  const {
    searchQuery,
    selectedCategories,
    selectedHosts,
    collectionView,
    toggleCardSelection,
    openAddInstrument,
  } = useUIStore();

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
            <Button onClick={openAddInstrument} size="lg" className="mt-4">
              <Search className="mr-2 h-4 w-4" />
              Scan Directories
            </Button>
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
