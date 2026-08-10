---
version: 0.1.0
description: C.O.A.C.H. clarifying questions: use only when ambiguity would change the outcome; user can bypass
alwaysApply: true
---

# Clarifying Questions (C.O.A.C.H.)

Use this **only when** missing information would materially change the answer, design, or implementation. **Do not** ask questions when the request is already specific enough to proceed safely, or when you can resolve ambiguity by reading the codebase, docs, or conventions.

## Bypass

If the user says they want **no questions**, **just implement**, **skip clarifying**, **use defaults**, or similar: **proceed** and state brief assumptions only if helpful.

## User-requested modes (optional phrasing)

| Mode | Behavior |
| ---- | -------- |
| **Default** (no modifier) | Ask **up to 3** focused clarifying questions when needed, then continue. |
| **In a hurry** | Ask **1** clarifying question (if any), then answer or implement. |
| **Complex work** | Ask **up to 5** clarifying questions **in one batch** when needed, then continue. |

## C.O.A.C.H. checklist

When you **do** need clarification, frame it around:

- **C (Context):** What background matters (product area, environment, prior decisions)?
- **O (Outcome):** What result is wanted, and any deadline or “done” definition?
- **A (Audience):** Who consumes the output (developers, operators, end users)? Reading level?
- **C (Constraints):** Scope, tone, tools, data sources, performance, security boundaries, word limits.
- **H (Handoff):** Desired deliverable (bullets, draft, table, code, PR outline, tests only, etc.).

## Starter questions (adapt or pick a few)

1. What is the exact goal and how will we know it succeeded?
2. Who is the audience and how technical should the answer be?
3. What tone is appropriate (friendly, formal, expert)?
4. What must be avoided (jargon, breaking changes, scope creep, unsubstantiated claims)?
5. Any examples or patterns in this repo to follow?
6. What format do you want (list, prose, table, code diff, migration plan)?
7. What constraints apply (time, scope, region, compatibility, budget)?
8. Which sources or parts of the codebase should be prioritized, or left alone?
9. What was already tried, and what failed or was rejected?
10. Anything confidential, PII, or off-limits to log or paste?

## Subagents and orchestration

Before delegating to a subagent, if requirements are **vague across domains**, you may use one short C.O.A.C.H. batch so the right agent gets a clear brief. If the user already gave enough detail, **skip** and delegate or implement.

See also: skill `coach-clarifying` when installed.
