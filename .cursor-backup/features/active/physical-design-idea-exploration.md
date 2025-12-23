# Feature: physical-design-idea-exploration

**Status:** 🎯 Planning
**Branch:** feature/physical-design-idea-exploration
**Created:** 2025-12-23
**Engineer:** Josh D

---

## 🎯 Phase 1: Architecture

### Engineer Request
> Consider a new onversation about what this app should be

I am trying to think of a great way to organize my music libraries. I use Bitwig, and I have collections and favorites, but something like this happens, where I use the favorites tab and open BBCSO. When I want a synthesizer, I reach for Pigments. I always forget that I have Massive hidden in my Kontackt plug-in. I always forget that I have Serum somewhere. I always forget that I bought the Rigid Audio bundle that is just a folder inside my Kontakt plugin library.

What are the best ways that people do a kind of digital organization? I'm thinking of my Steam library, which is okay, but not great. I think GOG does it better. I'm thinking of Cosmos, the sound editor, which does a great job of tagging things in a kind of AI-generated cloud. What are great models to think about a really good software that could organize native access, Kontackt, and the 100 random libraries I have?

8:38 PM
The core challenge you're describing is discovery vs. access — you know these tools exist intellectually, but they're not surfacing at the moment of need. Let me break down some proven organizational models and where they succeed:

Models Worth Studying
Native Instruments Komplete Kontrol / Native Access approach:

Tag-based filtering (synth/sampler/orchestral/etc.)
Character tags (warm/bright/aggressive)
Works across plugin formats
Problem: Only works for NI products, doesn't help with your Pigments/Serum/Rigid Audio situation
Cosmos (by Waves) approach you mentioned:

AI-generated semantic tags from analyzing actual sound
Search by describing what you want ("warm pad" or "aggressive bass")
Creates a unified layer above the mess
Strength: Discovery through description rather than memory
GOG Galaxy's strength over Steam:

Unified library across platforms (like your "across Kontakt/standalone/VST" problem)
Custom tags and filtering you control
Recent/frequently played surfacing
Manual curation tools that actually work
Splice/Loopcloud for samples (applicable to instruments):

Usage-based recommendations ("people who used X also used Y")
Quick preview without loading the full plugin
Collections you can build contextually ("dark cinematic" or "retro synths")
What Would Actually Work for Your Situation
Given your workflow, I'd think about context-based organization rather than hierarchical:

"Project type" collections in Bitwig:

"Orchestral essentials" (BBCSO sections you actually use + any Kontakt orchestral)
"Synthesis" (Pigments, Serum, Massive, relevant Rigid Audio instruments)
"Textural/sound design" (granular stuff, weird Rigid Audio patches)
Tactical memory aids:

