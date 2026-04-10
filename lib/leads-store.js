// Shared leads store. Uses Upstash Redis when KV_REST_API_URL and
// KV_REST_API_TOKEN are set, otherwise falls back to a local JSON file
// at data/leads.json so local dev works without any credentials.
import fs from 'fs'
import path from 'path'

const KV_KEY = 'deriva:leads'
const useKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
const LEADS_FILE = path.resolve('data/leads.json')

const STATUSES = ['new', 'contacted', 'in_progress', 'closed']

// Lazy-load @upstash/redis so the file-backed path works even if the
// package is missing or credentials are absent.
let redis = null
async function getRedis() {
  if (!redis) {
    const { Redis } = await import('@upstash/redis')
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  }
  return redis
}

function readFileLeads() {
  try {
    if (!fs.existsSync(LEADS_FILE)) return []
    const raw = fs.readFileSync(LEADS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeFileLeads(leads) {
  fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true })
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2))
}

async function loadAll() {
  if (useKV) {
    const client = await getRedis()
    const data = await client.get(KV_KEY)
    // @upstash/redis auto-parses JSON on get, so data may already be an
    // array. If it is a string for any reason, parse it defensively.
    if (Array.isArray(data)) return data
    if (typeof data === 'string') {
      try { const parsed = JSON.parse(data); return Array.isArray(parsed) ? parsed : [] }
      catch { return [] }
    }
    return []
  }
  return readFileLeads()
}

async function saveAll(leads) {
  if (useKV) {
    const client = await getRedis()
    // Stringify explicitly so the stored value is a predictable shape
    // regardless of SDK version behavior.
    await client.set(KV_KEY, JSON.stringify(leads))
    return
  }
  writeFileLeads(leads)
}

export async function listLeads() {
  const all = await loadAll()
  // Newest first by createdAt
  return [...all].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
}

export async function createLead(fields) {
  const now = new Date().toISOString()
  const lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: 'work-with-me',
    name: fields.name || '',
    email: fields.email || '',
    destinations: fields.destinations || '',
    dates: fields.dates || '',
    partySize: fields.partySize || '',
    tripNotes: fields.tripNotes || '',
    referral: fields.referral || '',
    status: 'new',
    notes: '',
    createdAt: now,
    updatedAt: now,
  }
  const all = await loadAll()
  all.push(lead)
  await saveAll(all)
  return lead
}

export async function updateLead(id, patch) {
  const all = await loadAll()
  const idx = all.findIndex(l => l.id === id)
  if (idx === -1) return null
  const allowed = {}
  if (typeof patch.status === 'string' && STATUSES.includes(patch.status)) allowed.status = patch.status
  if (typeof patch.notes === 'string') allowed.notes = patch.notes
  all[idx] = { ...all[idx], ...allowed, updatedAt: new Date().toISOString() }
  await saveAll(all)
  return all[idx]
}

export { STATUSES, useKV as isUsingKV }
