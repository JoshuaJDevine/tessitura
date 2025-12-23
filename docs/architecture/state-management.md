# State Management Architecture

**Last Updated:** 2024-12-22 - Card collection pivot, added DeckStore

## Overview

The application uses Zustand for state management with a multi-store architecture. Each store manages a specific domain of state.

**⚠️ Major Changes (2024-12-22):**
- Added **DeckStore** (replaces TemplateStore and GroupStore)
- Updated **InstrumentStore** with usage tracking methods
- Updated **UIStore** for collection view state
- **CanvasStore** moved to legacy (kept for reference)

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
- `incrementUsage()` - **NEW:** Increment usage count and update lastUsed
- `getInstrumentsByRarity()` - **NEW:** Get instruments grouped by rarity tier
- `getRandomUnderused()` - **NEW:** Get random instruments with low usage for discovery

**Persistence:** LocalStorage key `instrument-storage`

### DeckStore (NEW)

**File:** `src/store/deckStore.ts`  
**Purpose:** Manages instrument decks (curated collections for specific workflows)

**Status:** ✅ Active (Replaces TemplateStore and GroupStore)

**State:**
```typescript
{
  decks: Deck[]
  activeDeckId: string | null
}
```

**Actions:**
- `createDeck()` - Create new deck
- `updateDeck()` - Update existing deck
- `deleteDeck()` - Delete deck
- `addInstrumentsToDeck()` - Add instruments to deck
- `removeInstrumentFromDeck()` - Remove instrument from deck
- `setActiveDeck()` - Set currently active deck
- `useDeck()` - Mark deck as used (increment usage count, update lastUsed)
- `getDeckById()` - Get deck by ID
- `getDecksForInstrument()` - Get all decks containing an instrument

**Persistence:** LocalStorage key `deck-storage`

### CanvasStore (LEGACY)

**File:** `src/store/canvasStore.ts`  
**Purpose:** Managed React Flow canvas state (nodes, edges, selection)

**Status:** ⚠️ Legacy (Moved to `legacy/canvasStore.ts`, kept for reference)

**Note:** Canvas interface replaced by card-based collection view. Store kept for historical reference and potential future spatial features.

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
  collectionView: {
    sortBy: 'name' | 'recent' | 'most-used' | 'least-used' | 'category'
    viewDensity: 'compact' | 'spacious'
    selectedCardIds: string[]
  }
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
- `setCollectionSort()` - **NEW:** Set sort order for collection view
- `setViewDensity()` - **NEW:** Set card density (compact/spacious)
- `toggleCardSelection()` - **NEW:** Toggle card selection state
- `clearSelection()` - **NEW:** Clear all selected cards

**Persistence:** LocalStorage key `ui-storage` (includes collection view preferences)

### GroupStore (LEGACY)

**File:** `legacy/groupStore.ts`  
**Purpose:** Managed instrument groups (visual containers on canvas)

**Status:** ⚠️ Superseded by DeckStore

**Persistence:** LocalStorage key `group-storage` (will be migrated to decks)

### TemplateStore (LEGACY)

**File:** `legacy/templateStore.ts`  
**Purpose:** Managed workflow templates (saved canvas layouts)

**Status:** ⚠️ Superseded by DeckStore

**Persistence:** LocalStorage key `template-storage` (will be migrated to decks)

## State Flow

### Adding an Instrument (Updated for Card Collection)

```
User fills form → AddInstrument.tsx
  ↓
instrumentStore.addInstrument()
  ↓
Zustand state update
  ↓
LocalStorage persistence (auto)
  ↓
CollectionView.tsx re-renders
  ↓
New InstrumentCard appears in grid
  ↓
"Card pack opening" animation plays
```

### Creating a Deck (New Flow)

```
User selects multiple cards → InstrumentCard (selection mode)
  ↓
uiStore.toggleCardSelection(id) for each card
  ↓
"Create Deck" button appears (2+ selected)
  ↓
User clicks "Create Deck"
  ↓
deckStore.createDeck({ name, instruments: selectedIds })
  ↓
Zustand state update + LocalStorage persistence
  ↓
Sidebar.tsx DeckLibrary section updates
  ↓
New deck appears in sidebar list
```

### Using an Instrument (Updated with Usage Tracking)

```
User double-clicks card → InstrumentCard
  ↓
instrumentStore.incrementUsage(id)
  ↓
usageCount++, lastUsed = now
  ↓
Rarity tier recalculated
  ↓
Card visual effect updates (e.g., Common → Rare → Epic → Legendary)
  ↓
UI re-renders with new shimmer/glow effect
```

### Discovery Flow (New - "Surprise Me")

```
User clicks "Surprise Me" → CollectionHeader
  ↓
instrumentStore.getRandomUnderused(3)
  ↓
Filters to instruments with usageCount < 5
  ↓
Selects 3 random instruments
  ↓
DiscoveryModal opens with spotlight cards
  ↓
User can "Add to New Deck" or "Not Interested"
  ↓
If "Add to New Deck": deckStore.createDeck()
```

### Filtering (Updated for Collection View)

```
User changes filter → FilterPanel.tsx
  ↓
uiStore.toggleTag() / toggleCategory() / etc.
  ↓
CollectionView.tsx reads filters from uiStore
  ↓
Cards filtered based on criteria
  ↓
Stagger animation for remaining cards
  ↓
UI updates with smooth transitions
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

