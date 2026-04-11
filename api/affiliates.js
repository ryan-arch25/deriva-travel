import { listAffiliates, createAffiliate, updateAffiliate, deleteAffiliate } from '../lib/affiliates-store.js'

const ADVISOR_TOKEN = process.env.ADVISOR_AUTH_TOKEN || 'deriva2024'
const isAuthorized = (req) => req.headers['x-advisor-auth'] === ADVISOR_TOKEN

export default async function handler(req, res) {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
  try {
    if (req.method === 'GET') {
      const affiliates = await listAffiliates()
      return res.json({ affiliates })
    }
    if (req.method === 'POST') {
      const entry = await createAffiliate(req.body || {})
      return res.json({ affiliate: entry })
    }
    if (req.method === 'PATCH') {
      const { id, ...patch } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id required' })
      const entry = await updateAffiliate(id, patch)
      if (!entry) return res.status(404).json({ error: 'Not found' })
      return res.json({ affiliate: entry })
    }
    if (req.method === 'DELETE') {
      const id = req.query?.id
      if (!id) return res.status(400).json({ error: 'id required' })
      const deleted = await deleteAffiliate(id)
      if (!deleted) return res.status(404).json({ error: 'Not found' })
      return res.json({ ok: true })
    }
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
