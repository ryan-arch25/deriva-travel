import { listClients, getClient, createClient, updateClient, deleteClient } from '../lib/clients-store.js'

const ADVISOR_TOKEN = process.env.ADVISOR_AUTH_TOKEN || 'deriva2024'
const isAuthorized = (req) => req.headers['x-advisor-auth'] === ADVISOR_TOKEN

export default async function handler(req, res) {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
  try {
    if (req.method === 'GET') {
      const id = req.query?.id
      if (id) {
        const client = await getClient(id)
        if (!client) return res.status(404).json({ error: 'Not found' })
        return res.json({ client })
      }
      const clients = await listClients()
      return res.json({ clients })
    }
    if (req.method === 'POST') {
      const client = await createClient(req.body || {})
      return res.json({ client })
    }
    if (req.method === 'PATCH') {
      const { id, ...patch } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id required' })
      const client = await updateClient(id, patch)
      if (!client) return res.status(404).json({ error: 'Not found' })
      return res.json({ client })
    }
    if (req.method === 'DELETE') {
      const id = req.query?.id
      if (!id) return res.status(400).json({ error: 'id required' })
      const deleted = await deleteClient(id)
      if (!deleted) return res.status(404).json({ error: 'Not found' })
      return res.json({ ok: true })
    }
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
