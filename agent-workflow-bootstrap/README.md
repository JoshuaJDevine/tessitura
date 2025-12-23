# Agent Workflow Bootstrap

A structured 5-agent workflow system for AI-assisted software development.

## Overview

This bootstrap provides a self-documenting, self-organizing workflow where features are developed through a cascade of 5 specialized AI agents:

```
Designer → Coder → Tester → Documenter → Closer → PR
```

Each agent has:

- **Clear responsibilities** - One job, done well
- **Blockers** - Cannot proceed until prerequisites are met
- **Handoff prompts** - Generated context for the next agent
- **Own artifacts** - Separate documentation per agent

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start a Feature

```bash
npm run feature:start
```

This will:

- Checkout main and pull latest
- Create a feature branch (`feature/<name>`)
- Initialize the feature folder structure

### 3. Invoke the Designer

```
@designer I want to build [your feature]. Help me clarify the requirements.
```

### 4. Follow the Cascade

Each agent creates a handoff prompt for the next. Copy and paste to invoke:

```
Designer → "HANDOFF TO CODER" → @coder
Coder → "HANDOFF TO TESTER" → @tester
Tester → "HANDOFF TO DOCUMENTER" → @documenter
Documenter → "HANDOFF TO CLOSER" → @closer
```

### 5. Review and Merge

The Closer creates the PR. Review it, merge via GitHub, then:

```bash
npm run feature:complete
```

## Project Structure

```
.cursor/
├── agents/               # Agent personality definitions
│   ├── designer.md       # Requirements, ADRs, pushback
│   ├── coder.md          # Implementation focus
│   ├── tester.md         # Test coverage
│   ├── documenter.md     # Documentation
│   └── closer.md         # Final validation, PR
│
├── features/
│   ├── active/           # Features in progress
│   │   └── <feature>/
│   │       ├── README.md
│   │       ├── designer.md
│   │       ├── coder.md
│   │       ├── tester.md
│   │       ├── documenter.md
│   │       └── closer.md
│   │
│   └── completed/        # Archived features
│
└── WORKFLOW.md           # Detailed workflow documentation

scripts/
├── start-feature.js      # Initialize new feature
├── complete-feature.js   # Archive completed feature
├── validate-branch-name.js
├── validate-docs.js
├── create-github-issue.js
└── pre-push-check.js

.husky/
├── pre-commit           # Branch, lint, type-check
├── commit-msg           # Conventional commits
└── pre-push             # Full validation suite
```

## NPM Scripts

| Script                     | Description                  |
| -------------------------- | ---------------------------- |
| `npm run feature:start`    | Start a new feature          |
| `npm run feature:complete` | Archive completed feature    |
| `npm run pre-push`         | Run all quality checks       |
| `npm run docs:validate`    | Check documentation coverage |
| `npm run create-issue`     | Create GitHub issue for gaps |
| `npm run type-check`       | TypeScript validation        |
| `npm run lint`             | ESLint                       |
| `npm run format`           | Prettier formatting          |
| `npm test`                 | Run tests                    |

## Quality Gates

The workflow enforces quality at multiple points:

| Gate                 | Enforced By      | When         |
| -------------------- | ---------------- | ------------ |
| Branch naming        | Husky pre-commit | Every commit |
| Conventional commits | Husky commit-msg | Every commit |
| TypeScript           | Husky pre-commit | Every commit |
| Linting              | Husky pre-commit | Every commit |
| All checks           | Husky pre-push   | Before push  |
| Documentation        | Closer agent     | Before PR    |
| Test coverage        | Tester agent     | Before docs  |

## Customization

### Adjust Check Directories

Edit `scripts/validate-docs.js`:

```javascript
const CHECK_DIRS = [
  'src/components',
  'src/hooks',
  'src/store',
  // Add your directories
];
```

### Modify Agent Personalities

Edit files in `.cursor/agents/`:

- Adjust personality traits
- Change blockers
- Modify handoff templates

### Add/Remove Quality Checks

Edit `scripts/pre-push-check.js`:

```javascript
const checks = [
  { name: 'Custom Check', cmd: 'npm run custom', critical: true },
  // ...
];
```

## Philosophy

> "Every piece of code has three companions: tests and documentation."

This workflow treats documentation as a first-class artifact, not an afterthought. Every `.ts`/`.tsx` file should have:

- `file.ts` - The code
- `file.spec.ts` - The tests
- `file.md` - The documentation

## License

MIT
