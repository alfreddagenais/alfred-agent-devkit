# Bump version reference

## Sync targets (detect, do not invent)

| Target | When |
| ------ | ---- |
| `package.json` `"version"` | File exists |
| `package-lock.json` root + `packages[""]` `"version"` | File exists (npm) |
| `composer.json` `"version"` | File exists with a string version |
| `composer.lock` content-hash | `composer.lock` exists; run `composer update --lock --no-scripts --no-interaction` |
| `README.md` heading `## Presets (vX.Y.Z)` | That exact heading pattern exists |
| `.env` `APP_VERSION` / `NATIVEPHP_APP_VERSION` | The **key already exists** (do not create NativePHP keys on a JS-only host) |
| `.env.example` commented copies of those keys | The key already exists |
| Extra paths | Named in `CLAUDE.md` or `.cursor/PROJECT_CONTEXT.md` |

Canonical read: Composer version if present, else `package.json`. If they differ, warn and use the canonical file.

## Script contract

`./scripts/bump-version.sh [--dry-run] <patch|minor|major|set> [x.y.z]`

- Preserve JSON key order and formatting; replace the top-level `"version"` field
- Do not create a git commit or tag
- Do not bump dependency ranges
- Print `version: OLD -> NEW (kind)` and a synced-files list

This package ships `content/scripts/bump-version.sh`. The Cursor/Claude adapters write it to `scripts/bump-version.sh` **only when missing**.

## Fallback (no script)

1. Compute the new SemVer (drop pre-release / build on bump)
2. Replace root `"version"` in `package.json` / `composer.json`
3. Replace npm lock root versions (first two `"version"` keys before `node_modules/`)
4. Refresh Composer lock hash when `composer.lock` exists
5. Patch known overlays from the table above
6. Do not run `yarn install` / `pnpm install` for version-only bumps

## Changelog

Patch notes fold into the next minor/major. After a minor or major bump, if `write-changelog` is installed, remind the user to run `/write-changelog`.
