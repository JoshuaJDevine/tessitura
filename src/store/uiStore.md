# uiStore

**Last Updated:** 2024-12-22 - Initial documentation

## Purpose

Zustand store managing UI state including search, filters, dialog visibility, and suggestions. This is the central store for all user interface state that doesn't belong to domain entities.

## Dependencies

- `zustand` - State management
- `@/types` - Category and Host type definitions

## Props/API

```typescript
interface UIStore {
  // Search and Filter State
  /** Current search query */
  searchQuery: string;
  /** Selected tag filters */
  selectedTags: string[];
  /** Selected category filters */
  selectedCategories: Category[];
  /** Selected host filters */
  selectedHosts: Host[];
  
  // Dialog State
  /** Whether add instrument dialog is open */
  isAddInstrumentOpen: boolean;
  /** Whether edit instrument dialog is open */
  isEditInstrumentOpen: boolean;
  /** ID of instrument being edited */
  editingInstrumentId: string | null;
  
  // Suggestion State
  /** ID of currently suggested instrument (from "Surprise Me") */
  suggestedInstrumentId: string | null;
  
  // Collection View State
  /** Collection view preferences (sort, density, selection) */
  collectionView: {
    /** Sort order for collection grid */
    sortBy: 'name' | 'recent' | 'category' | 'developer';
    /** Card size variant */
    viewDensity: 'compact' | 'spacious';
    /** IDs of currently selected cards (for future deck building) */
    selectedCardIds: string[];
  };
  
  // Actions
  setSearchQuery: (query: string) => void;
  toggleTag: (tag: string) => void;
  toggleCategory: (category: Category) => void;
  toggleHost: (host: Host) => void;
  clearFilters: () => void;
  openAddInstrument: () => void;
  closeAddInstrument: () => void;
  openEditInstrument: (id: string) => void;
  closeEditInstrument: () => void;
  setSuggestedInstrument: (id: string | null) => void;
  setCollectionSort: (sortBy: 'name' | 'recent' | 'category' | 'developer') => void;
  setViewDensity: (density: 'compact' | 'spacious') => void;
  toggleCardSelection: (id: string) => void;
  clearSelection: () => void;
}
```

## Usage Example

```tsx
import { useUIStore } from '@/store/uiStore';

function SearchBar() {
  const { searchQuery, setSearchQuery, clearFilters } = useUIStore();
  
  return (
    <div>
      <input 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search instruments..."
      />
      <button onClick={clearFilters}>Clear</button>
    </div>
  );
}

function FilterPanel() {
  const { selectedCategories, toggleCategory } = useUIStore();
  
  return (
    <div>
      {['Orchestral', 'Synth', 'Drums'].map(category => (
        <button
          key={category}
          onClick={() => toggleCategory(category)}
          className={selectedCategories.includes(category) ? 'active' : ''}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
```

## State Management

**Persistence:** Uses Zustand persist middleware with localStorage key `ui-storage` (includes collection view preferences).

**State Categories:**
1. **Search/Filter** - User's current filter selections
2. **Dialogs** - Which dialogs are open and their context
3. **Suggestions** - Highlighted suggested instrument
4. **Collection View** - Card collection UI preferences (sort, density, selection)

**Filter Behavior:**
- Filters are additive (AND logic within category, OR across categories)
- Toggle actions add/remove from selection
- Clear filters resets all to empty state

**Collection View State:**
- `sortBy`: Controls how instruments are sorted in the grid ('name', 'recent', 'category', 'developer')
- `viewDensity`: Controls card size ('compact' for 200×280px, 'spacious' for 250×350px)
- `selectedCardIds`: Array of instrument IDs that are currently selected (for future deck building)
- State persists across sessions via localStorage

## Collection View Methods

### setCollectionSort
Updates the sort order for the collection grid.

```typescript
setCollectionSort('name' | 'recent' | 'category' | 'developer')
```

**Options:**
- `'name'`: Alphabetical by instrument name (A-Z)
- `'recent'`: Newest instruments first (by createdAt metadata)
- `'category'`: Grouped by category, then alphabetical
- `'developer'`: Alphabetical by developer name

### setViewDensity
Updates the card size variant.

```typescript
setViewDensity('compact' | 'spacious')
```

**Options:**
- `'compact'`: Smaller cards (200×280px)
- `'spacious'`: Larger cards (250×350px)

### toggleCardSelection
Toggles a card's selection state. Used for multi-select functionality (future deck building).

```typescript
toggleCardSelection(id: string)
```

If the card is already selected, it's removed from selection. Otherwise, it's added.

### clearSelection
Clears all selected cards.

```typescript
clearSelection()
```

Resets `selectedCardIds` to an empty array.

## Related Components

- `FilterPanel` - Primary consumer of search/filter state
- `AddInstrument` - Uses dialog state
- `CollectionView` - Primary consumer of collection view state
- `CollectionHeader` - Uses collection view methods for sort/density controls
- `InstrumentCard` - Uses selection state for visual feedback

## Future Enhancements

- [ ] Filter presets/saved searches
- [ ] Recent searches history
- [ ] Advanced filter combinations (OR/AND logic)
- [ ] Filter by date added/last used
- [ ] Multi-select with Shift/Ctrl modifiers
- [ ] Bulk actions on selected cards
- [ ] Sort by usage count (most-used/least-used)

