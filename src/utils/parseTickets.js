/**
 * Parse NDJSON Zendesk ticket export.
 * Each line is a JSON object representing a ticket.
 */
export function parseTickets(text) {
  const tickets = []
  const lines = text.trim().split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    try {
      const obj = JSON.parse(trimmed)
      if (obj && typeof obj === 'object') {
        tickets.push(obj)
      }
    } catch {
      // Skip malformed lines
    }
  }

  return tickets
}

/**
 * Normalize text for matching: lowercase, collapse whitespace.
 */
function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Split macro body on Zendesk template variables like {{ticket.requester.first_name}}.
 * Returns the literal chunks between placeholders.
 */
function splitOnPlaceholders(body) {
  return body.split(/\{\{[^}]+\}\}/).map(s => s.trim()).filter(Boolean)
}

/**
 * Check if a macro was used in a ticket by searching all comment bodies.
 * Returns true if there's a strong match.
 */
export function macroUsedInTicket(macro, ticket) {
  const normalizedBody = normalize(macro.body)

  // Skip very short macros — too many false positives
  if (normalizedBody.length < 20) return false

  const chunks = splitOnPlaceholders(normalizedBody)
  const longChunks = chunks.filter(c => c.length > 30)

  // Collect all text to search across (comments + description)
  const textsToSearch = []

  if (ticket.description) {
    textsToSearch.push(normalize(ticket.description))
  }

  if (Array.isArray(ticket.comments)) {
    for (const comment of ticket.comments) {
      const body = comment.plain_body || comment.body || ''
      if (body) textsToSearch.push(normalize(body))
    }
  }

  const allText = textsToSearch.join('\n')

  // Strategy 1: chunk-based matching (handles template variables)
  if (longChunks.length > 0) {
    const matchedChunks = longChunks.filter(chunk => allText.includes(chunk))
    const ratio = matchedChunks.length / longChunks.length
    if (ratio >= 0.5) return true
  }

  // Strategy 2: first 60 + last 60 chars as fallback
  if (normalizedBody.length >= 60) {
    const prefix = normalizedBody.slice(0, 60)
    const suffix = normalizedBody.slice(-60)
    if (allText.includes(prefix) || allText.includes(suffix)) return true
  }

  // Strategy 3: exact substring match (for macros without template vars)
  if (chunks.length === 1 && allText.includes(normalizedBody)) return true

  return false
}

/**
 * Find all tickets where the given macro was used.
 */
export function findMatchingTickets(macro, tickets) {
  return tickets.filter(ticket => macroUsedInTicket(macro, ticket))
}

/**
 * Condense a ticket into a summary for the API call.
 * Keeps id, subject, status, tags, and truncated comment bodies.
 */
export function condenseTicket(ticket) {
  const comments = (ticket.comments || []).map(c => {
    const body = c.plain_body || c.body || ''
    return {
      public: c.public !== false,
      body: body.slice(0, 500),
    }
  })

  return {
    id: ticket.id,
    subject: ticket.subject || '(no subject)',
    status: ticket.status || 'unknown',
    tags: ticket.tags || [],
    comments,
  }
}
