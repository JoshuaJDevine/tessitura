import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Pencil, Trash2 } from 'lucide-react';
import { useInstrumentStore } from '@/store/instrumentStore';
import { useUIStore } from '@/store/uiStore';

interface InstrumentCardContextMenuProps {
  instrumentId: string;
  instrumentName: string;
  children: React.ReactNode;
  onMarkAsUsed?: () => void;
}

export function InstrumentCardContextMenu({
  instrumentId,
  instrumentName,
  children,
  onMarkAsUsed,
}: InstrumentCardContextMenuProps) {
  const { markAsUsed, deleteInstrument } = useInstrumentStore();
  const { openEditInstrument } = useUIStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleMarkAsUsed = () => {
    markAsUsed(instrumentId);
    onMarkAsUsed?.();
  };

  const handleEdit = () => {
    openEditInstrument(instrumentId);
  };

  const handleDelete = () => {
    deleteInstrument(instrumentId);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        {children}
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleMarkAsUsed}>
            <Star className="mr-2 h-4 w-4" />
            Mark as Used
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Instrument</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{instrumentName}</strong>? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
