# Agent Cascade Workflow

This guide explains the **agent cascade pattern** - a structured workflow where each agent hands off to the next with full context.

## 🎯 The Pattern

```
Engineer → @architect → @coder → @test → @docs → Push
           ↓            ↓         ↓        ↓
        Creates plan  Implements Tests    Updates docs
        + next prompt + next prompt + next prompt
```

**Key Principle:** Each agent generates the detailed prompt for the next agent, creating a guided cascade with preserved context and comprehensive quality assurance.

## 🚀 Complete Walkthrough

### Step 1: Start a Feature

```bash
npm run feature:start
```

You'll be prompted for:
- Feature name (e.g., "canvas-zoom")
- Description
- Your name

This creates:
- New branch: `feature/canvas-zoom`
- Feature file: `.cursor/features/active/canvas-zoom.md`

### Step 2: Define Requirements

Open `.cursor/features/active/canvas-zoom.md` and fill in the "Engineer Request" section:

```markdown
### Engineer Request
> Add zoom controls to the Canvas component. Users should be able to:
> - Zoom in/out with buttons
> - Fit all nodes to view
> - Use keyboard shortcuts (Ctrl+Plus, Ctrl+Minus, Ctrl+0)
> - See current zoom level indicator
>
> This will help users navigate large plugin collections more easily.
```

### Step 3: Architecture Phase

**In Cursor Chat:**
```
@architect Review the feature request in .cursor/features/active/canvas-zoom.md 
and create a complete implementation plan with prompts for the next agents.
```

**@architect will:**
1. Analyze your requirements
2. Make architecture decisions
3. Create detailed implementation plan
4. Generate a specific prompt for @coder
5. Update the feature file with all this information

**Example @architect Output:**
```markdown
## 🎯 Phase 1: Architecture (COMPLETED)

**Decision:** Use React Flow's built-in zoom functionality

**Implementation Plan:**
1. Add ZoomControls component to Canvas
2. Use useReactFlow hook for zoom methods
3. Add keyboard shortcuts to useKeyboardShortcuts hook
4. Position controls in top-right corner

**Files to Modify:**
- src/components/Canvas/Canvas.tsx
- src/hooks/useKeyboardShortcuts.ts

**Next Agent:** @coder
**Coder Prompt:**
```
@coder Implement zoom controls following this plan:

1. In Canvas.tsx:
   - Import useReactFlow from 'reactflow'
   - Create ZoomControls component with 3 buttons: in/out/fit
   - Use zoomIn(), zoomOut(), fitView() methods
   - Add zoom level indicator showing current zoom %
   - Position in top-right: absolute positioning

2. In useKeyboardShortcuts.ts:
   - Add Ctrl+Plus → zoomIn()
   - Add Ctrl+Minus → zoomOut()  
   - Add Ctrl+0 → fitView()

Use lucide-react icons: ZoomIn, ZoomOut, Maximize
Use shadcn/ui Button component
Follow existing code patterns in Canvas.tsx

Files: src/components/Canvas/Canvas.tsx, src/hooks/useKeyboardShortcuts.ts
```
```

### Step 4: Implementation Phase

**Copy the @coder prompt from the feature file** and paste it into Cursor Chat.

**@coder will:**
1. Implement according to the architecture plan
2. Make the commits
3. Generate a detailed prompt for @test
4. Update the feature file

**Example @coder Output:**
```markdown
## 💻 Phase 2: Implementation (COMPLETED)

**Changes Made:**
- ✅ Added ZoomControls component
- ✅ Integrated React Flow zoom functionality
- ✅ Added keyboard shortcuts
- ✅ Added zoom level indicator

**Files Modified:**
- src/components/Canvas/Canvas.tsx (+45 lines)
- src/hooks/useKeyboardShortcuts.ts (+15 lines)

**Commits:**
- feat(canvas): add zoom controls with keyboard shortcuts

**Next Agent:** @test
**Test Prompt:**
```
@test Write comprehensive tests for zoom controls feature

Implementation files:
- src/components/Canvas/Canvas.tsx (ZoomControls component)
- src/hooks/useKeyboardShortcuts.ts (zoom shortcuts)

What to test:

1. ZoomControls component:
   - Renders all three buttons (in/out/fit)
   - Zoom in button calls zoomIn()
   - Zoom out button calls zoomOut()
   - Fit button calls fitView()
   - Zoom level indicator displays correctly
   - All buttons have proper accessibility labels

