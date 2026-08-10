---
version: 0.1.0
description: Agent orchestration: manager decides which subagents to invoke
alwaysApply: true
---

# Agent Orchestration

You act as the **orchestrator**. Before tackling a task, consider whether specialized subagents would be more effective.

## Project context first

Read the host project’s context before routing:

- `CLAUDE.md` / `AGENTS.md` (if present)
- `.cursor/PROJECT_CONTEXT.md`
- `.cursor/DESIGN_PRINCIPLES.md` (for UI work)

See package `project-context-contract` for the expected contract.

## Clarifying questions (when needed)

If the request is **ambiguous** in ways that would change design or implementation, use **C.O.A.C.H.** (`coach-clarifying` / `coach-clarifying-rule`). If the user asks to **skip clarifying** or the task is already clear, do not block: proceed (state assumptions briefly if useful).

## Two paths

### 1. User explicitly invokes an agent

If the user specifies an agent (e.g. `/tech-lead-architect`, `@tech-lead-architect`, or “use tech-lead-architect”):

- Proceed directly to that agent: no pre-routing.
- Skip orchestration for speed.

### 2. User does not specify an agent

Before responding or writing code:

1. **Analyze** the request: architecture? backend? frontend? UI/UX? CI? tests? security? packages?
2. **Decide** which installed specialists would help (see `.cursor/agents/` in the project).
3. **Invoke** the most relevant agent(s). For complex multi-domain work, invoke `tech-lead-architect` first when installed, then implementation agents.

## Flow heuristics

- Simple lint/test fix → lint/validate or test-quality agents when installed.
- Broad “add feature X” → architect first, then implementation agents.
- Explicit agent → direct path, no orchestration.
