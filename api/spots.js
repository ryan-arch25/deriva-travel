import { listSpots, createSpot, updateSpot, deleteSpot } from '../lib/spots-store.js'

const ADVISOR_TOKEN = process.env.ADVISOR_AUTH_TOKEN || 'deriva2024'
const isAuthorized = (req) => req.headers['x-advisor-auth'] === ADVISOR_TOKEN

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const { country, category } = req.query || {}
      const spots = await listSpots({ country, category })
      return res.json({ spots })
    }

    if (req.method === 'POST') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const body = req.body || {}
      if (!body.name) return res.status(400).json({ error: 'name required' })
      const spot = await createSpot(body)
      return res.json({ ok: true, spot })
    }

    if (req.method === 'PATCH') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const { id, ...patch } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id required' })
      const spot = await updateSpot(id, patch)
      if (!spot) return res.status(404).json({ error: 'Not found' })
      return res.json({ ok: true, spot })
    }

    if (req.method === 'DELETE') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const id = req.query?.id || req.body?.id
      if (!id) return res.status(400).json({ error: 'id required' })
      const deleted = await deleteSpot(id)
      if (!deleted) return res.status(404).json({ error: 'Not found' })
      return res.json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
