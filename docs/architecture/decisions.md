# Architecture Decision Records (ADRs)

This document tracks major architectural decisions made during the development of the Music Plugin Organizer.

## ADR-001: React Flow for Canvas Visualization

**Date:** 2024-12-19  
**Status:** Accepted

### Context
We needed an infinite spatial canvas with zoom, pan, drag, and connection capabilities for visualizing instrument relationships.

### Decision
Use React Flow instead of a custom Canvas API implementation.

### Rationale
- React Flow provides node rendering, dragging, zoom, pan, and connections out of the box
- Custom canvas would require weeks of development for basic features
- React Flow is battle-tested and handles edge cases
- Built-in support for custom node types and edge styling
- Active maintenance and community support

### Consequences
- **Positive:** Rapid development, reliable zoom/pan, built-in minimap
- **Negative:** Additional dependency (~200KB), some customization limitations
- **Mitigation:** React Flow is well-optimized and the bundle size is acceptable for a desktop app

---

## ADR-002: Zustand for State Management

**Date:** 2024-12-19  
**Status:** Accepted

### Context
Need lightweight state management for instruments, canvas state, UI state, groups, and templates.

### Decision
Use Zustand instead of Redux or Context API.

### Rationale
- Lightweight (~1KB) compared to Redux
- Simple API, no boilerplate
- Built-in persistence middleware
- TypeScript-friendly
- Perfect for canvas state + app state combination

### Consequences
- **Positive:** Minimal boilerplate, easy to understand, good performance
- **Negative:** Less ecosystem than Redux, no time-travel debugging
- **Mitigation:** Zustand's simplicity reduces need for complex debugging tools

---

## ADR-003: LocalStorage for Initial Persistence

**Date:** 2024-12-19  
**Status:** Accepted (with migration path)

### Context
Need to persist instrument data, groups, templates, and canvas state between sessions.

### Decision
Start with LocalStorage, plan migration to IndexedDB for Phase 2.

### Rationale
- LocalStorage is simple and works immediately
- No async complexity for MVP
- Sufficient for <1000 instruments
- Easy migration path to IndexedDB later

### Consequences
- **Positive:** Fast implementation, synchronous API, no setup required
- **Negative:** 5-10MB size limit, synchronous blocking, no complex queries
- **Migration Plan:** IndexedDB migration planned for Phase 4 when performance becomes critical

---

## ADR-004: Electron for Desktop App

**Date:** 2024-12-19  
**Status:** Accepted

### Context
Need desktop application with filesystem access for directory scanning.

### Decision
Use Electron instead of Tauri or native development.

### Rationale
- Mature ecosystem with extensive documentation
- Full filesystem access via IPC
- Cross-platform (Windows, macOS, Linux)
- Large community and tooling support
- Easy integration with React

### Consequences
- **Positive:** Rapid development, cross-platform, familiar web stack
- **Negative:** Larger bundle size (~100MB+), higher memory usage
- **Mitigation:** Bundle size acceptable for desktop app, memory usage reasonable for this use case

---

## ADR-005: Bidirectional Pairing Relationships

**Date:** 2024-12-19  
**Status:** Accepted

### Context
When instrument A pairs with instrument B, should B automatically pair with A?

### Decision
Yes, pairings are always bidirectional.

### Rationale
- Simplifies UX - users don't need to create two connections
- Makes sense for the domain - if A works with B, B works with A
- Reduces data inconsistency
- Easier to query and visualize

### Consequences
- **Positive:** Simpler mental model, consistent data, easier queries
- **Negative:** Slight storage overhead (storing IDs in both instruments)
- **Mitigation:** Storage overhead is minimal, consistency is more valuable

---

## ADR-006: Modular File Structure with Documentation

**Date:** 2024-12-19  
**Status:** Accepted

### Context
Agents lose context, documentation becomes stale, code becomes spaghetti.

### Decision
Enforce modular structure with component-level .md files and architecture docs.

### Rationale
- Each module documents itself
- Agents can read/write docs alongside code
- Prevents knowledge loss
- Forces modular thinking

### Consequences
- **Positive:** Self-documenting codebase, easier onboarding, better maintainability
- **Negative:** More files to maintain, requires discipline
- **Mitigation:** Automated validation in CI/CD, clear documentation rules

---

## ADR-007: shadcn/ui for Component Library

**Date:** 2024-12-19  
**Status:** Accepted

### Context
Need consistent, accessible UI components with dark theme support.

