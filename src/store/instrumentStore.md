# InstrumentStore

**Last Updated:** 2024-12-19

## Purpose

Zustand store that manages all instrument/plugin data. Handles CRUD operations, pairings, usage tracking, and persistence.

## Dependencies

- `zustand` - State management
- `zustand/middleware` - Persist middleware
- `@/types` - Instrument type definition

## Usage

```tsx
import { useInstrumentStore } from '@/store/instrumentStore';

const { instruments, addInstrument, updateInstrument } = useInstrumentStore();
```

## State

```typescript
{
  instruments: Instrument[]
}
```

## Actions

### `addInstrument(instrumentData)`

Creates a new instrument with auto-generated ID, position, and metadata.

**Parameters:**
```typescript
Omit<Instrument, 'id' | 'metadata' | 'position'>
```

**Behavior:**
- Generates UUID for `id`
- Random position (0-800, 0-600)
- Sets color based on category
- Initializes metadata (createdAt, usageCount: 0)
- Adds to instruments array

### `updateInstrument(id, updates)`

Updates an existing instrument with partial data.

**Parameters:**
- `id: string` - Instrument ID
- `updates: Partial<Instrument>` - Fields to update

**Behavior:**
- Finds instrument by ID
- Merges updates
- Preserves existing fields

### `deleteInstrument(id)`

Deletes an instrument and removes all pairings.

**Behavior:**
- Removes instrument from array
- Removes instrument ID from all other instruments' pairings arrays
- Cleans up relationships

### `getInstrument(id)`

Retrieves an instrument by ID.

**Returns:** `Instrument | undefined`

### `createPairing(id1, id2)`

Creates a bidirectional pairing between two instruments.

**Behavior:**
- Adds id2 to id1's pairings array
- Adds id1 to id2's pairings array
- Prevents self-pairing
- Prevents duplicate pairings

### `removePairing(id1, id2)`

Removes a pairing between two instruments (bidirectional).

**Behavior:**
- Removes id2 from id1's pairings
- Removes id1 from id2's pairings

### `markAsUsed(id)`

Updates usage metadata for an instrument.

**Behavior:**
- Sets `lastUsed` to current date
- Increments `usageCount`

## Persistence

**Storage Key:** `instrument-storage`  
**Format:** JSON in LocalStorage  
**Auto-save:** On every state change (via Zustand persist middleware)

## Default Colors

Category-based default colors:
```typescript
{
  Orchestral: '#3b82f6',
  Synth: '#8b5cf6',
  Drums: '#ef4444',
  Effects: '#10b981',
  Keys: '#f59e0b',
  World: '#ec4899',
  Vocal: '#06b6d4',
  Other: '#6b7280',
}
```

## Data Flow

1. User action → Store method called
2. Zustand updates state
3. Persist middleware saves to LocalStorage
4. Components re-render (if subscribed)
5. Canvas syncs nodes (via useEffect in Canvas.tsx)

## Performance

- Shallow equality checks prevent unnecessary re-renders
- Array operations are O(n) but acceptable for <1000 instruments
- Persistence is synchronous (LocalStorage) but fast

## Future Enhancements

- Batch operations (add multiple instruments)
- Import/export functionality
- Version history
- IndexedDB migration for better performance


