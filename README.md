# Macro Review Tool

An internal Next.js app for reviewing Zendesk support macro usage at SidelineSwap.

## What it does

Upload a Zendesk ticket export → select macros → AI matches tickets to macros → generates a categorized weekly report with action items, needs-review flags, and editable trend notes.

## Setup

### Required environment variable

```
ANTHROPIC_API_KEY=sk-ant-...
```

Set this in Vercel project settings (Environment Variables) for production, or in `.env.local` for local development.

### Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS (dark theme)
- Anthropic claude-haiku-4-5
- localStorage for macro library persistence
- Vercel hosting
