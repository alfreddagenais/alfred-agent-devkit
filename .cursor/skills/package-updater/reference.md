# Package updater reference

## Detect the JS package manager

Use the first match:

1. `package.json` `packageManager` field
2. `yarn.lock` → yarn
3. `pnpm-lock.yaml` → pnpm
4. `package-lock.json` or `npm-shrinkwrap.json` → npm
5. Else if `package.json` exists → npm

Do not mix managers in one turn.

## Commands

| Action | npm | yarn | pnpm |
| ------ | --- | ---- | ---- |
| Outdated | `npm outdated` | `yarn outdated` | `pnpm outdated` |
| Install / refresh lock | `npm install` | `yarn install` | `pnpm install` |
| Update one package | `npm update <pkg>` | `yarn up <pkg>` | `pnpm update <pkg>` |

Prefer editing the range in `package.json`, then install, so the manifest is the source of truth.

| Action | Composer |
| ------ | -------- |
| Outdated | `composer outdated` |
| Update deps | `composer update` or `composer update <package>` |
| Hash-only lock refresh | `composer update --lock --no-scripts --no-interaction` |
| Validate lock | `composer validate --no-check-publish` |

Composer hashes these `composer.json` keys into `composer.lock` `content-hash`: `name`, `version`, `require`, `require-dev`, `conflict`, `replace`, `provide`, `minimum-stability`, `prefer-stable`, `repositories`, `extra`. Changing any of them without a lock refresh fails validate.

The Packagist warning *“The version field is present…”* is expected when the root `"version"` exists. It is not a lock mismatch.

## Host scripts

Run only scripts that exist:

| Signal | Typical command |
| ------ | --------------- |
| `package.json` `scripts.test` | detected manager + `test` |
| `package.json` `scripts.build` | detected manager + `build` |
| `package.json` `scripts.lint` | detected manager + `lint` |
| `composer.json` / `CLAUDE.md` test | host command (`composer test`, `phpunit`, …) |

If the host has no `test` / `build` / `lint` script, use smoke commands from `CLAUDE.md` or `CONTRIBUTING.md`. Do not invent a test runner.

## Host overlays

Keep product-specific backup or install rules in `CLAUDE.md` or `.cursor/PROJECT_CONTEXT.md`. Examples:

- SQLite backup before Composer/yarn
- Private registries
- Pinned engines (`engines.node`)
