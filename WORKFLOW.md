# Development Workflow

This document provides an overview of the development workflow for the Music Plugin Organizer.

## 🎯 Core Workflow: Agent Cascade

**This project uses an Agent Cascade pattern for all feature development.**

See **[AGENT-CASCADE.md](AGENT-CASCADE.md)** for the complete guide.

### Quick Overview

```
npm run feature:start
  ↓
@architect (plan + generate @coder prompt)
  ↓
@coder (implement + generate @test prompt)
  ↓  
@test (test + generate @docs prompt)
  ↓
@docs (document)
  ↓
npm run feature:complete
  ↓
git push
```

## 📋 Quick Reference Commands

### Feature Management
```bash
npm run feature:start      # Start new feature (creates branch + lifecycle file)
npm run feature:complete   # Archive completed feature
```

### Development
```bash
npm run dev               # Start Vite dev server
npm run electron:dev      # Start Electron app
```

### Quality Checks
```bash
npm run type-check        # TypeScript type check
npm run lint              # ESLint
npm run lint:fix          # Fix ESLint errors
npm run format            # Format with Prettier
npm run format:check      # Check formatting
npm test                  # Run tests
npm run test:coverage     # Test coverage report
```

### Documentation
```bash
npm run docs:validate     # Check all files have .md files
```

### Building
```bash
npm run build             # Build for production
npm run electron:pack     # Package Electron app
```

## 🤖 Agent Roles

### @architect
- Reviews feature requirements
- Makes architecture decisions
- Creates implementation plan
- Generates @coder prompt

### @coder
- Implements features per architecture plan
- Follows code quality standards
- Commits implementation
- Generates @test prompt

### @test
- Writes comprehensive test coverage
- Ensures 80%+ coverage
- Tests behavior, not implementation
- Generates @docs prompt

### @docs
- Updates all affected documentation
- Documents test coverage
- Updates usage examples
- Updates timestamps

## 📁 File Organization

```
src/
├── components/
│   ├── ComponentName/
│   │   ├── ComponentName.tsx
│   │   ├── ComponentName.md          # Required documentation
│   │   └── ComponentName.test.tsx    # Required tests
│   └── ...
├── hooks/
│   ├── useHookName.ts
│   ├── useHookName.md                # Required documentation
│   └── useHookName.test.ts           # Required tests
└── store/
    ├── storeName.ts
    ├── storeName.md                  # Required documentation
    └── storeName.test.ts             # Required tests
```

## 🎨 Code Quality Standards

### TypeScript
- ✅ Strict mode enabled
- ✅ Explicit return types
- ✅ No `any` without justification
- ✅ Interface for object shapes

### React
- ✅ Functional components only
- ✅ Custom hooks for reusable logic
- ✅ Proper dependency arrays
- ✅ Memoization when needed

### Testing
- ✅ 80%+ coverage for new code
- ✅ Test behavior, not implementation
- ✅ Descriptive test names
- ✅ Arrange-Act-Assert pattern

### Documentation
- ✅ Every component/hook/store has .md file
- ✅ JSDoc comments on exported functions
- ✅ Usage examples in documentation
- ✅ Updated timestamps

## 🔄 Git Workflow

### Branch Strategy

**Core Rule: Agents work on branches, never merge to main locally.**

1. **Feature Branches** - All work happens on `feature/name` branches
2. **Push to GitHub** - Push branches, don't merge locally
3. **Pull Requests** - Create PRs on GitHub for review
4. **GitHub Merge** - Merge through GitHub's interface, not locally

```bash
# ✅ Correct workflow
git checkout -b feature/new-feature
# ... work on feature ...

# BEFORE PUSHING: Format and verify
npm run format
npm run docs:validate
npm run type-check
npm run lint
npm run format:check
npm test -- --run

# Commit any formatting changes
git add -A
git commit -m "style: format code with Prettier"

# Now push
git push -u origin feature/new-feature
# Create PR on GitHub → Review → Merge via GitHub

# ❌ Incorrect workflow
git checkout main
git merge feature/new-feature  # NEVER do this!
git push origin main           # NEVER do this!
```

