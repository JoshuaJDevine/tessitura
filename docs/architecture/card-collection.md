# Card Collection Architecture

**Last Updated:** 2024-12-22 - Initial architecture for card-based interface

## Overview

This document describes the architectural design of the card-based collection interface that replaces the node-canvas approach. The system is inspired by collectible card games (Hearthstone, Magic: The Gathering) and applies gamification principles to instrument organization and discovery.

## Core Philosophy

### The Problem We're Solving

Music producers have large instrument collections but struggle with:
- **Discovery**: Forgetting about underutilized instruments
- **Organization**: Manual categorization feels like work
- **Memory**: No persistent spatial or visual memory
- **Context**: Hard to remember which tools work well together

### The Solution: Gamified Card Collection

Transform instrument organization from a chore into an engaging experience:
- **Visual Hierarchy**: Rarity effects show usage patterns at a glance
- **Deck Building**: Create workflow-specific instrument sets
- **Passive Discovery**: "Surprise Me" surfaces forgotten tools
- **Progressive Enhancement**: AI features in later phases

## Design Principles

### 1. Scannable

Users should see 12-24 instruments at once in a grid, enabling rapid visual scanning without scrolling.

### 2. Delightful

Animations, visual effects, and gamification make the experience fun, not utilitarian.

### 3. Self-Organizing

The system adapts to user behavior (rarity updates automatically based on usage).

### 4. Workflow-Oriented

Decks represent real workflows ("Cinematic Scoring", "Electronic Production") not arbitrary groupings.

### 5. Progressive Disclosure

Basic features are simple, advanced features (AI) come later without complexity burden.

---

## Visual Design

### Card Anatomy

Each InstrumentCard displays:

```
┌─────────────────────────┐
│  [HOST BADGE]           │ ← Top-right corner
│                         │
│    [CATEGORY ICON]      │ ← Large watermark
│                         │
│  Instrument Name        │ ← Bold, 18px
│  Developer Name         │ ← Muted, 12px
│                         │
│ [CATEGORY] [RARITY]     │ ← Bottom badges
└─────────────────────────┘
```

**Dimensions:** 250px wide × 350px tall (portrait, card-like)

**Card Front:**
- Gradient background (category color-based)
- Category icon watermark (large, subtle)
- Instrument name (bold)
- Developer name (smaller, muted)
- Host badge (VST3, Kontakt, etc.)
- Category badge
- Rarity effect (border/glow)

**Card Back (on flip):**
- Usage statistics
- Last used date
- Times used count
- Quick actions (edit, delete, add to deck)

### Rarity Effects

Visual effects that indicate usage frequency:

| Rarity | Usage Count | Visual Effect |
|--------|-------------|---------------|
| **Legendary** | 50+ | Animated gold shimmer (gradient animation) |
| **Epic** | 20-49 | Pulsing purple glow (box-shadow animation) |
| **Rare** | 5-19 | Blue border (solid) |
| **Common** | 0-4 | Default appearance (gray/muted) |

**Implementation:**
- CSS animations for shimmer/pulse (GPU-accelerated)
- Conditional classes based on `usageCount`
- Smooth transitions when rarity changes

### Animations

**Card Entrance:**
```typescript
// Staggered entrance when page loads
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
```

**Hover Effect:**
```typescript
// Lift and highlight on hover
<motion.div
  whileHover={{ scale: 1.05, y: -8 }}
  transition={{ type: "spring", stiffness: 300 }}
>
```

**Flip Animation:**
```typescript
// 3D flip to show back
<motion.div
  animate={{ rotateY: flipped ? 180 : 0 }}
  transition={{ duration: 0.6 }}
  style={{ transformStyle: "preserve-3d" }}
>
```

**Selection:**
```typescript
// Border highlight when selected
<motion.div
  animate={{
    borderColor: isSelected ? "#3b82f6" : "transparent",
    borderWidth: isSelected ? 3 : 1
  }}
>
```

### Grid Layout

**Responsive Columns:**
```css
.collection-grid {
  display: grid;
  gap: 24px;
  padding: 32px;
  
  /* Responsive breakpoints */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

/* Specific breakpoints */
@media (max-width: 1200px) { /* 3 columns */ }
@media (min-width: 1200px) and (max-width: 1600px) { /* 4 columns */ }
@media (min-width: 1600px) and (max-width: 2000px) { /* 5 columns */ }
@media (min-width: 2000px) { /* 6 columns */ }
```

**Virtual Scrolling (Future Optimization):**
- Use `react-window` for 500+ instruments
- Render only visible cards + buffer
- Target: 60fps scrolling with 1000+ cards

---

## Component Architecture

### Component Hierarchy

