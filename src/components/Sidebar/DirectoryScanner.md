# DirectoryScanner

**Last Updated:** 2024-12-22 - Improved spacing, added tests

## Purpose

Semi-automatic instrument import feature that scans filesystem directories and uses heuristics to parse folder names into instrument metadata (name, developer, host, category). Provides preview and selection before import.

## Dependencies

- `@/store/instrumentStore` - For adding imported instruments
- `@/components/ui/button` - Button components
- `@/components/ui/dialog` - Dialog for preview and selection
- `@/components/ui/badge` - Badge for displaying parsed metadata
- `lucide-react` - Icons (FolderOpen, Loader2)
- `@/types` - Host and Category type definitions
- `window.electronAPI` - Electron IPC for filesystem access

## Props/API

No props - component is self-contained.

**Electron API Interface:**
```typescript
interface Window {
  electronAPI?: {
    selectDirectory: () => Promise<string | null>;
    scanDirectory: (path: string) => Promise<Array<{
      name: string;
      path: string;
      isDirectory: boolean;
    }>>;
  };
}
```

## Usage Example

```tsx
import { DirectoryScanner } from '@/components/Sidebar/DirectoryScanner';

<Sidebar>
  <FilterPanel />
  <TemplateLibrary />
  <DirectoryScanner />
</Sidebar>
```

## State Management

**Local State:**
- `isScanning` - Whether directory scan is in progress
- `isPreviewOpen` - Whether preview dialog is open
- `scannedItems` - Array of scanned items with parsed metadata
- `selectedItems` - Set of item paths selected for import

**Parsing Heuristics:**
- **Name parsing:** Splits on " - " or "-" to extract developer and instrument name
- **Host detection:** Searches path/name for keywords (kontakt, soundbox, sine, opus, vst, au)
- **Category detection:** Searches name for keywords (orchestral, synth, drums, keys, vocal, world, effects)

## Related Components

- `Sidebar` - Parent container
- `instrumentStore` - Receives imported instruments
- Electron main process - Provides filesystem access

## Future Enhancements

- [ ] Improved parsing heuristics with ML
- [ ] Support for plugin file scanning (.vst3, .component)
- [ ] Batch editing of parsed metadata before import
- [ ] Save parsing rules/patterns
- [ ] Detect duplicates before import
- [ ] Import from preset files (NKS, etc.)
- [ ] Auto-categorization based on file structure

