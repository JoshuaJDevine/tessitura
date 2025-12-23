# Feature: [Feature Name]

**Status:** 🎯 Planning
**Branch:** [branch-name]
**Created:** [YYYY-MM-DD]
**Engineer:** [Your Name]

---

## 🎯 Phase 1: Architecture

### Engineer Request
> [Describe what you want to build and why]

### @architect Response

**Decision:** [High-level approach]

**Implementation Plan:**
[Detailed steps]

**Architecture Decisions:**
[Key technical decisions and rationale]

**Files to Modify:**
- [List of files]

**ADR Required?** [Yes/No]
[If yes, what should be documented]

**Next Agent:** @coder
**Coder Prompt:**
```
[Detailed prompt for @coder with specific instructions]
```

---

## 💻 Phase 2: Implementation

### @coder Response

**Changes Made:**
[List of what was implemented]

**Files Modified:**
[List with line counts]

**Commits:**
[List of commit messages]

**Issues Encountered:**
[Any problems or deviations from plan]

**Next Agent:** @docs
**Docs Prompt:**
```
[Detailed prompt for @docs with specific instructions]
```

---

## 📚 Phase 3: Documentation

### @docs Response

**Documentation Updated:**
[List of .md files updated]

**Changes Made:**
[Summary of documentation changes]

**Commits:**
[List of commit messages]

**Next Step:** Review & Push

---

## ✅ Phase 4: Review & Push

### Pre-Push Checklist
- [ ] All architecture decisions documented
- [ ] All code implemented per plan
- [ ] All documentation updated
- [ ] Pre-commit hooks pass
- [ ] Manual testing complete
- [ ] Ready for git push
- [ ] Ready to create PR

### Push Command
```bash
git push origin [branch-name]
```

---

## 📝 Notes & Learnings
[Any insights, gotchas, or things to remember]

