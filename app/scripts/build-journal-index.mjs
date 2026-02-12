import fs from 'node:fs'
import path from 'node:path'
// Minimal frontmatter parser (keeps this repo dependency-free)
function parseFrontmatter(markdown) {
  const m = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/)
  if (!m) return { data: {}, body: markdown }
  const raw = m[1]
  const data = {}
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const idx = t.indexOf(':')
    if (idx === -1) continue
    const key = t.slice(0, idx).trim()
    let val = t.slice(idx + 1).trim()
    // very small YAML-ish handling
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim()
      const arr = inner
        ? inner.split(',').map((s) => s.trim()).map((s) => s.replace(/^['"]|['"]$/g, ''))
        : []
      data[key] = arr
    } else {
      data[key] = val
    }
  }
  const body = markdown.replace(m[0], '')
  return { data, body }
}

const appRoot = process.cwd()
const journalDir = path.join(appRoot, 'public', 'journal')
const outFile = path.join(journalDir, 'index.json')

if (!fs.existsSync(journalDir)) {
  console.log('[journal] no public/journal directory; skipping index generation')
  process.exit(0)
}

const files = fs
  .readdirSync(journalDir)
  .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))

const entries = files
  .map((file) => {
    const full = path.join(journalDir, file)
    const raw = fs.readFileSync(full, 'utf8')
    const parsed = parseFrontmatter(raw)

    const slug = file.replace(/\.(md|mdx)$/i, '')
    const title = parsed.data?.title ?? slug
    const date = parsed.data?.date ?? ''
    const tags = parsed.data?.tags ?? []

    return {
      slug,
      title,
      date,
      tags,
      file: `/journal/${file}`,
    }
  })
  // newest first if date is ISO-like; otherwise lexical
  .sort((a, b) => String(b.date).localeCompare(String(a.date)))

fs.writeFileSync(outFile, JSON.stringify({ items: entries }, null, 2) + '\n')
console.log(`[journal] wrote ${outFile} (${entries.length} entries)`) 
