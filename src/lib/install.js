import fs from 'node:fs'
import path from 'node:path'
import { expandPresetIncludes, loadManifest } from './catalog.js'
import { planClaudeWrites } from './adapters/claude.js'
import { planCursorWrites } from './adapters/cursor.js'

const TOOL_PLANNERS = {
  cursor: planCursorWrites,
  claude: planClaudeWrites,
}

export function planInstall({ tools, presets, targetRoot }) {
  const packageIds = expandPresetIncludes(presets)
  const ops = []
  const seen = new Set()

  for (const packageId of packageIds) {
    const manifest = loadManifest(packageId)
    for (const tool of tools) {
      const planner = TOOL_PLANNERS[tool]
      if (!planner) continue
      for (const op of planner(packageId, manifest, targetRoot)) {
        const key = `${op.to}::${op.from}`
        if (seen.has(key)) continue
        seen.add(key)
        ops.push({ ...op, tool })
      }
    }
  }

  return { packageIds, ops }
}

export function applyInstall(ops, { dryRun = false } = {}) {
  const written = []
  const skipped = []

  for (const op of ops) {
    if (dryRun) {
      written.push(op)
      continue
    }
    fs.mkdirSync(path.dirname(op.to), { recursive: true })
    if (fs.existsSync(op.to)) {
      // Overwrite package-managed files; CLAUDE.md already gated as missing-only
      fs.copyFileSync(op.from, op.to)
      written.push(op)
    } else {
      fs.copyFileSync(op.from, op.to)
      written.push(op)
    }
  }

  return { written, skipped }
}

export function writeInstallManifest(targetRoot, meta, { dryRun = false } = {}) {
  const dest = path.join(targetRoot, '.alfred-agent-devkit.json')
  if (dryRun) return dest
  fs.writeFileSync(dest, `${JSON.stringify(meta, null, 2)}\n`, 'utf8')
  return dest
}
