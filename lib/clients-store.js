// Clients store. Mirrors leads-store / itineraries-store: Upstash Redis when
// KV_REST_API_URL + KV_REST_API_TOKEN are set, otherwise a local JSON file.
import fs from 'fs'
import path from 'path'

const KV_KEY = 'deriva:clients'
const useKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
const DATA_FILE = path.resolve('data/clients.json')

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

function blankClient(fields = {}) {
  const now = new Date().toISOString()
  return {
    id: `cli_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: fields.name || 'New Client',
    email: fields.email || '',
    phone: fields.phone || '',
    referral: fields.referral || '',
    destinations: fields.destinations || '',
    departDate: fields.departDate || '',
    returnDate: fields.returnDate || '',
    travelers: fields.travelers || '',
    travelerDescription: fields.travelerDescription || '',
    citiesRegions: fields.citiesRegions || '',
    serviceTier: fields.serviceTier || 'standard',
    budgetPerNight: fields.budgetPerNight || '',
    travelStyle: fields.travelStyle || '',
    avoidOrBooked: fields.avoidOrBooked || '',
    discoveryNotes: fields.discoveryNotes || '',
    price: fields.price || '',
    deposit: fields.deposit || { amount: '', status: 'Pending' },
    balance: fields.balance || { amount: '', status: 'Pending' },
    paymentNotes: fields.paymentNotes || '',
    bookings: Array.isArray(fields.bookings) ? fields.bookings : [],
    clientNotes: fields.clientNotes || '',
    emailLog: Array.isArray(fields.emailLog) ? fields.emailLog : [],
    itineraryId: fields.itineraryId || '',
    stage: fields.stage || 'Call Scheduled',
    createdAt: now,
    updatedAt: now,
  }
}

export async function listClients() {
  const all = await loadAll()
  return [...all].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
}

export async function getClient(id) {
  const all = await loadAll()
  return all.find(c => c.id === id) || null
}

export async function createClient(fields = {}) {
  const client = blankClient(fields)
  const all = await loadAll()
  all.push(client)
  await saveAll(all)
  return client
}

export async function updateClient(id, patch) {
  const all = await loadAll()
  const idx = all.findIndex(c => c.id === id)
  if (idx === -1) return null
  const { id: _i, createdAt: _c, ...allowed } = patch || {}
  all[idx] = { ...all[idx], ...allowed, updatedAt: new Date().toISOString() }
  await saveAll(all)
  return all[idx]
}

export async function deleteClient(id) {
  const all = await loadAll()
  const filtered = all.filter(c => c.id !== id)
  const deleted = filtered.length < all.length
  if (deleted) await saveAll(filtered)
  return deleted
}
