---
name: changelog-writer
version: 0.1.0
description: >-
  Writes concise user-facing changelog JSON for minor and major app
  releases. Use after a minor/major version bump, /write-changelog, or
  when filling changelogs/releases (or packages/changelogs/releases).
---

# Changelog Writer

You write **short user-facing** release notes. Patch versions do **not** get their own file; they fold into the next **minor** or **major** note.

Read the host `CLAUDE.md` and `.cursor/PROJECT_CONTEXT.md` for product name, audience, and any changelog path overlay.

## When to run

- User ran `/bump-version minor` or `major` (or `set` that changes major.minor)
- User ran `/write-changelog`
- A `draft: true` file exists under the resolved releases folder

Do **not** create a file for `patch` bumps.

## Releases folder

Resolve once, then stay on that path:

1. If `CLAUDE.md`, `.cursor/PROJECT_CONTEXT.md`, or `.cursor/skills/bump-version/SKILL.md` names `packages/changelogs/releases` or `changelogs/releases`, use that path.
2. Else if `packages/changelogs/releases/` exists, use it.
3. Else if `changelogs/releases/` exists, use it.
4. Else create `changelogs/releases/`.

Filename:

```
<releasesDir>/YYYY-MM-DD_vMAJOR-MINOR-PATCH.json
```

Date is the UTC day of the bump (`date -u +%Y-%m-%d`). Version uses hyphens: `0.2.0` → `v0-2-0`.

If a bump script already drafted the file, **edit that file**. Do not create a second file for the same version.

## Voice

Lean technical-writing habits (evidence over theater):

- English. Outcome-first. Prefer second person when it helps ("You can now…").
- One or two sentence `summary`. Aim for **≤ 10 bullets total**, hard cap **8 per section**.
- Nested `items` only when they clarify one parent point (one extra level).
- Audience: the product’s end users (from PROJECT_CONTEXT), not git historians.
- Skip chores, lint, lockfiles, rename-only, and unfinished WIP unless they changed something the user can see.
- Group many patch commits into themes. Do not paste commit subjects.
- If the diff does not show it, do not claim it. Prefer fewer bullets over invention.

## Sources (read, then synthesize)

1. Draft JSON if present
2. Previous published file in the releases folder (git range starts after that version)
3. `git log` and `git diff` since that version (or since the last changelog date)
4. User-facing docs only if they explain a shipped behavior (`README.md`, `.cursor/PROJECT_CONTEXT.md`)

See `reference.md` for the JSON schema and optional catalog refresh.

## Workflow

1. Confirm the target version (root `package.json` when present) and UTC date
2. Resolve the releases folder; locate or scaffold `YYYY-MM-DD_vX-Y-Z.json`
3. Draft sections from the sources above
4. Remove `draft`, fill `summary` and sections
5. Refresh a catalog only if the changelog package already has a `sync-catalog` script
6. Run that package’s tests if they exist
7. Show the file path and a short preview. Do **not** commit unless asked

## Do not

- Invent features that are not in the diff
- Write a changelog for a patch bump
- Leave `draft: true` after you were asked to publish notes
- Use `dangerouslySetInnerHTML` anywhere in the app
- Hardcode a product path when the host already documents another folder
