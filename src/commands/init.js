import path from 'node:path'
import { checkbox, confirm, select } from '@inquirer/prompts'
import { createRequire } from 'node:module'
import { expandPresetIncludes, listPackages, listPresets } from '../lib/catalog.js'
import {
  applyInstall,
  planInstall,
  readInstallManifest,
  writeInstallManifest,
} from '../lib/install.js'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

const TOOL_CHOICES = [
  { name: 'Cursor', value: 'cursor', checked: true },
  { name: 'Claude Code', value: 'claude', checked: false },
  { name: 'Codex (coming soon)', value: 'codex', disabled: true },
  { name: 'GitHub Copilot (coming soon)', value: 'copilot', disabled: true },
]

const DEFAULT_PRESETS = [
  'preset-core',
  'preset-code-review',
  'preset-architecture',
  'preset-testing',
  'preset-security',
  'preset-ui',
]

const YES_PRESETS = ['preset-core', 'preset-code-review']

export async function initCommand(options) {
  const targetRoot = path.resolve(options.cwd)
  const presets = listPresets()
  const packages = listPackages()

  let tools
  let selectedPresets
  let selectedPackages = []

  if (options.yes) {
    tools = ['cursor']
    selectedPresets = [...YES_PRESETS]
  } else if (options.advanced) {
    ;({ tools, selectedPresets, selectedPackages } = await runAdvancedPrompts({
      targetRoot,
      presets,
      packages,
    }))
    if (!tools) return
  } else {
    ;({ tools, selectedPresets } = await runSimplePrompts({ targetRoot, presets }))
    if (!tools) return
  }

  // Simple mode always keeps the core baseline preset.
  // Advanced mode trusts the explicit package checklist.
  if (!options.advanced && !selectedPresets.includes('preset-core')) {
    selectedPresets = ['preset-core', ...selectedPresets]
  }

  const { packageIds, ops } = planInstall({
    tools,
    presets: options.advanced ? [] : selectedPresets,
    packages: options.advanced ? selectedPackages : [],
    targetRoot,
  })

  annotateOps(ops)

  console.log(`\nPlanning ${ops.length} file(s) from ${packageIds.length} package(s)…`)
  for (const op of ops) {
    const rel = path.relative(targetRoot, op.to)
    const tag = op.exists ? 'overwrite' : 'new'
    console.log(`  → ${rel} [${tag}]${op.note ? ` (${op.note})` : ''}`)
  }

  if (options.dryRun) {
    console.log('\nDry run: no files written.')
    return
  }

  const overwrites = ops.filter((op) => op.exists)
  if (overwrites.length && !options.yes) {
    const mode = options.advanced
      ? await select({
          message: `${overwrites.length} file(s) already exist. How should overwrites work?`,
          choices: [
            { name: 'Overwrite all existing kit files', value: 'all' },
            { name: 'Ask for each file', value: 'ask' },
            { name: 'Skip existing files (write new only)', value: 'skip' },
          ],
        })
      : 'all'

    if (mode === 'skip') {
      for (const op of overwrites) op.skip = true
    } else if (mode === 'ask') {
      for (const op of overwrites) {
        const ok = await confirm({
          message: `Overwrite ${path.relative(targetRoot, op.to)}?`,
          default: true,
        })
        if (!ok) op.skip = true
      }
    }
  }

  const activeOps = ops.filter((op) => !op.skip)
  if (!activeOps.length) {
    console.log('\nNothing to write.')
    return
  }

  const { written, skipped } = applyInstall(ops)
  const previous = readInstallManifest(targetRoot)
  const mergedPackages = uniqueIds([...(previous?.packages || []), ...packageIds])
  const mergedPresets = uniqueIds([...(previous?.presets || []), ...selectedPresets])

  const manifestPath = writeInstallManifest(targetRoot, {
    version: pkg.version,
    installedAt: previous?.installedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tools: uniqueIds([...(previous?.tools || []), ...tools]),
    presets: mergedPresets,
    packages: mergedPackages,
  })

  console.log(`\nInstalled ${written.length} file(s)${skipped.length ? `, skipped ${skipped.length}` : ''}.`)
  console.log(`Manifest: ${path.relative(targetRoot, manifestPath)}`)
  console.log(`
Next steps:
  1. Fill CLAUDE.md, .cursor/PROJECT_CONTEXT.md, and .cursor/DESIGN_PRINCIPLES.md
  2. In Cursor, run /devkit-setup-review to fit skills/commands to this project
  3. Optional: npx alfred-agent-devkit doctor
`)
}

async function runSimplePrompts({ targetRoot, presets }) {
  const tools = await checkbox({
    message: 'Which tools do you use?',
    choices: TOOL_CHOICES,
    required: true,
    validate: (value) => (value.length ? true : 'Select at least one tool'),
  })

  const selectedPresets = await checkbox({
    message: 'Install which presets?',
    choices: presets.map((p) => ({
      name: `${p.name}: ${trimDesc(p.description)}`,
      value: p.id,
      checked: DEFAULT_PRESETS.includes(p.id),
    })),
    required: true,
    validate: (value) => (value.length ? true : 'Select at least one preset'),
  })

  const ok = await confirm({
    message: `Install into ${targetRoot}?`,
    default: true,
  })
  if (!ok) {
    console.log('Cancelled.')
    return {}
  }

  return { tools, selectedPresets }
}

async function runAdvancedPrompts({ targetRoot, presets, packages }) {
  console.log('\nAdvanced mode: pick tools, presets, then fine-tune packages.\n')

  const tools = await checkbox({
    message: 'Which tools do you use?',
    choices: TOOL_CHOICES,
    required: true,
    validate: (value) => (value.length ? true : 'Select at least one tool'),
  })

  const selectedPresets = await checkbox({
    message: 'Start from which presets? (you can trim packages next)',
    choices: presets.map((p) => ({
      name: `${p.name}: ${trimDesc(p.description)}`,
      value: p.id,
      checked: YES_PRESETS.includes(p.id),
    })),
  })

  const fromPresets = selectedPresets.length ? expandPresetIncludes(selectedPresets) : []
  const selectedPackages = await checkbox({
    message: 'Confirm packages to install:',
    choices: packages.map((p) => ({
      name: `${p.id} [${p.type}] ${trimDesc(p.description)}`,
      value: p.id,
      checked: fromPresets.includes(p.id) || p.id === 'devkit-setup-review',
    })),
    required: true,
    validate: (value) => (value.length ? true : 'Select at least one package'),
  })

  const ok = await confirm({
    message: `Install into ${targetRoot}?`,
    default: true,
  })
  if (!ok) {
    console.log('Cancelled.')
    return {}
  }

  // Packages already chosen explicitly; keep presets for manifest only
  return { tools, selectedPresets, selectedPackages }
}

function annotateOps(ops) {
  for (const op of ops) {
    // exists already set in planOpsForPackages; refresh for safety
    op.exists = op.exists === true
  }
}

function uniqueIds(ids) {
  return [...new Set(ids)]
}

function trimDesc(text) {
  if (!text) return ''
  const one = String(text).replace(/\s+/g, ' ').trim()
  return one.length > 72 ? `${one.slice(0, 69)}…` : one
}
