#!/usr/bin/env python3
"""deploy_vercel.py
Sets up Vercel serverless function + config for Deriva AI features.
Run from anywhere: python3 deploy_vercel.py
Targets: ~/deriva/
"""
import os

BASE = os.path.expanduser('~/deriva')

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f'OK: wrote {path}')

# ── 1. api/chat.js — Vercel serverless function ───────────────────────────────
write(os.path.join(BASE, 'api/chat.js'), """\
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { system, messages, maxTokens = 1024 } = req.body
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system,
        messages,
      }),
    })
    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' })
    }
    res.json({ text: data.content[0].text })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
""")

# ── 2. vercel.json ─────────────────────────────────────────────────────────────
write(os.path.join(BASE, 'vercel.json'), """\
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
""")

# ── 3. vite.config.js — remove dev proxy to localhost:3001 ────────────────────
with open(os.path.join(BASE, 'vite.config.js'), 'w') as f:
    f.write("""\
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
""")
print(f"OK: updated {os.path.join(BASE, 'vite.config.js')}")

print("""
Done. Three files created/updated:
  api/chat.js     — Vercel serverless function
  vercel.json     — build config + SPA routing
  vite.config.js  — proxy removed

─── Vercel setup ──────────────────────────────────────────────────────────────
1. Push this branch to GitHub (once GitHub App permissions are fixed).

2. In Vercel dashboard → Import project → select deriva-travel.
   Vercel auto-detects Vite. No framework override needed.

3. Settings → Environment Variables → add:
     ANTHROPIC_API_KEY   =   sk-ant-...your key...
   (the function checks ANTHROPIC_API_KEY first, then VITE_ANTHROPIC_API_KEY)

4. Deploy. The /api/chat endpoint will be live automatically.

─── Local dev ─────────────────────────────────────────────────────────────────
To test AI features locally without running server.js:
  npm i -g vercel   # one-time
  vercel dev        # serves frontend + /api/chat together on localhost:3000

For frontend-only work (no AI), npm run dev still works fine.
""")