```
App.tsx
├── Sidebar.tsx
│   ├── FilterPanel.tsx
│   ├── DeckLibrary.tsx (NEW)
│   └── AddInstrument.tsx
└── CollectionView.tsx (NEW - Main view)
    ├── CollectionHeader.tsx (NEW)
    │   ├── SortDropdown
    │   ├── ViewDensityToggle
    │   └── SurpriseMeButton
    ├── InstrumentCard.tsx (NEW)
    │   ├── CardFront.tsx
    │   ├── CardBack.tsx
    │   └── RarityEffect.tsx
    └── DiscoveryModal.tsx (NEW)
        └── SpotlightCard.tsx
```

### Key Components

#### InstrumentCard

**Purpose:** Display individual instrument as interactive card

**Props:**
```typescript
interface InstrumentCardProps {
  instrument: Instrument;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUse: (id: string) => void;
  viewDensity: 'compact' | 'spacious';
}
```

**Behavior:**
- Single click → Toggle selection
- Double click → "Use" instrument (increment usage)
- Hover → Lift and highlight
- Long hover (1s) → Flip to show stats
- Context menu → Edit, Delete, Add to Deck

**Rarity Calculation:**
```typescript
function getRarity(usageCount: number): Rarity {
  if (usageCount >= 50) return 'legendary';
  if (usageCount >= 20) return 'epic';
  if (usageCount >= 5) return 'rare';
  return 'common';
}
```

#### CollectionView

**Purpose:** Main grid view of all instruments

**Features:**
- Filters instruments based on `uiStore` filters
- Sorts based on selected sort order
- Handles selection mode
- Shows "Create Deck" button when 2+ selected
- Virtual scrolling (future optimization)

**Sort Options:**
- Name (A-Z)
- Recently added (newest first)
- Most used (highest usage count)
- Least used (lowest usage count)
- Category (grouped by category)

#### DeckView

**Purpose:** Display active deck's instruments

**Features:**
- Shows only instruments in active deck
- "Add More" button to add instruments
- "Edit Deck" to change name/description
- "Use This Deck" increments deck usage
- Back button to return to collection

**Header:**
```typescript
interface DeckHeaderProps {
  deck: Deck;
  onUseDeck: () => void;
  onEditDeck: () => void;
  onAddInstruments: () => void;
  onBack: () => void;
}
```

#### DiscoveryModal

**Purpose:** "Surprise Me" feature for discovering underused instruments

**Features:**
- Shows 1-3 random cards with `usageCount < 5`
- Spotlight effect (glowing highlight)
- "Add to New Deck" button
- "Not Interested" button (fetch 3 more)
- "Maybe Later" closes modal

**Algorithm:**
```typescript
function getRandomUnderused(count: number): Instrument[] {
  const underused = instruments.filter(i => i.metadata.usageCount < 5);
  return shuffle(underused).slice(0, count);
}
```

---

## Data Architecture

### New Entity: Deck

```typescript
interface Deck {
  id: string;                    // UUID
  name: string;                  // User-defined name
  description: string;           // Optional description
  instruments: string[];         // Array of instrument IDs
  color: string;                 // Hex color for visual theming
  icon: string;                  // Emoji (🎹, 🎸, 🎺, etc.)
  tags: string[];                // User-defined tags
  metadata: {
    createdAt: Date;
    lastUsed?: Date;
    usageCount: number;          // How many times "Used"
  };
}
```

**Differences from Template/Group:**
- ✅ No position data (irrelevant without canvas)
- ✅ Usage tracking (like instruments)
- ✅ Icon emoji for visual identity
- ✅ Simplified structure

### Updated Entity: Instrument

**New Fields:**
```typescript
interface Instrument {
  // ... existing fields ...
  metadata: {
    createdAt: Date;
    lastUsed?: Date;
    usageCount: number;          // Used for rarity calculation
  };
}
```

**New Computed Properties:**
```typescript
// Rarity is computed, not stored
const rarity: Rarity = getRarity(instrument.metadata.usageCount);
```

---

## State Management

### DeckStore (New)

**Purpose:** Manage decks (replaces TemplateStore and GroupStore)

**State:**
```typescript
interface DeckState {
  decks: Deck[];
  activeDeckId: string | null;
  
  // Actions
  createDeck: (deck: Omit<Deck, 'id' | 'metadata'>) => void;
  updateDeck: (id: string, updates: Partial<Deck>) => void;
  deleteDeck: (id: string) => void;
  addInstrumentsToDeck: (deckId: string, instrumentIds: string[]) => void;
  removeInstrumentFromDeck: (deckId: string, instrumentId: string) => void;
  setActiveDeck: (deckId: string | null) => void;
  useDeck: (deckId: string) => void;
  
  // Selectors
  getDeckById: (id: string) => Deck | undefined;
  getDecksForInstrument: (instrumentId: string) => Deck[];
}
```

