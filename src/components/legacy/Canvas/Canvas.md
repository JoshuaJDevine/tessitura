# Canvas Component

**Last Updated:** 2024-12-19

## Purpose

Main canvas component that renders the infinite spatial canvas using React Flow. Displays instruments as nodes with connections, handles filtering, selection, and interaction.

## Dependencies

- `reactflow` - Canvas library
- `@/store/canvasStore` - Canvas state management
- `@/store/instrumentStore` - Instrument data
- `@/store/groupStore` - Group data
- `@/store/uiStore` - Filter/search state
- `@/components/Canvas/InstrumentNode` - Custom node component
- `@/components/Canvas/GroupNode` - Group node component

## Usage

```tsx
import { Canvas } from '@/components/Canvas/Canvas';

<Canvas />
```

The canvas automatically syncs with instrument and group stores, applies filters, and handles user interactions.

## State

### Managed State (via stores)
- **Nodes:** React Flow nodes derived from instruments and groups
- **Edges:** Connection lines between paired instruments
- **Selection:** Selected node IDs
- **Filters:** Applied via UIStore (search, tags, categories, hosts)

### Local State
- Filtered nodes (computed from filters)
- Highlighted edges (based on selection)

## Props

None - component is self-contained and reads from stores.

## Key Features

### Filtering
Nodes are filtered based on:
- Search query (name, developer, category)
- Selected tags
- Selected categories
- Selected hosts

Filtered nodes are hidden (not removed) to preserve positions.

### Selection
- Click node → selects node and highlights connected nodes
- Selected nodes show ring highlight
- Connected edges are highlighted

### Drag & Drop
- Nodes can be dragged on canvas
- Position updates are saved to instrument store
- Groups can be dragged (moves all contained instruments)

### Highlighting
- Suggested instruments (from "Surprise Me") are highlighted with yellow ring
- Connected nodes are highlighted when one is selected

## Event Handlers

- `onNodesChange` - React Flow node changes (drag, select, etc.)
- `onEdgesChange` - React Flow edge changes
- `onConnect` - New connection created
- `onNodeDragStop` - Save position when drag ends
- `onNodeClick` - Handle selection and highlighting

## React Flow Features Used

- **Background** - Grid pattern
- **Controls** - Zoom/pan controls
- **MiniMap** - Navigation minimap
- **Custom Node Types** - `instrument` and `group` types

## Performance

- Nodes are memoized to prevent unnecessary re-renders
- Filtering uses `useMemo` for computed values
- React Flow handles efficient rendering of large node counts

## Future Enhancements

- Undo/redo for canvas operations
- Multi-select with selection box
- Keyboard navigation (arrow keys)
- Zoom to fit selected nodes


