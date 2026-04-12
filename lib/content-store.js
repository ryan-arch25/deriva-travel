import fs from 'fs'
import path from 'path'

const KV_KEY = 'deriva:content'
const useKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
const FILE_PATH = path.resolve('data/content.json')

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

function writeFile(items) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true })
  fs.writeFileSync(FILE_PATH, JSON.stringify(items, null, 2))
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

async function saveAll(items) {
  if (useKV) {
    const client = await getRedis()
    await client.set(KV_KEY, JSON.stringify(items))
    return
  }
  writeFile(items)
}

export async function listDrafts() {
  const all = await loadAll()
  return [...all].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
}

export async function createDraft(fields) {
  const now = new Date().toISOString()
  const draft = {
    id: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    platform: fields.platform || '',
    text: fields.text || '',
    prompt: fields.prompt || '',
    scheduledDate: fields.scheduledDate || null,
    createdAt: now,
    updatedAt: now,
  }
  const all = await loadAll()
  all.push(draft)
  await saveAll(all)
  return draft
}

export async function updateDraft(id, patch) {
  const all = await loadAll()
  const idx = all.findIndex((d) => d.id === id)
  if (idx === -1) return null
  const allowed = {}
  if (typeof patch.text === 'string') allowed.text = patch.text
  if (patch.scheduledDate !== undefined) allowed.scheduledDate = patch.scheduledDate
  all[idx] = { ...all[idx], ...allowed, updatedAt: new Date().toISOString() }
  await saveAll(all)
  return all[idx]
}

export async function deleteDraft(id) {
  const all = await loadAll()
  const idx = all.findIndex((d) => d.id === id)
  if (idx === -1) return false
  all.splice(idx, 1)
  await saveAll(all)
  return true
}