**Persistence:** LocalStorage key `deck-storage`

### InstrumentStore (Updated)

**New Methods:**
```typescript
interface InstrumentStore {
  // ... existing methods ...
  
  // Usage tracking
  incrementUsage: (id: string) => void;
  
  // Rarity queries
  getInstrumentsByRarity: () => {
    legendary: Instrument[];
    epic: Instrument[];
    rare: Instrument[];
    common: Instrument[];
  };
  
  // Discovery
  getRandomUnderused: (count: number) => Instrument[];
}
```

### UIStore (Updated)

**New State:**
```typescript
interface UIState {
  // ... existing state ...
  
  collectionView: {
    sortBy: 'name' | 'recent' | 'most-used' | 'least-used' | 'category';
    viewDensity: 'compact' | 'spacious';
    selectedCardIds: string[];
  };
}
```

**New Methods:**
```typescript
interface UIStore {
  // ... existing methods ...
  
  setCollectionSort: (sortBy: SortOption) => void;
  setViewDensity: (density: 'compact' | 'spacious') => void;
  toggleCardSelection: (id: string) => void;
  clearSelection: () => void;
}
```

---

## User Flows

### Creating a Deck

1. User clicks multiple cards to select them
2. "Create Deck" button appears in header
3. User clicks button → Dialog opens
4. User enters name, description, icon, color
5. Click "Create" → `deckStore.createDeck()`
6. Deck appears in sidebar DeckLibrary
7. Success toast notification

### Using a Deck

1. User clicks deck in sidebar
2. `deckStore.setActiveDeck(deckId)`
3. View switches to DeckView
4. Only deck's instruments shown
5. User clicks "Use This Deck"
6. `deckStore.useDeck(deckId)` → usage count increments
7. User can add/remove instruments or go back to collection

### Discovery Flow

1. User clicks "Surprise Me" button
2. `instrumentStore.getRandomUnderused(3)`
3. DiscoveryModal opens with 3 spotlighted cards
4. User can:
   - "Add to New Deck" → Opens deck creation with these 3
   - "Not Interested" → Fetch 3 more random underused
   - "Maybe Later" → Close modal

### Rarity Progression

1. User double-clicks card (or uses instrument in DAW later)
2. `instrumentStore.incrementUsage(id)`
3. `usageCount` increases
4. Rarity recalculated: `getRarity(newUsageCount)`
5. Card effect updates (e.g., Common → Rare → Epic → Legendary)
6. Satisfying visual feedback (shimmer starts, glow intensifies)

---

## Performance Considerations

### Rendering Performance

**Grid with 500+ Cards:**
- Use CSS Grid (native performance)
- Lazy load images (if custom card art added)
- Throttle scroll events
- Future: Virtual scrolling with `react-window`

**Animation Performance:**
- Use CSS transforms (GPU-accelerated)
- Avoid layout-triggering properties in animations
- Use `will-change` sparingly for hover states
- Stagger animations to prevent frame drops

### State Performance

**Filtering:**
```typescript
// Memoize filtered instruments
const filteredInstruments = useMemo(() => {
  return instruments.filter(matchesFilters);
}, [instruments, filters]);
```

**Sorting:**
```typescript
// Memoize sorted instruments
const sortedInstruments = useMemo(() => {
  return [...filteredInstruments].sort(getSortFn(sortBy));
}, [filteredInstruments, sortBy]);
```

### Storage Performance

**LocalStorage Limits:**
- 5-10MB typical limit
- ~1000 instruments @ 1KB each = 1MB (comfortable)
- Zustand persist batches writes (good performance)

**Future: IndexedDB Migration:**
- When library > 500 instruments
- Async queries for complex filters
- Better performance for large datasets

---

## Accessibility

### Keyboard Navigation

- **Tab**: Navigate between cards
- **Enter**: Select/deselect card
- **Space**: "Use" instrument (increment usage)
- **Arrow keys**: Navigate grid (with focus management)
- **Escape**: Clear selection, close modals

### Screen Reader Support

```jsx
<div
  role="button"
  tabIndex={0}
  aria-label={`${instrument.name} by ${instrument.developer}, 
               ${rarity} rarity, used ${usageCount} times`}
  aria-pressed={isSelected}
>
```

### Visual Accessibility

- Rarity effects don't rely solely on color (shimmer patterns differ)
- Focus indicators clearly visible
- High contrast mode support (future)
- Reduced motion support for animations:

```css
@media (prefers-reduced-motion: reduce) {
  .instrument-card {
    transition: none;
    animation: none;
  }
}
```

---

## Future Enhancements

### Phase 2: AI Semantic Search

**Goal:** "Show me warm pads" returns relevant instruments

**Tech Stack:**
- Ollama (local LLM)
- Vector embeddings for instrument metadata
- Semantic similarity search

