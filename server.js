import 'dotenv/config'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { sendPicksEmail } from './lib/send-picks-email.js'

const app = express()
app.use(express.json())

const LEADS_PATH = path.resolve('leads.csv')
const CSV_HEADER = 'timestamp,country,email,vibe,party,notes\n'
const csvEscape = (v = '') => `"${String(v).replace(/"/g, '""')}"`

app.post('/api/chat', async (req, res) => {
  const { system, messages, maxTokens = 1024 } = req.body
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: maxTokens, system, messages }),
    })
    const data = await response.json()
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'API error' })
    res.json({ text: data.content[0].text })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/log', (req, res) => {
  const { country = '', email = '', vibe = '', party = '', notes = '' } = req.body || {}
  if (!email) return res.status(400).json({ error: 'Email required' })
  try {
    if (!fs.existsSync(LEADS_PATH)) fs.writeFileSync(LEADS_PATH, CSV_HEADER)
    const row = [new Date().toISOString(), country, email, vibe, party, notes].map(csvEscape).join(',') + '\n'
    fs.appendFileSync(LEADS_PATH, row)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/send-picks', async (req, res) => {
  const { to, country, picks } = req.body || {}
  if (!to || !country || !picks) return res.status(400).json({ error: 'Missing required fields' })
  try {
    const data = await sendPicksEmail({ to, country, picks })
    res.json({ ok: true, id: data?.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('Deriva API server on http://localhost:3001'))
