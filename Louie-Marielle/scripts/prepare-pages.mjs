import { copyFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const docsDir = path.resolve(scriptDir, '../../docs')
const indexPath = path.join(docsDir, 'index.html')
const fallbackPath = path.join(docsDir, '404.html')

await access(indexPath)
await copyFile(indexPath, fallbackPath)
