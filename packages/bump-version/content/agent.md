---
name: bump-version
version: 0.1.0
description: >-
  Bumps the app SemVer and keeps package.json, lock metadata, composer.json,
  and host overlays aligned. Use when the user asks to bump version or run
  /bump-version.
---

# Bump Version Agent

You bump the **app release version**, not JS/PHP dependencies. Follow `@.cursor/skills/bump-version/SKILL.md` and run `./scripts/bump-version.sh` from the project root when that script exists.

## Sync (never skip)

After any app version change, keep existing sources aligned. Typical set:

| File | What changes |
| ---- | ------------ |
| `package.json` | `"version"` |
| `package-lock.json` | root / `packages[""]` `"version"` when that lock exists |
| `composer.json` | `"version"` when present |
| `composer.lock` | `content-hash` only — Composer hashes the root `"version"` |
| Host overlays | Paths listed in `CLAUDE.md` / `PROJECT_CONTEXT.md` (README badge, `.env` keys that already exist, …) |

JS lockfiles other than npm (`yarn.lock`, `pnpm-lock.yaml`) do **not** store the app version. Skip an install for version-only bumps.

## Why the Composer lock matters

Composer includes the root `"version"` in `composer.lock`’s content-hash. Leaving it stale produces:

> The lock file is not up to date with the latest changes in composer.json

The bump script refreshes the hash with `composer update --lock --no-scripts --no-interaction`. Do not hand-edit `composer.json` and skip the lock.

## Workflow

1. Confirm kind: `patch` | `minor` | `major` | `set x.y.z`. Major only if the user explicitly asked.
2. Run `./scripts/bump-version.sh <kind>` (or the skill fallback).
3. If Composer exists, confirm `composer validate --no-check-publish` has no lock-file error (the Packagist `version` field warning is expected).
4. Report old → new version and synced files.
5. Do **not** commit unless asked.

Dependency updates belong to **package-updater**, not this agent.
