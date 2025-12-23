# CanvasStore

**Last Updated:** 2024-12-19

## Purpose

Zustand store that manages React Flow canvas state. Handles nodes, edges, selection, and synchronization with instrument/group data.

## Dependencies

- `zustand` - State management
- `reactflow` - Node, Edge, Connection types

## Usage

```tsx
import { useCanvasStore } from '@/store/canvasStore';

const { nodes, edges, onNodesChange, syncWithInstruments } = useCanvasStore();
```

## State

```typescript
{
  nodes: Node[]
  edges: Edge[]
  selectedNodeIds: string[]
}
```

## Actions

### `onNodesChange(changes)`

Handles React Flow node change events (drag, select, etc.).

**Parameters:**
- `changes: NodeChange[]` - React Flow node changes

**Behavior:**
- Applies changes to nodes array
- Updates node positions, selection, etc.

### `onEdgesChange(changes)`

Handles React Flow edge change events.

**Parameters:**
- `changes: EdgeChange[]` - React Flow edge changes

### `onConnect(connection)`

Handles new connection creation.

**Parameters:**
- `connection: Connection` - React Flow connection object

**Behavior:**
- Creates new edge between source and target nodes
- Prevents duplicate edges

### `setSelectedNodeIds(ids)`

Updates selected node IDs.

**Parameters:**
- `ids: string[]` - Array of selected node IDs

### `updateNodePosition(id, position)`

Updates a node's position.

**Parameters:**
- `id: string` - Node ID
- `position: { x: number; y: number }` - New position

### `syncWithInstruments(instruments)`

Synchronizes canvas nodes and edges from instrument data.

**Parameters:**
- `instruments: Instrument[]` - Array of instruments

**Behavior:**
1. Creates nodes from instruments
2. Creates edges from instrument pairings
3. Prevents duplicate edges (only creates edge once per pair)

### `syncWithGroups(groups)`

Synchronizes group nodes from group data.

**Parameters:**
- `groups: InstrumentGroup[]` - Array of groups

**Behavior:**
- Creates group nodes
- Preserves existing instrument nodes
- Merges with current nodes

### `getConnectedNodeIds(nodeId)`

Gets all node IDs connected to a given node.

**Parameters:**
- `nodeId: string` - Node ID

**Returns:** `string[]` - Array of connected node IDs

## Data Flow

1. Instruments change → `syncWithInstruments()` called
2. Nodes and edges created/updated
3. React Flow renders changes
4. User interactions → `onNodesChange()` / `onEdgesChange()`
5. State updates → React Flow re-renders

## Edge Creation Logic

Edges are created from instrument pairings:
- Only one edge per pair (checks `inst.id < pairId` to avoid duplicates)
- Edge ID format: `e{id1}-{id2}`

## Persistence

**No persistence** - Canvas state is derived from instruments and groups, which are persisted separately.

## Performance

- React Flow handles efficient rendering
- Node changes are batched
- Edge creation is O(n²) worst case but acceptable for <1000 instruments

## Future Enhancements

- Undo/redo stack
- Viewport state persistence
- Layout algorithms (force-directed, grid, etc.)
- Multi-select with selection box

