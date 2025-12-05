---
name: session-end
description: "End a coding session with proper documentation and clean state"
---

# Goal

Execute the **standardized shutdown routine** for a long-running agent session, ensuring the codebase is left in a clean, well-documented state for the next session.

## Context

This prompt implements the "clean state" requirement from Anthropic's long-running agent research. Every session must end with the environment in a state that:
- Is appropriate for merging to main branch
- Has no major bugs or half-implemented features
- Is well-documented with clear next steps
- Could be picked up by any developer (human or AI)

## Instructions

### 1. Verify Clean State

```bash
# Check for uncommitted changes
git status

# Check for linting/compile errors
# <your-lint-command>
# <your-build-command>

# Run tests
# <your-test-command>
```

**If there are issues:**
- Fix them before proceeding
- If unfixable, revert to last good state and document

### 2. Commit Outstanding Work

All changes should be committed with descriptive messages:

```bash
# Stage changes
git add -A

# Commit with conventional commit message
git commit -m "<type>(<scope>): <description>

<body explaining what and why>

<footer with any breaking changes or issues>"
```

Commit types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change that doesn't fix bug or add feature
- `docs`: Documentation only
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 3. Verify Feature Completion

For any features you worked on:

1. **Run end-to-end verification** (not just unit tests)
2. **Test as a user would** - browser, CLI, actual API calls
3. **Only mark `passes: true`** if ALL acceptance criteria are met

Update `features.json`:
```json
{
  "passes": true,
  "verifiedAt": "<ISO timestamp>",
  "verifiedBy": "agent-session-<date>"
}
```

**Important**: If feature is incomplete, leave `passes: false` - it's okay!

### 4. Update Progress File

Append a new session entry to `agent-progress.md`:

```markdown
### Session X - <Date>
**Duration**: ~<time>
**Focus**: <feature ID and name>

#### Completed
- <Specific accomplishment 1>
- <Specific accomplishment 2>
- <Files changed: list key files>

#### Attempted But Incomplete
- <What was tried that didn't work>
- <Why it didn't work>

#### Blockers Discovered
- <Any issues that need resolution>
- <Missing dependencies or decisions needed>

#### Recommended Next Steps
1. <Most important next action>
2. <Second priority>
3. <Third priority>

#### Technical Notes
- <Any non-obvious decisions made>
- <Gotchas for next session>
- <Useful commands discovered>
```

### 5. Final Verification

```bash
# Ensure everything is committed
git status  # Should show "nothing to commit, working tree clean"

# Verify app still works
./init.sh && <smoke-test-command>
```

### 6. Summary Report

Provide a brief handoff summary.

## Output Format

```markdown
## Session End Report

**Session Duration**: <time>
**Commits Made**: <count>

### Accomplishments
| Feature | Status | Notes |
|---------|--------|-------|
| F00X | ✅ Complete | Verified end-to-end |
| F00Y | 🔄 In Progress | 80% done, needs testing |

### Files Changed
- `path/to/file1.ts` - <what changed>
- `path/to/file2.ts` - <what changed>

### State Verification
- [x] All changes committed
- [x] No linting errors
- [x] Tests passing
- [x] Smoke test passing
- [x] Progress file updated
- [x] Features.json accurate

### Handoff to Next Session
> <2-3 sentence summary of where things stand and what to do next>

### Git Log (This Session)
\`\`\`
<output of git log showing this session's commits>
\`\`\`
```
