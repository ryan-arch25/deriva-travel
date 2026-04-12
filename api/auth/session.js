import { getSessionCookie, verifySessionToken, clearSessionCookie } from '../../lib/auth-session.js'
import { getUser } from '../../lib/auth-store.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = getSessionCookie(req)
    if (!token) return res.json({ authenticated: false })
    const payload = await verifySessionToken(token)
    if (!payload) return res.json({ authenticated: false })
    const user = await getUser()
    return res.json({ authenticated: true, needsSetup: user.needsSetup })
  }

  if (req.method === 'DELETE') {
    clearSessionCookie(res)
    return res.json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
