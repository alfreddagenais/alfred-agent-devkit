import fs from 'node:fs'
import path from 'node:path'

/**
 * Optional host scripts shipped under content/scripts/.
 * Written only when the destination is missing (project-owned after first copy).
 */
export function planScriptStarters(contentDir, targetRoot, packageId) {
  const scriptsDir = path.join(contentDir, 'scripts')
  if (!fs.existsSync(scriptsDir)) return []

  const ops = []
  for (const name of fs.readdirSync(scriptsDir)) {
    if (name.startsWith('.')) continue
    const from = path.join(scriptsDir, name)
    if (!fs.statSync(from).isFile()) continue
    const to = path.join(targetRoot, 'scripts', name)
    if (fs.existsSync(to)) continue
    ops.push({
      from,
      to,
      kind: 'file',
      packageId,
      note: `${name} starter (only written when missing)`,
    })
  }
  return ops
}
