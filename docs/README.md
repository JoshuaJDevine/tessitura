# Documentation Index

**Last Updated:** 2024-12-19

## Overview

This project follows a **self-documenting architecture** where every module has its own documentation file. This ensures agents and developers can understand the codebase without losing context.

## Documentation Structure

### Architecture Documentation

Located in `docs/architecture/`:

- **[decisions.md](architecture/decisions.md)** - Architecture Decision Records (ADRs)
  - Major technical decisions and rationale
  - Trade-offs and consequences
  
- **[data-model.md](architecture/data-model.md)** - Data structure documentation
  - Entity definitions
  - Relationships and constraints
  - Persistence strategy
  
- **[state-management.md](architecture/state-management.md)** - State management patterns
  - Store architecture
  - Data flow
  - Performance considerations

### Component Documentation

Each component has a corresponding `.md` file in the same directory:

**Canvas Components:**
- `src/components/Canvas/Canvas.md` - Main canvas component
- `src/components/Canvas/InstrumentNode.md` - Instrument node component
- `src/components/Canvas/GroupNode.md` - Group node component (if needed)

**Sidebar Components:**
- `src/components/Sidebar/FilterPanel.md` - Filter panel
- `src/components/Sidebar/AddInstrument.md` - Add/edit instrument dialog
- `src/components/Sidebar/Analytics.md` - Analytics dashboard (if needed)
- `src/components/Sidebar/DirectoryScanner.md` - Directory scanner (if needed)
- `src/components/Sidebar/TemplateLibrary.md` - Template library (if needed)

### Store Documentation

Each store has a corresponding `.md` file:

- `src/store/instrumentStore.md` - Instrument data management
- `src/store/canvasStore.md` - Canvas state management
- `src/store/uiStore.md` - UI state management (if needed)
- `src/store/groupStore.md` - Group management (if needed)
- `src/store/templateStore.md` - Template management (if needed)

### Hook Documentation

Each hook has a corresponding `.md` file:

- `src/hooks/useKeyboardShortcuts.md` - Keyboard shortcuts hook

## Documentation Requirements

Every `.md` file must contain:

1. **Purpose** - What does this module do?
2. **Dependencies** - What does it rely on?
3. **Usage** - How to use it (with examples)
4. **State** - What state does it manage?
5. **Props/API** - Interface documentation
6. **Last Updated** - Date and reason for change

## Validation

Run the documentation validation script:

```bash
npm run docs:validate
```

This checks that all components, hooks, and stores have corresponding `.md` files.

## Maintenance

### When Adding New Code

1. Create the component/hook/store file
2. **Immediately create** the corresponding `.md` file
3. Document purpose, dependencies, usage, and API
4. Run `npm run docs:validate` to verify

### When Modifying Code

1. Update the code
2. **Update the corresponding `.md` file** with:
   - New features/changes
   - Updated "Last Updated" date
   - Reason for change

### When Making Architectural Changes

1. Update `docs/architecture/decisions.md` with a new ADR
2. Update relevant architecture docs if data model or state management changes

## Benefits

- **Agent-Friendly**: AI agents can read docs alongside code
- **Onboarding**: New developers understand modules quickly
- **Maintenance**: Changes are documented as they happen
- **Knowledge Preservation**: Context isn't lost over time

## File Size Limits

To maintain modularity:

- Components: <200 lines
- Hooks: <150 lines
- Services: <300 lines

If exceeding, split into smaller modules (each with its own `.md` file).




