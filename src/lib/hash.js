import crypto from 'node:crypto'
import fs from 'node:fs'

export function sha256File(filePath) {
  const buf = fs.readFileSync(filePath)
  return crypto.createHash('sha256').update(buf).digest('hex')
}

export function filesEqual(a, b) {
  if (!fs.existsSync(a) || !fs.existsSync(b)) return false
  return sha256File(a) === sha256File(b)
}
