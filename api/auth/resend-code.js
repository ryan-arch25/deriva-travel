import { generate2FACode, ADMIN_EMAIL } from '../../lib/auth-store.js'
import { send2FACode } from '../../lib/auth-email.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const code = generate2FACode(ADMIN_EMAIL)
    await send2FACode(ADMIN_EMAIL, code)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
