import fs from 'node:fs'
import path from 'node:path'
import { packagesDir } from '../paths.js'

/**
 * Map a package into Cursor destinations under targetRoot.
 * Returns planned write operations: { from, to, kind }
 */
export function planCursorWrites(packageId, manifest, targetRoot) {
  const contentDir = path.join(packagesDir, packageId, 'content')
  const ops = []

  const pushIfExists = (relSource, dest) => {
    const from = path.join(contentDir, relSource)
    if (fs.existsSync(from)) {
      ops.push({ from, to: path.join(targetRoot, dest), kind: 'file', packageId })
    }
  }

  switch (manifest.type) {
    case 'skill':
      pushIfExists('SKILL.md', path.join('.cursor', 'skills', packageId, 'SKILL.md'))
      pushIfExists('reference.md', path.join('.cursor', 'skills', packageId, 'reference.md'))
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
      pushIfExists(
        'reference.md',
        path.join('.cursor', 'docs', `${packageId}.md`),
      )
      // CLAUDE.md starter only when missing: handled specially
      {
        const starter = path.join(contentDir, 'CLAUDE.md.starter')
        const claudeMd = path.join(targetRoot, 'CLAUDE.md')
        if (fs.existsSync(starter) && !fs.existsSync(claudeMd)) {
          ops.push({
            from: starter,
            to: claudeMd,
            kind: 'file',
            packageId,
            note: 'CLAUDE.md starter (only written when missing)',
          })
        }
      }
      break
    default:
      break
  }

  return ops
}
