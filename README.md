# VS Code Copilot Customizations for Long-Running Agents

> Based on [Anthropic's research on effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

## Overview

This repository implements a comprehensive VS Code customization framework designed to enable effective **multi-context-window agent workflows**. The key insight: each agent session starts fresh, so we create structured artifacts and prompts that bridge context windows.

## Quick Start

### Prerequisites

- **VS Code** 1.99+ (or latest Insiders)
- **GitHub Copilot extension** with active subscription
- **Git** installed and configured

### Installation

1. **Copy the `.github/` folder** to your project root:
   ```bash
   # Clone this repo or download and copy
   cp -r path/to/copilot-experiment/.github your-project/.github
   ```

2. **Copy VS Code settings** (or merge with existing):
   ```bash
   cp -r path/to/copilot-experiment/.vscode your-project/.vscode
   ```

3. **Open your project in VS Code** and verify prompts are loaded:
   - Open Copilot Chat (Ctrl+Shift+I / Cmd+Shift+I)
   - Type `/` - you should see `init-project`, `session-start`, etc.

### First-Time Setup

1. **Switch to Agent mode** in Copilot Chat (click the mode selector or use Ctrl+.)

2. **Initialize your project**:
   ```
   /init-project webapp my-todo-app
   ```
   This creates:
   - `features.json` with 20+ features based on your description
   - `agent-progress.md` for session tracking
   - `init.sh` / `init.ps1` for environment startup

3. **Start your first coding session**:
   ```
   /session-start
   ```

4. **Work on features** - the agent will guide you through one at a time

5. **End your session cleanly**:
   ```
   /session-end
   ```

---

## Customization Structure

```
.github/
├── copilot-instructions.md       # Core behavior rules (auto-applied)
├── prompts/
│   ├── init-project.prompt.md    # Initialize new projects
│   ├── session-start.prompt.md   # Start coding sessions
│   ├── session-end.prompt.md     # End sessions cleanly
│   ├── verify-feature.prompt.md  # Verify features work
│   ├── add-features.prompt.md    # Expand feature list
│   ├── recover-from-failure.prompt.md  # Fix broken states
│   └── progress-report.prompt.md # Generate status reports
├── instructions/
│   ├── session-artifacts.instructions.md  # Progress/features rules
│   ├── git-practices.instructions.md      # Git workflow
│   └── testing-practices.instructions.md  # E2E testing
└── templates/
    ├── features.schema.json      # Feature registry schema
    ├── features.example.json     # Example features
    ├── agent-progress.template.md # Progress file template
    ├── init.sh                   # Unix init script template
    └── init.ps1                  # Windows init script template

.vscode/
└── settings.json                 # VS Code configuration
```

**Note:** This framework works entirely within GitHub's standard **Agent mode** - no custom agents required. All behavior is embedded in instructions and prompts.

---

## Key Concepts

### The Problem (from Anthropic's Research)

Long-running agents fail in predictable ways:
1. **One-shotting**: Trying to do too much at once
2. **Premature victory**: Declaring "done" without verification
3. **Context loss**: New sessions don't know what happened before
4. **Broken handoffs**: Half-implemented, undocumented features

### The Solution

| Problem | Solution | Implementation |
|---------|----------|----------------|
| One-shotting | Work on ONE feature at a time | `/session-start` prompt |
| Premature victory | Structured feature registry | `features.json` + `/verify-feature` |
| Context loss | Progress file + git history | `agent-progress.md` |
| Broken handoffs | Session start/end routines | Prompt files |

---

## Prompt Commands

| Command | Purpose |
|---------|---------|
| `/init-project` | Set up long-running agent infrastructure for new project |
| `/session-start` | Begin a coding session with proper context |
| `/session-end` | End a session with documentation and clean state |
| `/verify-feature F00X` | Verify a feature works end-to-end |
| `/add-features` | Expand the feature registry |
| `/recover-from-failure` | Diagnose and fix broken project state |
| `/progress-report` | Generate comprehensive status report |

---

## How It Works (Standard Agent Mode)

All long-running agent behaviors are embedded directly into:

1. **`copilot-instructions.md`** - Automatically applied to every Agent session
   - Session lifecycle rules (start, work, end)
   - Artifact handling (features.json, agent-progress.md)
   - Prohibited behaviors (one-shotting, premature victory)

2. **Prompt files** - Invoked with `/command` in chat
   - Structured workflows for common tasks
   - Consistent output formats
   - Step-by-step guidance

3. **Path-specific instructions** - Auto-applied to matching files
   - Git practices for all files
   - Testing rules for test files
   - Artifact rules for progress/features files

No need to switch agents or modes - just use Agent mode as usual!

---

## Session Workflow

```
┌─────────────────────────────────────────────────────┐
│                   SESSION START                      │
│  1. Run /session-start                              │
│  2. Read agent-progress.md                          │
│  3. Check features.json                             │
│  4. Run init script                                 │
│  5. Smoke test                                      │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                   DURING SESSION                     │
│  • Work on ONE feature                              │
│  • Commit frequently                                │
│  • Test incrementally                               │
│  • Document decisions                               │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                   SESSION END                        │
│  1. Verify code compiles/passes tests               │
│  2. Commit all changes                              │
│  3. Run /verify-feature for completed work          │
│  4. Update features.json (only passes field)        │
│  5. Run /session-end to update progress             │
└─────────────────────────────────────────────────────┘
```

---

## features.json Rules

The feature registry prevents "premature victory" - agents declaring the project complete when it isn't.

**Allowed Changes:**
- ✅ Set `passes` from `false` to `true`
- ✅ Set `verifiedAt` timestamp
- ✅ Set `verifiedBy` identifier
- ✅ Update `metadata.passingFeatures` count

**Forbidden Changes:**
- ❌ Delete features
- ❌ Edit descriptions or criteria
- ❌ Change IDs or priorities
- ❌ Mark complete without end-to-end verification

---

## Required Project Artifacts

When using this framework, your project should have:

### 1. `features.json`

Comprehensive list of all features to implement. Example:

```json
{
  "projectName": "my-todo-app",
  "version": "0.1.0",
  "features": [
    {
      "id": "F001",
      "category": "core",
      "priority": 1,
      "description": "User can add a new todo item",
      "acceptanceCriteria": [
        "Input field visible on main page",
        "Pressing Enter adds the todo to the list",
        "Input clears after adding",
        "Empty input shows validation error"
      ],
      "passes": false,
      "verifiedAt": null,
      "verifiedBy": null
    }
  ],
  "metadata": {
    "createdAt": "2024-01-15T10:00:00Z",
    "lastUpdated": "2024-01-15T10:00:00Z",
    "totalFeatures": 20,
    "passingFeatures": 0
  }
}
```

See `.github/templates/features.example.json` for a complete example.

### 2. `agent-progress.md`

Session-by-session log. Example entry:

```markdown
### Session 3 - 2024-01-16
**Duration**: ~2 hours
**Focus**: F003 - Data persistence

#### Completed
- Implemented localStorage persistence
- Added save/load functions
- Todos now persist across page refreshes

#### Blockers
- None

#### Next Steps
1. Implement F004 - Delete todo functionality
2. Add error handling for storage quota exceeded
```

### 3. `init.sh` / `init.ps1`

Reproducible environment startup. See `.github/templates/` for templates.

---

## VS Code Configuration

The `.vscode/settings.json` enables all customizations:

```json
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "chat.promptFiles": true,
  "chat.instructionsFilesLocations": {
    ".github/instructions": true
  },
  "chat.promptFilesLocations": {
    ".github/prompts": true
  }
}
```

---

## Innovation Highlights

This framework innovates beyond the original Anthropic research by:

1. **Embedded Behaviors**: All agent rules live in `copilot-instructions.md`, automatically applied without requiring custom agents or mode switches

2. **Slash Command Prompts**: Structured prompts (`/session-start`, `/session-end`, etc.) guide each workflow phase while staying in standard Agent mode

3. **Path-Specific Instructions**: Git, testing, and artifact rules apply automatically to relevant files via `applyTo` patterns

4. **Recovery Workflows**: Dedicated `/recover-from-failure` prompt for diagnosing and fixing broken states

5. **Progress Reports**: Generate stakeholder-friendly status reports from structured data

6. **Template Library**: Ready-to-use templates for features, progress, and init scripts

7. **Schema Validation**: JSON schema for `features.json` enables tooling and validation

8. **Zero Mode Switching**: Works entirely within GitHub's standard Agent mode

---

## Typical Workflow Example

Here's what a real coding session looks like:

```
You: /session-start

Agent: ## Session Start Report
       **Working Directory**: /Users/dev/my-todo-app
       
       ### Project Status
       - Total Features: 20
       - Passing: 5 (25%)
       - Last Session: 2024-01-15 - Completed F005 (toggle todo)
       
       ### Current Session Plan
       **Target Feature**: F006 - Delete individual todo
       **Approach**: Add delete button to each todo item, wire up click handler
       
You: Sounds good, let's do it

Agent: [Implements the feature, commits changes, runs tests]

You: I need to stop for today

You: /session-end

Agent: ## Session End Report
       ### Accomplishments
       - ✅ F006: Delete todo - Verified end-to-end
       
       ### Files Changed
       - src/components/TodoItem.tsx
       - src/hooks/useTodos.ts
       
       ### Handoff
       > Delete functionality complete and verified. Next session 
       > should tackle F007 (filter todos by status).
```

---

## Troubleshooting

### Prompts not appearing

1. Ensure `.vscode/settings.json` has `"chat.promptFiles": true`
2. Check that `.github/prompts/` folder exists with `.prompt.md` files
3. Reload VS Code window (Ctrl+Shift+P → "Reload Window")

### Agent not following instructions

1. Verify `copilot-instructions.md` is in `.github/` folder
2. Check `"github.copilot.chat.codeGeneration.useInstructionFiles": true` in settings
3. Start a new chat session (instructions apply to new sessions)

### Features.json not being respected

1. Ensure file is valid JSON (no trailing commas)
2. Check that feature IDs follow `F###` pattern
3. Verify `passes` field is boolean, not string

---

## References

* [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
* [VS Code: Customize chat to your workflow](https://code.visualstudio.com/docs/copilot/customization/overview)
* [GitHub: Adding repository custom instructions](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
* [VS Code: Use prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
* [VS Code: Copilot settings reference](https://code.visualstudio.com/docs/copilot/reference/copilot-settings)
* [GitHub: About custom agents](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-custom-agents)
* [VS Code: Use tools in chat](https://code.visualstudio.com/docs/copilot/chat/chat-tools)
