# Write Changelog

Use the skill `@.cursor/skills/changelog-writer/SKILL.md` (or the `changelog-writer` agent).

Writes `<releasesDir>/YYYY-MM-DD_vMAJOR-MINOR-PATCH.json` for the current **minor** or **major** app version. The skill resolves `packages/changelogs/releases/` when that folder already exists; otherwise `changelogs/releases/`.

## Arguments

- `/write-changelog` — notes for the version in root `package.json` (must be a new major.minor line, or an existing draft)
- `/write-changelog 0.2.0` — notes for that version (date = today UTC unless a file already exists)

## Steps

1. If the version is only a patch bump, stop and explain that patch notes fold into the next minor or major
2. Edit or create the JSON file using the skill
3. Refresh a catalog only if the changelog package already has a `sync-catalog` script
4. Run that package’s tests if they exist
5. Do not commit unless asked
