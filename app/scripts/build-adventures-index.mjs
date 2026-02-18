import fs from 'node:fs'
import path from 'node:path'

// Minimal frontmatter parser
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
    // Handle quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    data[key] = val
  }
  const body = markdown.replace(m[0], '')
  return { data, body }
}

const appRoot = process.cwd()
const adventuresDir = path.join(appRoot, 'public', 'adventures')
const outFile = path.join(adventuresDir, 'index.json')

if (!fs.existsSync(adventuresDir)) {
  console.log('[adventures] no public/adventures directory; skipping index generation')
  process.exit(0)
}

const files = fs
  .readdirSync(adventuresDir)
  .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))

const entries = files
  .map((file) => {
    const full = path.join(adventuresDir, file)
    const raw = fs.readFileSync(full, 'utf8')
    const parsed = parseFrontmatter(raw)

    const slug = file.replace(/\.(md|mdx)$/i, '')
    const title = parsed.data?.title ?? slug
    const date = parsed.data?.date ?? ''
    const continent = parsed.data?.continent ?? ''
    const location = parsed.data?.location ?? ''
    const distance = parsed.data?.distance ?? ''
    const elevation_gain = parsed.data?.elevation_gain ?? ''
    const difficulty = parsed.data?.difficulty ?? ''

    return {
      slug,
      title,
      date,
      continent,
      location,
      distance,
      elevation_gain,
      difficulty,
      file: `/adventures/${file}`,
    }
  })
  .sort((a, b) => String(b.date).localeCompare(String(a.date)))

fs.writeFileSync(outFile, JSON.stringify({ items: entries }, null, 2) + '\n')
console.log(`[adventures] wrote ${outFile} (${entries.length} entries)`)
