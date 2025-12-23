# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Initial project setup with Electron + React + Vite + TypeScript
- React Flow canvas with zoom, pan, drag capabilities
- Instrument data model and Zustand store with LocalStorage persistence
- Add/Edit instrument form with all metadata fields
- Custom React Flow nodes for instruments with styling
- Search and filter functionality (text, tags, categories, hosts)
- Pairing system with bidirectional connections
- Right-click context menu for node operations
- Random suggestion algorithm ("Surprise Me")
- Template system for saving/loading instrument clusters
- Group objects with collapse/expand functionality
- Directory scanner with parsing heuristics
- Analytics dashboard with usage tracking
- Keyboard shortcuts (Ctrl+K, Ctrl+N, /, Escape)
- Minimap and visual polish
- Dark theme UI with Tailwind CSS and shadcn/ui
- Self-documenting architecture with component-level .md files
- Architecture documentation (ADRs, data model, state management)
- **Comprehensive test suite:** 202 tests achieving 80%+ code coverage across all critical business logic

### Technical
- TypeScript strict mode enabled
- Zustand for state management with persist middleware
- React Flow for canvas visualization
- Electron for desktop app with filesystem access
- Modular file structure with documentation
- **Vitest + React Testing Library:** 85% line coverage, 90% function coverage with 202 tests

## [Future]

### Planned
- IndexedDB migration for better performance with large libraries
- Undo/redo for canvas operations
- Multi-select with selection box
- Keyboard navigation (arrow keys)
- Export/import entire library as JSON
- DAW project file parsing
- Community template sharing

