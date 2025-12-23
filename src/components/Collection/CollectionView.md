# CollectionView

**Last Updated:** 2025-12-23 - Created for card collection interface

## Purpose

Main view component that replaces the canvas-based UI. Displays instruments as a responsive grid of cards with filtering, sorting, and empty states. This is the primary interface for browsing and managing instruments.

## Dependencies

- `@/store/instrumentStore` - Access to instrument data
- `@/store/uiStore` - Access to filters, search, and collection view state
- `./InstrumentCard` - Individual card component
- `./CollectionHeader` - Header with controls
- `@/components/ui/button` - Button component for empty state

## Props/API

No props - component is self-contained and reads from stores.

## Usage Example

```tsx
import { CollectionView } from '@/components/Collection/CollectionView';

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <CollectionView />
    </div>
  );
}
```

## Features

### Filtering

Applies filters from `uiStore`:
- **Search Query**: Filters by name, developer, or tags
- **Category Filter**: Shows only selected categories
- **Host Filter**: Shows only selected hosts

### Sorting

Sorts instruments based on `collectionView.sortBy`:
- **Name (A-Z)**: Alphabetical by instrument name
- **Recently Added**: Newest first (by createdAt metadata)
- **Category**: Grouped by category, then alphabetical
- **Developer**: Alphabetical by developer name

### Responsive Grid

Columns adjust based on viewport width:
- `< 1200px`: 3 columns
- `1200-1600px`: 4 columns
- `1600-2000px`: 5 columns
- `> 2000px`: 6 columns

Grid spacing: 24px gap, 32px padding around grid.

### Empty States

**No Instruments:**
- Large folder icon
- "No instruments yet" message
- "Scan Directories" button to trigger auto-scan

**No Matches:**
- Same icon/message but different text
- Suggests adjusting filters

## State Management

**Reads from stores:**
- `instrumentStore.instruments` - All instruments
- `uiStore.searchQuery` - Search filter
- `uiStore.selectedCategories` - Category filter
- `uiStore.selectedHosts` - Host filter
- `uiStore.collectionView.sortBy` - Sort order
- `uiStore.collectionView.viewDensity` - Card size
- `uiStore.collectionView.selectedCardIds` - Selected cards

**Actions:**
- `toggleCardSelection` - Toggle card selection on click

## Performance

- Uses `useMemo` for filtered/sorted list (only recomputes when dependencies change)
- CSS Grid for efficient layout
- No virtual scrolling needed for Phase 1 (< 500 plugins expected)
- If performance issues: Add react-window in Phase 2

## Related Components

- `InstrumentCard` - Individual card component
- `CollectionHeader` - Header with sort/view controls
- `DirectoryScanner` - Component that populates instruments

## Future Enhancements

- Virtual scrolling for 1000+ instruments
- Infinite scroll pagination
- Multi-select with Shift/Ctrl
- Bulk actions on selected cards
- Card grouping by category/developer
- Search highlights
- Grid/list view toggle

