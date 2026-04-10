import { listLeads, createLead, updateLead } from '../lib/leads-store.js'

const ADVISOR_TOKEN = process.env.ADVISOR_AUTH_TOKEN || 'deriva2024'

function isAuthorized(req) {
  const header = req.headers['x-advisor-auth']
  return header === ADVISOR_TOKEN
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const leads = await listLeads()
      return res.json({ leads })
    }

    if (req.method === 'POST') {
      // Public endpoint for Work With Me form submissions
      const body = req.body || {}
      if (!body.name || !body.email) return res.status(400).json({ error: 'Missing required fields' })
      const lead = await createLead(body)
      return res.json({ ok: true, id: lead.id })
    }

    if (req.method === 'PATCH') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const { id, ...patch } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id required' })
      const lead = await updateLead(id, patch)
      if (!lead) return res.status(404).json({ error: 'Lead not found' })
      return res.json({ ok: true, lead })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
