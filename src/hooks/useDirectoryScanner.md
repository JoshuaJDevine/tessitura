# useDirectoryScanner Hook

**Last Updated:** 2025-12-24 - Created shared hook for directory scanning logic

## Purpose

Reusable hook that encapsulates directory scanning logic for VST3 plugins. Provides scanning functions, progress tracking, and import functionality that can be used by multiple components. Extracted from component-specific code to enable reuse across `DirectoryScanner` and `CollectionView` components.

## Dependencies

- `@/store/instrumentStore` - Provides `addInstrument` function for importing scanned instruments into the store
- `@/types` - Type definitions for `Host` and `Category` enums
- `window.electronAPI` - Electron IPC interface for filesystem access (required at runtime)

## API / State

```typescript
interface UseDirectoryScannerReturn {
  isScanning: boolean;          // True when manual scan is in progress
  isAutoScanning: boolean;      // True when auto-scan is in progress
  scanProgress: {
    current: number;             // Current path index (1-indexed)
    total: number;               // Total paths to scan
    path: string;                // Current path being scanned
    found: number;               // Number of plugins found so far
  };
  handleAutoScan: () => Promise<ScannedItem[]>;  // Scans default VST3 directories
  handleScan: (dirPath: string) => Promise<ScannedItem[]>;  // Scans selected directory
  importInstruments: (items: ScannedItem[]) => void;  // Adds items to instrument store
}

export interface ScannedItem {
  name: string;
  path: string;
  isDirectory: boolean;
  parsed?: {
    developer?: string;          // Extracted from folder/filename
    instrumentName?: string;     // Extracted from folder/filename
    host?: Host;                 // Detected from path/name
    category?: Category;         // Detected from name
  };
}
```

## Usage

```tsx
import { useDirectoryScanner, ScannedItem } from '@/hooks/useDirectoryScanner';

function DirectoryScanner() {
  const {
    isAutoScanning,
    isScanning,
    scanProgress,
    handleAutoScan,
    handleScan,
    importInstruments,
  } = useDirectoryScanner();
  
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  
  // Auto-scan default directories
  const onAutoScan = async () => {
    try {
      const items = await handleAutoScan();
      setScannedItems(items);
      // Show preview dialog for user selection
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Scan failed');
    }
  };
  
  // Manual scan selected directory
  const onManualScan = async () => {
    const dirPath = await window.electronAPI?.selectDirectory();
    if (!dirPath) return;
    
    try {
      const items = await handleScan(dirPath);
      setScannedItems(items);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Scan failed');
    }
  };
  
  // Import selected items
  const onImport = () => {
    importInstruments(scannedItems);
  };
  
  return (
    <>
      <button onClick={onAutoScan} disabled={isAutoScanning}>
        {isAutoScanning ? 'Scanning...' : 'Scan Directories'}
      </button>
      {scanProgress.total > 0 && (
        <div>
          Scanning {scanProgress.current} of {scanProgress.total}
          Found {scanProgress.found} plugins
        </div>
      )}
    </>
  );
}
```

## Behavior

### Auto-Scan (`handleAutoScan`)

