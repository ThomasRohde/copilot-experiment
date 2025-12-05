---
name: verify-feature
description: "Thoroughly verify a feature works end-to-end before marking it complete"
---

# Goal

Perform **rigorous end-to-end verification** of a feature before marking it as passing in `features.json`.

## Context

From Anthropic's research: "Claude's tendency to mark a feature as complete without proper testing" is a major failure mode. Features must be tested **as a user would experience them**, not just via unit tests or code inspection.

## Instructions

### 1. Load Feature Details

Read `features.json` and find the specified feature:
- Feature ID
- Description
- Acceptance Criteria (ALL must pass)
- Current status

### 2. Ensure Environment is Running

```bash
./init.sh  # or .\init.ps1
# Verify dev server / environment is active
```

### 3. Design Verification Plan

For each acceptance criterion, define:
- **Test method**: How to verify (browser, API call, CLI command, etc.)
- **Expected result**: What success looks like
- **Evidence**: What to capture (screenshot, response, output)

### 4. Execute Verification

Perform each test **as a real user would**:

**For Web Applications:**
- Navigate through the actual UI
- Click buttons, fill forms, submit data
- Check that results appear correctly
- Verify error states work
- Test edge cases (empty input, long text, special characters)

**For APIs:**
- Make actual HTTP requests (curl, httpie, etc.)
- Test happy path AND error cases
- Verify response format matches spec
- Check status codes and error messages

**For CLI Tools:**
- Run actual commands
- Test with various arguments
- Verify output format
- Test error handling

**For Libraries:**
- Write actual usage example
- Import and call functions
- Verify return values
- Test error cases

### 5. Document Results

For each acceptance criterion:

```markdown
#### Criterion: "<description>"
- **Method**: <how tested>
- **Result**: ✅ PASS / ❌ FAIL
- **Evidence**: <screenshot path, command output, etc.>
- **Notes**: <any observations>
```

### 6. Update Feature Status

**Only if ALL criteria pass:**

Update `features.json`:
```json
{
  "id": "F00X",
  "passes": true,
  "verifiedAt": "2024-XX-XXTXX:XX:XXZ",
  "verifiedBy": "agent-verification"
}
```

**If ANY criterion fails:**
- Leave `passes: false`
- Document what failed and why
- Create fix plan for next session

### 7. Edge Case Testing

Go beyond acceptance criteria:
- Test with unexpected input
- Test rapid repeated actions
- Test concurrent access (if applicable)
- Test on different screen sizes (web)
- Test with slow network (if applicable)

## Output Format

```markdown
## Feature Verification Report

**Feature**: F00X - <description>
**Verification Date**: <timestamp>

### Acceptance Criteria Results

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | <criterion> | ✅/❌ | <link/description> |
| 2 | <criterion> | ✅/❌ | <link/description> |

### Additional Testing

| Test | Result | Notes |
|------|--------|-------|
| Edge case: empty input | ✅/❌ | <notes> |
| Edge case: long text | ✅/❌ | <notes> |
| Error handling | ✅/❌ | <notes> |

### Verification Evidence

<Include actual output, screenshots descriptions, or command results>

### Final Status

**VERDICT**: ✅ VERIFIED / ❌ NEEDS WORK

**Updated features.json**: Yes/No
**Issues Found**: <count>
**Follow-up Required**: <description or "None">
```

## Important Notes

- **Never skip verification** - code that "looks right" often has bugs
- **Test the actual running system** - not mocks or simulations
- **Document everything** - next agent needs to understand what was tested
- **Be honest about failures** - incomplete features should stay incomplete
