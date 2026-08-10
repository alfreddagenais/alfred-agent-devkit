import path from 'node:path'
import { checkbox, confirm } from '@inquirer/prompts'
import { listPresets } from '../lib/catalog.js'
import { applyInstall, planInstall, writeInstallManifest } from '../lib/install.js'

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

export async function initCommand(options) {
  const targetRoot = path.resolve(options.cwd)
  const presets = listPresets()

  let tools
  let selectedPresets

  if (options.yes) {
    tools = ['cursor']
    selectedPresets = ['preset-core', 'preset-code-review']
  } else {
    tools = await checkbox({
      message: 'Which tools do you use?',
      choices: TOOL_CHOICES,
      required: true,
      validate: (value) => (value.length ? true : 'Select at least one tool'),
    })

    selectedPresets = await checkbox({
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
      return
    }
  }

  // Always ensure core baseline if user forgot it but selected others
  if (!selectedPresets.includes('preset-core')) {
    selectedPresets = ['preset-core', ...selectedPresets]
  }

  const { packageIds, ops } = planInstall({
    tools,
    presets: selectedPresets,
    targetRoot,
  })

  console.log(`\nPlanning ${ops.length} file(s) from ${packageIds.length} package(s)…`)
  for (const op of ops) {
    const rel = path.relative(targetRoot, op.to)
    console.log(`  → ${rel}${op.note ? ` (${op.note})` : ''}`)
  }

  if (options.dryRun) {
    console.log('\nDry run: no files written.')
    return
  }

  const { written } = applyInstall(ops)
  const manifestPath = writeInstallManifest(targetRoot, {
    version: '0.1.0',
    installedAt: new Date().toISOString(),
    tools,
    presets: selectedPresets,
    packages: packageIds,
  })

  console.log(`\nInstalled ${written.length} file(s).`)
  console.log(`Manifest: ${path.relative(targetRoot, manifestPath)}`)
  console.log(`
Next steps:
  1. Fill in CLAUDE.md / .cursor/PROJECT_CONTEXT.md with your product facts
  2. Open the project in Cursor (or Claude Code) and try /qa-independent-review
`)
}

function trimDesc(text) {
  if (!text) return ''
  const one = String(text).replace(/\s+/g, ' ').trim()
  return one.length > 72 ? `${one.slice(0, 69)}…` : one
}
