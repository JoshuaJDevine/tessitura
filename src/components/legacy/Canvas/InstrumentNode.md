# InstrumentNode Component

**Last Updated:** 2024-12-19

## Purpose

Custom React Flow node component that displays an instrument/plugin as a visual card on the canvas. Shows instrument metadata, tags, host badge, and handles interactions.

## Dependencies

- `reactflow` - Node props and Handle components
- `@/types` - Instrument type definition
- `@/components/ui/badge` - Tag and host badges
- `@/components/ContextMenu` - Right-click menu
- `@/lib/utils` - `cn()` utility for className merging

## Usage

Registered as custom node type in React Flow:

```tsx
const nodeTypes = {
  instrument: InstrumentNode,
};
```

React Flow automatically renders this component for nodes with `type: 'instrument'`.

## Props

```typescript
NodeProps<InstrumentNodeData>
```

**InstrumentNodeData:**
```typescript
{
  instrument: Instrument;
  isHighlighted?: boolean;
  isSelected?: boolean;
}
```

## State

No local state - all data comes from props.

## Visual Design

### Layout
- **Header:** Host badge + instrument name
- **Developer:** Company/developer name
- **Tags:** Up to 3 tags displayed, "+N" for additional

### Styling
- Border color matches instrument's category color
- Selected state: Primary ring highlight
- Highlighted state: Yellow ring (for suggestions)
- Hover: Scale up and shadow increase

### Host Badge Colors
Each host has a distinct color scheme:
- Kontakt: Blue
- Standalone: Green
- VST3: Purple
- AU: Orange
- Soundbox: Cyan
- SINE: Yellow
- Opus: Pink
- Other: Gray

## Interactions

- **Click:** Handled by parent Canvas component (selection)
- **Right-click:** Opens context menu (via ContextMenu wrapper)
- **Drag:** Handled by React Flow (position updates saved to store)

## Handles

React Flow connection handles:
- **Top handle:** Target (incoming connections)
- **Bottom handle:** Source (outgoing connections)

## Memoization

Component is wrapped with `memo()` to prevent unnecessary re-renders when unrelated nodes change.

## Accessibility

- Semantic HTML structure
- Color contrast meets WCAG standards
- Keyboard navigation via React Flow

## Future Enhancements

- Expandable details on click
- Thumbnail/preview images
- Usage count indicator
- Last used date display





