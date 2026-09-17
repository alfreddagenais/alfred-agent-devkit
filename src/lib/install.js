import fs from 'node:fs'
import path from 'node:path'
import { expandPresetIncludes, loadManifest } from './catalog.js'
import { planClaudeWrites } from './adapters/claude.js'
import { planCursorWrites } from './adapters/cursor.js'
import { filesEqual, sha256File } from './hash.js'

const TOOL_PLANNERS = {
  cursor: planCursorWrites,
  claude: planClaudeWrites,
}

export const MANIFEST_NAME = '.alfred-agent-devkit.json'

export function manifestPath(targetRoot) {
  return path.join(targetRoot, MANIFEST_NAME)
}

export function readInstallManifest(targetRoot) {
  const dest = manifestPath(targetRoot)
  if (!fs.existsSync(dest)) return null
  try {
    return JSON.parse(fs.readFileSync(dest, 'utf8'))
  } catch {
    throw new Error(`Could not parse ${MANIFEST_NAME}. Fix or delete it, then re-run init.`)
  }
}

/**
 * Plan install ops from presets and/or explicit package ids.
 */
export function planInstall({ tools, presets = [], packages = [], targetRoot }) {
  const fromPresets = presets.length ? expandPresetIncludes(presets) : []
  const packageIds = uniqueIds([...fromPresets, ...packages])
  return { packageIds, ops: planOpsForPackages({ tools, packageIds, targetRoot }) }
}

export function planOpsForPackages({ tools, packageIds, targetRoot }) {
  const ops = []
  const seen = new Set()

  for (const packageId of packageIds) {
    const manifest = loadManifest(packageId)
    if (manifest.type === 'preset') continue
    for (const tool of tools) {
      const planner = TOOL_PLANNERS[tool]
      if (!planner) continue
      for (const op of planner(packageId, manifest, targetRoot)) {
        const key = `${op.to}::${op.from}`
        if (seen.has(key)) continue
        seen.add(key)
        ops.push({
          ...op,
          tool,
          exists: fs.existsSync(op.to),
        })
      }
    }
  }

  return ops
}

export function planRemove({ tools, packageIds, targetRoot }) {
  const ops = planOpsForPackages({ tools, packageIds, targetRoot })
  return ops
    .filter((op) => fs.existsSync(op.to))
    .map((op) => ({
      ...op,
      action: 'remove',
    }))
}

export function applyInstall(ops, { dryRun = false } = {}) {
  const written = []
  const skipped = []

  for (const op of ops) {
    if (op.skip) {
      skipped.push(op)
      continue
    }
    if (dryRun) {
      written.push(op)
      continue
    }
    fs.mkdirSync(path.dirname(op.to), { recursive: true })
    fs.copyFileSync(op.from, op.to)
    fs.chmodSync(op.to, fs.statSync(op.from).mode)
    written.push(op)
  }

  return { written, skipped }
}

export function applyRemove(ops, { dryRun = false, targetRoot } = {}) {
  const removed = []
  const skipped = []

  for (const op of ops) {
    if (op.skip) {
      skipped.push(op)
      continue
    }
    if (dryRun) {
      removed.push(op)
      continue
    }
    if (!fs.existsSync(op.to)) {
      skipped.push(op)
      continue
    }
    fs.unlinkSync(op.to)
    if (targetRoot) pruneEmptyParents(op.to, targetRoot)
    removed.push(op)
  }

  return { removed, skipped }
}

export function writeInstallManifest(targetRoot, meta, { dryRun = false } = {}) {
  const dest = manifestPath(targetRoot)
  if (dryRun) return dest
  fs.writeFileSync(dest, `${JSON.stringify(meta, null, 2)}\n`, 'utf8')
  return dest
}

/**
 * Merge install metadata. Preserves unknown keys.
 */
export function mergeInstallManifest(targetRoot, patch, { dryRun = false } = {}) {
  const prev = readInstallManifest(targetRoot) || {}
  const next = {
    ...prev,
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  return writeInstallManifest(targetRoot, next, { dryRun })
}

/**
 * Classify planned ops for adopt / skip-existing installs.
 * - missing → write (managed)
 * - exists + same as kit → manage, no write
 * - exists + different → override (keep local), no write
 */
export function classifyOpsForAdopt(ops, targetRoot) {
  const managed = []
  const overrides = []
  const toWrite = []

  for (const op of ops) {
    const rel = path.relative(targetRoot, op.to)
    if (!op.exists) {
      toWrite.push(op)
      managed.push(buildFileRecord(op, targetRoot, { fromSource: true }))
      continue
    }

    if (filesEqual(op.from, op.to)) {
      managed.push(buildFileRecord(op, targetRoot, { fromSource: true }))
      op.skip = true
      continue
    }

    // Context starters already only plan when missing; treat other diffs as overrides.
    overrides.push({
      packageId: op.packageId,
      path: rel,
      reason: 'local-copy-kept',
    })
    op.skip = true
  }

  return { managed, overrides, toWrite }
}

export function buildFileRecord(op, targetRoot, { fromSource = false } = {}) {
  const filePath = fromSource || !fs.existsSync(op.to) ? op.from : op.to
  return {
    packageId: op.packageId,
    path: path.relative(targetRoot, op.to),
    sha256: sha256File(filePath),
  }
}

export function overridePathSet(overrides = []) {
  return new Set(overrides.map((o) => o.path))
}

function pruneEmptyParents(filePath, stopAt) {
  let dir = path.dirname(filePath)
  const root = path.resolve(stopAt)
  while (dir.startsWith(root) && dir !== root) {
    if (!fs.existsSync(dir)) break
    const entries = fs.readdirSync(dir)
    if (entries.length) break
    fs.rmdirSync(dir)
    dir = path.dirname(dir)
  }
}

function uniqueIds(ids) {
  return [...new Set(ids)]
}
