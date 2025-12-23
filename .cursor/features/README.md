# Feature Lifecycle Tracking

This directory tracks features as they progress through the development workflow.

## Structure

```
.cursor/features/
├── active/          # Features currently in development
├── completed/       # Archived completed features
└── README.md        # This file
```

## Workflow

### 1. Start a New Feature

```bash
npm run feature:start
```

This will:
- Prompt you for feature details
- Create a new feature branch
- Create a feature lifecycle file in `active/`
- Guide you through the next steps

### 2. Follow the Cascade

Each feature goes through these phases:

**Phase 1: Architecture** (`@architect`)
- Review requirements
- Create implementation plan
- Make architecture decisions
- Generate prompt for @coder

**Phase 2: Implementation** (`@coder`)
- Follow architecture plan
- Implement the feature
- Commit code changes
- Generate prompt for @test

**Phase 3: Testing** (`@test`)
- Write comprehensive test coverage
- Ensure 80%+ coverage minimum
- Test behavior, not implementation
- Commit tests
- Generate prompt for @docs

**Phase 4: Documentation** (`@docs`)
- Update all affected .md files
- Document test coverage
- Update examples and usage
- Update timestamps
- Commit documentation

**Phase 5: Review & Push**
- Run pre-commit checks
- Verify test coverage
- Manual testing
- Push to GitHub
- Create PR

### 3. Complete a Feature

```bash
npm run feature:complete
```

This archives the feature file to `completed/` and provides push instructions.

## Agent Cascade Pattern

The key is that **each agent generates the prompt for the next agent**:

```
You: "I want to add zoom controls"
     ↓
@architect: "Here's the plan. @coder, implement this: [detailed prompt]"
     ↓
@coder: "Done! @test, write tests for this: [detailed prompt]"
     ↓
@test: "94% coverage achieved! @docs, update these files: [detailed prompt]"
     ↓
@docs: "Documentation updated. Ready for review."
```

## Example Feature File

See `.cursor/templates/feature-template.md` for the structure.

Each feature file contains:
- Engineer's original request
- Architecture decisions and plan
- Implementation details
- Documentation updates
- Review checklist

## Benefits

1. **Context Preservation** - Everything about a feature in one place
2. **Agent Coordination** - Each agent knows what the previous agent did
3. **Quality Assurance** - All features have comprehensive test coverage
4. **Traceability** - Complete history from idea → code → tests → docs
5. **Learning** - Review completed features to see patterns
6. **Onboarding** - New team members can see how features are built

## Tips

- Keep one feature active at a time for clarity
- Fill in each section completely before moving to next phase
- The feature file is your source of truth
- Don't push until all phases are complete
- Archive completed features for reference

