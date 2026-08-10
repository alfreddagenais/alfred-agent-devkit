# Cursor adapter map

| Package type | Destination |
|--------------|-------------|
| skill | `.cursor/skills/<id>/SKILL.md` |
| agent | `.cursor/agents/<id>.md` |
| command | `.cursor/commands/<id>.md` |
| rule | `.cursor/rules/<id>.mdc` |
| template (`CLAUDE.md.starter`) | `CLAUDE.md` if missing |
| template (`reference.md`) | `.cursor/docs/<id>.md` |

Presets expand `includes` then map each child package.