A literal text file or note: "When I want a wavetable synth: Serum (standalone), Pigments (standalone), Massive (inside Kontakt)"
Bitwig favorites that are search-optimized — instead of saving "BBCSO Strings" as the favorite name, save it as "Strings BBCSO orchestral" so searching "strings" surfaces everything
The nuclear option (what I'd probably do): Create a simple spreadsheet or Notion database with columns:

Instrument name
Location (standalone/Kontakt/NI/VST folder)
Type (synth/orchestral/texture/drum)
Character tags (bright/dark/aggressive/gentle)
"Use for" notes ("bass synthesis", "string arrangements")
Search it before opening Bitwig when starting a project. Sounds tedious but takes 10 seconds vs. 5 minutes of "wait, where was that thing again?"

The Real Problem
No software solves this elegantly because it spans:

Native plugin formats (VST/AU)
Kontakt's internal browser
NI's ecosystem
Standalone apps
Your actual memory/workflow
The closest to a real solution would be something like Komplete Kontrol working as a universal browser, but extending it to non-NI products. That doesn't exist yet.

Would a manual tagging system feel too labor-intensive, or does the "build the database once, search forever" approach appeal to you?

This is good, but I'm thinking more about building a React app or some kind of actual plugin solution like Cosmos.  I've tried Komplete Kontrol, and I really don't like it. Native Instruments doesn't support it well. For example, my old Mark I keyboard is completely defunct. It doesn't even work anymore, and I don't have a thousand dollars to upgrade. Native Access Interface is just a big list of things that's not very helpful, and I don't really love the tag system. I'm just trying to think more visually. I'm thinking about the Hearthstone box, which is a great visual analogy - the game world lives inside it. I think it's one of the best examples of design. Can we think more like that with a physical analogy? I don't think any of these companies have done this very well.

8:40 PM
Ah, now we're talking about spatial/visual organization as a cognitive aid rather than list-filtering. The Hearthstone box is brilliant precisely because it mirrors how your brain organizes things — not by tags, but by place and purpose.

The Physical Analogy Problem
You're right that music software fails here. Compare:

A physical studio:

Synths on the left wall
Your piano in the corner
Outboard gear racked by signal flow
You see your tools, muscle memory kicks in
Spatial relationship = functional relationship
Current plugin interfaces:

Alphabetical lists
Nested folders that hide things
No spatial memory possible
You have to remember rather than see
Better Physical Metaphors
The Hearthstone box approach for plugins:

Imagine a 3D space you navigate:

A "synth room" with your wavetable synths on one wall (Serum, Pigments, Massive visually represented)
An "orchestral hall" where BBCSO sections are spatially arranged like an actual orchestra seating chart
A "weird sounds lab" for Rigid Audio experimental stuff
Kontakt as a "warehouse" where you can see sections (orchestral wing, synth wing, etc.)
Each instrument is a physical object you click to load. The spatial arrangement is persistent and customizable — you decide Pigments sits next to Serum because you reach for them in similar contexts.

The "workbench" model (closer to Hearthstone's box):

Your most-used 10-15 instruments are always visible on a persistent UI surface
Like Hearthstone's hero powers and common cards always in the same spot
Everything else is in "drawers" you open spatially
Recent/frequent use automatically promotes things to the workbench
The "modular synth rack" model:

Vertical or horizontal racks you build
Each rack is a context: "Cinematic scoring rack", "Electronic production rack"
Instruments are modules you place
Visual patching between them shows your typical routing
Technical Implementation Thoughts
For a React app/Electron plugin browser:

Architecture:

Scans your VST/AU folders + Kontakt libraries
Builds a database with metadata (you add custom tags/positions)
Lives as a standalone app or VST plugin that sends MIDI/loads instruments
UI concepts:

Canvas-based spatial arrangement (React Three Fiber for 3D, or Fabric.js/Konva for 2D)
Drag instruments to position them in your personal space
Color coding by type (blue = orchestral, red = aggressive synths, etc.)
Size = frequency of use (bigger = you use it more)
Click to load into your DAW via:
VST hosting (if it's a plugin)
OSC/MIDI messages to Bitwig (if it's a DAW browser)
Deep links to open Kontakt to specific patches
The Hearthstone lesson specifically:

Consistent spatial positioning = muscle memory
Visual distinction without reading (card art = instrument character)
Hierarchical but shallow (deck → hand → board, not 5 levels deep)
Context-aware filtering (mana cost = your current project needs)
What This Could Actually Look Like
Picture opening your plugin browser and seeing:

A 2D room view with your instruments as objects:

Pigments is a glowing purple cube on the left
BBCSO is a golden orchestral hall icon in the center
Serum is a crystalline structure on the right
Kontakt is literally a building you can enter, with wings for different libraries
You drag them to arrange your space. You double-click to load. You hover to preview (if the plugin supports it). You filter by dimming non-matching items rather than hiding them (so you still see the space).

The spatial arrangement means you develop muscle memory: "My aggressive bass synths are always bottom-left" becomes automatic.

Prior Art Worth Looking At
Lemur/TouchOSC - custom controller layouts (spatial arrangement of controls)
Max/MSP patcher interface - spatial object relationships
Blender's workspace tabs - context-based tool arrangements
Ableton's browser (actually not terrible) - hierarchical but visual preview
Video game inventory systems - Resident Evil 4's attaché case, Diablo's grid
Would you want to build something 2D spatial (overhead room view) or 3D navigable (literally walk through your plugin collection)? And are you thinking this as a DAW plugin or standalone launcher?



### @architect Response

**Decision:** Pivot to Card Collection + AI Assistant Hybrid ("Studio Memory")

We're pivoting from the node-canvas approach to a card-based collection interface inspired by Hearthstone/Magic: The Gathering, with AI-driven discovery and contextual recommendations planned for later phases.

**Core Philosophy:**
- Instruments are **cards** in a collection, not nodes on a canvas
- Organization happens through **decks** (workflow templates), not spatial positioning
- Discovery is **gamified** and **AI-assisted**, not manual searching
- The UI is **delightful and playful**, not utilitarian

---

## Implementation Plan

### Phase 1: Card Collection Foundation (This Feature)

**Goal:** Replace canvas with card-based grid view that feels like a collectible card game.

#### 1.1 Card Component (`InstrumentCard.tsx`)
- Visual card design with:
  - Instrument name prominently displayed
  - Developer name (smaller)
  - Category badge with color
  - Host badge (VST3, Kontakt, etc.)
  - Visual "rarity" indicator based on usage frequency:
    - **Legendary** (gold shimmer): Used 50+ times
    - **Epic** (purple glow): Used 20-49 times
    - **Rare** (blue): Used 5-19 times
    - **Common** (gray): Used 0-4 times
  - Hover state with:
    - Last used date
    - Usage count
    - Quick actions (edit, delete, add to deck)
- Card dimensions: ~250px wide × 350px tall (portrait orientation)
- Animations:
  - Flip animation on hover (show stats on back)
  - Glow effect for rarity
  - Smooth scale on hover
  - Satisfying click animation

#### 1.2 Collection View (`CollectionView.tsx`)
Replace `Canvas.tsx` with grid-based collection browser:
- **Grid layout** with CSS Grid (responsive columns: 4-6 cards per row)
- **Virtual scrolling** (react-window) for performance with 500+ cards
- **Sort options** dropdown:
  - Name (A-Z)
  - Recently added
  - Most used
  - Least used
  - Category
  - Developer
- **View density toggle**: Compact (smaller cards) vs. Spacious (larger cards)
- **Filters** (existing sidebar filters still apply)
- **Selection mode**: 
  - Click to select multiple cards
  - Selected cards have highlight border
  - "Create Deck" button appears when 2+ selected

#### 1.3 Deck Builder System
- **New Entity: `Deck`** (similar to current Template)
  ```typescript
  interface Deck {
    id: string;
    name: string;
    description: string;
    instruments: string[];  // Instrument IDs
    color: string;          // Deck theme color
    icon: string;           // Emoji or icon
    tags: string[];
    metadata: {
      createdAt: Date;
      lastUsed?: Date;
      usageCount: number;
    };
  }
  ```
- **Deck View** (`DeckView.tsx`):
  - Shows selected deck's cards in grid
  - "Add to Deck" button to add more instruments
  - "Edit Deck Info" to change name, description
  - "Delete Deck" option
  - "Use This Deck" button (increments usage count, updates lastUsed)
- **Deck Library** in sidebar:
  - List all decks
  - Click to view deck
  - Quick stats (card count, last used)

#### 1.4 Discovery Features (Basic)
- **Random Discovery**: "Surprise Me" button that:
  - Filters to least-used instruments
  - Shows 1-3 random cards with spotlight effect
  - Suggests creating a deck with them
- **Achievement System** (placeholder for now):
  - "Collector" - Add 50+ instruments
  - "Curator" - Create 5 decks
  - "Explorer" - Use 10 different instruments
  - (Display as badges, no functionality yet)

#### 1.5 Visual Polish
- **Card Artwork Placeholders**:
  - Generated gradient backgrounds based on category color
  - Large category icon watermark
  - Optional: User can upload custom card art later
- **Animations** (Framer Motion):
  - Staggered card entrance on load
  - Smooth flip animation
  - Deck shuffle animation when viewing deck
  - "Card pack opening" animation when adding new instruments
- **Sound Effects** (optional stretch goal):
  - Subtle "whoosh" when flipping card
  - "click" when selecting
  - "shimmer" for legendary cards

---

## Architecture Decisions

### ADR-001: Card UI Over Canvas

**Context:** The canvas approach doesn't provide enough value over traditional list views. Spatial positioning is arbitrary and doesn't build muscle memory.

**Decision:** Adopt card-based collection UI inspired by collectible card games.

**Rationale:**
1. **Scannable**: Grid view lets you see 12-24 items at once vs. canvas's variable visibility
2. **Mental Model**: Everyone understands card collections (Hearthstone, Magic, Steam library)
3. **Gamification-Ready**: Cards naturally support rarity, stats, achievements
4. **Performance**: Grid with virtual scrolling > hundreds of canvas nodes
5. **Fun Factor**: Cards are inherently more playful and engaging

**Consequences:**
- **Positive**: Better UX, more engaging, easier to build features on top of
- **Negative**: Lose spatial positioning (but we weren't using it effectively anyway)
- **Migration**: Canvas code becomes legacy, we refactor to collection view

---

### ADR-002: Decks Replace Templates and Groups

**Context:** Current Templates and Groups serve similar purposes but are confusing. Templates have layout data that's no longer relevant.

**Decision:** Merge concepts into **Decks** - curated collections of instruments for specific workflows.

**Rationale:**
1. **Clearer Mental Model**: "Deck" implies a working set, not just a static group
2. **Simpler Data**: No position data needed, just instrument IDs
3. **Better UX**: "Use This Deck" is clearer than "Load Template"
4. **Extensible**: Decks can later have AI-generated suggestions, auto-updating based on usage, etc.

**Consequences:**
- **Positive**: Simpler conceptually, easier to understand
- **Negative**: Breaking change from existing templates (migration needed)
- **Migration Strategy**: 
  - Convert existing Templates → Decks (drop layout data)
  - Convert Groups → Decks (already similar)
  - Provide migration utility on first launch

---

### ADR-003: Rarity System Based on Usage

**Context:** Users forget about underutilized instruments. Need passive discovery mechanism.

**Decision:** Implement visible "rarity" levels based on usage count, displayed as visual card effects.

**Rationale:**
1. **Passive Discovery**: Glancing at your collection shows which tools you're ignoring
2. **Gamification**: Rarity feels like progression (natural dopamine hit)
3. **Visual Hierarchy**: Easy to spot your "go-to" instruments vs. "dusty" ones
4. **No Extra Data**: Already tracking usage count

**Tiers:**
- **Legendary** (50+ uses): Gold shimmer effect
- **Epic** (20-49): Purple glow
- **Rare** (5-19): Blue border
- **Common** (0-4): Standard gray

**Consequences:**
- **Positive**: Makes "Surprise Me" more effective, encourages exploration
- **Negative**: Might make users feel bad about unused plugins (mitigate with positive framing: "Hidden Gems")

---

### ADR-004: Phase AI Integration, Build Foundation First

**Context:** AI recommendations are compelling but complex. Need working product first.

**Decision:** Phase 1 = Card UI + Decks + Basic Discovery. Phase 2+ = AI/LLM integration.

**Rationale:**
1. **De-risk**: Prove card UI works before adding AI complexity
2. **Iterative**: Get user feedback on core experience first
3. **Data Collection**: Need usage data to train AI effectively
4. **Technical Debt**: Don't want to refactor AI integration if UI doesn't work

**Phase Boundaries:**
- **Phase 1** (this feature): Card UI, Decks, Manual organization, Basic "Surprise Me"
- **Phase 2** (future): Local LLM (Ollama), Semantic search ("show me warm pads")
- **Phase 3** (future): Context-aware recommendations, Auto-deck generation

---

## Technical Implementation Details

### Component Architecture

```
App.tsx
├─ Sidebar.tsx (existing, update filters)
└─ CollectionView.tsx (NEW - replaces Canvas.tsx)
    ├─ CollectionHeader.tsx (sort/view options)
    ├─ InstrumentCard.tsx (NEW - main card component)
    │   ├─ CardFront.tsx
    │   ├─ CardBack.tsx (stats on hover/flip)
    │   └─ RarityEffect.tsx (visual glow/shimmer)
    ├─ DeckView.tsx (NEW - when viewing a deck)
    └─ DiscoveryModal.tsx (NEW - "Surprise Me" results)
```

### New Store: `deckStore.ts`

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
  useDeck: (deckId: string) => void; // Increment usage, update lastUsed
  
  // Computed
  getDeckById: (id: string) => Deck | undefined;
  getDecksForInstrument: (instrumentId: string) => Deck[];
}
```

### Update `instrumentStore.ts`

Add usage tracking:
```typescript
// New action
incrementUsage: (id: string) => void; // Increment usageCount, set lastUsed

// New computed
getInstrumentsByRarity: () => {
  legendary: Instrument[];
  epic: Instrument[];
  rare: Instrument[];
  common: Instrument[];
};

getRandomUnderused: (count: number) => Instrument[]; // For "Surprise Me"
```

### Update `uiStore.ts`

Add collection view state:
```typescript
interface UIState {
  // ... existing
  collectionView: {
    sortBy: 'name' | 'recent' | 'most-used' | 'least-used' | 'category';
    viewDensity: 'compact' | 'spacious';
    selectedCardIds: string[];
  };
  activeDeckId: string | null;
}
```

### Styling Approach

- **Tailwind** for layout and utilities
- **CSS Modules** for card-specific animations (to avoid Tailwind bloat)
- **Framer Motion** for orchestrated animations (stagger, flip, etc.)
- **shadcn/ui** for dropdowns, dialogs, buttons

### Migration Strategy

On app load, check if legacy data exists:
1. If `canvas-storage` has position data → ignore it
2. If `template-storage` exists → convert to decks
3. If `group-storage` exists → convert to decks
4. Show toast: "We've upgraded to a new collection view!"

---

## Files to Create

**New Components:**
- `src/components/Collection/CollectionView.tsx`
- `src/components/Collection/CollectionView.md`
- `src/components/Collection/CollectionHeader.tsx`
- `src/components/Collection/CollectionHeader.md`
- `src/components/Collection/InstrumentCard.tsx`
- `src/components/Collection/InstrumentCard.md`
- `src/components/Collection/CardFront.tsx` (sub-component, optional .md)
- `src/components/Collection/CardBack.tsx` (sub-component, optional .md)
- `src/components/Collection/RarityEffect.tsx`
- `src/components/Collection/RarityEffect.md`
- `src/components/Collection/DeckView.tsx`
- `src/components/Collection/DeckView.md`
- `src/components/Collection/DiscoveryModal.tsx`
- `src/components/Collection/DiscoveryModal.md`

**New Store:**
- `src/store/deckStore.ts`
- `src/store/deckStore.md`

**Updated Types:**
- `src/types/index.ts` (add `Deck` interface, `Rarity` type)

**Updated Stores:**
- `src/store/instrumentStore.ts` (add usage methods)
- `src/store/uiStore.ts` (add collection view state)

**Updated Components:**
- `src/App.tsx` (replace Canvas with CollectionView)
- `src/components/Sidebar/Sidebar.tsx` (add Deck Library section)

**Architecture Docs:**
- `docs/architecture/decisions.md` (add ADRs 001-004)
- `docs/architecture/card-collection.md` (NEW - comprehensive guide)

**Migration Utility:**
- `src/lib/migrateToCards.ts` (one-time data migration)

---

## Files to Remove (After Testing)

- `src/components/Canvas/Canvas.tsx`
- `src/components/Canvas/Canvas.md`
- `src/components/Canvas/InstrumentNode.tsx`
- `src/components/Canvas/InstrumentNode.md`
- `src/components/Canvas/GroupNode.tsx`
- `src/components/Canvas/GroupNode.md`
- `src/store/canvasStore.ts`
- `src/store/canvasStore.md`
- `src/store/groupStore.ts` (merged into deckStore)
- `src/store/groupStore.md`
- `src/store/templateStore.ts` (merged into deckStore)
- `src/store/templateStore.md`

*(Keep these in a `legacy/` folder during development for reference)*

---

## Visual Design Inspiration

**Card Style:**
- **Layout**: Portrait card similar to Hearthstone
- **Background**: Subtle gradient based on category color
- **Border**: Rounded corners (12px radius), rarity-based glow effect
- **Typography**: 
  - Instrument name: Bold, 18px
  - Developer: Regular, 12px, muted
- **Badges**: Small pills for Host (top-right), Category (bottom)
- **Hover State**: Lift effect (scale 1.05, shadow increase)

**Rarity Effects:**
- **Legendary**: Animated gold shimmer (CSS animation with gradient)
- **Epic**: Pulsing purple glow (box-shadow animation)
- **Rare**: Subtle blue border
- **Common**: No effect (clean default state)

**Grid Spacing:**
- Gap: 24px between cards
- Padding: 32px around grid
- Responsive breakpoints:
  - < 1200px: 3 columns
  - 1200-1600px: 4 columns
  - 1600-2000px: 5 columns
  - > 2000px: 6 columns

---

## Success Metrics

This feature is successful if:
1. ✅ Collection view renders 500+ cards smoothly (60fps scrolling)
2. ✅ Card flip animation feels delightful (subjective but important)
3. ✅ Creating a deck takes < 30 seconds
4. ✅ "Surprise Me" actually surfaces forgotten instruments effectively
5. ✅ User testing (you!) finds it more engaging than canvas

---

## Future Enhancements (Not This Feature)

**Phase 2: AI Integration**
- Ollama local LLM for semantic search
- "Show me warm pads" → filters to relevant cards
- Auto-tagging based on instrument name/description

**Phase 3: Advanced Discovery**
- "Daily Challenge" suggests random combo to try
- Collaborative filtering ("users like you also used...")
- Context detection (read DAW project files to suggest relevant decks)

**Phase 4: Social Features**
- Export/import decks as JSON
- Share decks with other users
- Community deck library

**Phase 5: DAW Integration**
- Drag card to DAW to load instrument
- OSC/MIDI communication with Bitwig
- Real-time preview (trigger MIDI notes)

---

## ADR Required?

**Yes** - Create `docs/architecture/card-collection.md` documenting:
- Philosophy behind card-based approach
- Design principles for card UI
- Rarity system rationale
- Deck vs. Template vs. Group decision
- Future AI integration plans

Also update `docs/architecture/decisions.md` with ADRs 001-004 above.

---

## Risk Assessment

**High Risk:**
- **User Resistance**: Canvas users might resist change
  - *Mitigation*: Keep legacy code accessible via feature flag initially
  
**Medium Risk:**
- **Performance**: 500+ cards with animations could lag
  - *Mitigation*: Virtual scrolling, CSS animations (GPU-accelerated), lazy load card images

**Low Risk:**
- **Scope Creep**: AI features are tempting to add now
  - *Mitigation*: Strict phase boundaries, document future plans but don't implement

---

## Next Agent: @coder

**Coder Prompt:**

```
BUILD CARD COLLECTION INTERFACE - PHASE 1 FOUNDATION

CONTEXT:
We're pivoting from the node-canvas approach to a card-based collection interface inspired by collectible card games like Hearthstone. The goal is to make instrument organization fun, visual, and gamified.

WHAT YOU'RE BUILDING:
1. Card-based grid view to replace the canvas
2. Beautiful instrument cards with rarity effects (based on usage)
3. Deck builder system (replaces Templates/Groups)
4. Basic discovery ("Surprise Me" for underused instruments)

IMPLEMENTATION STEPS:

STEP 1: Create Deck Store
- File: `src/store/deckStore.ts`
- Implement Deck interface and deckStore with Zustand
- Methods: createDeck, updateDeck, deleteDeck, addInstrumentsToDeck, removeInstrumentFromDeck, setActiveDeck, useDeck
- Include persist middleware (localStorage: 'deck-storage')
- Document in `src/store/deckStore.md`

STEP 2: Update instrumentStore
- Add `incrementUsage(id)` method
- Add `getInstrumentsByRarity()` computed selector (legendary/epic/rare/common based on usageCount)
- Add `getRandomUnderused(count)` for discovery

STEP 3: Update uiStore
- Add collectionView state: { sortBy, viewDensity, selectedCardIds }
- Add activeDeckId state
- Add methods: setCollectionSort, setViewDensity, toggleCardSelection, clearSelection

STEP 4: Create InstrumentCard Component
- File: `src/components/Collection/InstrumentCard.tsx`
- Props: instrument, isSelected, onSelect, onUse
- Display: name, developer, category badge, host badge, rarity indicator
- Hover: flip animation showing stats (usage count, last used)
- Click: toggle selection
- Double-click: "use" instrument (increment usage)
- Rarity visual effects:
  - Legendary (50+ uses): gold shimmer border
  - Epic (20-49): purple glow
  - Rare (5-19): blue border
  - Common (0-4): default
- Use Framer Motion for flip animation
- Tailwind for styling, card dimensions: ~250px × 350px
- Document in `src/components/Collection/InstrumentCard.md`

STEP 5: Create CollectionView Component
- File: `src/components/Collection/CollectionView.tsx`
- Replace Canvas as main view
- CSS Grid layout, responsive (4-6 columns)
- Map instruments to InstrumentCard components
- Show/hide based on filters (from uiStore)
- Selection mode: when 2+ cards selected, show "Create Deck" button
- Virtual scrolling optional (can add later if performance needed)
- Document in `src/components/Collection/CollectionView.md`

STEP 6: Create CollectionHeader Component
- File: `src/components/Collection/CollectionHeader.tsx`
- Dropdowns for:
  - Sort by (name, recent, most used, least used, category)
  - View density (compact, spacious)
- "Surprise Me" button (opens DiscoveryModal)
- Selected count badge (when in selection mode)
- "Create Deck" button (when 2+ selected)
- Document in `src/components/Collection/CollectionHeader.md`

STEP 7: Create DeckView Component
- File: `src/components/Collection/DeckView.tsx`
- Shows instruments in active deck
- "Add to Deck" button
- "Edit Deck Info" button (opens dialog)
- "Use This Deck" button (increments deck usage)
- Back to collection button
- Document in `src/components/Collection/DeckView.md`

STEP 8: Create DiscoveryModal Component
- File: `src/components/Collection/DiscoveryModal.tsx`
- Shows 1-3 random underused instruments
- Spotlight effect on cards
- "Add to New Deck" button
- "Not Interested" (get 3 more)
- Uses shadcn/ui Dialog
- Document in `src/components/Collection/DiscoveryModal.md`

STEP 9: Update Sidebar
- Add "Decks" section below filters
- List all decks with click to activate
- "New Deck" button
- Show active deck with highlight

STEP 10: Update App.tsx
- Replace <Canvas /> with:
  - <CollectionView /> when no active deck
  - <DeckView /> when deck is active

STEP 11: Add Deck Type to types/index.ts
```typescript
export interface Deck {
  id: string;
  name: string;
  description: string;
  instruments: string[];  // Instrument IDs
  color: string;
  icon: string;           // Emoji
  tags: string[];
  metadata: {
    createdAt: Date;
    lastUsed?: Date;
    usageCount: number;
  };
}

export type Rarity = 'legendary' | 'epic' | 'rare' | 'common';
```

STEP 12: Create Migration Utility (optional for now)
- Can implement later if needed
- For now, templates/groups just won't migrate

DESIGN NOTES:
- Card background: gradient based on category color
- Rarity effects: use CSS animations (gold shimmer = animated gradient)
- Framer Motion for flip animation (rotateY: 180deg)
- Keep it playful and fun!
- Use shadcn/ui components for dialogs, dropdowns, buttons

WHAT NOT TO DO:
- Don't implement AI features yet (Phase 2)
- Don't add sound effects (stretch goal)
- Don't worry about DAW integration (Phase 5)
- Don't delete Canvas components yet (move to legacy/ folder)

TESTING:
- Test with existing seed data (should have various usage counts)
- Test selection mode (select multiple, create deck)
- Test rarity visual effects (manually adjust usage counts to see all tiers)
- Test "Surprise Me" with mix of used/unused instruments

FILE SIZE LIMITS:
- InstrumentCard.tsx: <200 lines
- CollectionView.tsx: <250 lines
- If larger, split into sub-components

After implementation, generate detailed @test prompt with:
- What components need testing
- What stores need testing
- Edge cases to cover
- Visual regression testing notes
```

---

## 💻 Phase 2: Implementation

### @coder Response

**Changes Made:**
[List of what was implemented]

**Files Modified:**
[List with line counts]

**Commits:**
[List of commit messages]

**Issues Encountered:**
[Any problems or deviations from plan]

**Next Agent:** @test
**Test Prompt:**
```
[Detailed prompt for @test with specific instructions]
```

---

## 🧪 Phase 3: Testing

### @test Response

**Tests Created:**
[List of test files created]

**Test Coverage:**
[Summary of what's covered]

**Test Types:**
- [ ] Unit tests for business logic
- [ ] Integration tests for component interactions
- [ ] E2E tests for critical user flows

**Commits:**
[List of commit messages]

**Next Agent:** @docs
**Docs Prompt:**
```
[Detailed prompt for @docs with specific instructions]
```

---

## 📚 Phase 4: Documentation

### @docs Response

**Documentation Updated:**
[List of .md files updated]

**Changes Made:**
[Summary of documentation changes]

**Commits:**
[List of commit messages]

**Next Step:** Review & Push

---

## ✅ Phase 5: Review, Push & Merge

### Pre-Push Checklist (Completed by @docs Agent)
- [ ] All architecture decisions documented
- [ ] All code implemented per plan
- [ ] All tests written and passing
- [ ] All documentation updated
- [ ] Code formatted with Prettier
- [ ] All CI checks pass locally
- [ ] Branch pushed to GitHub

### @docs Agent Responsibilities

**1. Format All Code**
```bash
npm run format
```

**2. Run All CI Checks**
```bash
npm run pre-push
```

**3. Commit Formatting Changes (if any)**
```bash
git add -A
git commit -m "style: format code with Prettier"
```

**4. Push to GitHub**
```bash
git push -u origin [branch-name]
```

**5. Instruct Engineer**
Provide engineer with:
- GitHub branch URL
- Instructions to create PR
- Reminder to run `npm run feature:complete` after merge

### Engineer Responsibilities

**After @docs pushes to GitHub:**

1. **Create Pull Request**
   - Visit: https://github.com/username/repo/pull/new/[branch-name]
   - Fill in PR description with feature summary
   - Link to any related issues
   - Request reviews if needed

2. **Wait for CI/CD to Pass**
   - Verify all GitHub Actions checks pass
   - Address any failures

3. **Merge via GitHub**
   - Use GitHub's merge button (NOT local merge)
   - Choose merge strategy (squash/merge/rebase per team policy)

4. **Run Cleanup**
   ```bash
   npm run feature:complete
   ```
   - Archives the feature file
   - Provides cleanup instructions

5. **Clean Up Local Branches**
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/[branch-name]
   ```

---

## 📝 Notes & Learnings
[Any insights, gotchas, or things to remember]

