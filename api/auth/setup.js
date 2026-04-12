import { getUser, setPassword, generate2FACode, ADMIN_EMAIL } from '../../lib/auth-store.js'
import { send2FACode } from '../../lib/auth-email.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  if (email.toLowerCase() !== ADMIN_EMAIL) return res.status(403).json({ error: 'Not authorized' })
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })

  try {
    const user = await getUser()
    if (!user.needsSetup) return res.status(400).json({ error: 'Password already set. Use the login flow.' })

    await setPassword(password)
    const code = generate2FACode(ADMIN_EMAIL)
    await send2FACode(ADMIN_EMAIL, code)
    res.json({ ok: true, step: '2fa' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
