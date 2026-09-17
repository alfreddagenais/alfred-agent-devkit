# Changelog

## 0.4.1

### Added

- Product-UI craft playbook on `frontend-design` (`reference.md`)
- Commands `/ui-visual-system`, `/ui-decision-flow`, `/ui-surface-fit`
- `preset-ui` 0.2.0 includes the three new craft lenses
- `preset-release` 0.2.0: `/bump-version`, `package-updater`, `version-bump` rule, and `scripts/bump-version.sh` starter

### Changed

- `ui-ux-experience` 0.2.0: craft lenses + PASS/HOLD finish gate
- `ui-critique` / `ui-polish` / `ui-clarify` 0.2.0
- `project-context-contract` 0.2.0 starter craft checks
- QA and orchestration packages pick up overlay-contrast / trust-cluster checks
- `devkit-setup-review` → 0.1.3 (Release package group lists bump/updater)
- Adapters copy `content/scripts/*` to `scripts/` only when missing

## 0.4.0

### Added

- `preset-release`: changelog writer skill + companion agent + `/write-changelog`
- Skills may ship an optional companion `agent.md` (same id as the skill)
- Default notes folder is `changelogs/releases/`; `packages/changelogs/releases/` is used when that directory already exists

### Changed

- Interactive `init` default preset list includes `preset-release` (`--yes` still installs only Core + Code Review)
- `devkit-setup-review` → 0.1.1 (Release package group)

## 0.3.0

### Added

- `update`: refresh managed kit files from the current CLI; keeps `overrides` and all custom project files
- `init --skip-existing`: adopt mode for repos that already have `.cursor/` content
- `init --presets <ids>`: non-interactive preset list (use with `--yes`)
- Lockfile fields `files[]` (managed paths + sha256) and `overrides[]` (local copies kept)

### Changed

- `status` reports managed file count and override paths
- Post-init next steps mention `update`

## 0.2.0

### Added

- `init --advanced`: pick packages individually and control overwrites
- `status`: show install manifest summary
- `doctor`: health check for install paths and context stubs
- `remove`: uninstall presets/packages with confirmation (`--dry-run` supported)
- Package `devkit-setup-review` (skill + `/devkit-setup-review`), included in `preset-core`
- Starters for `.cursor/PROJECT_CONTEXT.md` and `.cursor/DESIGN_PRINCIPLES.md`
- Skills may ship an optional companion `command.md`
- `SECURITY.md`, troubleshooting section in README, GitHub issue templates
- `CONTRIBUTING.md`

### Changed

- `preset-core` → 0.1.3 (includes setup review)
- `project-context-contract` → 0.1.1 (extra starters)
- Post-init next steps point at `/devkit-setup-review` and `doctor`

## 0.1.0

- Initial public CLI: `init`, `list`, presets, Cursor + Claude adapters
