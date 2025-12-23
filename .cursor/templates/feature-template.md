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

## ✅ Phase 5: Review, Push & Merge

### Pre-Push Checklist (Completed by @docs Agent)
- [ ] All architecture decisions documented
- [ ] All code implemented per plan
- [ ] All tests written and passing
- [ ] All documentation updated
- [ ] Code formatted with Prettier
- [ ] All CI checks pass locally
- [ ] Branch pushed to GitHub

### @docs Agent Responsibilities

**1. Format All Code**
```bash
npm run format
```

**2. Run All CI Checks**
```bash
npm run pre-push
```

**3. Commit Formatting Changes (if any)**
```bash
git add -A
git commit -m "style: format code with Prettier"
```

**4. Push to GitHub**
```bash
git push -u origin [branch-name]
```

**5. Instruct Engineer**
Provide engineer with:
- GitHub branch URL
- Instructions to create PR
- Reminder to run `npm run feature:complete` after merge

### Engineer Responsibilities

**After @docs pushes to GitHub:**

1. **Create Pull Request**
   - Visit: https://github.com/username/repo/pull/new/[branch-name]
   - Fill in PR description with feature summary
   - Link to any related issues
   - Request reviews if needed

2. **Wait for CI/CD to Pass**
   - Verify all GitHub Actions checks pass
   - Address any failures

3. **Merge via GitHub**
   - Use GitHub's merge button (NOT local merge)
   - Choose merge strategy (squash/merge/rebase per team policy)

4. **Run Cleanup**
   ```bash
   npm run feature:complete
   ```
   - Archives the feature file
   - Provides cleanup instructions

5. **Clean Up Local Branches**
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/[branch-name]
   ```

---

## 📝 Notes & Learnings
[Any insights, gotchas, or things to remember]

