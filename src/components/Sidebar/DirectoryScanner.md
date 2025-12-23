# DirectoryScanner

**Last Updated:** 2025-12-23 - Added auto-scan VST3 directories feature

## Purpose

Semi-automatic instrument import feature that scans filesystem directories and uses heuristics to parse folder names and VST3 files into instrument metadata (name, developer, host, category). Provides preview and selection before import. Now includes auto-scan functionality for standard VST3 paths.

## Dependencies

- `@/store/instrumentStore` - For adding imported instruments
- `@/components/ui/button` - Button components
- `@/components/ui/dialog` - Dialog for preview and selection
- `@/components/ui/badge` - Badge for displaying parsed metadata
- `lucide-react` - Icons (FolderOpen, Loader2, Scan)
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
- `isScanning` - Whether manual directory scan is in progress
- `isAutoScanning` - Whether auto-scan is in progress
- `isPreviewOpen` - Whether preview dialog is open
- `isProgressOpen` - Whether progress dialog is open
- `scanProgress` - Current scan progress (current path, total paths, found count)
- `scannedItems` - Array of scanned items with parsed metadata
- `selectedItems` - Set of item paths selected for import

## Features

### Auto-Scan Directories

**Primary Action:** "Scan Directories" button automatically scans standard VST3 paths:

**Windows Default Paths:**
- `C:\Program Files\Common Files\VST3\`
- `C:\Program Files\VSTPlugins\`
- `C:\Program Files (x86)\Common Files\VST3\`

**Mac Default Paths (ready for future support):**
- `/Library/Audio/Plug-Ins/VST3/`
- `/Library/Audio/Plug-Ins/Components/`
- `~/Library/Audio/Plug-Ins/VST3/`
- `~/Library/Audio/Plug-Ins/Components/`

Features:
- Scans all paths sequentially
- Shows progress dialog with current path and found count
- Filters for `.vst3` files and directories
- Auto-creates instruments after selection
- Handles missing/inaccessible paths gracefully

### Manual Directory Selection

**Secondary Action:** "Choose Directory" button allows manual path selection:
- Opens native file dialog
- Scans selected directory recursively
- Same parsing and preview workflow as auto-scan

**Parsing Heuristics:**
- **Folder names:** Splits on " - " or "-" to extract developer and instrument name
- **VST3 filenames:** Parses filename to extract manufacturer and plugin name
- **Host detection:** Searches path/name for keywords (kontakt, soundbox, sine, opus, vst, au)
- **Category detection:** Searches name for keywords:
  - Orchestral: "orchestr", "string", "brass", "woodwind"
  - Synth: "synth", "synthesizer"
  - Drums: "drum", "percussion", "kick", "snare"
  - Keys: "piano", "key"
  - Vocal: "vocal", "choir", "voice"
  - World: "world", "ethnic"
  - Effects: "effect", "reverb", "delay", "eq"

### Helper Functions

**parseVST3FileName(fileName: string): ScannedItem['parsed']**
- Removes `.vst3` extension
- Parses common patterns: `"Manufacturer - Plugin Name.vst3"` or `"Manufacturer_Plugin_Name.vst3"`
- Returns object with `developer` and `instrumentName`, or just `instrumentName` if parsing fails
- Used during auto-scan to extract metadata from VST3 filenames

**detectCategory(name: string): Category**
- Searches instrument name (case-insensitive) for category keywords
- Returns first matching category, or `'Other'` if no match
- Used to auto-categorize instruments during scanning

**detectHost(path: string, name: string): Host**
- Searches both path and name (case-insensitive) for host keywords
- Priority order: Kontakt → Soundbox → SINE → Opus → VST3 → AU → Other
- Used to detect plugin host type from file path/name

## Related Components

- `Sidebar` - Parent container
- `instrumentStore` - Receives imported instruments
- Electron main process - Provides filesystem access

## UI Flow

1. **Auto-Scan Flow:**
   - User clicks "Scan Directories"
   - Progress dialog shows scanning status
   - All found plugins shown in preview dialog
   - User selects/deselects items
   - Click "Import" to add selected instruments

2. **Manual Scan Flow:**
   - User clicks "Choose Directory"
   - Native file dialog opens
   - Directory scanned
   - Preview dialog with results
   - User selects/deselects items
   - Click "Import" to add selected instruments

## Future Enhancements

- [ ] Platform detection for Mac paths
- [ ] Improved parsing heuristics with ML
- [ ] Metadata extraction from .vst3 files (manufacturer, version)
- [ ] Batch editing of parsed metadata before import
- [ ] Save parsing rules/patterns
- [ ] Detect duplicates before import
- [ ] Import from preset files (NKS, etc.)
- [ ] Auto-categorization based on file structure
- [ ] Cancel button during auto-scan
- [ ] Resume interrupted scans

