import { useUIStore } from '@/store/uiStore';
import { useInstrumentStore } from '@/store/instrumentStore';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, LayoutGrid, LayoutList } from 'lucide-react';

export function CollectionHeader() {
  const { collectionView, setCollectionSort, setViewDensity, openAddInstrument } = useUIStore();
  const { instruments } = useInstrumentStore();

  const handleSortChange = (value: string) => {
    setCollectionSort(value as 'name' | 'recent' | 'category' | 'developer');
  };

  const handleDensityChange = (value: string) => {
    setViewDensity(value as 'compact' | 'spacious');
  };

  return (
    <div className="flex items-center justify-between p-6 border-b">
      {/* Left: Sort and Count */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={collectionView.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          {instruments.length} {instruments.length === 1 ? 'instrument' : 'instruments'}
        </div>
      </div>

      {/* Right: View Density and Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border rounded-md p-1">
          <Button
            variant={collectionView.viewDensity === 'compact' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => handleDensityChange('compact')}
            className="h-8"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={collectionView.viewDensity === 'spacious' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => handleDensityChange('spacious')}
            className="h-8"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline" onClick={openAddInstrument}>
          <Plus className="mr-2 h-4 w-4" />
          Add Instrument
        </Button>
      </div>
    </div>
  );
}
