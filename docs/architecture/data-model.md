# Data Model Architecture

**Last Updated:** 2024-12-19

## Overview

The application uses a flat, normalized data structure with relationships stored as ID references. All data is persisted to LocalStorage (with IndexedDB migration planned).

## Core Entities

### Instrument

The primary entity representing a music plugin or sample library.

```typescript
interface Instrument {
  id: string;                    // UUID
  name: string;                  // Display name
  developer: string;             // Company/developer name
  host: Host;                    // Plugin host (Kontakt, VST3, etc.)
  category: Category;            // Instrument category
  tags: string[];                // User-defined tags (GO-TO, Hidden Gem, etc.)
  notes: string;                 // User notes/reminders
  position: { x: number; y: number };  // Canvas position
  pairings: string[];             // Array of instrument IDs (bidirectional)
  color: string;                 // Hex color for visual grouping
  metadata: {
    createdAt: Date;
    lastUsed?: Date;
    usageCount: number;
  };
}
```

**Storage:** `instrument-storage` key in LocalStorage  
**Store:** `src/store/instrumentStore.ts`

### InstrumentGroup

Visual grouping container for related instruments.

```typescript
interface InstrumentGroup {
  id: string;
  name: string;
  description: string;
  instruments: string[];         // Array of instrument IDs
  position: { x: number; y: number };
  color: string;
  collapsed: boolean;
}
```

**Storage:** `group-storage` key in LocalStorage  
**Store:** `src/store/groupStore.ts`

### Template

Reusable workflow configuration for instrument clusters.

```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  instruments: string[];         // Array of instrument IDs
  pairings: Array<{ from: string; to: string; note?: string }>;
  layout: Record<string, { x: number; y: number }>;  // Relative positions
}
```

**Storage:** `template-storage` key in LocalStorage  
**Store:** `src/store/templateStore.ts`

## Relationships

### Pairings (Bidirectional)

When instrument A pairs with instrument B:
- A's `pairings` array contains B's ID
- B's `pairings` array contains A's ID
- React Flow edge is created between nodes
- Relationship is automatically bidirectional

**Implementation:** `createPairing()` in `instrumentStore.ts` enforces bidirectionality.

### Groups

Groups contain references to instruments, but instruments don't reference groups (many-to-many relationship stored in group only).

## Data Flow

1. **User Action** → Store method (e.g., `addInstrument()`)
2. **Store Update** → Zustand state change
3. **Persistence** → LocalStorage auto-save (via Zustand persist middleware)
4. **Canvas Sync** → `syncWithInstruments()` updates React Flow nodes
5. **UI Update** → React re-renders

## Persistence Strategy

### Current: LocalStorage

- **Format:** JSON serialization via Zustand persist middleware
- **Keys:** 
  - `instrument-storage`
  - `group-storage`
  - `template-storage`
  - `ui-storage` (filters, search state)
- **Limitations:** 5-10MB limit, synchronous, no queries

### Future: IndexedDB Migration

Planned for Phase 4 when:
- Library exceeds 500+ instruments
- Complex queries needed (e.g., "all Kontakt instruments never used")
- Performance becomes critical

## Data Validation

- **Type Safety:** TypeScript interfaces enforce structure
- **Runtime:** Zustand stores validate on set
- **UI:** Form validation in `AddInstrument.tsx`

## Default Values

### Category Colors

```typescript
const defaultColors = {
  Orchestral: '#3b82f6',
  Synth: '#8b5cf6',
  Drums: '#ef4444',
  Effects: '#10b981',
  Keys: '#f59e0b',
  World: '#ec4899',
  Vocal: '#06b6d4',
  Other: '#6b7280',
};
```

### New Instrument Defaults

- `id`: Generated UUID
- `position`: Random position (0-800, 0-600)
- `pairings`: Empty array
- `color`: Based on category
- `metadata.usageCount`: 0
- `metadata.createdAt`: Current date

## Migration Considerations

When migrating to IndexedDB:
1. Read all LocalStorage keys
2. Transform to IndexedDB objects
3. Batch insert
4. Verify data integrity
5. Clear LocalStorage after successful migration

