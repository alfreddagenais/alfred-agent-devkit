---
name: independent-qa-review
version: 0.1.0
description: >-
  Independent QA review of recent changes with fresh eyes. Validates
  correctness, UX, copy, security, tests, and regressions; produces a
  structured report with manual test cases and separates auto-fix items
  from user decisions. Use when the user asks for external QA, post-feature
  validation, or before merge.
---

# Independent QA Review

Run when acting as **Independent QA Reviewer** or when the user invokes `/qa-independent-review`.

## Mindset

Assume nothing works until verified. Do not trust the implementer’s summary. Read `.cursor/agents/independent-qa-reviewer.md` when installed.

Read project context first: `CLAUDE.md`, `.cursor/PROJECT_CONTEXT.md`, `.cursor/DESIGN_PRINCIPLES.md`.

## Step 1: Discover the change set

```bash
git status
git diff --stat
git diff                    # or git diff main...HEAD for branch reviews
```

Note files touched vs stated goal, deletions, and lockfile-only churn.

## Step 2: Orphan and regression scan

Grep for removed identifiers and stale labels (adapt to the feature). Check coupling surfaces documented in the project’s `CLAUDE.md` / `PROJECT_CONTEXT` (routes, auth, public APIs, realtime, queues, multi-tenant boundaries).

## Step 3: Automated gates

Use the project’s documented lint/test/build commands from `CLAUDE.md` or docs. Record pass/fail. Failures are **Blockers** unless clearly pre-existing and unrelated.

## Step 4: Product and UX review

For UI changes, score against the project’s design principles (C.L.E.A.R. when present):

- One primary action per section?
- Labels match actual behavior?
- State shown where the user acts?
- Secondary actions de-emphasized?
- Keyboard / screen reader basics?
- Touch targets adequate for the product’s devices?

## Step 5: Manual test plan

Write at least: happy path, alternate entry, edge/failure, and one regression for critical boundaries (auth, tenancy, public vs private surfaces).

## Step 6: Classify

| Finding type | Action |
| --- | --- |
| Blocker | Must fix before merge |
| Should fix | Safe for an agent to implement |
| User decision | Present 2-3 options |
| Test gap | Note; invoke `test-quality` if installed |
| Security | List fix; invoke `qa-security-validator` if installed |

## Step 7: Deliver report

Use the report template in `.cursor/agents/independent-qa-reviewer.md`.
