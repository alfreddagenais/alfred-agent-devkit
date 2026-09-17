# Bump Version

Use the skill `@.cursor/skills/bump-version/SKILL.md` (or the `bump-version` agent) and run `./scripts/bump-version.sh` from the project root when that script exists.

## Arguments

- `/bump-version` — ask patch vs minor (major only if the user says so)
- `/bump-version patch` — `x.y.Z+1`
- `/bump-version minor` — `x.Y+1.0`
- `/bump-version major` — `X+1.0.0` (explicit user request only)
- `/bump-version set 1.4.0` — set exact version

## Syncs

`package.json` `"version"`, npm `package-lock.json` root version when present, `composer.json` / `composer.lock` content-hash when Composer is in the repo, plus host overlays documented in `CLAUDE.md` or `PROJECT_CONTEXT.md`.

`yarn.lock` / `pnpm-lock.yaml` do not need a refresh for an app version bump.

## Steps

1. Confirm bump kind if not provided
2. Run the script (use `--dry-run` first only if the user wants a preview)
3. If Composer exists, confirm `composer validate --no-check-publish` has no lock mismatch
4. Report old → new version
5. After minor/major, mention `/write-changelog` when that command is installed
6. Do not commit unless asked
