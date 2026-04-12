import fs from 'fs'
import path from 'path'

const KV_KEY = 'deriva:spots'
const useKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
const FILE_PATH = path.resolve('data/spots.json')

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
    if (!fs.existsSync(FILE_PATH)) return []
    const raw = fs.readFileSync(FILE_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeFile(spots) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true })
  fs.writeFileSync(FILE_PATH, JSON.stringify(spots, null, 2))
}

async function loadAll() {
  if (useKV) {
    const client = await getRedis()
    const data = await client.get(KV_KEY)
    if (Array.isArray(data)) return data
    if (typeof data === 'string') {
      try { const parsed = JSON.parse(data); return Array.isArray(parsed) ? parsed : [] }
      catch { return [] }
    }
    return []
  }
  return readFile()
}

async function saveAll(spots) {
  if (useKV) {
    const client = await getRedis()
    await client.set(KV_KEY, JSON.stringify(spots))
    return
  }
  writeFile(spots)
}

function normCountry(raw) {
  const s = (raw || '').toString().trim().toLowerCase()
  if (!s) return ''
  if (/^(it|italy|italia)$/.test(s) || /italy/.test(s)) return 'Italy'
  if (/^(pt|portugal)$/.test(s) || /portugal/.test(s)) return 'Portugal'
  if (/^(es|spain|españa|espana)$/.test(s) || /spain/.test(s)) return 'Spain'
  if (/^(is|iceland)$/.test(s) || /iceland/.test(s)) return 'Iceland'
  return raw || ''
}

function normCategoryFilter(raw) {
  const s = (raw || '').toString().trim().toLowerCase()
  if (!s) return ''
  if (/^(restaurant|restaurants|food|dining)/.test(s)) return 'Restaurant'
  if (/^(hotel|hotels|accommodation|stay|stays|lodging)/.test(s)) return 'Hotel'
  if (/^(experience|experiences|activity|tour)/.test(s)) return 'Experience'
  if (/^(cafe|bar|cafes?|cafés?)/.test(s) || s.includes('cafe') || s.includes('bar')) return 'Cafe & Bar'
  return raw || ''
}

export async function listSpots({ country, category } = {}) {
  const all = await loadAll()
  let filtered = all
  if (country) {
    const target = normCountry(country)
    filtered = filtered.filter((s) => normCountry(s.country) === target)
  }
  if (category) {
    const target = normCategoryFilter(category)
    filtered = filtered.filter((s) => normCategoryFilter(s.category) === target)
  }
  return filtered
}

export async function getSpot(id) {
  const all = await loadAll()
  return all.find((s) => s.id === id) || null
}

export async function createSpot(fields) {
  const now = new Date().toISOString()
  const spot = {
    id: fields.id || `spot_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: fields.name || '',
    city: fields.city || '',
    neighborhood: fields.neighborhood || '',
    address: fields.address || '',
    category: fields.category || 'Restaurant',
    country: fields.country || '',
    note: fields.note || '',
    priceTier: fields.priceTier || '',
    vibe: Array.isArray(fields.vibe) ? fields.vibe : [],
    goodFor: Array.isArray(fields.goodFor) ? fields.goodFor : [],
    lat: typeof fields.lat === 'number' ? fields.lat : undefined,
    lng: typeof fields.lng === 'number' ? fields.lng : undefined,
    isAdvisorPick: !!fields.isAdvisorPick,
    source: fields.source || 'custom',
    createdAt: fields.createdAt || now,
    updatedAt: now,
  }
  const all = await loadAll()
  all.push(spot)
  await saveAll(all)
  return spot
}

export async function updateSpot(id, patch) {
  const all = await loadAll()
  const idx = all.findIndex((s) => s.id === id)
  if (idx === -1) return null
  const allowed = {}
  const fields = ['name', 'city', 'neighborhood', 'address', 'category', 'country', 'note', 'priceTier', 'vibe', 'goodFor', 'lat', 'lng', 'isAdvisorPick']
  for (const f of fields) {
    if (patch[f] !== undefined) allowed[f] = patch[f]
  }
  all[idx] = { ...all[idx], ...allowed, updatedAt: new Date().toISOString() }
  await saveAll(all)
  return all[idx]
}

export async function deleteSpot(id) {
  const all = await loadAll()
  const idx = all.findIndex((s) => s.id === id)
  if (idx === -1) return false
  all.splice(idx, 1)
  await saveAll(all)
  return true
}

export async function replaceAllSpots(spots) {
  if (!Array.isArray(spots)) throw new Error('spots must be an array')
  await saveAll(spots)
  return spots.length
}
