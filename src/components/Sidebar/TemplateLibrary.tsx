import { useTemplateStore } from '@/store/templateStore';
import { useInstrumentStore } from '@/store/instrumentStore';
import { useCanvasStore } from '@/store/canvasStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Play } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export function TemplateLibrary() {
  const { templates, addTemplate, deleteTemplate, loadTemplate } = useTemplateStore();
  const { instruments } = useInstrumentStore();
  const { selectedNodeIds } = useCanvasStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const handleCreateTemplate = () => {
    if (!templateName.trim()) return;

    const selectedInstruments = instruments.filter((inst) =>
      selectedNodeIds.includes(inst.id)
    );

    if (selectedInstruments.length === 0) {
      alert('Please select at least one instrument to create a template');
      return;
    }

    // Get relative positions
    const firstPos = selectedInstruments[0].position;
    const layout: Record<string, { x: number; y: number }> = {};
    selectedInstruments.forEach((inst) => {
      layout[inst.id] = {
        x: inst.position.x - firstPos.x,
        y: inst.position.y - firstPos.y,
      };
    });

    // Get pairings between selected instruments
    const pairings = selectedInstruments.flatMap((inst) =>
      inst.pairings
        .filter((pairId) => selectedInstruments.some((i) => i.id === pairId))
        .map((pairId) => ({ from: inst.id, to: pairId }))
    );

    // Remove duplicates
    const uniquePairings = pairings.filter(
      (p, index, self) =>
        index === self.findIndex((t) => (t.from === p.from && t.to === p.to) || (t.from === p.to && t.to === p.from))
    );

    addTemplate({
      name: templateName,
      description: templateDescription,
      tags: [],
      instruments: selectedInstruments.map((inst) => inst.id),
      pairings: uniquePairings,
      layout,
    });

    setTemplateName('');
    setTemplateDescription('');
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-2 border-t p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Templates</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          disabled={selectedNodeIds.length === 0}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {templates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No templates yet</p>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between rounded border p-2 hover:bg-accent"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{template.name}</p>
                <p className="text-xs text-muted-foreground">
                  {template.instruments.length} instruments
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => loadTemplate(template.id)}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm('Delete this template?')) {
                      deleteTemplate(template.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Template</DialogTitle>
            <DialogDescription>
              Save the current selection as a reusable template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Name *</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Epic Orchestral"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-desc">Description</Label>
              <Textarea
                id="template-desc"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Template description..."
                rows={3}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Selected: {selectedNodeIds.length} instrument(s)
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate} disabled={!templateName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

