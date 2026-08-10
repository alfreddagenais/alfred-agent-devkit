import { Command } from 'commander'
import { createRequire } from 'node:module'
import { initCommand } from './commands/init.js'
import { doctorCommand } from './commands/doctor.js'
import { statusCommand } from './commands/status.js'
import { removeCommand } from './commands/remove.js'
import { updateCommand } from './commands/update.js'

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
    .option('--advanced', 'Pick packages individually and control overwrites', false)
    .option(
      '--presets <ids>',
      'Comma-separated preset ids (use with --yes). Example: preset-core,preset-ui',
    )
    .option(
      '--skip-existing',
      'Adopt mode: never overwrite; divergent locals become overrides',
      false,
    )
    .option('--cwd <path>', 'Target project directory', process.cwd())
    .option('--dry-run', 'Show planned writes without writing files', false)
    .action(async (options) => {
      await initCommand(options)
    })

  program
    .command('update')
    .description('Refresh managed kit files from the current CLI (keeps overrides + custom files)')
    .option('--cwd <path>', 'Target project directory', process.cwd())
    .option('--dry-run', 'Show planned refreshes without writing', false)
    .action(async (options) => {
      await updateCommand(options)
    })

  program
    .command('list')
    .description('List available presets and packages')
    .action(async () => {
      const { listCatalog } = await import('./lib/catalog.js')
      listCatalog()
    })

  program
    .command('status')
    .description('Show what this kit installed in a project')
    .option('--cwd <path>', 'Target project directory', process.cwd())
    .action(async (options) => {
      await statusCommand(options)
    })

  program
    .command('doctor')
    .description('Check install health, missing files, and context stubs')
    .option('--cwd <path>', 'Target project directory', process.cwd())
    .action(async (options) => {
      await doctorCommand(options)
    })

  program
    .command('remove')
    .description('Remove installed presets or packages (asks before deleting)')
    .argument('[packages...]', 'Preset or package ids to remove')
    .option('-y, --yes', 'Skip confirmation', false)
    .option('--cwd <path>', 'Target project directory', process.cwd())
    .option('--dry-run', 'Show planned removals without deleting', false)
    .action(async (packages, options) => {
      await removeCommand(packages, options)
    })

  await program.parseAsync(argv)
}