### Decision
Use shadcn/ui (Radix UI primitives + Tailwind) instead of Material-UI or Ant Design.

### Rationale
- Copy-paste components (not a dependency)
- Full control over styling
- Built on Radix UI (excellent accessibility)
- Tailwind CSS for easy customization
- Dark theme out of the box

### Consequences
- **Positive:** No version conflicts, full customization, excellent a11y
- **Negative:** More setup, need to copy components manually
- **Mitigation:** Components are copied once, then maintained in project

---

## ADR-008: TypeScript Strict Mode

**Date:** 2024-12-19  
**Status:** Accepted

### Context
Type safety and code quality requirements.

### Decision
Enable TypeScript strict mode with all checks enabled.

### Rationale
- Catches errors at compile time
- Better IDE support and autocomplete
- Self-documenting code through types
- Prevents common JavaScript pitfalls

### Consequences
- **Positive:** Fewer runtime errors, better refactoring safety
- **Negative:** More verbose, requires type definitions
- **Mitigation:** Types pay off in long-term maintenance

---

## 🔄 MAJOR PIVOT: Card Collection Interface

**Date:** 2025-12-23  
**Status:** In Progress

The following ADRs document the architectural pivot from node-canvas to card-based collection interface.

This is an **exploratory project** focused on creative intuition over incremental improvement. Current DAW browsers (Bitwig, Ableton, Omnisphere 3) are frustrating musicians. We're testing a radical alternative.

---

## ADR-009: Card-Based UI Over Spatial Canvas

**Date:** 2025-12-23  
**Status:** Accepted

### Context
The node-canvas approach feels uninspiring and reminds users of work tools (Jira boards). After testing, it's clear the canvas isn't fun or useful. Current music software UIs have stagnated - Omnisphere 3 shipped with amazing samples but musicians are frustrated by the unchanged, painful interface.

We need something **radically different** that makes browsing a plugin collection feel exciting, not utilitarian.

### Decision
**Completely remove** the canvas interface and replace it with a card-based collection grid inspired by collectible card games (Hearthstone) and modern game libraries (GOG Galaxy, Steam).

This is a full replacement, not a toggle or alternative view.

### Rationale
1. **Fun First**: Opening a card collection feels exciting, like opening a deck of magic cards
2. **Visual Browsing**: Grid layout shows 12-24 cards at once, easy to scan visually
3. **Familiar Mental Model**: Everyone understands card collections from games, trading cards, music streaming
4. **Extensible Foundation**: Cards can support artwork, animations, stats, rarity without rearchitecting
5. **Better Than DAWs**: Current plugin browsers are essentially boring lists. We can do better.
6. **Creative Intuition**: Following a gut feeling that spatial organization of abstract nodes is the wrong paradigm

