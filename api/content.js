import { listDrafts, createDraft, updateDraft, deleteDraft } from '../lib/content-store.js'

const ADVISOR_TOKEN = process.env.ADVISOR_AUTH_TOKEN || 'deriva2024'
const isAuthorized = (req) => req.headers['x-advisor-auth'] === ADVISOR_TOKEN

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const drafts = await listDrafts()
      return res.json({ drafts })
    }

    if (req.method === 'POST') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const body = req.body || {}
      if (!body.platform || !body.text) return res.status(400).json({ error: 'platform and text required' })
      const draft = await createDraft(body)
      return res.json({ ok: true, draft })
    }

    if (req.method === 'PATCH') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const { id, ...patch } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id required' })
      const draft = await updateDraft(id, patch)
      if (!draft) return res.status(404).json({ error: 'Draft not found' })
      return res.json({ ok: true, draft })
    }

    if (req.method === 'DELETE') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const id = req.query?.id || req.body?.id
      if (!id) return res.status(400).json({ error: 'id required' })
      const deleted = await deleteDraft(id)
      if (!deleted) return res.status(404).json({ error: 'Draft not found' })
      return res.json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
