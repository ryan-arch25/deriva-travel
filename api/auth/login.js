import { getUser, verifyPassword, ADMIN_EMAIL } from '../../lib/auth-store.js'
import { generate2FACode } from '../../lib/auth-store.js'
import { send2FACode } from '../../lib/auth-email.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  if (email.toLowerCase() !== ADMIN_EMAIL) return res.status(401).json({ error: 'Invalid credentials' })

  try {
    const user = await getUser()
    if (user.needsSetup) return res.status(401).json({ error: 'Invalid credentials' })
    const valid = await verifyPassword(password)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    const code = generate2FACode(email.toLowerCase())
    await send2FACode(email.toLowerCase(), code)
    res.json({ ok: true, step: '2fa' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
