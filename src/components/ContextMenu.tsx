import { useUIStore } from '@/store/uiStore';
import { useInstrumentStore } from '@/store/instrumentStore';
import { useCanvasStore } from '@/store/canvasStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, Link2, Star } from 'lucide-react';

interface ContextMenuProps {
  instrumentId: string;
  children: React.ReactNode;
}

export function ContextMenu({ instrumentId, children }: ContextMenuProps) {
  const { openEditInstrument } = useUIStore();
  const { deleteInstrument, markAsUsed } = useInstrumentStore();
  const { selectedNodeIds } = useCanvasStore();

  const handleEdit = () => {
    openEditInstrument(instrumentId);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this instrument?')) {
      deleteInstrument(instrumentId);
    }
  };

  const handleCreatePairing = () => {
    if (selectedNodeIds.length > 0 && selectedNodeIds[0] !== instrumentId) {
      useInstrumentStore.getState().createPairing(instrumentId, selectedNodeIds[0]);
    }
  };

  const handleMarkAsUsed = () => {
    markAsUsed(instrumentId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleMarkAsUsed}>
          <Star className="mr-2 h-4 w-4" />
          Mark as Used
        </DropdownMenuItem>
        {selectedNodeIds.length > 0 && selectedNodeIds[0] !== instrumentId && (
          <DropdownMenuItem onClick={handleCreatePairing}>
            <Link2 className="mr-2 h-4 w-4" />
            Create Pairing
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
