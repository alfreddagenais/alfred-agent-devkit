# alfred-agent-devkit

Installable AI agents, skills, and commands. Packages + presets + adapters. Cursor first, then Claude Code. Codex / Copilot later.

```bash
npx alfred-agent-devkit init
# local clone:
npm install
node ./bin/alfred-agent-devkit.js init
```

## Flow

1. Pick tools (Cursor, Claude Code)
2. Pick presets (Core, Code Review, Architecture, Testing, Security, UI)
3. Files land in `.cursor/` (and `.claude/` if selected)

```bash
npx alfred-agent-devkit init --yes
npx alfred-agent-devkit init --dry-run
npx alfred-agent-devkit list
```

## Model

```
packages/   skills, agents, commands, rules
presets/    bundles (preset-core, …)
adapters/   write into .cursor/ / .claude/ / …
```

Agents are specialists without product memory. Each project should keep:

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Short entry (stack, commands, non-negotiables) |
| `.cursor/PROJECT_CONTEXT.md` | Domain and architecture |
| `.cursor/DESIGN_PRINCIPLES.md` | UI standards |

`init` writes a `CLAUDE.md` starter only if the file is missing.

## Presets (v0.1)

| Preset | Includes |
|--------|----------|
| **Core** | english-code, orchestration, C.O.A.C.H., project-context-contract |
| **Code Review** | independent QA + security validator |
| **Architecture** | tech-lead-architect |
| **Testing** | test-quality |
| **Security** | qa-security-validator |
| **UI** | frontend-design, ui-ux agent, critique / polish / clarify |

## Related

For general engineering workflows and templates (not the agent installer), see [alfred-devkit](https://github.com/alfreddagenais/alfred-devkit).

## Contributing

Ideas, recommendations, and PRs welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
