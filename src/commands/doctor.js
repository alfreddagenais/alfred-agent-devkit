import path from 'node:path'
import { printDoctorReport, runDoctor } from '../lib/doctor.js'

export async function doctorCommand(options) {
  const targetRoot = path.resolve(options.cwd)
  const report = runDoctor(targetRoot)
  const ok = printDoctorReport(report)
  if (!ok) process.exitCode = 1
}
