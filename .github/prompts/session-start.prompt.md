---
name: session-start
description: "Start a new coding session with proper context gathering"
---

# Goal

Execute the **standardized startup routine** for a long-running agent session, ensuring you have full context before making any changes.

## Context

This prompt implements the "Getting up to speed" phase from Anthropic's long-running agent research. Every coding session should start with this routine to:
- Understand current project state
- Identify what was done recently
- Verify the environment works
- Choose the right next task

## Instructions

### 1. Orient Yourself

```bash
# Confirm working directory
pwd  # or Get-Location on Windows

# Check project structure
ls -la  # or Get-ChildItem
```

### 2. Read Progress Artifacts

Read these files in order:

1. **`agent-progress.md`** - Recent session summaries
   - What was the last session working on?
   - Are there any documented blockers?
   - What were the recommended next steps?

2. **`features.json`** - Feature completion status
   - How many features are passing vs pending?
   - What's the highest priority incomplete feature?
   - Are there any features marked as in-progress?

3. **Git history** - Recent changes
   ```bash
   git log --oneline -15
   git status
   git diff --stat HEAD~3  # What changed recently
   ```

### 3. Start the Environment

**IMPORTANT**: The init script starts a dev server. When calling `run_in_terminal`, you do NOT need to set `isBackground: true` - the init script handles backgrounding the server automatically and will return control.

```bash
# Run the init script (it backgrounds the dev server automatically)
./init.sh  # or .\init.ps1 on Windows
```

If init script doesn't exist or fails:
- Document the issue
- Attempt to start the dev environment manually
- Create/fix the init script as first priority

**Note**: If you need to start just the dev server separately, use `run_in_terminal` with `isBackground: true`:
```
npm run dev  # with isBackground: true
```

### 4. Smoke Test

Before implementing new features, verify basic functionality:

- **For web apps**: Navigate to main page, perform core action
- **For APIs**: Hit health endpoint, test one main endpoint
- **For CLI tools**: Run help command, execute basic operation
- **For libraries**: Run test suite, import main module

If smoke test fails:
- **STOP** - Do not start new features
- Investigate and fix the existing issue first
- Document what was broken in progress file

### 5. Select Next Task

Based on your review:

1. If environment is broken → Fix it first
2. If there are incomplete in-progress features → Complete them
3. Otherwise → Pick highest priority feature from `features.json`

### 6. Announce Your Plan

Before making changes, state:
- Which feature you'll work on (by ID and description)
- Your approach in 2-3 sentences
- Any risks or dependencies you've identified

## Output Format

```markdown
## Session Start Report

**Timestamp**: <current time>
**Working Directory**: <path>

### Environment Status
- [ ] Progress file read
- [ ] Features file read  
- [ ] Git history reviewed
- [ ] Init script executed
- [ ] Smoke test passed

### Project Status
- **Total Features**: X
- **Passing**: Y (Z%)
- **Last Session**: <date> - <summary>

### Current Session Plan
**Target Feature**: F00X - <description>
**Approach**: <brief plan>
**Estimated Scope**: <small/medium/large>

### Risks/Dependencies
- <any concerns>
```
