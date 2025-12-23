# templateStore

**Last Updated:** 2024-12-22 - Initial documentation

## Purpose

Zustand store managing workflow templates. Templates save instrument configurations, positions, and pairings for quick setup of common instrument combinations (e.g., "Epic Orchestral", "Lo-Fi Hip Hop").

## Dependencies

- `zustand` - State management
- `zustand/middleware` - Persist middleware for localStorage
- `@/types` - Template type definition
- `@/store/instrumentStore` - For creating instruments and pairings when loading templates
- `@/store/canvasStore` - For positioning instruments when loading templates

## Props/API

```typescript
interface TemplateStore {
  /** All saved templates */
  templates: Template[];
  
  /** Create a new template */
  addTemplate: (template: Omit<Template, 'id'>) => void;
  
  /** Update template properties */
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  
  /** Delete a template */
  deleteTemplate: (id: string) => void;
  
  /** Get a single template by ID */
  getTemplate: (id: string) => Template | undefined;
  
  /** Load a template onto the canvas */
  loadTemplate: (id: string) => void;
}
```

## Usage Example

```tsx
import { useTemplateStore } from '@/store/templateStore';
import { useCanvasStore } from '@/store/canvasStore';

function TemplateManager() {
  const { templates, addTemplate, loadTemplate } = useTemplateStore();
  const { selectedNodeIds } = useCanvasStore();
  
  const handleSaveTemplate = () => {
    addTemplate({
      name: 'Epic Orchestral',
      description: 'BBC SO + Time Textures + Reverb',
      instruments: selectedNodeIds,
      pairings: [
        { from: 'id1', to: 'id2' }
      ],
      layout: {
        'id1': { x: 0, y: 0 },
        'id2': { x: 200, y: 0 },
      },
    });
  };
  
  return (
    <div>
      {templates.map(template => (
        <button key={template.id} onClick={() => loadTemplate(template.id)}>
          {template.name}
        </button>
      ))}
    </div>
  );
}
```

## State Management

**Persistence:** LocalStorage via Zustand persist middleware
**Storage Key:** `template-storage`

**State Structure:**
- `templates` - Array of Template objects
- Each template contains: name, description, instrument IDs, pairings, and layout positions

**Load Template Operation:**
1. Retrieves template by ID
2. Creates instruments from template data (placeholder implementation)
3. Creates pairings between instruments
4. Positions instruments relative to viewport center

## Related Components

- `TemplateLibrary` - UI for managing and loading templates
- `instrumentStore` - Creates instruments and pairings when loading
- `canvasStore` - Positions instruments when loading

## Future Enhancements

- [ ] Store full instrument data in templates (not just IDs)
- [ ] Template categories/tags
- [ ] Template sharing/export
- [ ] Template preview thumbnails
- [ ] Community template library
- [ ] Smart viewport centering when loading

