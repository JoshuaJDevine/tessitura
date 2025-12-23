# Music Plugin Organizer

A desktop React application for visually organizing music production plugins and sample libraries using an infinite spatial canvas with nodes, connections, and intelligent discovery features.

## Features

- **Visual Canvas**: Infinite spatial canvas with pan, zoom, and drag capabilities
- **Instrument Management**: Add, edit, and organize instruments with detailed metadata
- **Pairing System**: Create visual connections between instruments that work well together
- **Search & Filtering**: Advanced filtering by category, host, tags, and search queries
- **Random Suggestions**: Discover forgotten or underutilized instruments
- **Templates**: Save and load workflow templates for common instrument combinations
- **Groups**: Visual grouping of related instruments
- **Analytics**: Usage tracking and insights dashboard
- **Directory Scanner**: Semi-automatic import from filesystem
- **Dark Theme**: Modern dark UI optimized for music production workflows

## Tech Stack

- **React 18** with TypeScript
- **Electron** for desktop application
- **React Flow** for canvas visualization
- **Zustand** for state management
- **Tailwind CSS** + **shadcn/ui** for styling
- **Vite** for build tooling

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. In another terminal, start Electron:
```bash
npm run electron:dev
```

### Building

Build for production:
```bash
npm run build
```

This will create distributable packages in the `release/` directory.

## Usage

1. **Add Instruments**: Click "Add Instrument" in the sidebar to add new plugins/instruments
2. **Organize**: Drag nodes on the canvas to position them spatially
3. **Create Pairings**: Select two nodes and use the context menu to create connections
4. **Filter**: Use the sidebar filters to find specific instruments
5. **Discover**: Click "Surprise Me" to get random suggestions for forgotten instruments
6. **Templates**: Select multiple instruments and create reusable templates
7. **Groups**: Create visual groups to organize related instruments

## Keyboard Shortcuts

- `Ctrl+K` / `Cmd+K` - Focus search
- `Ctrl+N` / `Cmd+N` - New instrument
- `/` - Focus search
- `Escape` - Clear search

## Project Structure

```
music-plugin-organizer/
├── electron/          # Electron main process
├── src/
│   ├── components/   # React components
│   │   ├── Canvas/   # Canvas components with .md docs
│   │   └── Sidebar/  # Sidebar components with .md docs
│   ├── store/        # Zustand stores with .md docs
│   ├── hooks/        # Custom hooks with .md docs
│   ├── types/        # TypeScript types
│   └── lib/          # Utilities
├── docs/
│   └── architecture/ # Architecture documentation
└── ...
```

## Documentation

This project follows a self-documenting architecture:

- **Component-level docs**: Each component has a corresponding `.md` file
- **Architecture docs**: See `docs/architecture/` for ADRs and design decisions
- **Store docs**: Each store has documentation in `src/store/*.md`

## Development Workflow

This project uses an **Agent Cascade Workflow** for feature development:

```
@architect → @coder → @test → @docs
```

Each agent generates the prompt for the next, ensuring consistent quality and complete documentation.

**Start a new feature:**
```bash
npm run feature:start
```

**See [AGENT-CASCADE.md](AGENT-CASCADE.md) for complete workflow guide.**

## Testing

- **Framework:** Vitest + React Testing Library
- **Coverage Goal:** 80%+ for new code, 90%+ for critical paths
- **Run tests:** `npm test`
- **Coverage:** `npm run test:coverage`

## Architecture

- **Decisions:** [docs/architecture/decisions.md](docs/architecture/decisions.md)
- **Data Model:** [docs/architecture/data-model.md](docs/architecture/data-model.md)
- **State Management:** [docs/architecture/state-management.md](docs/architecture/state-management.md)

## Contributing

1. Run `npm run feature:start` to begin
2. Follow the agent cascade workflow (@architect → @coder → @test → @docs)
3. @docs agent formats, validates, and pushes to GitHub
4. Engineer creates PR on GitHub
5. Wait for CI/CD to pass
6. Merge via GitHub's interface (never merge locally)
7. Run `npm run feature:complete` to archive and cleanup

## License

MIT
