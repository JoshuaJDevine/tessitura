# ContextMenu

**Last Updated:** 2024-12-22 - Initial documentation

## Purpose

Right-click context menu for instrument nodes providing quick actions: edit, delete, create pairings, and mark as used. Integrates with multiple stores to perform operations.

## Dependencies

- `@/store/uiStore` - UI state for opening edit dialog
- `@/store/instrumentStore` - Instrument operations (delete, pairing, mark as used)
- `@/store/canvasStore` - Selected nodes for pairing creation
- `@/components/ui/dropdown-menu` - Radix UI dropdown menu primitives
- `lucide-react` - Icons for menu items

## Props/API

```typescript
interface ContextMenuProps {
  /** ID of the instrument this context menu is for */
  instrumentId: string;
  /** The trigger element (typically the instrument node) */
  children: React.ReactNode;
}
```

## Usage Example

```tsx
import { ContextMenu } from '@/components/ContextMenu';

<ContextMenu instrumentId={instrument.id}>
  <div className="instrument-node">
    {/* Node content */}
  </div>
</ContextMenu>
```

## State Management

No internal state. Reads from and dispatches to:
- `useUIStore` - Opens edit dialog
- `useInstrumentStore` - Performs instrument operations
- `useCanvasStore` - Gets selected nodes for pairing

## Related Components

- `InstrumentNode` - Uses this component for context menu
- `AddInstrument` - Edit dialog opened by this menu

## Future Enhancements

- [ ] Add to group action
- [ ] Duplicate instrument action
- [ ] Export/share instrument configuration
- [ ] Keyboard shortcuts for menu items