Scans default VST3 directories on Windows in sequence:
- `C:\Program Files\Common Files\VST3\`
- `C:\Program Files\VSTPlugins\`
- `C:\Program Files (x86)\Common Files\VST3\`

**Process:**
1. Validates Electron API is available (throws if not)
2. Iterates through each default path
3. Updates `scanProgress` for each path scanned
4. Filters items to `.vst3` files or directories only
5. Parses each item to extract metadata (developer, name, host, category)
6. Accumulates all found items
7. Throws error if no plugins found
8. Returns array of `ScannedItem` with parsed metadata
9. Resets state on completion or error

**Error Handling:**
- Inaccessible paths are logged as warnings and skipped (scanning continues)
- If all paths fail or no plugins found, throws descriptive error
- Always resets `isAutoScanning` and `scanProgress` in finally block

### Manual Scan (`handleScan`)

Scans a user-selected directory. Only processes directories (filters out files).

**Process:**
1. Validates Electron API is available (throws if not)
2. Calls `window.electronAPI.scanDirectory(dirPath)`
3. Filters results to directories only
4. Parses each directory name to extract metadata
5. Returns array of `ScannedItem` with parsed metadata
6. Resets `isScanning` state on completion or error

**Error Handling:**
- Throws descriptive error if Electron API unavailable
- Throws error if directory scan fails
- Always resets `isScanning` in finally block

### Import Instruments (`importInstruments`)

Adds scanned items to the instrument store, creating `Instrument` objects with parsed metadata.

**Process:**
1. Iterates through provided `ScannedItem[]`
2. Skips items without `parsed` data
3. Calls `addInstrument` for each valid item with:
   - `name`: Uses `parsed.instrumentName` or falls back to `item.name`
   - `developer`: Uses `parsed.developer` or falls back to `'Unknown'`
   - `host`: Uses `parsed.host` or falls back to `'Other'`
   - `category`: Uses `parsed.category` or falls back to `'Other'`
   - `notes`: Includes import path for reference
   - Default values for other fields (tags: `[]`, color: `'#3b82f6'`, pairings: `[]`)

### Parsing Logic

**Folder Names:**
- Tries `"Developer - Instrument Name"` pattern (splits on `" - "`)
- Falls back to single dash pattern (`"Developer-Instrument Name"`)
- Uses full name as `instrumentName` if no separator found

**VST3 Files:**
- Removes `.vst3` extension
- Splits on `-` or `_` to separate developer and plugin name
- Uses full name as `instrumentName` if no separator found

**Host Detection:**
Checks path and name (case-insensitive) for keywords:
- `kontakt` → `'Kontakt'`
- `soundbox` → `'Soundbox'`
- `sine` → `'SINE'`
- `opus` → `'Opus'`
- `vst` → `'VST3'`
- `.component` or `au` → `'AU'`
- Default → `'Other'`

**Category Detection:**
Uses heuristic keyword matching on name (case-insensitive):
- `orchestr`, `string`, `brass`, `woodwind` → `'Orchestral'`
- `synth`, `synthesizer` → `'Synth'`
- `drum`, `percussion`, `kick`, `snare` → `'Drums'`
- `piano`, `key` → `'Keys'`
- `vocal`, `choir`, `voice` → `'Vocal'`
- `world`, `ethnic` → `'World'`
- `effect`, `reverb`, `delay`, `eq` → `'Effects'`
- Default → `'Other'`

## State Management

The hook manages three pieces of state:
- `isScanning`: Boolean flag for manual scan operations
- `isAutoScanning`: Boolean flag for auto-scan operations
- `scanProgress`: Object tracking progress during auto-scan only

State is reset automatically after operations complete or error out. Components should use these flags to show loading states and disable buttons during operations.

## Testing

- **Coverage:** 96.84% lines, 90.58% branches, 100% functions, 92.45% statements
- **Test file:** `src/hooks/useDirectoryScanner.test.ts`
- **Key test cases:**
  - Initial state values are correct
  - All hook functions are exposed
  - `handleAutoScan` throws when Electron API unavailable
  - `handleAutoScan` successfully scans default paths
  - `handleAutoScan` filters for .vst3 files and directories
  - `handleAutoScan` handles inaccessible paths gracefully
  - `handleScan` throws when Electron API unavailable
  - `handleScan` successfully scans selected directory
  - `handleScan` filters for directories only
  - `importInstruments` adds instruments to store with correct data
  - `importInstruments` handles missing parsed data gracefully
  - Full workflow: scan → import integration test

## Related

- [DirectoryScanner](../components/Sidebar/DirectoryScanner.md) - Sidebar component that uses this hook for manual scanning
- [CollectionView](../components/Collection/CollectionView.md) - Collection view that uses this hook in empty state
- [ADR-015](../../../docs/architecture/decisions.md#adr-015-directory-scanning-bug-fixes) - Architecture decision for bug fixes that led to creating this hook
- [instrumentStore](../store/instrumentStore.md) - Store used for importing instruments

## Future Enhancements

- [ ] Platform detection for Mac/Linux VST paths
- [ ] Support for .dll and other plugin formats
- [ ] Incremental scanning (skip already-imported files)
- [ ] Background scanning with progress callbacks
- [ ] Custom parsing rules/configurable patterns
- [ ] Batch import with preview before committing

