import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { importSheet, exportSheet, ImportTypes, ExportTypes } from 'jsr:@psych/sheet@1.0.8'

type Data = {
  content: string
  school: string
  author?: string
  teacher: string
}

if (!import.meta.dirname) {
  throw new Error('import.meta.dirname is not available')
}

const path = resolve(import.meta.dirname, 'original.xlsx')
const buffer = await readFile(path)
const data = await importSheet<Data>(buffer.buffer as ArrayBuffer, ImportTypes.XLSX)
const output = exportSheet(data.map((d) => {
  const content = d.content.trim()
  const author = [d.author, d.school, d.teacher].filter(Boolean).join(' ')
  return { content, author }
}), ExportTypes.JSON)
await writeFile(resolve(import.meta.dirname, 'original.json'), output)
