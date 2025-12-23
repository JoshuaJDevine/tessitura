# useKeyboardShortcuts Hook

**Last Updated:** 2024-12-19

## Purpose

Custom React hook that sets up global keyboard shortcuts for the application. Handles search focus, new instrument creation, and search clearing.

## Dependencies

- `react` - useEffect hook
- `@/store/uiStore` - UI actions (openAddInstrument, setSearchQuery)

## Usage

```tsx
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

function App() {
  useKeyboardShortcuts();
  // ...
}
```

Call once at the app root level.

## Shortcuts

### `Ctrl+K` / `Cmd+K`
- **Action:** Focus search input
- **Prevents default:** Yes
- **Works when:** Anywhere in app (unless input focused)

### `Ctrl+N` / `Cmd+N`
- **Action:** Open "Add Instrument" dialog
- **Prevents default:** Yes
- **Works when:** Anywhere in app

### `/`
- **Action:** Focus search input
- **Prevents default:** Yes
- **Works when:** Not typing in input/textarea

### `Escape`
- **Action:** Clear search query and blur input
- **Prevents default:** No
- **Works when:** Search input is focused

## Implementation

Uses `window.addEventListener('keydown')` with cleanup on unmount.

## Event Handling

- Checks for modifier keys (Ctrl/Cmd)
- Prevents default browser behavior
- Finds DOM elements by selector (search input)
- Focuses/blurs elements programmatically

## Future Enhancements

- Configurable shortcuts
- Shortcut help dialog (`?` key)
- More shortcuts:
  - `Delete` - Delete selected instrument
  - `E` - Edit selected instrument
  - Arrow keys - Navigate canvas
  - `Ctrl+F` - Focus filters

