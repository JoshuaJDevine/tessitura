# InstrumentCardContextMenu

**Last Updated:** 2025-12-24 - Created for interactive cards with context menu actions

## Purpose

Provides a right-click context menu for instrument cards with actions to mark as used, edit, and delete instruments. Uses shadcn/ui DropdownMenu for accessibility and consistent styling.

## Dependencies

- `@/components/ui/dropdown-menu` - DropdownMenu components from shadcn/ui
- `@/components/ui/dialog` - Dialog for delete confirmation
- `@/components/ui/button` - Button component
- `lucide-react` - Icons (Star, Pencil, Trash2, Info)
- `@/store/instrumentStore` - `markAsUsed`, `deleteInstrument` actions
- `@/store/uiStore` - `openEditInstrument` action

## Props/API

```typescript
interface InstrumentCardContextMenuProps {
  instrumentId: string;           // ID of the instrument
  instrumentName: string;          // Name for delete confirmation dialog
  children: React.ReactNode;        // Trigger element (usually DropdownMenuTrigger)
  onMarkAsUsed?: () => void;       // Optional callback after marking as used
}
```

## Usage Example

```tsx
import { InstrumentCardContextMenu } from '@/components/Collection/InstrumentCardContextMenu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function MyComponent() {
  return (
    <InstrumentCardContextMenu
      instrumentId={instrument.id}
      instrumentName={instrument.name}
      onMarkAsUsed={() => {
        // Optional: Show toast, update UI, etc.
      }}
    >
      <DropdownMenuTrigger asChild>
        <div>Right-click me</div>
      </DropdownMenuTrigger>
    </InstrumentCardContextMenu>
  );
}
```

## Menu Actions

1. **Mark as Used** - Calls `markAsUsed(instrumentId)` and optional callback
2. **Edit** - Opens edit dialog via `openEditInstrument(instrumentId)`
3. **Delete** - Shows confirmation dialog, then calls `deleteInstrument(instrumentId)`

## Delete Confirmation

The component includes a confirmation dialog before deleting to prevent accidental deletions. The dialog:
- Shows the instrument name
- Requires explicit confirmation
- Cannot be undone once confirmed

## Accessibility

- Uses Radix UI primitives (accessible by default)
- Keyboard navigation support
- Screen reader announcements
- Focus management

## Related Components

- `InstrumentCard` - Wraps cards with this context menu
- `instrumentStore` - Provides `markAsUsed` and `deleteInstrument` actions
- `uiStore` - Provides `openEditInstrument` action

## Future Enhancements

- "View Details" menu item (shows full instrument info modal)
- Keyboard shortcut hints in menu items
- Bulk actions (mark multiple as used)

