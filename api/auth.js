import { getUser, verifyPassword, setPassword, ADMIN_EMAIL, generate2FACode, verify2FACode, generateResetToken, validateResetToken, consumeResetToken } from '../lib/auth-store.js'
import { createSessionToken, setSessionCookie, clearSessionCookie, getSessionCookie, verifySessionToken } from '../lib/auth-session.js'
import { send2FACode, sendResetEmail } from '../lib/auth-email.js'

export default async function handler(req, res) {
  const action = req.query?.action || req.body?.action
  try {
    // GET /api/auth?action=session
    if (req.method === 'GET' && action === 'session') {
      const token = getSessionCookie(req)
      if (!token) return res.json({ authenticated: false })
      const payload = await verifySessionToken(token)
      if (!payload) return res.json({ authenticated: false })
      const user = await getUser()
      return res.json({ authenticated: true, needsSetup: user.needsSetup })
    }

    // GET /api/auth?action=validate-reset&token=...
    if (req.method === 'GET' && action === 'validate-reset') {
      const token = req.query?.token
      if (!token) return res.status(400).json({ error: 'Token required' })
      const email = validateResetToken(token)
      if (!email) return res.status(400).json({ error: 'Invalid or expired reset link' })
      return res.json({ ok: true, valid: true })
    }

    if (req.method !== 'POST' && req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // DELETE /api/auth?action=logout
    if (req.method === 'DELETE' && action === 'logout') {
      clearSessionCookie(res)
      return res.json({ ok: true })
    }

    // POST actions
    if (action === 'login') {
      const { email, password } = req.body || {}
      if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
      if (email.toLowerCase() !== ADMIN_EMAIL) return res.status(401).json({ error: 'Invalid credentials' })
      const user = await getUser()
      if (user.needsSetup) return res.status(401).json({ error: 'Invalid credentials' })
      const valid = await verifyPassword(password)
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
      const code = generate2FACode(email.toLowerCase())
      await send2FACode(email.toLowerCase(), code)
      return res.json({ ok: true, step: '2fa' })
    }

    if (action === 'setup') {
      const { email, password } = req.body || {}
      if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
      if (email.toLowerCase() !== ADMIN_EMAIL) return res.status(403).json({ error: 'Not authorized' })
      if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
      const user = await getUser()
      if (!user.needsSetup) return res.status(400).json({ error: 'Password already set. Use the login flow.' })
      await setPassword(password)
      const code = generate2FACode(ADMIN_EMAIL)
      await send2FACode(ADMIN_EMAIL, code)
      return res.json({ ok: true, step: '2fa' })
    }

    if (action === 'verify-2fa') {
      const { code } = req.body || {}
      if (!code) return res.status(400).json({ error: 'Code required' })
      const result = verify2FACode(ADMIN_EMAIL, code.trim())
      if (!result.valid) {
        if (result.reason === 'expired') return res.status(401).json({ error: 'Code expired. Please start over.', restart: true })
        if (result.reason === 'max_attempts') return res.status(401).json({ error: 'Too many attempts. Please start over.', restart: true })
        return res.status(401).json({ error: `Incorrect code. ${result.attemptsLeft} attempt${result.attemptsLeft === 1 ? '' : 's'} remaining.` })
      }
      const token = await createSessionToken()
      setSessionCookie(res, token)
      return res.json({ ok: true })
    }

    if (action === 'resend-code') {
      const code = generate2FACode(ADMIN_EMAIL)
      await send2FACode(ADMIN_EMAIL, code)
      return res.json({ ok: true })
    }

    if (action === 'forgot') {
      const { email } = req.body || {}
      if (email?.toLowerCase() === ADMIN_EMAIL) {
        const user = await getUser()
        if (!user.needsSetup) {
          const token = generateResetToken(ADMIN_EMAIL)
          const origin = `https://${req.headers.host || 'deriva.travel'}`
          const resetUrl = `${origin}/advisor/reset-password?token=${token}`
          await sendResetEmail(ADMIN_EMAIL, resetUrl)
        }
      }
      return res.json({ ok: true, message: 'If an account exists with that email, a reset link has been sent.' })
    }

    if (action === 'reset-password') {
      const { token, password } = req.body || {}
      if (!token || !password) return res.status(400).json({ error: 'Token and password required' })
      if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
      const email = consumeResetToken(token)
      if (!email) return res.status(400).json({ error: 'Invalid or expired reset link' })
      await setPassword(password)
      return res.json({ ok: true })
    }

    return res.status(400).json({ error: 'Unknown action' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
