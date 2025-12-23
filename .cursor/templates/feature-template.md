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

**Next Agent:** @test
**Test Prompt:**
```
[Detailed prompt for @test with specific instructions]
```

---

## 🧪 Phase 3: Testing

### @test Response

**Tests Created:**
[List of test files created]

**Test Coverage:**
[Summary of what's covered]

**Test Types:**
- [ ] Unit tests for business logic
- [ ] Integration tests for component interactions
- [ ] E2E tests for critical user flows

**Commits:**
[List of commit messages]

**Next Agent:** @docs
**Docs Prompt:**
```
[Detailed prompt for @docs with specific instructions]
```

---

## 📚 Phase 4: Documentation

### @docs Response

**Documentation Updated:**
[List of .md files updated]

**Changes Made:**
[Summary of documentation changes]

**Commits:**
[List of commit messages]

**Next Step:** Review & Push

---

## ✅ Phase 5: Review & Push

### Pre-Push Checklist
- [ ] All architecture decisions documented
- [ ] All code implemented per plan
- [ ] All tests written and passing
- [ ] All documentation updated
- [ ] Pre-commit hooks pass
- [ ] Test coverage meets standards
- [ ] Manual testing complete

### Pre-Push Commands (Run These Before Pushing!)

**1. Format All Code**
```bash
npm run format
```

**2. Run All CI Checks Locally**

**Option A: Automated (Recommended)**
```bash
npm run pre-push
```

**Option B: Manual**
```bash
# Documentation validation
npm run docs:validate

# TypeScript type check
npm run type-check

# Linting
npm run lint

# Format check (should pass after step 1)
npm run format:check

# Run tests
npm test -- --run
```

**3. Commit Formatting Changes (if any)**
```bash
git add -A
git commit -m "style: format code with Prettier"
```

### Push to GitHub
**IMPORTANT: Never merge to main locally. Always push branch and create PR on GitHub.**

```bash
# Push feature branch to GitHub
git push -u origin [branch-name]

# GitHub will provide a PR URL, e.g.:
# https://github.com/username/repo/pull/new/[branch-name]
```

### Create Pull Request
1. Visit the PR URL provided by GitHub
2. Fill in PR description with feature summary
3. Link to any related issues
4. Request reviews if needed
5. Wait for CI/CD to pass
6. Merge through GitHub's interface (NOT locally)

---

## 📝 Notes & Learnings
[Any insights, gotchas, or things to remember]

