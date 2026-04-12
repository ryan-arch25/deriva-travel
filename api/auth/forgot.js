import { getUser, generateResetToken, ADMIN_EMAIL } from '../../lib/auth-store.js'
import { sendResetEmail } from '../../lib/auth-email.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { email } = req.body || {}

  try {
    if (email?.toLowerCase() === ADMIN_EMAIL) {
      const user = await getUser()
      if (!user.needsSetup) {
        const token = generateResetToken(ADMIN_EMAIL)
        const origin = `https://${req.headers.host || 'deriva.travel'}`
        const resetUrl = `${origin}/advisor/reset-password?token=${token}`
        await sendResetEmail(ADMIN_EMAIL, resetUrl)
      }
    }
    res.json({ ok: true, message: 'If an account exists with that email, a reset link has been sent.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
