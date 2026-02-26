# Macro Check Analyzer

Internal ops tool for weekly Zendesk macro spike investigation, powered by Claude.

## Setup

```bash
cd macro-check-analyzer
npm install
cp .env.example .env
# Edit .env and add your Anthropic API key
```

## Local development

You need two terminals:

**Terminal 1 — Vite dev server:**
```bash
npm run dev
```

**Terminal 2 — API dev server:**
```bash
node api/dev-server.js
```

Then open http://localhost:5173

## Input formats

### Macro list (upload or paste)

**JSON array:**
```json
[
  {"name": "My Macro", "body": "Hi {{ticket.requester.first_name}}, thanks for reaching out..."}
]
```

**Pipe-separated (one per line):**
```
My Macro ||| Hi {{ticket.requester.first_name}}, thanks for reaching out...
Another Macro ||| Sorry to hear about this issue...
```

### Ticket export

NDJSON format — one JSON ticket object per line. Each ticket should have:
- `id`, `subject`, `description`, `status`, `tags`
- `comments`: array with `body`/`plain_body`, `public`, `author_id`, `created_at`

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variable: `ANTHROPIC_API_KEY=sk-ant-...`
4. Deploy

No build configuration needed — Vercel auto-detects Vite.

## How macro matching works

For each macro, the tool scans all ticket comments for the macro body text:

1. **Chunk matching**: splits the macro body on `{{template.variables}}`, then checks if ≥50% of the literal chunks (>30 chars) appear in any comment
2. **Prefix/suffix fallback**: matches the first or last 60 characters of the macro body
3. **Short macro skip**: macros with <20 normalized characters are skipped (too many false positives)
