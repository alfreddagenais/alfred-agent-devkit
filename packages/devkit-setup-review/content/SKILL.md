---
name: devkit-setup-review
version: 0.1.0
description: >-
  Post-install review that fits alfred-agent-devkit skills, commands, and
  project context to the real repository. Suggests keep/remove actions and
  context fills. Use after init, when the kit feels too heavy, or when
  PROJECT_CONTEXT is still empty. Always ask before each change.
---

# Devkit Setup Review

Run after `npx alfred-agent-devkit init`, or when the user invokes `/devkit-setup-review`.

This is **not** a product code review. For that, use `/qa-independent-review`.

## Hard rules

1. **Ask before every action** that creates, edits, or deletes a file.
2. Prefer proposing a plan, then applying items one by one (or a user-approved batch).
3. Prefer CLI removal: `npx alfred-agent-devkit remove <package-id>` (or `--dry-run` first).
4. Never remove secrets files, `.env*`, or unrelated project code.
5. Keep English for kit files and project context docs unless the user asks otherwise.

## Step 1: Inventory

Gather:

```bash
npx alfred-agent-devkit status
npx alfred-agent-devkit doctor
```

Also read when present:

| Path | Why |
|------|-----|
| `.alfred-agent-devkit.json` | Installed tools, presets, packages |
| `CLAUDE.md` | Short project entry |
| `.cursor/PROJECT_CONTEXT.md` | Domain / architecture |
| `.cursor/DESIGN_PRINCIPLES.md` | UI standards |
| `.cursor/skills/`, `.cursor/agents/`, `.cursor/commands/`, `.cursor/rules/` | What landed on disk |

Summarize installed packages in a short table: id, type, one-line purpose.

## Step 2: Signal from the real repo

Scan the project (lightweight):

- Package manifests (`package.json`, `composer.json`, `pyproject.toml`, `go.mod`, …)
- App / UI folders (`app/`, `src/`, `web/`, `frontend/`, …)
- Tests and CI (`.github/workflows/`, `*.test.*`, `phpunit.xml`, …)
- Infra hints (`Dockerfile`, `docker-compose*`, Terraform, …)
- Existing AI docs (`AGENTS.md`, `.cursor/rules/*`)

Infer rough needs:

| Signal | Kit lean |
|--------|----------|
| Little or no UI | UI preset/packages may be optional |
| No automated tests yet | Keep or drop `test-quality` with a clear reason |
| Library / CLI only | Architecture + core often enough |
| Auth, payments, multi-tenant, public API | Keep security-oriented packages |
| Greenfield with empty context | Prioritize context files before trim |

## Step 3: Context fit

Check `CLAUDE.md`, `.cursor/PROJECT_CONTEXT.md`, `.cursor/DESIGN_PRINCIPLES.md`.

For each missing or stubby file:

1. Say what is missing
2. Ask 1–3 targeted questions (reuse C.O.A.C.H. if helpful)
3. Propose a draft
4. **Ask before writing**

Do not invent product facts. Prefer short tables and checklists.

## Step 4: Keep / remove plan

Produce a numbered plan, for example:

```text
Plan
1. [context] Fill PROJECT_CONTEXT.md (draft ready)
2. [keep] preset-core packages (baseline)
3. [remove] frontend-design, ui-* (no UI in this repo)
4. [keep] qa-security-validator (public API present)
```

For each removal candidate, include:

- Package id
- Why it looks unnecessary **for this repo**
- Suggested command: `npx alfred-agent-devkit remove <id> --dry-run`

Default bias: **keep when unsure**. Suggest removal only with a concrete reason.

## Step 5: Apply with consent

For each plan item:

1. Restate the action in one sentence
2. Ask for yes / no / skip
3. On yes: perform it
4. On remove: prefer the CLI; then re-run `doctor` if useful

Optional: offer “approve remaining items” after the user has seen the full plan. Still confirm destructive batches once.

## Step 6: Closing summary

End with:

- What changed
- What stayed
- Open questions for the user
- Next useful command (often `/qa-independent-review` once context is solid)

## Quick CLI cheat sheet

```bash
npx alfred-agent-devkit status
npx alfred-agent-devkit doctor
npx alfred-agent-devkit list
npx alfred-agent-devkit remove <package-id> --dry-run
npx alfred-agent-devkit remove <package-id>
npx alfred-agent-devkit init --advanced --dry-run
```