2. useKeyboardShortcuts hook:
   - Ctrl+Plus triggers zoom in
   - Ctrl+Minus triggers zoom out
   - Ctrl+0 triggers fit view
   - Shortcuts work cross-platform (Cmd on Mac)

Create test files:
- src/components/Canvas/ZoomControls.test.tsx
- src/hooks/useKeyboardShortcuts.test.ts (add to existing if present)

Target coverage: 90%+ for new code
Mock React Flow's useReactFlow hook
```
```

### Step 5: Testing Phase

**Copy the @test prompt from the feature file** and paste it into Cursor Chat.

**@test will:**
1. Write comprehensive test coverage
2. Ensure tests pass
3. Make the commits
4. Generate a detailed prompt for @docs
5. Update the feature file

**Example @test Output:**
```markdown
## 🧪 Phase 3: Testing (COMPLETED)

**Tests Created:**
- ✅ src/components/Canvas/ZoomControls.test.tsx (8 tests)
- ✅ src/hooks/useKeyboardShortcuts.test.ts (3 new tests)

**Test Coverage:**
- ZoomControls: All user interactions tested
- ZoomControls: Accessibility labels verified
- useKeyboardShortcuts: All zoom shortcuts tested
- Edge cases: Disabled states, null refs, etc.

**Coverage:** 94% of new code

**Test Types:**
- [x] Unit tests for zoom calculations
- [x] Integration tests for ZoomControls component  
- [ ] E2E tests (not needed for this feature)

**Commits:**
- test(canvas): add comprehensive zoom controls tests

**Next Agent:** @docs
**Docs Prompt:**
```
@docs Update documentation for the zoom controls feature:

Implementation files:
- src/components/Canvas/Canvas.tsx
- src/hooks/useKeyboardShortcuts.ts

Test files:
- src/components/Canvas/ZoomControls.test.tsx (94% coverage)
- src/hooks/useKeyboardShortcuts.test.ts

Tasks:

1. Canvas.md:
   - Add "Zoom Controls" to Key Features section
   - Update usage example to include zoom controls
   - Document zoom keyboard shortcuts
   - Add note about test coverage (94%)
   - Update "Last Updated" to today with reason: "Added zoom controls"

2. useKeyboardShortcuts.md:
   - Add zoom shortcuts to the shortcuts table:
     - Ctrl+Plus: Zoom in
     - Ctrl+Minus: Zoom out
     - Ctrl+0: Fit view to all nodes
   - Add note about comprehensive test coverage
   - Update "Last Updated" to today with reason: "Added zoom shortcuts"

New features:
- ZoomControls component with in/out/fit buttons
- Visual zoom level indicator showing percentage
- Keyboard shortcuts for zoom operations
- Positioned in top-right corner of canvas
- Comprehensive test coverage (94%)
```
```

### Step 6: Documentation Phase

**Copy the @docs prompt from the feature file** and paste it into Cursor Chat.

**@docs will:**
1. Update all affected .md files
2. Document test coverage
3. Update examples and usage
4. Update timestamps
5. Make the commits
6. Update the feature file

**Example @docs Output:**
```markdown
## 📚 Phase 4: Documentation (COMPLETED)

**Documentation Updated:**
- ✅ Canvas.md - Added zoom controls documentation
- ✅ useKeyboardShortcuts.md - Added zoom shortcuts

**Changes Made:**
- Added zoom controls to Canvas features section
- Updated usage examples with zoom controls
- Documented all zoom keyboard shortcuts
- Updated timestamps with today's date

**Commits:**
- docs(canvas): document zoom controls and shortcuts

**Next Step:** Review & Push
```

### Step 7: @docs Agent Final Steps

**The @docs agent completes all pre-push work:**

```bash
# 1. Format all code
npm run format

# 2. Verify all CI checks pass locally
npm run pre-push

# 3. Commit any formatting changes (if needed)
git add -A
git commit -m "style: format code with Prettier"

# 4. Push to GitHub
git push -u origin feature/canvas-zoom
```

**@docs agent then tells the engineer:**
```
✅ Branch pushed to GitHub: https://github.com/username/repo/tree/feature/canvas-zoom

Next steps for engineer:
1. Create PR: https://github.com/username/repo/pull/new/feature/canvas-zoom
2. Wait for CI/CD to pass
3. Merge via GitHub interface
4. Run: npm run feature:complete
```

**⚠️ Agent pushed to GitHub, did NOT merge to main locally**

### Step 8: Engineer Creates PR & Merges

**Engineer's responsibilities:**