**Implementation:**
```typescript
interface SemanticSearch {
  query: string; // "warm pads", "aggressive bass"
  results: Instrument[]; // Ranked by relevance
}
```

### Phase 3: Auto-Deck Generation

**Goal:** AI suggests decks based on usage patterns

**Features:**
- Clustering algorithms find natural groupings
- "People who use X also use Y"
- Context-aware suggestions (genre, tempo, mood)

### Phase 4: DAW Integration

**Goal:** Real-time integration with Bitwig/other DAWs

**Features:**
- Drag card to DAW to load instrument
- Track which instruments are actually used in projects
- Project context detection (read DAW files)
- Real-time "Used" tracking

### Phase 5: Social Features

**Goal:** Share and discover decks from community

**Features:**
- Export/import decks as JSON
- Community deck library
- Upvoting/comments on decks
- "Deck of the week" curation

---

## Migration Strategy

### From Canvas to Cards

**Legacy Data:**
- `template-storage`: Convert to decks (drop `layout` field)
- `group-storage`: Convert to decks (already similar structure)
- `instrument-storage`: Keep as-is (compatible)
- `canvas-storage`: Ignore (position data irrelevant)

**Migration Function:**
```typescript
function migrateToCards() {
  // Read legacy templates
  const templates = JSON.parse(localStorage.getItem('template-storage') || '[]');
  
  // Convert to decks
  const decks = templates.map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    instruments: template.instruments,
    color: '#3b82f6', // Default blue
    icon: '🎹', // Default icon
    tags: template.tags,
    metadata: {
      createdAt: new Date(),
      usageCount: 0,
    },
  }));
  
  // Save as decks
  localStorage.setItem('deck-storage', JSON.stringify({ decks }));
  
  // Archive legacy data
  localStorage.setItem('template-storage-backup', 
    localStorage.getItem('template-storage'));
  localStorage.removeItem('template-storage');
  
  // Show migration success toast
  toast.success('Your templates have been converted to decks!');
}
```

**Migration Trigger:**
- On app load, check if `template-storage` exists and `deck-storage` doesn't
- Run migration automatically
- Show informational toast to user

---

## Testing Strategy

### Component Tests

**InstrumentCard:**
- Renders correctly with all props
- Click toggles selection
- Double-click calls `onUse`
- Hover shows lift animation
- Correct rarity effect based on usage count

**CollectionView:**
- Filters instruments correctly
- Sorts instruments correctly
- Shows "Create Deck" when 2+ selected
- Virtual scrolling (future)

**DeckView:**
- Shows only deck's instruments
- "Use Deck" increments usage
- Add/remove instruments works

### Integration Tests

**Deck Creation Flow:**
1. Select multiple cards
2. Create deck
3. Verify deck appears in sidebar
4. Verify instruments are in deck

**Usage Tracking:**
1. Double-click card
2. Verify usage count increases
3. Verify rarity updates
4. Verify visual effect changes

### Performance Tests

**Rendering:**
- 500 cards render in < 2s
- Scrolling maintains 60fps
- Animations don't drop frames

**State:**
- Filter 1000 instruments in < 100ms
- Sort 1000 instruments in < 100ms

---

## Success Metrics

This architecture is successful if:

1. **Performance**: 500+ cards render smoothly (60fps)
2. **Engagement**: User finds discovery features useful
3. **Usability**: Deck creation takes < 30 seconds
4. **Delight**: Card animations feel satisfying
5. **Discovery**: "Surprise Me" surfaces actually forgotten instruments

---

## Related Documentation

- **ADRs**: `docs/architecture/decisions.md` (ADRs 009-012)
- **Data Model**: `docs/architecture/data-model.md` (Deck entity, updated Instrument)
- **State Management**: `docs/architecture/state-management.md` (DeckStore, updated stores)

---

## Appendix: Design Inspiration

### Hearthstone
- Card rarity (Common, Rare, Epic, Legendary)
- Deck building (30-card decks for specific strategies)
- Visual effects (golden shimmer for special cards)
- Collection management (grid view, filters)

### Magic: The Gathering Arena
- Card collection browser (grid layout)
- Deck builder interface
- Rarity indicators
- Filtering by mana cost, color, type

### Steam Library
- Grid vs. List view toggle
- Sorting options (recent, playtime, name)
- Collections/categories
- Recent/frequently played surfacing

### GOG Galaxy
- Unified library across platforms
- Custom tags and filtering
- Visual grid with artwork
- Recent/frequently played

### Cosmos (Waves)
- AI-generated semantic tags
- Search by describing sound
- Tag cloud visualization
- Preview without loading

---

**Version:** 1.0  
**Status:** Architecture complete, ready for implementation  
**Next Step:** @coder begins implementation (see feature file for detailed prompt)

