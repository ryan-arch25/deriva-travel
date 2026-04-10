// Shared itineraries store. Mirrors the leads-store pattern: uses Upstash
// Redis when KV_REST_API_URL + KV_REST_API_TOKEN are present, otherwise
// falls back to a local JSON file so dev works without provisioning.
import fs from 'fs'
import path from 'path'

const KV_KEY = 'deriva:itineraries'
const useKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
const DATA_FILE = path.resolve('data/itineraries.json')

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

async function loadAll() {
  if (useKV) {
    const client = await getRedis()
    const data = await client.get(KV_KEY)
    if (Array.isArray(data)) return data
    if (typeof data === 'string') {
      try { const p = JSON.parse(data); return Array.isArray(p) ? p : [] }
      catch { return [] }
    }
    return []
  }
  return readFile()
}

async function saveAll(list) {
  if (useKV) {
    const client = await getRedis()
    await client.set(KV_KEY, JSON.stringify(list))
    return
  }
  writeFile(list)
}

// Return a lightweight index (no days/hotels/flights/documents) for the list
// view so it doesn't ship the full itinerary payload when all you want is the
// client name and date to pick one.
export async function listItineraries() {
  const all = await loadAll()
  return [...all]
    .map(it => ({
      id: it.id,
      clientName: it.clientName || '',
      destination: it.destination || '',
      dates: it.dates || '',
      travelers: it.travelers || '',
      updatedAt: it.updatedAt || '',
      createdAt: it.createdAt || '',
      dayCount: Array.isArray(it.days) ? it.days.length : 0,
    }))
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
}

export async function getItinerary(id) {
  const all = await loadAll()
  return all.find(it => it.id === id) || null
}

export async function createItinerary(fields = {}) {
  const now = new Date().toISOString()
  const itinerary = {
    id: `it_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    clientName: fields.clientName || 'Untitled Itinerary',
    destination: fields.destination || '',
    dates: fields.dates || '',
    travelers: fields.travelers || '',
    notes: fields.notes || '',
    hotels: [],
    flights: [],
    days: [],
    documents: [],
    createdAt: now,
    updatedAt: now,
  }
  const all = await loadAll()
  all.push(itinerary)
  await saveAll(all)
  return itinerary
}

export async function updateItinerary(id, patch) {
  const all = await loadAll()
  const idx = all.findIndex(it => it.id === id)
  if (idx === -1) return null
  // Never allow overwriting id or createdAt
  const { id: _ignore, createdAt: _c, ...allowed } = patch || {}
  all[idx] = { ...all[idx], ...allowed, updatedAt: new Date().toISOString() }
  await saveAll(all)
  return all[idx]
}

export async function deleteItinerary(id) {
  const all = await loadAll()
  const filtered = all.filter(it => it.id !== id)
  const deleted = filtered.length < all.length
  if (deleted) await saveAll(filtered)
  return deleted
}
