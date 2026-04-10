// Shared leads store. Uses Vercel KV when KV_REST_API_URL is set,
// otherwise falls back to a local JSON file at data/leads.json so
// local dev works without provisioning a KV instance.
import fs from 'fs'
import path from 'path'

const KV_KEY = 'deriva:leads'
const useKV = !!process.env.KV_REST_API_URL
const LEADS_FILE = path.resolve('data/leads.json')

const STATUSES = ['new', 'contacted', 'in_progress', 'closed']

// Lazy-load @vercel/kv only when we actually use it. This keeps the
// local fallback path from crashing if the package is missing or the
// env vars are absent.
let kv = null
async function getKv() {
  if (!kv) {
    const mod = await import('@vercel/kv')
    kv = mod.kv
  }
  return kv
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
    const kvClient = await getKv()
    const data = await kvClient.get(KV_KEY)
    return Array.isArray(data) ? data : []
  }
  return readFileLeads()
}

async function saveAll(leads) {
  if (useKV) {
    const kvClient = await getKv()
    await kvClient.set(KV_KEY, leads)
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
