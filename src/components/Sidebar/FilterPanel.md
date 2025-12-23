# FilterPanel Component

**Last Updated:** 2024-12-19

## Purpose

Sidebar panel that provides search, filtering, and discovery features. Allows users to filter instruments by category, host, tags, and search query. Includes "Surprise Me" random suggestion feature.

## Dependencies

- `@/store/uiStore` - Filter state management
- `@/store/instrumentStore` - Instrument data for suggestions
- `@/components/ui/button` - Action buttons
- `@/components/ui/input` - Search input
- `@/components/ui/checkbox` - Filter checkboxes
- `@/components/ui/badge` - Tag pills
- `@/types` - Category and Host types

## Usage

```tsx
import { FilterPanel } from '@/components/Sidebar/FilterPanel';

<FilterPanel />
```

## State

Reads from `uiStore`:
- `searchQuery` - Text search
- `selectedTags` - Active tag filters
- `selectedCategories` - Active category filters
- `selectedHosts` - Active host filters

## Features

### Search
- Real-time text search across name, developer, category
- Keyboard shortcut: `/` to focus, `Ctrl+K` to focus
- Clear button when active

### Category Filtering
Checkboxes for all categories:
- Orchestral, Synth, Drums, Effects, Keys, World, Vocal, Other

### Host Filtering
Checkboxes for all hosts:
- Kontakt, Standalone, VST3, AU, Soundbox, SINE, Opus, Other

### Tag Filtering
- Dynamic list of all tags from instruments
- Click badge to toggle filter
- Active tags highlighted

### Active Filters Display
Shows all active filters as removable pills:
- Search query
- Selected tags
- Selected categories
- Selected hosts

### Surprise Me
Random suggestion algorithm that:
- Weights by "Hidden Gem" tag (3x)
- Weights by never used (5x)
- Weights by days since last used
- Highlights suggested node
- Scrolls to suggested node

## Algorithm: Random Suggestion

```typescript
1. Calculate weight for each instrument:
   - Base: 1
   - If "Hidden Gem" tag: ×3
   - If never used: ×5
   - Days since used: ×(days/30, max 10)
2. Weighted random selection
3. Highlight and scroll to selected instrument
```

## UI Layout

1. Search bar (with icon)
2. Categories section (checkboxes)
3. Hosts section (checkboxes)
4. Tags section (clickable badges)
5. Active filters (removable pills)
6. "Surprise Me" button (bottom)

## Keyboard Shortcuts

- `/` - Focus search input
- `Ctrl+K` / `Cmd+K` - Focus search input
- `Escape` - Clear search and blur

## Performance

- Tag list computed from instruments (could be memoized if needed)
- Filter changes trigger canvas re-filtering (handled by Canvas component)

## Future Enhancements

- Save filter presets
- Filter by date ranges (last used)
- Filter by usage count
- Advanced search with operators