1. **Create Pull Request on GitHub**
   - Visit the PR URL provided by @docs agent
   - Fill in description summarizing the feature
   - Link related issues
   - Request reviews (if required)

2. **Wait for CI/CD Validation**
   - GitHub Actions will run same checks as local
   - Should pass since `npm run pre-push` passed

3. **Merge via GitHub Interface**
   - Use GitHub's merge button
   - Follow team's merge strategy (squash/merge/rebase)
   - **NEVER** merge locally with `git merge`

4. **Run Feature Complete**
   ```bash
   npm run feature:complete
   ```
   
   This archives the feature file and provides cleanup instructions:
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/canvas-zoom
   ```

**Feature is now complete! 🎉**

## 🎨 Why This Works

### Problems It Solves

**❌ Old Way (Manual):**
```
Engineer: "Add zoom controls"
    ↓ (thinking... what's the plan?)
@coder: "Okay, I'll add some buttons"
    ↓ (inconsistent implementation)
Engineer: "Should I write tests?"
    ↓ (tests forgotten)
@docs: "What did you change?"
    ↓ (incomplete docs, no tests)
```

**✅ New Way (Cascade):**
```
Engineer: "Add zoom controls"
    ↓
@architect: "Here's the architectural plan + detailed @coder prompt"
    ↓ (consistent approach)
@coder: "Implemented exactly per plan + detailed @test prompt"
    ↓ (full context)
@test: "94% test coverage achieved + detailed @docs prompt"
    ↓ (quality assured)
@docs: "Updated all docs with test coverage info"
    ↓ (complete)
✅ Push
```

### Benefits

1. **Context Preservation** - Each agent gets full details from previous agent
2. **Consistency** - Architecture plan guides implementation
3. **Completeness** - Nothing gets forgotten
4. **Traceability** - Complete history in feature file
5. **Onboarding** - Clear process for new developers
6. **Learning** - Review completed features to improve

## 📝 Templates

## 🚨 Critical Rules

### Agents NEVER Merge to Main
- ✅ Agents work on feature branches
- ✅ Agents push branches to GitHub
- ✅ PRs are created on GitHub
- ✅ Merging happens through GitHub's interface
- ❌ NEVER `git merge` to main locally
- ❌ NEVER push directly to main

### Why?
1. **Code Review** - PRs enable team review
2. **CI/CD** - GitHub Actions run on PRs
3. **Traceability** - PR history shows discussion
4. **Safety** - Protects main branch
5. **Collaboration** - Others can review and comment

## 📝 Quick Templates

### Quick Architecture Prompt

```
@architect Review feature request in .cursor/features/active/[name].md
Create implementation plan and generate @coder prompt.
```

### Quick Implementation Prompt

```
[Copy from feature file's "Coder Prompt" section]
```

### Quick Testing Prompt

```
[Copy from feature file's "Test Prompt" section]
```

### Quick Documentation Prompt

```
[Copy from feature file's "Docs Prompt" section]
```

## 🔄 Variations

### Simple Feature (Skip Architecture)

For very simple changes, you can skip @architect:

```markdown
## 🎯 Phase 1: Architecture (SKIPPED - Simple change)

Directly to @coder:
[Your prompt]
```

### Complex Feature (Multiple Iterations)

For complex features, you might cycle through agents multiple times:

```
@architect → @coder → @test → Issues Found
    ↑______________|
    
@architect (revise plan) → @coder (fix) → @test → @docs → Push
```

## 💡 Pro Tips

1. **Always start with @architect** for anything beyond trivial changes
2. **Copy prompts exactly** from the feature file - don't retype
3. **One feature at a time** - don't start a new feature until current is pushed
4. **Keep feature files updated** - they're your source of truth
5. **Review completed features** - learn from past implementations
6. **Archive religiously** - `npm run feature:complete` after every push

## 🎯 Success Metrics

You know the system is working when:
- ✅ Features follow consistent patterns
- ✅ All features have 80%+ test coverage
- ✅ Documentation is always up to date
- ✅ No "how did we build this?" questions
- ✅ New features reference similar past features
- ✅ Onboarding is smooth (read feature files)
- ✅ Less context switching between agents

## 📚 Related Documents

- **WORKFLOW.md** - Overall development workflow
- **`.cursorrules`** - Agent behavior rules
- **`.cursor/features/README.md`** - Feature tracking system
- **`.cursor/templates/feature-template.md`** - Feature file template

---

**Remember:** The cascade only works if each agent updates the feature file with the prompt for the next agent. This creates a chain of context that ensures nothing gets lost.

