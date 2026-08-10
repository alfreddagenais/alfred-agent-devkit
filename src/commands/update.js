import path from 'node:path'
import { createRequire } from 'node:module'
import { loadManifest } from '../lib/catalog.js'
import {
  applyInstall,
  buildFileRecord,
  overridePathSet,
  planOpsForPackages,
  readInstallManifest,
  writeInstallManifest,
} from '../lib/install.js'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

/**
 * Refresh managed kit files from the current CLI catalog.
 * Never touches custom project files or paths listed in manifest.overrides.
 */
export async function updateCommand(options) {
  const targetRoot = path.resolve(options.cwd)
  const previous = readInstallManifest(targetRoot)

  if (!previous) {
    console.log(`No install found in ${targetRoot}`)
    console.log('Run: npx alfred-agent-devkit init')
    process.exitCode = 1
    return
  }

  const tools = Array.isArray(previous.tools) ? previous.tools : []
  const packages = Array.isArray(previous.packages) ? previous.packages : []

  if (!tools.length || !packages.length) {
    console.log('Manifest is missing tools or packages. Re-run init.')
    process.exitCode = 1
    return
  }

  const knownPackages = packages.filter((id) => {
    try {
      loadManifest(id)
      return true
    } catch {
      console.log(`  ! Skipping unknown package: ${id}`)
      return false
    }
  })

  const overrides = Array.isArray(previous.overrides) ? previous.overrides : []
  const overridePaths = overridePathSet(overrides)
  const ops = planOpsForPackages({ tools, packageIds: knownPackages, targetRoot })

  const managed = []
  const skippedOverrides = []
  const skippedStarters = []

  for (const op of ops) {
    const rel = path.relative(targetRoot, op.to)
    // Context starters are only written when missing (adapter already filters,
    // but keep a soft skip if something reappears as exists).
    if (op.note && /only written when missing/i.test(op.note) && op.exists) {
      op.skip = true
      skippedStarters.push(op)
      continue
    }
    if (overridePaths.has(rel)) {
      op.skip = true
      skippedOverrides.push(op)
      continue
    }
    managed.push(op)
  }

  console.log(`\nUpdating managed kit files in ${targetRoot}`)
  console.log(`  CLI:       ${pkg.version}`)
  console.log(`  Packages:  ${knownPackages.length}`)
  console.log(`  Managed:   ${managed.length}`)
  console.log(`  Overrides: ${skippedOverrides.length} (kept local)`)
  if (skippedStarters.length) {
    console.log(`  Starters:  ${skippedStarters.length} skipped (already present)`)
  }

  for (const op of managed) {
    const rel = path.relative(targetRoot, op.to)
    console.log(`  → ${rel} [${op.exists ? 'refresh' : 'new'}]`)
  }
  for (const op of skippedOverrides) {
    console.log(`  · ${path.relative(targetRoot, op.to)} [override]`)
  }

  if (options.dryRun) {
    console.log('\nDry run: no files written.')
    return
  }

  const { written, skipped } = applyInstall(ops)
  const files = managed.map((op) => buildFileRecord(op, targetRoot))

  writeInstallManifest(targetRoot, {
    ...previous,
    version: pkg.version,
    updatedAt: new Date().toISOString(),
    tools,
    presets: previous.presets || [],
    packages: knownPackages,
    files,
    overrides,
  })

  console.log(
    `\nUpdated ${written.length} file(s)${skipped.length ? `, skipped ${skipped.length}` : ''}.`,
  )
  console.log('Manifest refreshed: .alfred-agent-devkit.json')
  if (overrides.length) {
    console.log(
      `\n${overrides.length} local override(s) were left alone. Clear an override in the manifest (or delete the overrides entry) when you want that path managed again.`,
    )
  }
}
