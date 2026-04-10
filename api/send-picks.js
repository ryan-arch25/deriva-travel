import { sendPicksEmail } from '../lib/send-picks-email.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { to, country, picks } = req.body || {}
  if (!to || !country || !picks) return res.status(400).json({ error: 'Missing required fields' })
  try {
    const data = await sendPicksEmail({ to, country, picks })
    res.json({ ok: true, id: data?.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
