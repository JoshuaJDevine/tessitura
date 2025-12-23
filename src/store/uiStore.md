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

**No persistence** - UI state is ephemeral and resets on page reload.

**State Categories:**
1. **Search/Filter** - User's current filter selections
2. **Dialogs** - Which dialogs are open and their context
3. **Suggestions** - Highlighted suggested instrument

**Filter Behavior:**
- Filters are additive (AND logic within category, OR across categories)
- Toggle actions add/remove from selection
- Clear filters resets all to empty state

## Related Components

- `FilterPanel` - Primary consumer of search/filter state
- `AddInstrument` - Uses dialog state
- `Canvas` - Reads filters to hide/show nodes
- `InstrumentNode` - Reads suggestion state for highlighting

## Future Enhancements

- [ ] Persist filter preferences to localStorage
- [ ] Filter presets/saved searches
- [ ] Recent searches history
- [ ] Advanced filter combinations (OR/AND logic)
- [ ] Filter by date added/last used

