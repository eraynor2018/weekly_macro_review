/**
 * Parse macro list from either:
 * - JSON array: [{"name": "...", "body": "..."}]
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
