# CollectionHeader

**Last Updated:** 2025-12-23 - Created for card collection interface

## Purpose

Header component that provides controls for the collection view: sorting, view density toggle, instrument count, and action buttons.

## Dependencies

- `@/store/uiStore` - Collection view state and actions
- `@/store/instrumentStore` - Instrument count
- `@/components/ui/button` - Button components
- `@/components/ui/select` - Sort dropdown
- `lucide-react` - Icons (Plus, LayoutGrid, LayoutList)

## Props/API

No props - component is self-contained and reads from stores.

## Usage Example

```tsx
import { CollectionHeader } from '@/components/Collection/CollectionHeader';

function CollectionView() {
  return (
    <div className="flex flex-col">
      <CollectionHeader />
      {/* Card grid below */}
    </div>
  );
}
```

## Features

### Sort Dropdown

Allows users to change sort order:
- **Name (A-Z)**: Alphabetical by instrument name
- **Recently Added**: Newest instruments first
- **Category**: Grouped by category
- **Developer**: Alphabetical by developer

Updates `uiStore.collectionView.sortBy`.

### View Density Toggle

Two-button toggle between:
- **Compact**: Smaller cards (200×280px)
- **Spacious**: Larger cards (250×350px)

Updates `uiStore.collectionView.viewDensity`.

### Instrument Count

Displays total number of instruments:
- Format: "X instruments" (singular/plural)
- Updates automatically when instruments are added/removed

### Add Instrument Button

Opens the "Add Instrument" dialog:
- Triggers `uiStore.openAddInstrument()`
- Same functionality as sidebar button

## Layout

```
┌─────────────────────────────────────────────────────────┐
│ Sort by: [Name (A-Z) ▼]  142 instruments    [Compact]  │
│                                      [Spacious] [Add...]│
└─────────────────────────────────────────────────────────┘
```

Left side: Sort dropdown and count  
Right side: View density toggle and action buttons

## State Management

**Reads from stores:**
- `uiStore.collectionView.sortBy` - Current sort option
- `uiStore.collectionView.viewDensity` - Current density
- `instrumentStore.instruments.length` - Instrument count

**Actions:**
- `setCollectionSort(sortBy)` - Update sort order
- `setViewDensity(density)` - Update view density
- `openAddInstrument()` - Open add dialog

## Accessibility

- Sort dropdown uses accessible Select component with proper labels
- View density toggle buttons have descriptive icons (LayoutGrid, LayoutList)
- Instrument count uses semantic text (not just numbers)
- All interactive elements are keyboard accessible
- Button labels are clear and descriptive

## Related Components

- `CollectionView` - Parent component that uses this header
- `AddInstrument` - Dialog opened by "Add Instrument" button

## Future Enhancements

- Grid/List view toggle (in addition to density)
- Filter quick-access buttons
- Export/import collection
- Bulk actions dropdown
- View options menu (save presets)

