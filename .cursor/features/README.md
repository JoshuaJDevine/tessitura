# Feature Lifecycle Tracking

This directory tracks features as they progress through the 5-agent development workflow.

## Structure

```
.cursor/features/
├── active/           # Features currently in development
│   └── <feature>/    # Each feature gets its own folder
│       ├── README.md
│       ├── designer.md
│       ├── coder.md
│       ├── tester.md
│       ├── documenter.md
│       └── closer.md
├── completed/        # Archived completed features
└── README.md         # This file
```

## Workflow

### 1. Start a New Feature

```bash
npm run feature:start
```

This will:
- Checkout main and pull latest
- Create a new feature branch (`feature/<name>`)
- Create a feature folder in `active/`
- Guide you to invoke @designer

### 2. Follow the 5-Agent Cascade

Each feature goes through these phases:

| Phase | Agent | Responsibility | Handoff |
|-------|-------|----------------|---------|
| 1 | **@designer** | Requirements, ADR, branch setup | → @coder prompt |
| 2 | **@coder** | Implementation, commits | → @tester prompt |
| 3 | **@tester** | Tests, 80%+ coverage | → @documenter prompt |
| 4 | **@documenter** | .md files for all code | → @closer prompt |
| 5 | **@closer** | Validation, PR creation | → Human review |

**Key:** Each agent creates a handoff document with the prompt for the next agent.

### 3. Agent Documents

Each agent writes to their own file in the feature folder:

- `designer.md` - Requirements, ADR reference, @coder prompt
- `coder.md` - Implementation notes, files changed, @tester prompt
- `tester.md` - Test summary, coverage, @documenter prompt
- `documenter.md` - Docs created, @closer prompt
- `closer.md` - PR link, issues created, final checklist

### 4. Complete a Feature

After PR is merged via GitHub:

```bash
npm run feature:complete
```

This archives the feature folder to `completed/` and provides cleanup instructions.

## Agent Definitions

Full agent personalities, blockers, and handoff templates are in:
- `.cursor/agents/designer.md`
- `.cursor/agents/coder.md`
- `.cursor/agents/tester.md`
- `.cursor/agents/documenter.md`
- `.cursor/agents/closer.md`

## Quality Gates

Each agent has **blockers** that must be complete before proceeding:

| Agent | Must Complete Before Handoff |
|-------|------------------------------|
| Designer | ADR created, clean branch from main |
| Coder | Type-check passes, lint passes |
| Tester | Tests pass, 80%+ coverage |
| Documenter | .md file for every new code file |
| Closer | All pre-push checks pass |

## Benefits

1. **No bloated files** - Each agent has their own document
2. **Clear ownership** - Each agent knows exactly what they're responsible for
3. **Enforced quality** - Blockers prevent skipping steps
4. **Full traceability** - Complete history in feature folder
5. **Easy onboarding** - Review completed features to learn patterns

## Tips

- One feature at a time for clarity
- Copy handoff prompts exactly - don't retype
- Archive completed features for reference
- Review completed features to improve process
