import path from 'node:path'
import { readInstallManifest } from '../lib/install.js'

export async function statusCommand(options) {
  const targetRoot = path.resolve(options.cwd)
  const manifest = readInstallManifest(targetRoot)

  if (!manifest) {
    console.log(`No install found in ${targetRoot}`)
    console.log('Run: npx alfred-agent-devkit init')
    process.exitCode = 1
    return
  }

  console.log(`Target:   ${targetRoot}`)
  console.log(`Version:  ${manifest.version || 'unknown'}`)
  console.log(`Tools:    ${(manifest.tools || []).join(', ') || '(none)'}`)
  console.log(`Presets:  ${(manifest.presets || []).join(', ') || '(none)'}`)
  console.log(`Packages: ${(manifest.packages || []).length}`)
  for (const id of manifest.packages || []) {
    console.log(`  - ${id}`)
  }
  const files = Array.isArray(manifest.files) ? manifest.files : []
  const overrides = Array.isArray(manifest.overrides) ? manifest.overrides : []
  console.log(`Managed:  ${files.length} file(s)`)
  console.log(`Overrides:${overrides.length} local path(s) (skipped by update)`)
  for (const o of overrides) {
    console.log(`  - ${o.path}${o.packageId ? ` (${o.packageId})` : ''}`)
  }
  if (manifest.installedAt) console.log(`Installed: ${manifest.installedAt}`)
  if (manifest.updatedAt) console.log(`Updated:   ${manifest.updatedAt}`)
  console.log('\nRefresh managed files: npx alfred-agent-devkit update')
  console.log('Full health check:     npx alfred-agent-devkit doctor')
}
