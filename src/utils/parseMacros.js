/**
 * Parse a single CSV line, handling quoted fields (including quoted commas and newlines).
 */
function parseCSVLine(line) {
  const fields = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields.map(f => f.trim())
}

/**
 * Parse macro list from either:
 * - JSON array: [{"name": "...", "body": "..."}]
 * - CSV: header row with name/body columns, then data rows
 * - Pipe-separated: Name ||| body (one per line)
 * - Tab-separated fallback: Name\tbody (one per line)
 */
export function parseMacros(text) {
  const trimmed = text.trim()

  // Try JSON array first
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed
          .filter(m => m.name && m.body)
          .map(m => ({ name: String(m.name).trim(), body: String(m.body).trim() }))
      }
    } catch {
      // Fall through to text parsing
    }
  }

  // Try CSV (detect by comma-separated header with name/body columns)
  const firstLine = trimmed.split('\n')[0]
  if (firstLine.includes(',')) {
    const lines = trimmed.split('\n').filter(l => l.trim())
    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z]/g, ''))
    const nameIdx = headers.findIndex(h => h === 'name' || h === 'macroname' || h === 'title')
    const bodyIdx = headers.findIndex(h => h === 'body' || h === 'content' || h === 'text' || h === 'macrobody')

    if (nameIdx !== -1 && bodyIdx !== -1) {
      return lines
        .slice(1)
        .map(line => {
          const fields = parseCSVLine(line)
          const name = fields[nameIdx] || ''
          const body = fields[bodyIdx] || ''
          return name && body ? { name, body } : null
        })
        .filter(Boolean)
    }

    // No header match — try first two columns as name, body
    if (lines.length > 1) {
      const results = lines
        .slice(1)
        .map(line => {
          const fields = parseCSVLine(line)
          return fields.length >= 2 && fields[0] && fields[1]
            ? { name: fields[0], body: fields[1] }
            : null
        })
        .filter(Boolean)
      if (results.length > 0) return results
    }
  }

  // Try pipe-separated (||| delimiter)
  if (trimmed.includes('|||')) {
    return trimmed
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const idx = line.indexOf('|||')
        if (idx === -1) return null
        return {
          name: line.slice(0, idx).trim(),
          body: line.slice(idx + 3).trim(),
        }
      })
      .filter(m => m && m.name && m.body)
  }

  // Tab-separated fallback
  if (trimmed.includes('\t')) {
    return trimmed
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const idx = line.indexOf('\t')
        if (idx === -1) return null
        return {
          name: line.slice(0, idx).trim(),
          body: line.slice(idx + 1).trim(),
        }
      })
      .filter(m => m && m.name && m.body)
  }

  return []
}
