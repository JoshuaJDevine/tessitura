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


