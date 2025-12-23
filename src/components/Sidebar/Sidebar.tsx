import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { FilterPanel } from './FilterPanel';
import { AddInstrument } from './AddInstrument';
import { TemplateLibrary } from './TemplateLibrary';
import { DirectoryScanner } from './DirectoryScanner';
import { Analytics } from './Analytics';

export function Sidebar() {
  const { openAddInstrument } = useUIStore();

  return (
    <div className="flex h-screen w-80 flex-col">
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Plugin Organizer</h1>
        </div>
        <Button className="mt-4 w-full" onClick={openAddInstrument}>
          <Plus className="mr-2 h-4 w-4" />
          Add Instrument
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <FilterPanel />
        <TemplateLibrary />
        <DirectoryScanner />
        <Analytics />
      </div>
      
      <AddInstrument />
    </div>
  );
}

