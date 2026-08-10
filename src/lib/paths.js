import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Root of the alfred-agent-devkit package (repo or npm install). */
export const packageRoot = path.resolve(__dirname, '../..')

export const packagesDir = path.join(packageRoot, 'packages')
