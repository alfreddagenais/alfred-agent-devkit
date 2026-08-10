# Contributing

Hey. Thanks for stopping by.

This repo is still early. If something feels off, unclear, or just "I'd do it differently", say so. I'm happy to hear it.

## Ways to help

You don't need a perfect PR to be useful.

- 💬 **Open an issue** with a bug, idea, or rough note. Half-formed thoughts are fine.
- 💡 **Send a recommendation** (issue or discussion). Docs, DX, presets, adapters, naming, whatever you noticed.
- 🔀 **Open a PR** if you already have a fix or a small improvement. Welcome with pleasure.

No pressure either way. A short note often helps more than a giant rewrite.

## Before you dive in

1. Skim the [README](README.md) so the packages / presets / adapters model is clear.
2. Prefer small, focused changes over big multi-purpose PRs.
3. Keep English for code, comments, and package docs.
4. No secrets, tokens, or private client stuff in PRs.

## Local smoke check

```bash
npm install
node ./bin/alfred-agent-devkit.js list
node ./bin/alfred-agent-devkit.js init --dry-run
```

If you touch install paths or adapters, try a real `init` in a throwaway folder too.

## PR tips

- Say what changed and why (one short paragraph is enough).
- Link an issue if there is one.
- If you're unsure about direction, open the issue first. Happy to chat before you spend hours on it.

## Tone of the project

Clear, short, practical. Same bar as the CLI: make the next step obvious.

Thanks again. Really. If this kit helped you even a little, a PR or a recommendation means a lot. 🙌
