import { useState, useEffect } from 'react';
import { useInstrumentStore } from '@/store/instrumentStore';
import { useUIStore } from '@/store/uiStore';
import { Host, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

const HOSTS: Host[] = ['Kontakt', 'Standalone', 'VST3', 'AU', 'Soundbox', 'SINE', 'Opus', 'Other'];
const CATEGORIES: Category[] = ['Orchestral', 'Synth', 'Drums', 'Effects', 'Keys', 'World', 'Vocal', 'Other'];
const COMMON_TAGS = ['GO-TO', 'Hidden Gem', 'Specialty', 'Lo-Fi', 'Experimental', 'Cinematic', 'Ambient'];

export function AddInstrument() {
  const { isAddInstrumentOpen, isEditInstrumentOpen, editingInstrumentId, closeAddInstrument, closeEditInstrument } = useUIStore();
  const { addInstrument, updateInstrument, getInstrument } = useInstrumentStore();
  
  const editingInstrument = editingInstrumentId ? getInstrument(editingInstrumentId) : null;
  const isOpen = isAddInstrumentOpen || isEditInstrumentOpen;

  const [formData, setFormData] = useState({
    name: editingInstrument?.name || '',
    developer: editingInstrument?.developer || '',
    host: (editingInstrument?.host || 'Other') as Host,
    category: (editingInstrument?.category || 'Other') as Category,
    tags: editingInstrument?.tags || [] as string[],
    notes: editingInstrument?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingInstrument) {
      updateInstrument(editingInstrument.id, formData);
      closeEditInstrument();
    } else {
      addInstrument(formData);
      closeAddInstrument();
    }
    
    // Reset form
    setFormData({
      name: '',
      developer: '',
      host: 'Other',
      category: 'Other',
      tags: [],
      notes: '',
    });
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleClose = () => {
    if (isEditInstrumentOpen) {
      closeEditInstrument();
    } else {
      closeAddInstrument();
    }
    setFormData({
      name: '',
      developer: '',
      host: 'Other',
      category: 'Other',
      tags: [],
      notes: '',
    });
  };

  // Update form when editing instrument changes
  useEffect(() => {
    if (editingInstrument) {
      setFormData({
        name: editingInstrument.name,
        developer: editingInstrument.developer,
        host: editingInstrument.host,
        category: editingInstrument.category,
        tags: editingInstrument.tags,
        notes: editingInstrument.notes,
      });
    }
  }, [editingInstrument]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingInstrument ? 'Edit Instrument' : 'Add New Instrument'}</DialogTitle>
          <DialogDescription>
            {editingInstrument
              ? 'Update the instrument details below.'
              : 'Add a new instrument or plugin to your library.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., BBC Symphony Orchestra"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="developer">Developer/Company *</Label>
            <Input
              id="developer"
              value={formData.developer}
              onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
              required
              placeholder="e.g., Spitfire Audio"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Select
                value={formData.host}
                onValueChange={(value) => setFormData({ ...formData, host: value as Host })}
              >
                <SelectTrigger id="host">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOSTS.map((host) => (
                    <SelectItem key={host} value={host}>
                      {host}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_TAGS.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={formData.tags.includes(tag)}
                    onCheckedChange={() => toggleTag(tag)}
                  />
                  <Label htmlFor={`tag-${tag}`} className="text-sm font-normal cursor-pointer">
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Personal reminders, use cases, etc."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{editingInstrument ? 'Update' : 'Add'} Instrument</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

