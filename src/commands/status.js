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
  if (manifest.installedAt) console.log(`Installed: ${manifest.installedAt}`)
  if (manifest.updatedAt) console.log(`Updated:   ${manifest.updatedAt}`)
  console.log('\nFor a full health check: npx alfred-agent-devkit doctor')
}
