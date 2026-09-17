# Package Updater

Use the skill `@.cursor/skills/package-updater/SKILL.md` (or the `package-updater` agent).

Audits and updates JS and Composer dependencies. Applies patch/minor first. Defers majors for you to confirm.

App SemVer is **not** this command. Use `/bump-version`.

## Arguments

- `/package-updater` — full audit, then apply safe updates
- `/package-updater audit` — report only; do not write
- `/package-updater apply` — apply deferred majors the user already named in chat

## Steps

1. Detect package manager and manifests (see the skill `reference.md`)
2. Run the host backup hook if the project documents one
3. Audit outdated packages
4. Apply patch/minor unless the user asked for audit-only
5. Produce the Applied / Deferred report
6. Do not commit unless asked
