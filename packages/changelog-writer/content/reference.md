# Changelog JSON reference

## Schema

Published files omit `draft` or set `"draft": false`. Required: `version`, `date`, `summary`, `sections` with at least one non-empty key.

Optional: `title` (≤ 80 chars).

| Field | Required | Notes |
| ----- | -------- | ----- |
| `version` | yes | Must match the filename (`v0-2-0` → `0.2.0`) |
| `date` | yes | Must match the filename `YYYY-MM-DD` |
| `title` | no | Short headline |
| `summary` | yes when published | One or two sentences |
| `draft` | no | `true` hides the note until published |
| `sections` | yes when published | Only non-empty keys are shown |

Section keys, in display order: `added`, `improved`, `changed`, `fixed`, `security`, `breaking`, `removed`. Use only keys that have items.

Item: a string, or `{ "text": "…", "items": ["nested"] }`. Nested lines are one level only.

Inline markup only: `` `code` ``, `**bold**`, `*italic*`, `[label](https://…)` or `[label](/path)`. No HTML.

## Example

```json
{
  "version": "0.2.0",
  "date": "2026-09-16",
  "title": "What’s new",
  "summary": "You can now review recent sessions from the home screen.",
  "draft": false,
  "sections": {
    "added": [
      "Home lists your last sessions with a single tap to open one."
    ],
    "improved": [
      {
        "text": "Charts stay readable in dark venues",
        "items": ["Higher contrast on axis labels"]
      }
    ]
  }
}
```

## Optional catalog refresh

If the parent of the releases folder is a package with a `sync-catalog` script, run it (pnpm workspace filter when the host uses pnpm; otherwise `npm run sync-catalog` in that package). If that package has tests, run them. Do not invent a catalog generator.

## Host overlay

Keep product facts in the host repo: `CLAUDE.md`, `.cursor/PROJECT_CONTEXT.md`, or a local bump-version skill. Typical overlays:

| Host shape | Releases folder |
| ---------- | --------------- |
| Simple repo | `changelogs/releases/` |
| JS monorepo / shared UI package | `packages/changelogs/releases/` |
