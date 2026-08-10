# Changelog

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
