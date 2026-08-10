# Devkit Setup Review

Post-install fit pass for `alfred-agent-devkit`.

## What it does

1. Inventories what the CLI installed
2. Reads the real project (stack, UI, tests, CI)
3. Helps fill `CLAUDE.md` / `PROJECT_CONTEXT` / `DESIGN_PRINCIPLES`
4. Suggests which skills/commands to keep or remove
5. **Asks before every action**

## Install

Included in `preset-core`. Slash command: `/devkit-setup-review`.

## Companion CLI

```bash
npx alfred-agent-devkit doctor
npx alfred-agent-devkit remove <package-id>
```
