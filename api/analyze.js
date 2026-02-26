export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
  }

  const { macroName, macroBody, ticketSummaries, matchCount } = req.body

  if (!macroName || !ticketSummaries) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const systemPrompt = `You are an expert support operations analyst reviewing Zendesk macro usage spikes.

Your job is to analyze a batch of tickets where a specific macro was used, and produce a themed breakdown of WHY the macro was applied so many times this week.

Output format — use ONLY this structure, with no preamble:

1. Theme Name – [count]
   - Sub-theme – [count]
     - Sub-sub-theme – [count]
       - Ticket #XXXXX: [one-line reason]

Rules:
- Group tickets into meaningful themes (e.g. "False positive restriction", "Legitimate use", "Bug workaround", "Misuse", "Edge case")
- Flag false positives clearly
- Surface any bugs or systemic issues
- Call out any individual tickets that are especially notable or anomalous
- Be precise with counts — they must add up correctly
- Keep descriptions tight — this is an internal ops tool
- Do not add any intro, outro, or commentary outside the numbered list`

  const userMessage = `Macro name: "${macroName}"
Match count this week: ${matchCount}

Macro body:
${macroBody}

Ticket data (${ticketSummaries.length} tickets):
${ticketSummaries.map(t => `
---
Ticket #${t.id} | Status: ${t.status} | Subject: ${t.subject}
Tags: ${(t.tags || []).join(', ') || 'none'}
Comments:
${t.comments.map((c, i) => `  [${c.public ? 'Public' : 'Internal'}] ${c.body}`).join('\n')}
`).join('\n')}

Analyze why this macro spiked and group the tickets into themes.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userMessage }
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Anthropic API error:', response.status, errorData)
      return res.status(502).json({
        error: `Anthropic API error: ${response.status}`,
        detail: errorData?.error?.message || 'Unknown error',
      })
    }

    const data = await response.json()
    const analysisText = data.content?.[0]?.text || ''

    return res.status(200).json({ analysis: analysisText })
  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}
