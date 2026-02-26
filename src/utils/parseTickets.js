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
 * Strip HTML tags and decode common HTML entities.
 */
function stripHtml(str) {
  return String(str || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
}

/**
 * Normalize text for matching: strip HTML, lowercase, collapse whitespace.
 */
function normalize(str) {
  return stripHtml(str)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Extract the core matching text from a macro body:
 * - Strip HTML
 * - Remove all {{placeholder}} tokens (including greeting placeholders)
 * - Take only the first two sentences of what remains
 */
function extractMatchText(body) {
  const stripped = normalize(body)
  // Remove all template variable placeholders entirely
  const noPlaceholders = stripped.replace(/\{\{[^}]+\}\}/g, ' ').replace(/\s+/g, ' ').trim()
  // Split into sentences on . ! ? and take first two non-trivial ones
  const sentences = noPlaceholders
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15)
  return sentences.slice(0, 2).join(' ')
}

/**
 * Split macro body on Zendesk template variables like {{ticket.requester.first_name}}.
 * Returns the literal chunks between placeholders, with HTML stripped.
 */
function splitOnPlaceholders(body) {
  return normalize(body)
    .split(/\{\{[^}]+\}\}/)
    .map(s => s.trim())
    .filter(Boolean)
}

/**
 * Check if a macro was used in a ticket by searching all comment bodies.
 * Returns true if there's a strong match.
 */
export function macroUsedInTicket(macro, ticket) {
  const normalizedBody = normalize(macro.body)

  // Skip very short macros — too many false positives
  if (normalizedBody.length < 20) return false

  // Core match text: first two sentences, no placeholders, no HTML
  const matchText = extractMatchText(macro.body)

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

  // Strategy 1: match the first two sentences of the macro body (no placeholders)
  if (matchText.length > 30 && allText.includes(matchText)) return true

  // Strategy 2: chunk-based matching on long literal chunks
  const chunks = splitOnPlaceholders(macro.body)
  const longChunks = chunks.filter(c => c.length > 30)
  if (longChunks.length > 0) {
    const matchedChunks = longChunks.filter(chunk => allText.includes(chunk))
    const ratio = matchedChunks.length / longChunks.length
    if (ratio >= 0.5) return true
  }

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
