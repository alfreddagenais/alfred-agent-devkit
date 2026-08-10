import fs from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'
import { packagesDir } from './paths.js'

export function loadManifest(packageId) {
  const file = path.join(packagesDir, packageId, 'manifest.yaml')
  if (!fs.existsSync(file)) {
    throw new Error(`Unknown package: ${packageId}`)
  }
  return parseYaml(fs.readFileSync(file, 'utf8'))
}

export function listPackageIds() {
  return fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
}

export function listPresets() {
  return listPackageIds()
    .map((id) => loadManifest(id))
    .filter((m) => m.type === 'preset')
}

export function listPackages() {
  return listPackageIds()
    .map((id) => loadManifest(id))
    .filter((m) => m.type !== 'preset')
}

/** Resolve package ids from preset ids and/or direct package ids. */
export function resolvePackageIds({ presets = [], packages = [] } = {}) {
  const fromPresets = presets.length ? expandPresetIncludes(presets) : []
  return [...new Set([...fromPresets, ...packages])]
}

export function expandPresetIncludes(presetIds) {
  const resolved = new Set()
  const queue = [...presetIds]

  while (queue.length) {
    const id = queue.shift()
    if (resolved.has(id)) continue
    resolved.add(id)
    const manifest = loadManifest(id)
    if (manifest.type === 'preset' && Array.isArray(manifest.includes)) {
      for (const child of manifest.includes) {
        queue.push(child)
      }
    }
  }

  return [...resolved].filter((id) => loadManifest(id).type !== 'preset')
}

export function listCatalog() {
  const presets = listPresets()
  const packages = listPackageIds()
    .map((id) => loadManifest(id))
    .filter((m) => m.type !== 'preset')

  console.log('Presets:')
  for (const p of presets) {
    console.log(`  - ${p.id.padEnd(22)} ${p.name} (${(p.includes || []).join(', ')})`)
  }
  console.log('\nPackages:')
  for (const p of packages) {
    console.log(`  - ${p.id.padEnd(22)} [${p.type}] ${p.name}`)
  }
}
