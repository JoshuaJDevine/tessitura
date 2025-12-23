# Agent Workflow System

This document describes the 5-agent cascade workflow for developing features with AI assistance.

## The Philosophy

> Every feature goes through 5 specialized agents, each with a single responsibility and clear handoff to the next.

**Key Principles:**
1. **Separation of Concerns** - Each agent does ONE thing well
2. **No Shared Artifacts** - Each agent creates their own documentation
3. **Clear Handoffs** - Generated prompts preserve context
4. **Blockers Enforce Quality** - Agents cannot skip steps
5. **Human Reviews at the End** - All work flows to a PR

## The 5 Agents

```
┌──────────────────────────────────────────────────────────────────────┐
│                        FEATURE REQUEST                                │
│                              ↓                                        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐               │
│  │  DESIGNER   │───▶│   CODER     │───▶│   TESTER    │               │
│  │             │    │             │    │             │               │
│  │ • Clarify   │    │ • Implement │    │ • Write     │               │
│  │ • Push back │    │ • Commit    │    │   tests     │               │
│  │ • Create ADR│    │ • Validate  │    │ • Coverage  │               │
│  │ • Branch    │    │             │    │             │               │
│  └─────────────┘    └─────────────┘    └─────────────┘               │
│                                              ↓                        │
│                     ┌─────────────┐    ┌─────────────┐               │
│                     │   CLOSER    │◀───│ DOCUMENTER  │               │
│                     │             │    │             │               │
│                     │ • Validate  │    │ • .md files │               │
│                     │ • Format    │    │ • Examples  │               │
│                     │ • Create PR │    │ • Update    │               │
│                     │ • Issues    │    │   arch docs │               │
│                     └─────────────┘    └─────────────┘               │
│                            ↓                                          │
│                    PULL REQUEST                                       │
│                            ↓                                          │
│                    HUMAN REVIEW                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## Agent Responsibilities

| Agent | Primary Output | Key Blockers |
|-------|---------------|--------------|
| **Designer** | ADR + Requirements + Branch | Must create ADR, must be on fresh branch |
| **Coder** | Implementation + Commits | Must pass type-check and lint |
| **Tester** | Test files + Coverage | Must achieve 80%+ coverage |
| **Documenter** | .md files for all code | Must document every new file |
| **Closer** | PR + GitHub Issues | Must pass all quality checks |

## File Structure

Each feature creates its own folder with per-agent documents:

```
.cursor/
├── agents/                    # Agent personality definitions
│   ├── designer.md
│   ├── coder.md
│   ├── tester.md
│   ├── documenter.md
│   └── closer.md
│
├── features/
│   ├── active/               # Features in progress
│   │   └── my-feature/
│   │       ├── designer.md   # Requirements, ADR ref, coder prompt
│   │       ├── coder.md      # Implementation notes, tester prompt
│   │       ├── tester.md     # Test summary, documenter prompt
│   │       ├── documenter.md # Doc summary, closer prompt
│   │       └── closer.md     # PR link, issues created
│   │
│   └── completed/            # Archived features
│       └── old-feature/
│           └── ...
│
└── WORKFLOW.md               # This file
```

## How to Start a Feature

### 1. Invoke the Designer

Open your AI chat and paste:

```
@designer I want to build [describe your feature].

Please help me clarify the requirements and set up the feature.
```

### 2. Follow the Cascade

After each agent completes, they provide a handoff prompt. Copy and paste it to invoke the next agent:

```
Designer completes → Copy "HANDOFF TO CODER" section → Paste to @coder
Coder completes → Copy "HANDOFF TO TESTER" section → Paste to @tester
Tester completes → Copy "HANDOFF TO DOCUMENTER" section → Paste to @documenter
Documenter completes → Copy "HANDOFF TO CLOSER" section → Paste to @closer
```

### 3. Review the PR

After the Closer finishes:
1. Review the PR on GitHub
2. Check the feature documents in `.cursor/features/active/<feature-name>/`
3. Merge via GitHub (never locally)
4. Run `npm run feature:complete` to archive

## Agent Rules

Each agent has strict rules they must follow. See individual agent files in `.cursor/agents/` for:
- **Personality** - How they approach problems
- **Responsibilities** - What they must do
- **Blockers** - What they cannot skip
- **Workflow** - Step-by-step process
- **Handoff Template** - What they pass to the next agent
- **Anti-Patterns** - What they must NOT do

## Quality Gates

The workflow enforces quality at multiple points:

| Stage | Check | Enforced By |
|-------|-------|-------------|
| Design | ADR exists | Designer agent |
| Design | Clean branch from main | Designer agent |
| Code | Type-check passes | Coder agent |
| Code | Lint passes | Coder agent |
| Test | 80%+ coverage | Tester agent |
| Docs | .md for every .ts/.tsx | Documenter agent |
| Close | All pre-push checks | Closer agent |
| Close | Conventional commits | Closer agent |

## Naming Conventions

### Branch Names
```
feature/<kebab-case-name>

Valid:
  feature/add-user-auth
  feature/fix-login-bug
  feature/update-dashboard

Invalid:
  addUserAuth
  Feature/something
  feature/Add_User_Auth
```

### Commit Messages
```
type(scope): description

Types:
  feat     - New feature
  fix      - Bug fix
  docs     - Documentation only
  style    - Formatting, no code change
  refactor - Code restructuring
  test     - Adding tests
  chore    - Maintenance tasks

Examples:
  feat(auth): add login form validation
  fix(dashboard): correct chart rendering
  docs(api): document REST endpoints
  test(utils): add edge case coverage
```

### File Names
```
Code:  PascalCase.tsx or camelCase.ts
Tests: Same name + .spec.ts(x)
Docs:  Same name + .md

Example:
  UserProfile.tsx
  UserProfile.spec.tsx
  UserProfile.md
```

## Automation

The workflow includes scripts to enforce standards:

| Script | Purpose |
|--------|---------|
| `npm run feature:start` | Create branch and feature folder |
| `npm run feature:complete` | Archive feature after merge |
| `npm run pre-push` | Run all quality checks |
| `npm run docs:validate` | Verify all code has documentation |
| `npm run create-issue` | Create GitHub issue for gaps |

## FAQ

### What if the Designer disagrees with my idea?
Good! The Designer is supposed to push back. Refine your idea together until it's solid.

### What if I find a bug during Coder phase?
If it's in scope, fix it. If it's out of scope, note it in your handoff for the Closer to create an issue.

### What if tests reveal a code bug?
The Tester flags it in their handoff. You can loop back to Coder, or the Closer creates an issue.

### Can I skip an agent?
No. The workflow is designed so each agent depends on the previous. Skipping creates gaps.

### What if I need to make changes after the PR?
Address PR feedback directly. If it's substantial, consider looping back through the relevant agents.

## Related Documents

- [Designer Agent](.cursor/agents/designer.md)
- [Coder Agent](.cursor/agents/coder.md)
- [Tester Agent](.cursor/agents/tester.md)
- [Documenter Agent](.cursor/agents/documenter.md)
- [Closer Agent](.cursor/agents/closer.md)
