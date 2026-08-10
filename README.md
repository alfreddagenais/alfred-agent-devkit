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
4. Run `/devkit-setup-review` in Cursor to fit the kit to your project

```bash
npx alfred-agent-devkit init --yes
npx alfred-agent-devkit init --advanced
npx alfred-agent-devkit init --dry-run
npx alfred-agent-devkit list
npx alfred-agent-devkit status
npx alfred-agent-devkit doctor
npx alfred-agent-devkit remove <package-id>
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

`init` writes starters for those files only when they are missing.

## Presets (v0.2)

| Preset | Includes |
|--------|----------|
| **Core** | english-code, orchestration, C.O.A.C.H., project-context-contract, `/devkit-setup-review` |
| **Code Review** | independent QA + security validator |
| **Architecture** | tech-lead-architect |
| **Testing** | test-quality |
| **Security** | qa-security-validator |
| **UI** | frontend-design, ui-ux agent, critique / polish / clarify |

## Recommended setup (2 steps)

1. **Install:** `npx alfred-agent-devkit init` (use `--advanced` to trim packages up front)
2. **Fit:** in Cursor, run `/devkit-setup-review` (asks before every change; can suggest removals)

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| `engines` / odd runtime errors | Node **>= 24** (see `.nvmrc`) |
| Want to preview writes | `init --dry-run` or `remove --dry-run` |
| Not sure what is installed | `status` then `doctor` |
| Re-init overwrote something | Prefer `init --advanced` and choose "skip existing" / ask per file |
| Kit feels too heavy | `/devkit-setup-review` or `remove <package-id>` |
| Context files empty | Fill starters, or let `/devkit-setup-review` draft with your answers |
| Claude rules missing | Expected for now: Cursor `.mdc` rules are primary |

Something still weird? Open an issue with `doctor` output (scrub secrets first).

## Related

For general engineering workflows and templates (not the agent installer), see [alfred-devkit](https://github.com/alfreddagenais/alfred-devkit).

## Contributing

Ideas, recommendations, and PRs welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).

## License

MIT. See [LICENSE](LICENSE).
