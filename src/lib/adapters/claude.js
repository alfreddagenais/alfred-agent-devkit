import fs from 'node:fs'
import path from 'node:path'
import { packagesDir } from '../paths.js'

/**
 * Lightweight Claude Code mapping (v0.1).
 * Skills → .claude/skills/<id>/SKILL.md (+ optional command)
 * Agents/commands → .claude/agents or commands when content exists
 */
export function planClaudeWrites(packageId, manifest, targetRoot) {
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
      pushIfExists('SKILL.md', path.join('.claude', 'skills', packageId, 'SKILL.md'))
      pushIfExists('reference.md', path.join('.claude', 'skills', packageId, 'reference.md'))
      pushIfExists('command.md', path.join('.claude', 'commands', `${packageId}.md`))
      break
    case 'agent':
      pushIfExists('agent.md', path.join('.claude', 'agents', `${packageId}.md`))
      break
    case 'command':
      pushIfExists('command.md', path.join('.claude', 'commands', `${packageId}.md`))
      break
    case 'rule':
      // Claude has no .mdc rules; skip for now (Cursor remains primary)
      break
    case 'template':
      pushStarterIfMissing('CLAUDE.md.starter', 'CLAUDE.md', 'CLAUDE.md starter (only written when missing)')
      break
    default:
      break
  }

  return ops
}
