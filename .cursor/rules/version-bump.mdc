---
version: 0.1.0
description: App release version bumps (patch/minor) — propose after shippable work; sync all version sources
alwaysApply: true
---

# App Version Bumps

## Policy

- **patch** (`1.3.2` → `1.3.3`): fix, polish, small UX tweak
- **minor** (`1.3.2` → `1.4.0`): new user-facing feature / notable surface
- **major** (`→ 2.0.0`): **only when the user explicitly requests it**
- Do **not** bump for lint-only, rename-only, or unfinished WIP

## When to act

1. **User asks** `/bump-version` or “bump version” → follow `@.cursor/skills/bump-version/SKILL.md` and run `./scripts/bump-version.sh` when present
2. **End of shippable work** → ask once: bump **patch** / **minor** / **skip**? Never auto-bump; never suggest major unless they ask

## Sync (never hand-edit one file alone)

Use `./scripts/bump-version.sh <patch|minor|major|set>` so existing sources stay aligned (`package.json`, npm lock root version, Composer version + lock hash, documented README/env overlays).

Do not commit the bump unless the user asks.

Dependency upgrades (`npm` / `yarn` / `composer require`) belong to `package-updater`.
