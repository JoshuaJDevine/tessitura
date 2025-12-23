# Development Workflow Guide

This document explains the self-documenting workflow established for this project.

## 🎯 Core Principle

**Code and documentation are created together, never separately.**

Every component, hook, and store must have a corresponding `.md` file that documents its purpose, API, usage, and relationships.

## 🤖 Agent Roles

This project uses multiple agent roles in Cursor:

### @coder - Implementation Agent
- Implements features and fixes bugs
- Writes clean, modular code
- Follows TypeScript strict mode
- Adds JSDoc comments
- Creates `.md` files for new modules

### @docs - Documentation Agent
- Updates documentation when code changes
- Ensures examples are current
- Maintains architecture docs
- Updates "Last Updated" timestamps

### @architect - Architecture Agent
- Reviews architectural changes
- Creates/updates ADRs
- Identifies breaking changes
- Suggests refactoring opportunities

## 📁 File Structure

Every module follows this pattern:

```
src/components/MyComponent/
├── MyComponent.tsx      # Implementation
├── MyComponent.md       # Documentation
└── MyComponent.test.tsx # Tests (future)
```

## 📝 Documentation Template

Every `.md` file must contain:

```markdown
# ComponentName

**Last Updated:** YYYY-MM-DD - Reason for update

## Purpose
What it does and why it exists

## Dependencies
- List of imports and their purposes

## Props/API
TypeScript interface with descriptions

## Usage Example
Code example showing how to use it

## State Management
What state it manages and how

## Related Components
What it connects to or works with

## Future Enhancements
- [ ] Planned improvements
```

See `.cursor/rules/documentation-rules.mdc` for the full template.

## 🔄 Development Workflow

### Starting a New Feature

1. **Plan First**
   ```
   You: @architect I want to add [feature]. What's the best approach?
   ```

2. **Implement**
   ```
   You: @coder Implement [feature] following the plan
   ```

3. **Document**
   ```
   You: @docs Update documentation for the changes just made
   ```

4. **Commit**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

### Modifying Existing Code

1. **Read Context**
   - Read the `.md` file for the module you're changing
   - Understand dependencies and related components

2. **Make Changes**
   ```
   You: @coder Update [component] to [do something]
   ```

3. **Update Docs**
   ```
   You: @docs Review and update [component].md based on changes
   ```

4. **Commit**
   ```bash
   git add .
   git commit -m "fix(scope): description"
   ```

## 🛡️ Pre-Commit Checks

Before every commit, these checks run automatically:

1. **Documentation Validation** - Ensures all files have `.md` files
2. **TypeScript Type Check** - Ensures no type errors
3. **ESLint** - Ensures code quality
4. **Prettier** - Ensures consistent formatting
5. **Commit Message Format** - Ensures conventional commits

If any check fails, the commit is blocked with helpful instructions.

## 📋 Commit Message Format

Use conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Build/tooling changes

**Examples:**
```bash
feat(canvas): add zoom to fit selected nodes
fix(store): resolve instrument deletion bug
docs(readme): update installation instructions
```

## 🔍 Finding Your Way Around

### Reading Documentation

1. **Start with README.md** - Project overview
2. **Check docs/architecture/** - Architectural decisions
3. **Read component .md files** - Specific implementations

### Understanding a Component

```bash
# Read the documentation
cat src/components/Canvas/Canvas.md

# Read the implementation
cat src/components/Canvas/Canvas.tsx

# Find related components
grep -r "Canvas" src/components/**/*.md
```

### Finding Where Something is Used

```bash
# Use grep to find imports
npm run grep "useInstrumentStore"

# Or use Cursor's search
Ctrl+Shift+F
```

## 🚀 Common Tasks

### Adding a New Component

```typescript
// 1. Create the component file
src/components/NewComponent/NewComponent.tsx

// 2. Implement the component
export function NewComponent() {
  // ...
}

// 3. Create documentation
src/components/NewComponent/NewComponent.md

// 4. Use the template from .cursor/rules/documentation-rules.mdc

// 5. Commit
git add src/components/NewComponent/
git commit -m "feat(components): add NewComponent"
```

### Adding a New Store

```typescript
// 1. Create the store file
src/store/newStore.ts

// 2. Implement using Zustand pattern
export const useNewStore = create<NewState>()(
  persist(
    (set, get) => ({
      // state and actions
    }),
    {
      name: 'new-storage',
    }
  )
);

// 3. Create documentation
src/store/newStore.md

