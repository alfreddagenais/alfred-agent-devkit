# Project context contract

## Required reading order for agents

1. `CLAUDE.md` (or `AGENTS.md`): short entry
2. `.cursor/PROJECT_CONTEXT.md`: domain & architecture
3. `.cursor/DESIGN_PRINCIPLES.md`: when touching UI
4. Project-specific `.cursor/rules/*`: alwaysApply conventions

## What belongs in the project (not in shared packages)

- Product names, clients, unreleased features
- Absolute local paths, Docker service names unique to the monorepo
- Domain checklists (e.g. tenant isolation fields, music taxonomy)
- Secrets, private URLs, pilot customer names

## What belongs in shared packages

- Generic workflows (QA report template, C.O.A.C.H., design anti-patterns)
- Role definitions that say “read PROJECT_CONTEXT” instead of embedding product lore
- Command maps as **placeholders** the project fills in (`lint`, `test`, `build`)
