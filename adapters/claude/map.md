# Claude adapter map (v0.1)

| Package type | Destination |
|--------------|-------------|
| skill | `.claude/skills/<id>/SKILL.md` |
| skill (`reference.md`) | `.claude/skills/<id>/reference.md` |
| skill (`command.md`) | `.claude/commands/<id>.md` (optional) |
| skill (`agent.md`) | `.claude/agents/<id>.md` (optional companion, same id) |
| agent | `.claude/agents/<id>.md` |
| command | `.claude/commands/<id>.md` |
| rule | skipped (no Cursor-style `.mdc` yet) |
| template starter | `CLAUDE.md` if missing |
| any (`content/scripts/*`) | `scripts/<file>` if missing |

Cursor remains the primary adapter; Claude coverage will deepen over time.
