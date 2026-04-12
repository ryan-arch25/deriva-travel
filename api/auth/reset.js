import { validateResetToken, consumeResetToken, setPassword } from '../../lib/auth-store.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.query?.token
    if (!token) return res.status(400).json({ error: 'Token required' })
    const email = validateResetToken(token)
    if (!email) return res.status(400).json({ error: 'Invalid or expired reset link' })
    return res.json({ ok: true, valid: true })
  }

  if (req.method === 'POST') {
    const { token, password } = req.body || {}
    if (!token || !password) return res.status(400).json({ error: 'Token and password required' })
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
    const email = consumeResetToken(token)
    if (!email) return res.status(400).json({ error: 'Invalid or expired reset link' })
    await setPassword(password)
    return res.json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