// 4. Update docs/architecture/state-management.md

// 5. Commit
git add src/store/
git commit -m "feat(store): add newStore for [purpose]"
```

### Making an Architectural Decision

```typescript
// 1. Discuss with architect agent
You: @architect Should we use [option A] or [option B] for [problem]?

// 2. Document the decision
Add ADR to docs/architecture/decisions.md

// 3. Implement the decision
You: @coder Implement [chosen option]

// 4. Commit
git commit -m "feat(architecture): implement [decision]"
```

## 🧪 Testing Your Changes

```bash
# Validate documentation
npm run docs:validate

# Type check
npm run type-check

# Lint
npm run lint

# Format check
npm run format:check

# Run all checks
npm run docs:validate && npm run type-check && npm run lint
```

## 🔧 Available Scripts

```bash
npm run dev                 # Start development server
npm run electron:dev        # Start Electron app
npm run build               # Build for production
npm run type-check          # TypeScript type check
npm run lint                # Run ESLint
npm run lint:fix            # Fix ESLint errors
npm run format              # Format code with Prettier
npm run format:check        # Check formatting
npm run docs:validate       # Validate documentation completeness
npm run docs:prompt         # Generate documentation update prompts
npm run docs:check          # Check if docs need updating (pre-commit)
```

## 🐛 Troubleshooting

### Pre-commit hook fails with "Documentation missing"

**Problem:** You modified a component but didn't update its `.md` file.

**Solution:**
1. Check `.cursor/doc-prompt.txt` for the generated prompt
2. Paste into Cursor Chat: `@docs [prompt from file]`
3. Review and commit the documentation updates
4. Try committing again

### Pre-commit hook fails with "Type errors"

**Problem:** TypeScript compilation errors.

**Solution:**
```bash
npm run type-check
# Fix the errors shown
git add .
git commit -m "fix: resolve type errors"
```

### Pre-commit hook fails with "Lint errors"

**Problem:** ESLint found code quality issues.

**Solution:**
```bash
npm run lint:fix
git add .
git commit -m "style: fix linting errors"
```

### Commit message rejected

**Problem:** Commit message doesn't follow conventional format.

**Solution:**
```bash
# Use the correct format
git commit -m "feat(scope): description"
# Not: "added new feature"
```

## 📚 Learning Resources

### Project Documentation
- `README.md` - Getting started
- `docs/architecture/decisions.md` - ADRs
- `docs/architecture/data-model.md` - Data structures
- `docs/architecture/state-management.md` - State patterns

### Component Documentation
- Browse `src/components/**/*.md`
- Browse `src/store/**/*.md`
- Browse `src/hooks/**/*.md`

### Cursor Rules
- `.cursorrules` - Main development rules
- `.cursor/rules/documentation-rules.mdc` - Documentation template

## 🎓 Best Practices

### DO:
✅ Read the `.md` file before modifying a component
✅ Update documentation when you change code
✅ Keep files under size limits (see `.cursorrules`)
✅ Write descriptive commit messages
✅ Ask the architect agent for big decisions
✅ Use TypeScript strict mode
✅ Add JSDoc comments to exported functions

### DON'T:
❌ Commit without documentation
❌ Use `any` type without justification
❌ Create files over size limits
❌ Skip pre-commit checks
❌ Make architectural changes without ADRs
❌ Modify UI components (they're from shadcn/ui)

## 🚦 CI/CD Pipeline

### On Push/PR
1. Documentation validation
2. TypeScript type check
3. ESLint
4. Prettier format check
5. Build test (all platforms)

### On Tag (v*)
1. Build for Windows, macOS, Linux
2. Create GitHub release
3. Upload artifacts

### On Push to Main
1. Deploy documentation to GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow this workflow guide
4. Ensure all checks pass
5. Submit a pull request

## 📞 Getting Help

- **Documentation issues:** Ask `@docs` agent
- **Implementation questions:** Ask `@coder` agent
- **Architecture decisions:** Ask `@architect` agent
- **Workflow questions:** Read this file or `.cursorrules`

## 🎯 Success Criteria

You're following the workflow correctly if:

✅ Every component has a `.md` file
✅ Documentation is up to date
✅ Commits follow conventional format
✅ Pre-commit checks pass
✅ CI/CD pipeline is green
✅ New developers can understand the code by reading docs

---

**Remember:** The goal is that in 6 months, any agent (or human) can understand any part of this codebase by reading the `.md` files and architecture docs.

