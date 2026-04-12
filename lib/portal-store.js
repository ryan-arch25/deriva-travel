import fs from 'fs'
import path from 'path'

const KV_INDEX = 'deriva:portals:index'
const KV_PREFIX = 'deriva:portal:'
const useKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
const FILE_PATH = path.resolve('data/portals.json')

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
    if (!fs.existsSync(FILE_PATH)) return {}
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8')) || {}
  } catch { return {} }
}

function writeFile(map) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true })
  fs.writeFileSync(FILE_PATH, JSON.stringify(map, null, 2))
}

async function loadAll() {
  if (useKV) {
    const client = await getRedis()
    const indexRaw = await client.get(KV_INDEX)
    const slugs = Array.isArray(indexRaw) ? indexRaw : (typeof indexRaw === 'string' ? JSON.parse(indexRaw) : [])
    const map = {}
    for (const slug of slugs) {
      const data = await client.get(KV_PREFIX + slug)
      if (data) map[slug] = typeof data === 'string' ? JSON.parse(data) : data
    }
    return map
  }
  return readFile()
}

async function saveOne(slug, portal) {
  if (useKV) {
    const client = await getRedis()
    await client.set(KV_PREFIX + slug, JSON.stringify(portal))
    const indexRaw = await client.get(KV_INDEX)
    const slugs = Array.isArray(indexRaw) ? indexRaw : (typeof indexRaw === 'string' ? JSON.parse(indexRaw) : [])
    if (!slugs.includes(slug)) {
      slugs.push(slug)
      await client.set(KV_INDEX, JSON.stringify(slugs))
    }
    return
  }
  const map = readFile()
  map[slug] = portal
  writeFile(map)
}

async function deleteOne(slug) {
  if (useKV) {
    const client = await getRedis()
    await client.del(KV_PREFIX + slug)
    const indexRaw = await client.get(KV_INDEX)
    const slugs = Array.isArray(indexRaw) ? indexRaw : (typeof indexRaw === 'string' ? JSON.parse(indexRaw) : [])
    const next = slugs.filter((s) => s !== slug)
    await client.set(KV_INDEX, JSON.stringify(next))
    return
  }
  const map = readFile()
  delete map[slug]
  writeFile(map)
}

export async function getPortal(slug) {
  if (useKV) {
    const client = await getRedis()
    const data = await client.get(KV_PREFIX + slug)
    if (!data) return null
    return typeof data === 'string' ? JSON.parse(data) : data
  }
  const map = readFile()
  return map[slug] || null
}

export async function listPortals() {
  const map = await loadAll()
  return Object.entries(map).map(([slug, p]) => ({
    slug,
    clientName: p.clientName || '',
    tripName: p.tripName || '',
    startDate: p.startDate || '',
    endDate: p.endDate || '',
    status: p.status || 'Active',
    createdAt: p.createdAt || '',
  })).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
}

export async function createPortal(fields) {
  const now = new Date().toISOString()
  const portal = {
    slug: fields.slug,
    password: fields.password,
    clientName: fields.clientName || '',
    clientEmail: fields.clientEmail || '',
    tripName: fields.tripName || '',
    startDate: fields.startDate || '',
    endDate: fields.endDate || '',
    days: fields.days || [],
    status: fields.status || 'Active',
    createdAt: now,
    updatedAt: now,
  }
  await saveOne(portal.slug, portal)
  return portal
}

export async function removePortal(slug) {
  await deleteOne(slug)
  return true
}
