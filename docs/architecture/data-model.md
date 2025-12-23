# Data Model Architecture

**Last Updated:** 2024-12-22 - Added Deck entity, updated for card collection pivot

## Overview

The application uses a flat, normalized data structure with relationships stored as ID references. All data is persisted to LocalStorage (with IndexedDB migration planned).

**Recent Changes (2024-12-22):**
- Added **Deck** entity (replaces Template and InstrumentGroup)
- Updated Instrument with enhanced usage tracking
- Removed position data (no longer needed without canvas)

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

### Deck (NEW - Replaces InstrumentGroup and Template)

Curated collection of instruments for specific workflows.

```typescript
interface Deck {
  id: string;
  name: string;                  // "Cinematic Scoring", "Electronic Production"
  description: string;           // Optional workflow description
  instruments: string[];         // Array of instrument IDs
  color: string;                 // Hex color for visual theming
  icon: string;                  // Emoji icon (🎹, 🎸, 🎺)
  tags: string[];                // User-defined tags
  metadata: {
    createdAt: Date;
    lastUsed?: Date;
    usageCount: number;          // How many times deck was "used"
  };
}
```

**Key Differences from Template/Group:**
- ✅ No position data (irrelevant without canvas)
- ✅ Usage tracking (like instruments)
- ✅ Icon emoji for visual identity
- ✅ Simplified, focused structure

**Storage:** `deck-storage` key in LocalStorage  
**Store:** `src/store/deckStore.ts`

### InstrumentGroup (LEGACY)

**Status:** ⚠️ Superseded by Deck

Visual grouping container for related instruments on canvas.

**Migration:** Converted to Deck on first app load after update.

### Template (LEGACY)

**Status:** ⚠️ Superseded by Deck

Reusable workflow configuration with canvas layout positions.

**Migration:** Converted to Deck (layout data dropped) on first app load.

## Relationships

### Pairings (Bidirectional)

When instrument A pairs with instrument B:
- A's `pairings` array contains B's ID
- B's `pairings` array contains A's ID
- Relationship is automatically bidirectional

**Implementation:** `createPairing()` in `instrumentStore.ts` enforces bidirectionality.

**Note:** Pairings are less prominent in card UI (no visual edges), but maintained for future features.

### Deck Membership

Decks contain references to instruments, but instruments don't reference decks (many-to-many relationship stored in deck only).

**Queries:**
- Find all decks for an instrument: `deckStore.getDecksForInstrument(instrumentId)`
- Find all instruments in deck: `deck.instruments` array

### Rarity (Computed)

Rarity is **not stored**, but computed from `metadata.usageCount`:

```typescript
function getRarity(usageCount: number): Rarity {
  if (usageCount >= 50) return 'legendary';
  if (usageCount >= 20) return 'epic';
  if (usageCount >= 5) return 'rare';
  return 'common';
}
```

**Rationale:** Keeps data normalized, ensures consistency, easy to adjust tiers.

## Data Flow (Updated for Card Collection)

1. **User Action** → Store method (e.g., `addInstrument()`, `createDeck()`)
2. **Store Update** → Zustand state change
3. **Persistence** → LocalStorage auto-save (via Zustand persist middleware)
4. **UI Update** → React re-renders collection grid
5. **Animation** → Card entrance/update animations play

## Persistence Strategy

### Current: LocalStorage

- **Format:** JSON serialization via Zustand persist middleware
- **Keys:** 
  - `instrument-storage` (active)
  - `deck-storage` (NEW - active)
  - `ui-storage` (active - filters, search, collection view state)
  - `group-storage` (legacy - migrated to decks)
  - `template-storage` (legacy - migrated to decks)
  - `canvas-storage` (legacy - ignored)
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
- `position`: `{ x: 0, y: 0 }` (kept for backward compatibility, not used in card UI)
- `pairings`: Empty array
- `color`: Based on category
- `metadata.usageCount`: 0
- `metadata.createdAt`: Current date

### New Deck Defaults

- `id`: Generated UUID
- `instruments`: Selected instrument IDs
- `color`: `#3b82f6` (default blue)
- `icon`: `🎹` (default keyboard emoji)
- `metadata.usageCount`: 0
- `metadata.createdAt`: Current date

## Migration Considerations

### Card Collection Migration (v2.0)

**From:** Canvas-based interface with Templates and Groups  
**To:** Card collection interface with Decks

**Migration Steps:**
1. Check if `template-storage` or `group-storage` exist
2. Convert Templates → Decks (drop `layout` field)
3. Convert Groups → Decks (already similar structure)
4. Save to `deck-storage`
5. Archive legacy data with `-backup` suffix
6. Show user notification about migration

**Migration Function:**
```typescript
function migrateToCards() {
  const templates = readFromStorage('template-storage');
  const groups = readFromStorage('group-storage');
  
  const decks = [
    ...templates.map(convertTemplateToDeck),
    ...groups.map(convertGroupToDeck),
  ];
  
  saveToStorage('deck-storage', { decks });
  archiveLegacyData(['template-storage', 'group-storage']);
  showMigrationToast();
}
```

### IndexedDB Migration (Future)

When migrating to IndexedDB:
1. Read all LocalStorage keys
2. Transform to IndexedDB objects
3. Batch insert
4. Verify data integrity
5. Clear LocalStorage after successful migration

**Triggers:**
- Library exceeds 500 instruments
- Performance degrades
- User opts in for better performance

