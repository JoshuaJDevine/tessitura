# State Management Architecture

**Last Updated:** 2024-12-19

## Overview

The application uses Zustand for state management with a multi-store architecture. Each store manages a specific domain of state.

## Store Architecture

### InstrumentStore

**File:** `src/store/instrumentStore.ts`  
**Purpose:** Manages all instrument data (CRUD operations, pairings, usage tracking)

**State:**
```typescript
{
  instruments: Instrument[]
}
```

**Actions:**
- `addInstrument()` - Create new instrument
- `updateInstrument()` - Update existing instrument
- `deleteInstrument()` - Delete instrument (removes pairings)
- `getInstrument()` - Get instrument by ID
- `createPairing()` - Create bidirectional pairing
- `removePairing()` - Remove pairing
- `markAsUsed()` - Update usage metadata

**Persistence:** LocalStorage key `instrument-storage`

### CanvasStore

**File:** `src/store/canvasStore.ts`  
**Purpose:** Manages React Flow canvas state (nodes, edges, selection)

**State:**
```typescript
{
  nodes: Node[]
  edges: Edge[]
  selectedNodeIds: string[]
}
```

**Actions:**
- `onNodesChange()` - Handle React Flow node changes
- `onEdgesChange()` - Handle React Flow edge changes
- `onConnect()` - Handle new connections
- `setSelectedNodeIds()` - Update selection
- `updateNodePosition()` - Update node position
- `syncWithInstruments()` - Sync nodes from instruments
- `syncWithGroups()` - Sync group nodes
- `getConnectedNodeIds()` - Get connected node IDs

**Persistence:** None (derived from instruments)

### UIStore

**File:** `src/store/uiStore.ts`  
**Purpose:** Manages UI state (filters, modals, search)

**State:**
```typescript
{
  searchQuery: string
  selectedTags: string[]
  selectedCategories: Category[]
  selectedHosts: Host[]
  isAddInstrumentOpen: boolean
  isEditInstrumentOpen: boolean
  editingInstrumentId: string | null
  suggestedInstrumentId: string | null
}
```

**Actions:**
- `setSearchQuery()` - Update search query
- `toggleTag()` - Toggle tag filter
- `toggleCategory()` - Toggle category filter
- `toggleHost()` - Toggle host filter
- `clearFilters()` - Clear all filters
- `openAddInstrument()` / `closeAddInstrument()` - Modal control
- `openEditInstrument()` / `closeEditInstrument()` - Edit modal control
- `setSuggestedInstrument()` - Set highlighted suggestion

**Persistence:** Optional (can persist filters)

### GroupStore

**File:** `src/store/groupStore.ts`  
**Purpose:** Manages instrument groups

**State:**
```typescript
{
  groups: InstrumentGroup[]
}
```

**Actions:**
- `addGroup()` - Create new group
- `updateGroup()` - Update group
- `deleteGroup()` - Delete group
- `getGroup()` - Get group by ID
- `toggleGroupCollapse()` - Toggle collapse state
- `addInstrumentToGroup()` - Add instrument to group
- `removeInstrumentFromGroup()` - Remove instrument from group

**Persistence:** LocalStorage key `group-storage`

### TemplateStore

**File:** `src/store/templateStore.ts`  
**Purpose:** Manages workflow templates

**State:**
```typescript
{
  templates: Template[]
}
```

**Actions:**
- `addTemplate()` - Create template from selection
- `updateTemplate()` - Update template
- `deleteTemplate()` - Delete template
- `getTemplate()` - Get template by ID
- `loadTemplate()` - Load template onto canvas

**Persistence:** LocalStorage key `template-storage`

## State Flow

### Adding an Instrument

```
User fills form → AddInstrument.tsx
  ↓
instrumentStore.addInstrument()
  ↓
Zustand state update
  ↓
LocalStorage persistence (auto)
  ↓
Canvas sync (useEffect in Canvas.tsx)
  ↓
React Flow nodes update
  ↓
UI re-renders
```

### Creating a Pairing

```
User selects nodes → ContextMenu
  ↓
instrumentStore.createPairing(id1, id2)
  ↓
Both instruments' pairings arrays updated
  ↓
Canvas sync detects new pairings
  ↓
React Flow edge created
  ↓
UI updates with connection line
```

### Filtering

```
User changes filter → FilterPanel.tsx
  ↓
uiStore.toggleTag() / toggleCategory() / etc.
  ↓
Canvas.tsx reads filters from uiStore
  ↓
Nodes filtered based on criteria
  ↓
Hidden nodes removed from view
  ↓
UI updates
```

## Persistence Strategy

### Zustand Persist Middleware

All stores use Zustand's `persist` middleware for automatic LocalStorage sync:

```typescript
persist(
  (set, get) => ({ /* store */ }),
  {
    name: 'storage-key',
    storage: createJSONStorage(() => localStorage),
  }
)
```

### Serialization

- Dates are serialized as ISO strings
- Zustand handles JSON.stringify/parse automatically
- Custom serialization via `partialize` option if needed

## Performance Considerations

### Memoization

- React Flow nodes memoized with `memo()`
- Filtered nodes computed with `useMemo()`
- Store selectors can be optimized with Zustand's shallow comparison

### Updates

- Stores update only changed data (Zustand's shallow equality)
- Canvas syncs only when instruments change (useEffect dependencies)
- React Flow handles node/edge diffing internally

## Testing Strategy

- Store actions can be tested in isolation
- Mock stores for component testing
- Integration tests for state flow

