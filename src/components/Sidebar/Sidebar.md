# Sidebar

**Last Updated:** 2024-12-22 - Improved spacing between sections

## Purpose

Main sidebar container that houses all sidebar panels: filters, templates, directory scanner, and analytics. Provides the "Add Instrument" button and overall sidebar layout.

## Dependencies

- `@/store/uiStore` - UI state for opening add instrument dialog
- `@/components/ui/button` - Button component
- `@/components/Sidebar/FilterPanel` - Search and filter controls
- `@/components/Sidebar/AddInstrument` - Add/edit instrument dialog
- `@/components/Sidebar/TemplateLibrary` - Template management
- `@/components/Sidebar/DirectoryScanner` - Directory scanning feature
- `@/components/Sidebar/Analytics` - Usage analytics display
- `lucide-react` - Plus icon

## Props/API

No props - component is self-contained.

## Usage Example

```tsx
import { Sidebar } from '@/components/Sidebar/Sidebar';

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <Canvas />
    </div>
  );
}
```

## State Management

No internal state. Uses `useUIStore` to trigger add instrument dialog.

All child components manage their own state and interactions.

## Layout & Spacing

The sidebar uses consistent spacing between sections for visual clarity:
- All sections (FilterPanel, TemplateLibrary, DirectoryScanner, Analytics) have `border-t` for separation
- Sections use `mt-4` for vertical breathing room
- Each section has `p-4` for internal padding
- This creates a comfortable, scannable layout

## Related Components

- `FilterPanel` - Child component for filtering
- `AddInstrument` - Child component for add/edit dialog
- `TemplateLibrary` - Child component for templates
- `DirectoryScanner` - Child component for directory scanning
- `Analytics` - Child component for analytics
- `Canvas` - Sibling component showing filtered results

## Future Enhancements

- [ ] Collapsible sidebar
- [ ] Sidebar width adjustment
- [ ] Tab-based organization of panels
- [ ] Keyboard shortcuts panel