### Pre-Push Checklist

Before pushing any branch to GitHub, always:
1. ✅ Format code: `npm run format`
2. ✅ Validate docs: `npm run docs:validate`
3. ✅ Type check: `npm run type-check`
4. ✅ Lint: `npm run lint`
5. ✅ Format check: `npm run format:check`
6. ✅ Test: `npm test -- --run`
7. ✅ Commit formatting: `git add -A && git commit -m "style: format code with Prettier"`
8. ✅ Push: `git push -u origin feature/name`

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `test` - Adding tests
- `docs` - Documentation only
- `refactor` - Code refactoring
- `style` - Formatting
- `chore` - Build/tooling

**Examples:**
```bash
feat(canvas): add zoom controls with keyboard shortcuts
fix(store): resolve instrument deletion bug
test(canvas): add comprehensive zoom tests
docs(canvas): update zoom controls documentation
```

### Pre-Commit Checks

Every commit automatically runs:
1. ✅ Documentation validation
2. ✅ TypeScript type check
3. ✅ ESLint (with auto-fix)
4. ✅ Prettier formatting
5. ✅ Commit message format validation

If any check fails, commit is blocked with helpful instructions.

## 🚀 CI/CD Pipeline

### On Every Push/PR
- Documentation validation
- TypeScript type check
- ESLint
- Test suite
- Build verification (all platforms)

### On Push to Main
- Deploy documentation to GitHub Pages
- Generate coverage reports

### On Version Tags (v*)
- Build for Windows, macOS, Linux
- Create GitHub Release
- Upload artifacts

## 📚 Key Documents

- **[AGENT-CASCADE.md](AGENT-CASCADE.md)** - Complete cascade workflow guide
- **[.cursorrules](.cursorrules)** - Agent behavior rules
- **[.cursorrules-test](.cursorrules-test)** - @test agent rules
- **[docs/architecture/](docs/architecture/)** - Architecture decisions
- **[SETUP-COMPLETE.md](SETUP-COMPLETE.md)** - Setup summary

## 💡 Best Practices

### DO:
✅ Start every feature with `npm run feature:start`
✅ Follow the agent cascade (@architect → @coder → @test → @docs)
✅ Write tests for all new code (80%+ coverage)
✅ Update documentation with every change
✅ Use descriptive commit messages
✅ Review the feature file before pushing
✅ Complete all phases before `npm run feature:complete`

### DON'T:
❌ Skip the architecture phase
❌ Skip writing tests
❌ Commit without documentation
❌ Push without completing all phases
❌ Modify UI components (they're from shadcn/ui)
❌ Use `--no-verify` to skip checks (except rare cases)

## 🎯 Success Metrics

Your workflow is working well when:
- ✅ All features have 80%+ test coverage
- ✅ All components have .md documentation
- ✅ Pre-commit checks always pass
- ✅ CI/CD pipeline is green
- ✅ Feature files are complete and archived
- ✅ Code follows consistent patterns

## 🆘 Troubleshooting

### Pre-commit Hook Fails
```bash
# Check what failed
npm run docs:validate
npm run type-check
npm run lint
npm test

# Fix issues and try again
git add .
git commit -m "fix: resolve issues"
```

### Documentation Validation Fails
- Ensure every `.ts`/`.tsx` file (except UI components) has a `.md` file
- Use the template in `.cursor/rules/documentation-rules.mdc`

### Tests Failing
```bash
# Run tests with watch mode
npm test -- --watch

# Check coverage
npm run test:coverage
```

### Need to Skip Hooks (Rare)
```bash
git commit --no-verify -m "emergency fix"
# But use very sparingly!
```

## 📖 Learning Resources

- Read completed features in `.cursor/features/completed/`
- Review architecture decisions in `docs/architecture/decisions.md`
- Check component documentation in `src/components/**/*.md`
- See testing patterns in `*.test.ts` files

---

**Remember:** The cascade workflow ensures consistent quality, complete documentation, and comprehensive testing for every feature. Follow it, and your codebase will remain maintainable and well-documented.
