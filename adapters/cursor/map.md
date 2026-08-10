# Cursor adapter map

| Package type | Destination |
|--------------|-------------|
| skill | `.cursor/skills/<id>/SKILL.md` |
| skill (`reference.md`) | `.cursor/skills/<id>/reference.md` |
| skill (`command.md`) | `.cursor/commands/<id>.md` (optional companion slash command) |
| agent | `.cursor/agents/<id>.md` |
| command | `.cursor/commands/<id>.md` |
| rule | `.cursor/rules/<id>.mdc` |
| template (`CLAUDE.md.starter`) | `CLAUDE.md` if missing |
| template (`PROJECT_CONTEXT.md.starter`) | `.cursor/PROJECT_CONTEXT.md` if missing |
| template (`DESIGN_PRINCIPLES.md.starter`) | `.cursor/DESIGN_PRINCIPLES.md` if missing |
| template (`reference.md`) | `.cursor/docs/<id>.md` |

Presets expand `includes` then map each child package.
