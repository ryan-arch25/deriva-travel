import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.AUTH_JWT_SECRET || 'deriva-advisor-secret-change-in-prod-2024')

export async function createSessionToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET)
}

export async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload
  } catch {
    return null
  }
}

export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', `deriva_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${30 * 24 * 60 * 60}`)
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 'deriva_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0')
}

export function getSessionCookie(req) {
  const cookies = req.headers.cookie || ''
  const match = cookies.match(/deriva_session=([^;]+)/)
  return match ? match[1] : null
}
