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

**Date:** 2024-12-22  
**Status:** In Progress

The following ADRs document the architectural pivot from node-canvas to card-based collection interface.

---

## ADR-009: Card-Based UI Over Spatial Canvas

**Date:** 2024-12-22  
**Status:** Accepted

### Context
The node-canvas approach (using React Flow) is functional but doesn't solve the core problem: discovery and memory. Spatial positioning is arbitrary and doesn't build muscle memory. Users still forget about underutilized instruments.

### Decision
Replace the canvas interface with a card-based collection UI inspired by collectible card games (Hearthstone, Magic: The Gathering).

### Rationale
1. **Better Scanning**: Grid view shows 12-24 items at once vs. canvas's variable visibility
2. **Clear Mental Model**: Everyone understands card collections (trading cards, Steam library)
3. **Gamification-Ready**: Cards naturally support rarity, stats, achievements, and progression
4. **Performance**: Grid with virtual scrolling outperforms hundreds of canvas nodes
5. **Visual Hierarchy**: Rarity effects create passive discovery (glowing cards = frequently used)
6. **Fun Factor**: Cards are inherently more playful and engaging than nodes on a canvas

### Consequences
- **Positive:** More engaging UX, better discoverability, easier to build features on top of, better performance
- **Negative:** Lose spatial positioning (but we weren't using it effectively anyway)
- **Migration:** Canvas code becomes legacy, moved to `legacy/` folder for reference

### Alternatives Considered
1. **3D Memory Palace**: Navigable 3D space with instruments in rooms
   - Rejected: Too complex for MVP, might feel gimmicky
2. **Modular Rack UI**: Vertical rack with patch cables
   - Rejected: Doesn't scale beyond ~20 instruments per rack
3. **Keep Canvas**: Improve existing approach
   - Rejected: Fundamentally doesn't solve discovery problem

---

## ADR-010: Decks Replace Templates and Groups

**Date:** 2024-12-22  
**Status:** Accepted

### Context
Current system has both Templates (with position data) and Groups (visual containers). With the canvas removed, position data is irrelevant. Both concepts serve similar purposes and cause confusion.

### Decision
Merge Templates and Groups into a single concept: **Decks**.

A Deck is a curated collection of instruments for a specific workflow (e.g., "Cinematic Scoring", "Electronic Production", "Sound Design Experiments").

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

## ADR-011: Usage-Based Rarity System

**Date:** 2024-12-22  
**Status:** Accepted

### Context
Users forget about underutilized instruments. Need a passive discovery mechanism that surfaces forgotten tools without requiring manual organization.

### Decision
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

## ADR-012: Phased AI Integration

**Date:** 2024-12-22  
**Status:** Accepted

### Context
AI-powered recommendations and semantic search ("show me warm pads") are compelling features, but add significant complexity. Need to prove the core card UI works before investing in AI infrastructure.

### Decision
Phase AI integration after core card UI is proven. Build foundation first, add intelligence later.

**Phase Boundaries:**
- **Phase 1** (Current): Card UI, Decks, Manual organization, Basic "Surprise Me" (random underused instruments)
- **Phase 2** (Future): Local LLM integration (Ollama), Semantic search ("warm pads", "aggressive bass")
- **Phase 3** (Future): Context-aware recommendations, Auto-deck generation, Collaborative filtering
- **Phase 4** (Future): DAW integration, Project context detection, Real-time suggestions

### Rationale
1. **De-risk Development**: Prove card UI works before adding AI complexity
2. **Iterative Approach**: Get user feedback on core experience first
3. **Data Collection**: Need usage data to train/tune AI effectively
4. **Technical Debt Avoidance**: Don't want to refactor AI integration if UI paradigm changes
5. **Manageable Scope**: Each phase is shippable and valuable on its own

### Consequences
- **Positive:** Lower risk, faster initial delivery, clear milestones, easier testing
- **Negative:** Full vision takes longer to realize, users might expect AI immediately
- **Mitigation:** Be transparent about roadmap, ship Phase 1 as "MVP" with clear future plans

### Technical Considerations
- **Phase 2 Tech Stack**: Ollama (local LLM), vector embeddings for semantic search
- **Phase 3 Tech Stack**: ML clustering for auto-deck generation, usage pattern analysis
- **Phase 4 Tech Stack**: Electron IPC for DAW communication, file parsing for project context

---

## Related Documentation

- **Card Collection Guide**: `docs/architecture/card-collection.md` (comprehensive design guide)
- **Data Model**: `docs/architecture/data-model.md` (updated with Deck entity)
- **State Management**: `docs/architecture/state-management.md` (updated with deckStore)

---

## Status Summary

**Legacy (Superseded):**
- ADR-001: React Flow for Canvas - No longer primary interface, but kept for reference
- GroupStore and TemplateStore - Replaced by DeckStore

**Active:**
- ADR-002: Zustand - Still primary state management
- ADR-003: LocalStorage - Still primary persistence
- ADR-004: Electron - Still primary platform
- ADR-005: Bidirectional Pairings - Kept, but less prominent in card UI
- ADR-006: Modular Documentation - Still enforced
- ADR-007: shadcn/ui - Still primary component library
- ADR-008: TypeScript Strict - Still enforced
- ADR-009-012: Card Collection Pivot - **Active development**