### Consequences
- **Positive:** More engaging UX, better discoverability, easier to build features on top of, better performance
- **Negative:** Lose spatial positioning (but we weren't using it effectively anyway)
- **Migration:** Canvas code becomes legacy, moved to `legacy/` folder for reference

### Alternatives Considered
1. **Improve Canvas**: Add visual polish, better layouts
   - Rejected: User tested it, not inspiring, feels like work tools
2. **Traditional List View**: Like Ableton browser with folders
   - Rejected: This is what everyone does, and it sucks
3. **3D Virtual Studio**: Walk through rooms with instruments
   - Rejected: Too complex for Phase 1, might be gimmicky

### Phase 1 Simplifications
To prove the concept quickly:
- **No rarity system** (needs usage data first)
- **No deck builder** (Phase 2)
- **No animations** beyond basic hover effects
- **No "Surprise Me"** discovery (Phase 2)
- **Focus**: Beautiful cards + auto-scanning = immediate value

---

## ADR-010: Directory Auto-Scanning for Real Data

**Date:** 2025-12-23  
**Status:** Accepted

### Context
Manually adding 100+ plugins defeats the purpose. Need immediate value with real plugin collection, not seed data.

### Decision
Implement directory scanner that auto-discovers VST3/AU plugins and creates instrument cards automatically.

**Phase 1 Priority:** This is critical to test with real data.

### Rationale
1. **Immediate Value**: See your actual collection in seconds
2. **Real Testing**: Test UI with 50-200 real plugins, not 10 seed items
3. **Discovery**: Find plugins you forgot you owned
4. **Foundation**: Enables future usage tracking, recommendations
5. **Reduces Friction**: Zero manual data entry

### Implementation
- **Windows Paths**:
  - `C:\Program Files\Common Files\VST3\`
  - `C:\Program Files\VSTPlugins\`
  - User can configure additional paths
- **Mac Paths**:
  - `/Library/Audio/Plug-Ins/VST3/`
  - `/Library/Audio/Plug-Ins/Components/` (AU)
- **Metadata Extraction**:
  - Parse VST3 module info (name, manufacturer)
  - Fallback to filename if metadata unavailable
  - Auto-categorize by folder/naming patterns (synth, effect, etc.)
- **Progress UI**: Show scan progress with count

### Consequences
- **Positive:** Immediate real-world testing, finds forgotten plugins
- **Negative:** Platform-specific code, metadata parsing complexity
- **Technical Debt:** Will need refinement for Kontakt libraries (folder-based, not single files)

---

## ADR-011: Decks Replace Templates and Groups (Phase 2)

**Date:** 2025-12-23  
**Status:** Deferred to Phase 2

### Context
Current system has both Templates (with position data) and Groups (visual containers). With canvas removed, position data is irrelevant. However, for Phase 1, we're focusing on cards + scanning only.

**Phase 1:** Templates and Groups remain unchanged (though less prominent without canvas).  
**Phase 2:** Will merge into **Decks** once card UI is proven.

### Decision (Future)
Merge Templates and Groups into **Decks** - curated collections of instruments for specific workflows (e.g., "Cinematic Scoring", "Electronic Production").

### Rationale
1. **Clearer Mental Model**: "Deck" implies a working set for a specific purpose
2. **Simpler Data Structure**: Just instrument IDs, no position data
3. **Better UX**: "Use This Deck" is clearer than "Load Template"
4. **Extensible**: Decks can later have AI-generated suggestions, auto-updating based on usage patterns
5. **Familiar**: Decks are understood from card games, playlists, etc.

### Consequences
- **Positive:** Simpler conceptually, easier to understand and use
- **Negative:** Breaking change from existing templates/groups (migration needed)
- **Migration Strategy:**
  - Convert existing Templates → Decks (drop layout/position data)
  - Convert Groups → Decks (already conceptually similar)
  - Migration happens on first app launch after update

---

## ADR-012: Usage-Based Rarity System (Phase 2)

**Date:** 2025-12-23  
**Status:** Deferred to Phase 2

### Context
Users forget about underutilized instruments. Need a passive discovery mechanism that surfaces forgotten tools without requiring manual organization.

**Phase 1:** Skip rarity system - need usage data first.  
**Phase 2:** Add rarity after collecting usage patterns.

### Decision (Future)
Implement visible "rarity" levels based on usage count, displayed as visual card effects (shimmer, glow, border).

**Rarity Tiers:**
- **Legendary** (50+ uses): Animated gold shimmer effect
- **Epic** (20-49 uses): Pulsing purple glow
- **Rare** (5-19 uses): Blue border
- **Common** (0-4 uses): Standard gray/default appearance

### Rationale
1. **Passive Discovery**: Glancing at collection shows which tools are forgotten vs. frequently used
2. **Gamification**: Rarity feels like progression, provides positive feedback (dopamine hit)
3. **Visual Hierarchy**: Easy to spot "go-to" instruments vs. "hidden gems"
4. **No Extra Data**: Already tracking usage count in metadata
5. **Self-Organizing**: System automatically updates as behavior changes

### Consequences
- **Positive:** Makes "Surprise Me" feature more effective, encourages exploration, provides satisfying visual feedback
- **Negative:** Might make users feel guilty about unused plugins
- **Mitigation:** Frame unused instruments positively as "Hidden Gems" or "Undiscovered Treasures"

### Future Enhancements
- Time-based decay (instruments get "dusty" if unused for 6+ months)
- Context-aware rarity (per-genre or per-project-type usage)
- Achievement system tied to trying new instruments

---

## ADR-013: Phased Feature Development

**Date:** 2025-12-23  
**Status:** Accepted

### Context
Original plan included rarity, decks, AI, animations, and more in Phase 1. That's too much. This is an exploratory project - need to prove card UI concept works before adding complexity.

### Decision
Radically simplify Phase 1. Add features incrementally only after validating previous phases.

**Revised Phase Boundaries:**
- **Phase 1** (Current - This Feature): 
  - Card grid UI only
  - Basic card display (name, developer, category, host)
  - Auto-scan plugin directories
  - Existing filters work with cards
  - Simple hover effects
  - **No** rarity, **no** decks, **no** complex animations
  
- **Phase 2** (Future): 
  - Usage tracking + rarity visual effects
  - Deck builder system
  - "Surprise Me" discovery
  - Flip animations
  
- **Phase 3** (Future): 
  - Local LLM integration (Ollama)
  - Semantic search ("warm pads", "aggressive bass")
  - Auto-deck generation
  
- **Phase 4** (Future): 
  - DAW integration
  - Context detection
  - Real-time suggestions

### Rationale
1. **Validate Core Concept**: Is card UI actually better? Prove it before building on top
2. **Exploratory Project**: Following creative intuition, not building production app yet
3. **Reduce Risk**: Don't invest weeks in features if foundation doesn't work
4. **Faster Feedback**: Get something visual working in days, not weeks
5. **Data First**: Can't build usage-based features without usage data

### Consequences
- **Positive:** Fast validation, clear go/no-go decisions, manageable scope
- **Negative:** Full vision takes longer to realize
- **Acceptable:** This is exploration, not shipping to users yet

---

## ADR-014: Interactive Cards with Usage-Based Rarity

**Date:** 2025-12-24  
**Status:** Accepted

### Context

Phase 1 card collection is complete and validated. Cards are currently static - they display information but don't allow interaction or show usage-based visual feedback. Usage tracking infrastructure exists (`markAsUsed`, `usageCount`, `lastUsed`) but is not exposed in the UI.

Users need:
1. **Visual feedback** showing which instruments are frequently used vs. forgotten
2. **Quick actions** to mark instruments as used directly from cards
3. **Context menu** for common operations (edit, delete, mark as used)
4. **Visual polish** that makes browsing more engaging

This builds on ADR-012's rarity concept but adds the interaction layer needed to make it functional.

### Decision

Implement interactive cards with usage-based visual rarity system:

**Visual Rarity Tiers:**
- **Legendary** (50+ uses): Gold shimmer animation, gold border, subtle glow
- **Epic** (20-49 uses): Purple glow effect, purple border accent
- **Rare** (5-19 uses): Blue border highlight
- **Common** (0-4 uses): Standard appearance (no special effects)

**Card Interactions:**
- Right-click context menu with: Mark as Used, Edit, Delete, View Details
- Quick "Mark as Used" button on hover (subtle, doesn't clutter)
- Visual feedback when marking as used (brief success animation)
- Optional usage count badge (toggleable in settings)

**Implementation Details:**
- Rarity calculated in real-time from `instrument.metadata.usageCount`
- Visual effects using CSS animations/transitions (no heavy libraries)
- Context menu using shadcn/ui DropdownMenu component
- Usage count badge is optional (hidden by default, can be enabled)

### Rationale

1. **Builds on Existing Infrastructure**: Usage tracking already exists, just needs UI exposure
2. **Immediate Visual Value**: Makes collection browsing more engaging and informative
3. **Self-Organizing**: System improves over time as users interact with instruments
4. **Enables Future Features**: Foundation for "Surprise Me" discovery and deck recommendations
5. **Focused Scope**: Cards-only feature, doesn't require broader refactoring
6. **Gamification Psychology**: Visual rarity provides positive feedback, encourages exploration

### Consequences

- **Positive:** 
  - More engaging UI that provides immediate feedback
  - Users can discover underutilized instruments at a glance
  - Foundation for discovery features
  - Makes browsing feel more like a collection game
  
- **Negative:** 
  - Adds complexity to card rendering logic
  - CSS animations need performance testing with large collections
  - Context menu adds interaction complexity
  
- **Mitigation:**
  - Keep animations lightweight (CSS transforms, not JavaScript)
  - Use React.memo on InstrumentCard to prevent unnecessary re-renders
  - Performance test with 500+ cards before optimizing
  - Keep context menu simple (4-5 actions max)

### Alternatives Considered

1. **Separate Rarity Badge Only** (no interactions)
   - Rejected: Doesn't solve the "how do I mark as used?" problem
   
2. **Modal Dialog for Marking as Used**
   - Rejected: Too much friction, breaks browsing flow
   
3. **Sidebar Panel for Usage Stats**
   - Rejected: Users already have Analytics panel, need card-level feedback
   
4. **Complex Animation Library (Framer Motion)**
   - Rejected: Adds bundle size, CSS animations sufficient for Phase 2

### Implementation Notes

- Rarity calculation: Pure function `getRarityTier(usageCount: number) => 'common' | 'rare' | 'epic' | 'legendary'`
- Visual effects: CSS classes applied based on rarity tier
- Context menu: Positioned at cursor, keyboard accessible
- Usage count badge: Small badge in corner, only visible if enabled in settings
- Animation timing: 200-300ms transitions, subtle and non-distracting

### Future Enhancements

- Time-based decay (instruments unused for 6+ months get "dusty" effect)
- Per-category rarity (separate tiers for different categories)
- Achievement system ("Discover 10 rare instruments")
- Usage streak tracking ("Used 5 days in a row")

---

## Related Documentation

- **Card Collection Guide**: `docs/architecture/card-collection.md` (comprehensive design guide)
- **Data Model**: `docs/architecture/data-model.md` (updated with Deck entity)
- **State Management**: `docs/architecture/state-management.md` (updated with deckStore)

---

## Status Summary

**Phase 1 (Complete):**
- **ADR-009**: Card-Based UI - ✅ Complete
- **ADR-010**: Auto-Scanning - ✅ Complete
- **ADR-013**: Phased Development - ✅ Complete

**Phase 2 (Current - In Progress):**
- **ADR-014**: Interactive Cards with Usage-Based Rarity - ✅ Accepted, implementing now
- **ADR-011**: Decks System - Deferred to Phase 2.1
- **ADR-012**: Rarity System - Superseded by ADR-014 (implementation)

**Legacy (Being Removed in Phase 1):**
- ADR-001: React Flow - Canvas components will be deleted
- CanvasStore - Being removed
- GroupStore/TemplateStore - Kept for now, will merge in Phase 2

**Active (Unchanged):**
- ADR-002: Zustand - Still primary state management
- ADR-003: LocalStorage - Still primary persistence
- ADR-004: Electron - Still primary platform
- ADR-005: Bidirectional Pairings - Kept, less prominent in card UI
- ADR-006: Modular Documentation - Still enforced
- ADR-007: shadcn/ui - Still primary component library
- ADR-008: TypeScript Strict - Still enforced

---

## ADR-015: Directory Scanning Bug Fixes

**Date:** 2025-12-24  
**Status:** Accepted

### Context

Directory scanning feature exists but has critical bugs preventing use:
1. "Scan Directories" button in empty state opens Add Instrument modal instead of scanning
2. Directory scanning buttons are disabled in Electron app (`window.electronAPI` not available)
3. No user feedback explaining why buttons are disabled or what to do

Users cannot populate the collection with their actual plugins, blocking core functionality.

### Decision

Fix critical bugs to make directory scanning functional:
1. Fix CollectionView "Scan Directories" button to trigger actual scanning
2. Fix Electron API exposure (preload script contextBridge)
3. Add better error handling and user feedback
4. Add diagnostic logging for Electron API availability

**Scope:** Bug fixes only, no new features. Get existing functionality working.

### Rationale

1. **Blocks Core Functionality**: Users can't import plugins without this working
2. **Quick Win**: These are straightforward bugs, not architectural issues
3. **Validates Approach**: Need working scanning before building enhanced features
4. **User Experience**: Clear feedback prevents confusion

### Consequences

- **Positive:** 
  - Users can actually scan and import plugins
  - Better error messages guide users
  - Foundation for enhanced directory management (Phase 2.1)
  
- **Negative:** 
  - None - these are bug fixes
  
- **Mitigation:**
  - Add console logging for debugging Electron API issues
  - Clear error messages guide users to solutions

### Implementation Details

**Bug 1: CollectionView Button**
- Change `onClick={openAddInstrument}` to trigger directory scanning
- Options: Direct call to DirectoryScanner function, or expose scanning action from store

**Bug 2: Electron API Not Available**
- Verify preload script is loading correctly
- Check contextBridge is exposing API before window loads
- Add diagnostic logging to identify timing issues
- Ensure preload path is correct in main.ts

**Bug 3: User Feedback**
- Show tooltip/alert when Electron API unavailable
- Explain that Electron app is required (not web mode)
- Add console warnings for developers

### Related
- ADR-010: Auto-Scanning (original feature)
- Component: `src/components/Collection/CollectionView.tsx`
- Component: `src/components/Sidebar/DirectoryScanner.tsx`
- Electron: `electron/main.ts`, `electron/preload.ts`


