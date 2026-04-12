import { verify2FACode, ADMIN_EMAIL } from '../../lib/auth-store.js'
import { createSessionToken, setSessionCookie } from '../../lib/auth-session.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { code } = req.body || {}
  if (!code) return res.status(400).json({ error: 'Code required' })

  try {
    const result = verify2FACode(ADMIN_EMAIL, code.trim())
    if (!result.valid) {
      if (result.reason === 'expired') return res.status(401).json({ error: 'Code expired. Please start over.', restart: true })
      if (result.reason === 'max_attempts') return res.status(401).json({ error: 'Too many attempts. Please start over.', restart: true })
      return res.status(401).json({ error: `Incorrect code. ${result.attemptsLeft} attempt${result.attemptsLeft === 1 ? '' : 's'} remaining.` })
    }

    const token = await createSessionToken()
    setSessionCookie(res, token)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
