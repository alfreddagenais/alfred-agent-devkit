import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { loadManifest } from './catalog.js'
import { planOpsForPackages, readInstallManifest } from './install.js'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

const CONTEXT_FILES = [
  { rel: 'CLAUDE.md', label: 'CLAUDE.md', requiredHint: true },
  { rel: path.join('.cursor', 'PROJECT_CONTEXT.md'), label: '.cursor/PROJECT_CONTEXT.md', requiredHint: true },
  { rel: path.join('.cursor', 'DESIGN_PRINCIPLES.md'), label: '.cursor/DESIGN_PRINCIPLES.md', requiredHint: false },
]

/**
 * Collect diagnostic findings for a target project.
 * @returns {{ ok: boolean, findings: Array<{ level: 'ok'|'warn'|'error'|'info', message: string }> }}
 */
export function runDoctor(targetRoot) {
  const findings = []

  const major = Number.parseInt(process.versions.node.split('.')[0], 10)
  const engineMatch = String(pkg.engines?.node || '>=24').match(/\d+/)
  const minMajor = engineMatch ? Number.parseInt(engineMatch[0], 10) : 24
  if (Number.isFinite(major) && major < minMajor) {
    findings.push({
      level: 'error',
      message: `Node ${process.versions.node} is below required >=${minMajor}. Upgrade Node, then retry.`,
    })
  } else {
    findings.push({ level: 'ok', message: `Node ${process.versions.node}` })
  }

  findings.push({ level: 'info', message: `CLI version ${pkg.version}` })
  findings.push({ level: 'info', message: `Target ${targetRoot}` })

  const manifest = readInstallManifest(targetRoot)
  if (!manifest) {
    findings.push({
      level: 'warn',
      message: `No .alfred-agent-devkit.json found. Run: npx alfred-agent-devkit init`,
    })
    addContextFindings(targetRoot, findings)
    return summarize(findings)
  }

  const tools = Array.isArray(manifest.tools) ? manifest.tools : []
  const packages = Array.isArray(manifest.packages) ? manifest.packages : []
  const presets = Array.isArray(manifest.presets) ? manifest.presets : []

  const overrides = Array.isArray(manifest.overrides) ? manifest.overrides : []
  const files = Array.isArray(manifest.files) ? manifest.files : []

  findings.push({
    level: 'ok',
    message: `Manifest present (tools: ${tools.join(', ') || 'none'}; presets: ${presets.length}; packages: ${packages.length}; managed: ${files.length}; overrides: ${overrides.length})`,
  })

  if (overrides.length) {
    findings.push({
      level: 'info',
      message: `${overrides.length} local override(s) are skipped by update. Clear entries in .alfred-agent-devkit.json when ready to manage those paths.`,
    })
  }

  if (!tools.length) {
    findings.push({ level: 'warn', message: 'Manifest has no tools listed.' })
  }
  if (!packages.length) {
    findings.push({ level: 'warn', message: 'Manifest has no packages listed.' })
  }

  for (const packageId of packages) {
    try {
      loadManifest(packageId)
    } catch {
      findings.push({
        level: 'warn',
        message: `Package "${packageId}" is in the manifest but not in this CLI catalog (removed or renamed upstream).`,
      })
    }
  }

  const knownPackages = packages.filter((id) => {
    try {
      loadManifest(id)
      return true
    } catch {
      return false
    }
  })

  if (knownPackages.length && tools.length) {
    const ops = planOpsForPackages({ tools, packageIds: knownPackages, targetRoot })
    let missing = 0
    for (const op of ops) {
      if (!fs.existsSync(op.to)) {
        missing += 1
        findings.push({
          level: 'error',
          message: `Missing installed file: ${path.relative(targetRoot, op.to)} (${op.packageId})`,
        })
      }
    }
    if (!missing) {
      findings.push({
        level: 'ok',
        message: `All ${ops.length} expected install path(s) are present`,
      })
    }
  }

  addContextFindings(targetRoot, findings)

  if (tools.includes('cursor') && !fs.existsSync(path.join(targetRoot, '.cursor'))) {
    findings.push({ level: 'warn', message: 'Manifest lists cursor but .cursor/ is missing.' })
  }
  if (tools.includes('claude') && !fs.existsSync(path.join(targetRoot, '.claude'))) {
    findings.push({ level: 'warn', message: 'Manifest lists claude but .claude/ is missing.' })
  }

  findings.push({
    level: 'info',
    message: 'After fixing context gaps, run /devkit-setup-review in Cursor to fit the kit to this project.',
  })

  return summarize(findings)
}

function addContextFindings(targetRoot, findings) {
  for (const file of CONTEXT_FILES) {
    const abs = path.join(targetRoot, file.rel)
    if (!fs.existsSync(abs)) {
      findings.push({
        level: file.requiredHint ? 'warn' : 'info',
        message: `Context missing: ${file.label}`,
      })
      continue
    }
    const text = fs.readFileSync(abs, 'utf8')
    const stubby = isMostlyStub(text)
    if (stubby) {
      findings.push({
        level: 'warn',
        message: `Context looks unfinished: ${file.label} (still has placeholders or is nearly empty)`,
      })
    } else {
      findings.push({ level: 'ok', message: `Context present: ${file.label}` })
    }
  }
}

function isMostlyStub(text) {
  const trimmed = text.trim()
  if (trimmed.length < 80) return true
  const placeholderHits = (trimmed.match(/<!--|TODO|TBD|\bFill in\b|\bone paragraph\b/gi) || []).length
  return placeholderHits >= 2
}

function summarize(findings) {
  const ok = !findings.some((f) => f.level === 'error')
  return { ok, findings }
}

export function printDoctorReport({ ok, findings }) {
  const icon = {
    ok: '✓',
    warn: '!',
    error: '✗',
    info: '·',
  }
  console.log('\nDoctor report\n')
  for (const f of findings) {
    console.log(`  ${icon[f.level] || '·'} [${f.level}] ${f.message}`)
  }
  console.log(ok ? '\nResult: OK (no blocking errors)\n' : '\nResult: issues found\n')
  return ok
}
