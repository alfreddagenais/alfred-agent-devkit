import { Command } from 'commander'
import { createRequire } from 'node:module'
import { initCommand } from './commands/init.js'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')

export async function run(argv) {
  const program = new Command()

  program
    .name('alfred-agent-devkit')
    .description('Install AI agents, skills, and commands via presets + adapters')
    .version(pkg.version)

  program
    .command('init')
    .description('Interactively install presets into .cursor/ / .claude/ / …')
    .option('-y, --yes', 'Accept defaults (Cursor + Core + Code Review)', false)
    .option('--cwd <path>', 'Target project directory', process.cwd())
    .option('--dry-run', 'Show planned writes without writing files', false)
    .action(async (options) => {
      await initCommand(options)
    })

  program
    .command('list')
    .description('List available presets and packages')
    .action(async () => {
      const { listCatalog } = await import('./lib/catalog.js')
      listCatalog()
    })

  await program.parseAsync(argv)
}
