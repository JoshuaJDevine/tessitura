# TemplateLibrary

**Last Updated:** 2024-12-22 - Initial documentation

## Purpose

UI for managing workflow templates. Allows users to save current instrument selections as reusable templates and load templates onto the canvas. Templates preserve instrument positions, pairings, and relationships.

## Dependencies

- `@/store/templateStore` - Template CRUD operations and loading
- `@/store/instrumentStore` - Instrument data for template creation
- `@/store/canvasStore` - Selected nodes for template creation
- `@/components/ui/button` - Button components
- `@/components/ui/dialog` - Dialog for template creation
- `@/components/ui/input` - Input for template name
- `@/components/ui/textarea` - Textarea for template description
- `@/components/ui/label` - Label components
- `@/components/ui/badge` - Badge for instrument counts
- `lucide-react` - Icons (Plus, Trash2, Play)

## Props/API

No props - component is self-contained.

## Usage Example

```tsx
import { TemplateLibrary } from '@/components/Sidebar/TemplateLibrary';

<Sidebar>
  <FilterPanel />
  <TemplateLibrary />
  <DirectoryScanner />
</Sidebar>
```

## State Management

**Local State:**
- `isCreateOpen` - Whether create template dialog is open
- `templateName` - Name input for new template
- `templateDescription` - Description input for new template

**Store Integration:**
- Reads templates from `useTemplateStore`
- Reads selected nodes from `useCanvasStore`
- Reads instrument data from `useInstrumentStore`

**Template Creation Process:**
1. Gets selected instruments from canvas
2. Calculates relative positions (offset from first instrument)
3. Extracts pairings between selected instruments
4. Removes duplicate pairings (bidirectional)
5. Saves template with name, description, instruments, pairings, and layout

## Related Components

- `Sidebar` - Parent container
- `templateStore` - Manages template data
- `Canvas` - Source of selected instruments
- `instrumentStore` - Provides instrument details

## Future Enhancements

- [ ] Template preview thumbnails
- [ ] Template categories/tags
- [ ] Template search and filtering
- [ ] Edit existing templates
- [ ] Duplicate templates
- [ ] Export/import templates (JSON)
- [ ] Community template sharing
- [ ] Template usage statistics

