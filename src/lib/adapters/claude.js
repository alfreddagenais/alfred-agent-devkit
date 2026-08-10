import fs from 'node:fs'
import path from 'node:path'
import { packagesDir } from '../paths.js'

/**
 * Lightweight Claude Code mapping (v0.1).
 * Skills → .claude/skills/<id>/SKILL.md
 * Agents/commands → .claude/agents or commands when content exists
 */
export function planClaudeWrites(packageId, manifest, targetRoot) {
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
      pushIfExists('SKILL.md', path.join('.claude', 'skills', packageId, 'SKILL.md'))
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
