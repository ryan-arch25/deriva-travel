import { listItineraries, getItinerary, createItinerary, updateItinerary, deleteItinerary } from '../lib/itineraries-store.js'

const ADVISOR_TOKEN = process.env.ADVISOR_AUTH_TOKEN || 'deriva2024'
const isAuthorized = (req) => req.headers['x-advisor-auth'] === ADVISOR_TOKEN

export default async function handler(req, res) {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
  try {
    if (req.method === 'GET') {
      const id = req.query?.id
      if (id) {
        const it = await getItinerary(id)
        if (!it) return res.status(404).json({ error: 'Not found' })
        return res.json({ itinerary: it })
      }
      const itineraries = await listItineraries()
      return res.json({ itineraries })
    }
    if (req.method === 'POST') {
      const it = await createItinerary(req.body || {})
      return res.json({ itinerary: it })
    }
    if (req.method === 'PATCH') {
      const { id, ...patch } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id required' })
      const it = await updateItinerary(id, patch)
      if (!it) return res.status(404).json({ error: 'Not found' })
      return res.json({ itinerary: it })
    }
    if (req.method === 'DELETE') {
      const id = req.query?.id
      if (!id) return res.status(400).json({ error: 'id required' })
      const deleted = await deleteItinerary(id)
      if (!deleted) return res.status(404).json({ error: 'Not found' })
      return res.json({ ok: true })
    }
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
