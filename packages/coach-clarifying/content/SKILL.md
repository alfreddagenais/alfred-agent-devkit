---
name: coach-clarifying
version: 0.1.0
description: >-
  Structured clarification using C.O.A.C.H. when requirements are ambiguous.
  Use when the user wants a discovery pass before coding, or when missing
  details would change architecture, UX, or security.
---

# Clarifying Questions (C.O.A.C.H.)

**Canonical rules:** `.cursor/rules/coach-clarifying-rule.mdc` when installed (always applied).

## When to use this skill explicitly

- User asks for **clarifying questions** before you build.
- Request spans **multiple domains** and success criteria are unclear.
- **Security or compliance** scope is fuzzy.

## When not to use

- Request is **already specific**; you can read the repo and implement.
- User said **no questions** / **just do it** / **skip clarifying**: proceed with stated assumptions.

## Quick reference

- **C.O.A.C.H.:** Context, Outcome, Audience, Constraints, Handoff.
- **Batch sizes:** default up to **3** questions; **in a hurry** → 1 then answer; **complex** → up to **5** in one batch.
- **Starter list:** goal/metric, audience, tone, avoidances, examples, format, constraints, sources/priorities, prior attempts, confidential/off-limits.

After answers (or bypass), continue with orchestration and implementation. Read project `CLAUDE.md` / `.cursor/PROJECT_CONTEXT.md` for domain facts.
