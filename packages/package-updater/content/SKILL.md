---
name: package-updater
version: 0.1.0
description: >-
  Validates and updates npm, yarn, pnpm, and Composer dependencies. Applies
  patch/minor first, defers majors, and keeps lock files in sync with
  manifests. Use when updating packages or when the user asks for dependency
  upgrades.
---

# Package Updater

Keep dependencies current with low risk. Run from **project root**.

**Guiding principle:** Update safely first. Defer major breaking upgrades and present them for the user to choose. Never leave a lock file stale after a manifest edit.

App SemVer (`"version"` in `package.json` / `composer.json`) is **not** in scope. Use `/bump-version` or `./scripts/bump-version.sh`.

Read `CLAUDE.md` and `.cursor/PROJECT_CONTEXT.md` when present for host package managers, test commands, and backup hooks.

## Target files

Detect what exists. Do not invent a stack.

| File | Purpose |
| ---- | ------- |
| `package.json` | JS dependencies |
| `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` | JS lock |
| `composer.json` | PHP dependencies |
| `composer.lock` | Composer lock **and** content-hash |

See `reference.md` for package-manager detection and commands.

## Lock file sync (mandatory)

After any **dependency** change, refresh the matching lock in the same turn.

| Manifest | Lock | Command |
| -------- | ---- | ------- |
| `package.json` | npm / yarn / pnpm lock | Install with the detected manager (`npm install`, `yarn install`, `pnpm install`) |
| `composer.json` | `composer.lock` | Dep change: `composer update` or `composer update <package>`. Metadata / app `"version"` only: `composer update --lock --no-scripts --no-interaction` |

A root `"version"`-only edit in `package.json` is a **bump-version** job. npm’s lock still stores that root version — the bump script updates it. This skill must not hand-edit app SemVer.

Then, if Composer is in play, run `composer validate --no-check-publish`. A lock mismatch is a failure.

## Workflow

### Phase 0: Host backup (when documented)

If the host has a documented pre-update backup (`scripts/backup-db-before-packages.sh`, `php artisan db:backup`, or notes in `CLAUDE.md` / `PROJECT_CONTEXT.md`), run that **before** install/update commands. Skip invented backups.

### Phase 1: Audit

1. Read the manifests that exist
2. List outdated packages:
   - **npm:** `npm outdated`
   - **yarn:** `yarn outdated`
   - **pnpm:** `pnpm outdated`
   - **Composer:** `composer outdated`
3. If `resolutions` / `overrides` exist, check whether each is still needed
4. Group: **patch/minor** (safe) vs **major** (potential breaking)

### Phase 2: Apply safe updates

1. Update patch and minor constraints in the manifest **and** the lock
2. Install / update
3. Validate Composer lock when `composer.json` exists
4. Run host scripts that exist: test, build, lint (see `package.json` `scripts` and `CLAUDE.md`)
5. Fix failures with minimal code changes

### Phase 3: Majors

For each major candidate:

1. Read breaking changes (changelog, migration guide)
2. Apply only if the fix is small; otherwise **defer** and add to the report

### Phase 4: Report

```markdown
## Package Update Summary

### Applied (safe)
- package-a: 1.2.3 → 1.2.5

### Resolutions / overrides
- removed: …
- kept: … (why)

### Deferred (user decision)
| Package | Current | Latest | Breaking changes |
| ------- | ------- | ------ | ---------------- |
| package-x | 2.1.0 | 4.0.0 | API rewrite |
```

Ask: _Do you want to proceed with any of the deferred major upgrades?_

### Phase 5: Validation reminder

If installed, remind the user to run `/qa-independent-review` and `qa-security-validator`.

## Rules

- English for code, comments, and the report
- Update manifest constraints, not only the lock
- Never leave a lock stale after editing its manifest
- If a major upgrade breaks tests and fixes are non-trivial, defer
- Do **not** treat app SemVer bumps as package updates
