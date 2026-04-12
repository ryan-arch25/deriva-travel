import fs from 'fs'
import path from 'path'
import bcryptjs from 'bcryptjs'

const KV_KEY = 'deriva:auth'
const useKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
const FILE_PATH = path.resolve('data/auth.json')

const ADMIN_EMAIL = 'ryancarlsailer@gmail.com'

let redis = null
async function getRedis() {
  if (!redis) {
    const { Redis } = await import('@upstash/redis')
    redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
  }
  return redis
}

function readFile() {
  try {
    if (!fs.existsSync(FILE_PATH)) return null
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'))
  } catch { return null }
}

function writeFile(data) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true })
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2))
}

async function load() {
  if (useKV) {
    const client = await getRedis()
    const data = await client.get(KV_KEY)
    if (typeof data === 'string') {
      try { return JSON.parse(data) } catch { return null }
    }
    return data || null
  }
  return readFile()
}

async function save(data) {
  if (useKV) {
    const client = await getRedis()
    await client.set(KV_KEY, JSON.stringify(data))
    return
  }
  writeFile(data)
}

export async function getUser() {
  const data = await load()
  if (!data) return { email: ADMIN_EMAIL, passwordHash: null, needsSetup: true }
  return { email: ADMIN_EMAIL, passwordHash: data.passwordHash, needsSetup: !data.passwordHash }
}

export async function setPassword(plaintext) {
  const hash = await bcryptjs.hash(plaintext, 12)
  const data = (await load()) || {}
  data.passwordHash = hash
  await save(data)
}

export async function verifyPassword(plaintext) {
  const data = await load()
  if (!data?.passwordHash) return false
  return bcryptjs.compare(plaintext, data.passwordHash)
}

// 2FA codes stored ephemerally
const pending2fa = new Map()

export function generate2FACode(email) {
  const code = String(Math.floor(100000 + Math.random() * 900000))
  pending2fa.set(email, { code, attempts: 0, expiresAt: Date.now() + 10 * 60 * 1000 })
  return code
}

export function verify2FACode(email, code) {
  const entry = pending2fa.get(email)
  if (!entry) return { valid: false, reason: 'expired' }
  if (Date.now() > entry.expiresAt) { pending2fa.delete(email); return { valid: false, reason: 'expired' } }
  if (entry.code !== code) {
    entry.attempts++
    if (entry.attempts >= 3) { pending2fa.delete(email); return { valid: false, reason: 'max_attempts' } }
    return { valid: false, reason: 'wrong_code', attemptsLeft: 3 - entry.attempts }
  }
  pending2fa.delete(email)
  return { valid: true }
}

// Password reset tokens
const resetTokens = new Map()

export function generateResetToken(email) {
  const token = Array.from({ length: 32 }, () => Math.random().toString(36).charAt(2)).join('')
  resetTokens.set(token, { email, expiresAt: Date.now() + 60 * 60 * 1000 })
  return token
}

export function validateResetToken(token) {
  const entry = resetTokens.get(token)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) { resetTokens.delete(token); return null }
  return entry.email
}

export function consumeResetToken(token) {
  const email = validateResetToken(token)
  if (email) resetTokens.delete(token)
  return email
}

export { ADMIN_EMAIL }
