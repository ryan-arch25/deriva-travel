import fs from 'fs'
import path from 'path'

const CSV_HEADER = 'timestamp,country,email,vibe,party,notes\n'
const csvEscape = (v = '') => `"${String(v).replace(/"/g, '""')}"`

// Vercel serverless filesystems are read-only except /tmp, which is also
// ephemeral. This logger writes to /tmp/leads.csv as a best-effort fallback.
// For durable storage in production, swap this for a database write.
const LEADS_PATH = process.env.VERCEL ? '/tmp/leads.csv' : path.resolve('leads.csv')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
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
}
