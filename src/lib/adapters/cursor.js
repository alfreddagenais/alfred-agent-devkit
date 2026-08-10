import fs from 'node:fs'
import path from 'node:path'
import { packagesDir } from '../paths.js'

/**
 * Map a package into Cursor destinations under targetRoot.
 * Returns planned write operations: { from, to, kind, packageId }
 */
export function planCursorWrites(packageId, manifest, targetRoot) {
  const contentDir = path.join(packagesDir, packageId, 'content')
  const ops = []

  const pushIfExists = (relSource, dest, note) => {
    const from = path.join(contentDir, relSource)
    if (fs.existsSync(from)) {
      const op = { from, to: path.join(targetRoot, dest), kind: 'file', packageId }
      if (note) op.note = note
      ops.push(op)
    }
  }

  const pushStarterIfMissing = (relSource, dest, note) => {
    const from = path.join(contentDir, relSource)
    const to = path.join(targetRoot, dest)
    if (fs.existsSync(from) && !fs.existsSync(to)) {
      ops.push({
        from,
        to,
        kind: 'file',
        packageId,
        note: note || `${path.basename(dest)} starter (only written when missing)`,
      })
    }
  }

  switch (manifest.type) {
    case 'skill':
      pushIfExists('SKILL.md', path.join('.cursor', 'skills', packageId, 'SKILL.md'))
      pushIfExists('reference.md', path.join('.cursor', 'skills', packageId, 'reference.md'))
      // Optional companion slash command shipped with the skill
      pushIfExists('command.md', path.join('.cursor', 'commands', `${packageId}.md`))
      break
    case 'agent':
      pushIfExists('agent.md', path.join('.cursor', 'agents', `${packageId}.md`))
      break
    case 'command':
      pushIfExists('command.md', path.join('.cursor', 'commands', `${packageId}.md`))
      break
    case 'rule':
      pushIfExists('rule.md', path.join('.cursor', 'rules', `${packageId}.mdc`))
      break
    case 'template':
      pushIfExists('reference.md', path.join('.cursor', 'docs', `${packageId}.md`))
      pushStarterIfMissing('CLAUDE.md.starter', 'CLAUDE.md', 'CLAUDE.md starter (only written when missing)')
      pushStarterIfMissing(
        'PROJECT_CONTEXT.md.starter',
        path.join('.cursor', 'PROJECT_CONTEXT.md'),
      )
      pushStarterIfMissing(
        'DESIGN_PRINCIPLES.md.starter',
        path.join('.cursor', 'DESIGN_PRINCIPLES.md'),
      )
      break
    default:
      break
  }

  return ops
}
