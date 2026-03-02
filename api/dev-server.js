/**
 * Local development server that mimics the Vercel serverless function.
 * Run with: node api/dev-server.js
 * (In a separate terminal while running `npm run dev`)
 *
 * Requires a .env file in the project root with ANTHROPIC_API_KEY set.
 */

import { createServer } from 'http'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env manually (no dotenv dependency needed)
try {
  const envPath = join(__dirname, '..', '.env')
  const envContent = readFileSync(envPath, 'utf8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
} catch {
  // No .env file — rely on environment
}

const PORT = 3001

const server = createServer(async (req, res) => {
  // CORS headers for local dev
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method !== 'POST' || !req.url.startsWith('/api/analyze')) {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  let body = ''
  for await (const chunk of req) body += chunk

  let parsed
  try {
    parsed = JSON.parse(body)
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Invalid JSON' }))
    return
  }

  // Delegate to the handler
  const mockRes = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) { this.statusCode = code; return this },
    json(data) { this.body = data },
  }

  const { default: handler } = await import('./analyze.js')
  await handler({ method: 'POST', body: parsed }, mockRes)

  res.writeHead(mockRes.statusCode, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(mockRes.body))
})

server.listen(PORT, () => {
  console.log(`Dev API server running at http://localhost:${PORT}`)
  console.log(`ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? 'set ✓' : 'NOT SET ✗'}`)
})
