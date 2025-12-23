# Agent Cascade Workflow

This guide explains the **agent cascade pattern** - a structured workflow where each agent hands off to the next with full context.

## 🎯 The Pattern

```
Engineer → @architect → @coder → @docs → Push
           ↓            ↓         ↓
        Creates plan  Implements Updates docs
        + next prompt + next prompt
```

**Key Principle:** Each agent generates the detailed prompt for the next agent, creating a guided cascade with preserved context.

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
3. Generate a detailed prompt for @docs
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

**Next Agent:** @docs
**Docs Prompt:**
```
@docs Update documentation for the zoom controls feature:

Files modified:
- src/components/Canvas/Canvas.tsx
- src/hooks/useKeyboardShortcuts.ts

Tasks:

1. Canvas.md:
   - Add "Zoom Controls" to Key Features section
   - Update usage example to include zoom controls
   - Document zoom keyboard shortcuts
   - Update "Last Updated" to today with reason: "Added zoom controls"

2. useKeyboardShortcuts.md:
   - Add zoom shortcuts to the shortcuts table:
     - Ctrl+Plus: Zoom in
     - Ctrl+Minus: Zoom out
     - Ctrl+0: Fit view to all nodes
   - Update "Last Updated" to today with reason: "Added zoom shortcuts"

New features:
- ZoomControls component with in/out/fit buttons
- Visual zoom level indicator showing percentage
- Keyboard shortcuts for zoom operations
- Positioned in top-right corner of canvas
```
```

### Step 5: Documentation Phase

**Copy the @docs prompt from the feature file** and paste it into Cursor Chat.

**@docs will:**
1. Update all affected .md files
2. Update examples and usage
3. Update timestamps
4. Make the commits
5. Update the feature file

**Example @docs Output:**
```markdown
## 📚 Phase 3: Documentation (COMPLETED)

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

### Step 6: Review & Push

**Check the feature file's review checklist:**

```markdown
## ✅ Phase 4: Review & Push

### Pre-Push Checklist
- [x] All architecture decisions documented
- [x] All code implemented per plan
- [x] All documentation updated
- [x] Pre-commit hooks pass
- [ ] Manual testing complete
- [ ] Ready for git push
- [ ] Ready to create PR
```

**Manual Testing:**
1. Run `npm run dev`
2. Test the zoom controls
3. Test keyboard shortcuts
4. Verify zoom level indicator

**Complete the feature:**
```bash
npm run feature:complete
```

This will:
- Archive the feature file to `.cursor/features/completed/`
- Show you the push command

**Push to GitHub:**
```bash
git push origin feature/canvas-zoom
```

**Create PR on GitHub**

## 🎨 Why This Works

### Problems It Solves

**❌ Old Way (Manual):**
```
Engineer: "Add zoom controls"
    ↓ (thinking... what's the plan?)
@coder: "Okay, I'll add some buttons"
    ↓ (inconsistent implementation)
Engineer: "Wait, wrong approach..."
    ↓ (lost context)
@docs: "What did you change?"
    ↓ (incomplete docs)
```

**✅ New Way (Cascade):**
```
Engineer: "Add zoom controls"
    ↓
@architect: "Here's the architectural plan + detailed @coder prompt"
    ↓ (consistent approach)
@coder: "Implemented exactly per plan + detailed @docs prompt"
    ↓ (full context)
@docs: "Updated all docs per prompt"
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

### Quick Architecture Prompt

```
@architect Review feature request in .cursor/features/active/[name].md
Create implementation plan and generate @coder prompt.
```

### Quick Implementation Prompt

```
[Copy from feature file's "Coder Prompt" section]
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
@architect → @coder → Testing → Issues Found
    ↑______________|
    
@architect (revise plan) → @coder (fix) → @docs → Push
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

