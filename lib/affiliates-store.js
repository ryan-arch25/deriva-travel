// Affiliate link library store. Same pattern as clients-store.
import fs from 'fs'
import path from 'path'

const KV_KEY = 'deriva:affiliates'
const useKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
const DATA_FILE = path.resolve('data/affiliates.json')

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

function readFile() {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeFile(list) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2))
}

const SEED = [
  { platform: 'Viator', label: 'Viator Rome Tours', url: 'https://www.viator.com/Rome/d511', notes: 'Search for skip-the-line Vatican and Colosseum tours.' },
  { platform: 'GetYourGuide', label: 'GetYourGuide Lisbon', url: 'https://www.getyourguide.com/lisbon-l42', notes: 'Good for Sintra day trips and food tours.' },
  { platform: 'Booking.com', label: 'Booking.com Affiliate Home', url: 'https://www.booking.com', notes: 'Use for hotels with the partner ID appended.' },
]

async function loadAll() {
  let list
  if (useKV) {
    const client = await getRedis()
    const data = await client.get(KV_KEY)
    if (Array.isArray(data)) list = data
    else if (typeof data === 'string') {
      try { const p = JSON.parse(data); list = Array.isArray(p) ? p : null } catch { list = null }
    }
  } else {
    list = readFile()
  }

  if (!list || list.length === 0) {
    const seeded = SEED.map(s => blankAffiliate(s))
    await saveAll(seeded)
    return seeded
  }
  return list
}

async function saveAll(list) {
  if (useKV) {
    const client = await getRedis()
    await client.set(KV_KEY, JSON.stringify(list))
    return
  }
  writeFile(list)
}

function blankAffiliate(fields = {}) {
  const now = new Date().toISOString()
  return {
    id: `aff_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    platform: fields.platform || 'Other',
    label: fields.label || '',
    url: fields.url || '',
    notes: fields.notes || '',
    createdAt: now,
    updatedAt: now,
  }
}

export async function listAffiliates() {
  const all = await loadAll()
  return [...all].sort((a, b) => (a.platform || '').localeCompare(b.platform || '') || (a.label || '').localeCompare(b.label || ''))
}

export async function createAffiliate(fields = {}) {
  const entry = blankAffiliate(fields)
  const all = await loadAll()
  all.push(entry)
  await saveAll(all)
  return entry
}

export async function updateAffiliate(id, patch) {
  const all = await loadAll()
  const idx = all.findIndex(a => a.id === id)
  if (idx === -1) return null
  const { id: _i, createdAt: _c, ...allowed } = patch || {}
  all[idx] = { ...all[idx], ...allowed, updatedAt: new Date().toISOString() }
  await saveAll(all)
  return all[idx]
}

export async function deleteAffiliate(id) {
  const all = await loadAll()
  const filtered = all.filter(a => a.id !== id)
  const deleted = filtered.length < all.length
  if (deleted) await saveAll(filtered)
  return deleted
}
