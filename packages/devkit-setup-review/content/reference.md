# Devkit setup review reference

## Package groups (typical)

| Group | Package ids | Often keep when |
|-------|-------------|-----------------|
| Core | `english-code`, `agent-orchestration`, `coach-clarifying`, `coach-clarifying-rule`, `project-context-contract`, `devkit-setup-review` | Always, unless the user wants a tiny custom set |
| Code review | `independent-qa-review`, `independent-qa-reviewer`, `qa-independent-review`, `qa-security-validator` | Any app that ships changes for review |
| Architecture | `tech-lead-architect` | Non-trivial systems, refactors, greenfield structure |
| Testing | `test-quality` | Repos with or adopting automated tests |
| Security | `qa-security-validator` | Auth, multi-tenant, payments, public APIs |
| UI | `frontend-design`, `ui-ux-experience`, `ui-critique`, `ui-polish`, `ui-clarify` | Real UI / design work |

## Safe removal order

1. Propose
2. `remove --dry-run`
3. User confirms
4. `remove`
5. `doctor`

## Do not remove casually

- `project-context-contract` / context starters while onboarding is unfinished
- `devkit-setup-review` until the user is done fitting the kit
- Anything the user says they use weekly
