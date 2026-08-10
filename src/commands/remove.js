import path from 'node:path'
import { checkbox, confirm } from '@inquirer/prompts'
import { expandPresetIncludes, loadManifest, listPackageIds } from '../lib/catalog.js'
import {
  applyRemove,
  mergeInstallManifest,
  planRemove,
  readInstallManifest,
} from '../lib/install.js'

export async function removeCommand(packageArgs, options) {
  const targetRoot = path.resolve(options.cwd)
  const manifest = readInstallManifest(targetRoot)

  if (!manifest) {
    console.error(`No .alfred-agent-devkit.json in ${targetRoot}. Nothing to remove.`)
    process.exitCode = 1
    return
  }

  const tools = Array.isArray(manifest.tools) && manifest.tools.length ? manifest.tools : ['cursor']
  const installed = Array.isArray(manifest.packages) ? [...manifest.packages] : []
  const installedPresets = Array.isArray(manifest.presets) ? [...manifest.presets] : []

  if (!installed.length && !installedPresets.length) {
    console.error('Manifest lists no packages or presets.')
    process.exitCode = 1
    return
  }

  let selected = packageArgs.filter(Boolean)

  if (!selected.length) {
    if (options.yes) {
      console.error('Pass package ids when using --yes, or run interactively.')
      process.exitCode = 1
      return
    }

    const choices = buildChoices(installedPresets, installed)
    selected = await checkbox({
      message: 'Remove which presets / packages?',
      choices,
      required: true,
      validate: (value) => (value.length ? true : 'Select at least one'),
    })
  }

  const { packageIds, presetsRemoved } = resolveRemovalTargets(selected, installed)

  if (!packageIds.length) {
    console.error('Nothing resolvable to remove (ids not in this install).')
    process.exitCode = 1
    return
  }

  const ops = planRemove({ tools, packageIds, targetRoot })
  console.log(`\nPlanning removal of ${ops.length} file(s) from ${packageIds.length} package(s)…`)
  for (const op of ops) {
    console.log(`  ✗ ${path.relative(targetRoot, op.to)}`)
  }
  if (!ops.length) {
    console.log('  (no matching files on disk; manifest will still be updated)')
  }

  if (options.dryRun) {
    console.log('\nDry run: no files removed.')
    return
  }

  if (!options.yes) {
    const ok = await confirm({
      message: `Remove ${packageIds.length} package(s) from ${targetRoot}?`,
      default: false,
    })
    if (!ok) {
      console.log('Cancelled.')
      return
    }
  }

  const { removed } = applyRemove(ops, { targetRoot })
  const nextPackages = installed.filter((id) => !packageIds.includes(id))
  const nextPresets = installedPresets.filter((id) => !presetsRemoved.includes(id))

  mergeInstallManifest(targetRoot, {
    packages: nextPackages,
    presets: nextPresets,
  })

  console.log(`\nRemoved ${removed.length} file(s).`)
  console.log(`Packages left: ${nextPackages.length}`)
  console.log('Tip: run `npx alfred-agent-devkit doctor` to verify.')
}

function buildChoices(installedPresets, installed) {
  const choices = [
    ...installedPresets.map((id) => ({
      name: `${id} [preset]`,
      value: id,
    })),
    ...installed.map((id) => {
      let type = 'package'
      try {
        type = loadManifest(id).type
      } catch {
        /* keep */
      }
      return { name: `${id} [${type}]`, value: id }
    }),
  ]
  const seen = new Set()
  return choices.filter((c) => {
    if (seen.has(c.value)) return false
    seen.add(c.value)
    return true
  })
}

function resolveRemovalTargets(selected, installed) {
  const packageIds = new Set()
  const presetsRemoved = []
  const catalog = new Set(listPackageIds())

  for (const id of selected) {
    if (!catalog.has(id) && !installed.includes(id)) {
      console.warn(`Unknown id (skipping): ${id}`)
      continue
    }

    let type = null
    try {
      type = loadManifest(id).type
    } catch {
      if (installed.includes(id)) packageIds.add(id)
      continue
    }

    if (type === 'preset') {
      presetsRemoved.push(id)
      for (const child of expandPresetIncludes([id])) {
        if (installed.includes(child)) packageIds.add(child)
      }
    } else if (installed.includes(id)) {
      packageIds.add(id)
    } else {
      console.warn(`Not installed (skipping): ${id}`)
    }
  }

  return { packageIds: [...packageIds], presetsRemoved }
}
