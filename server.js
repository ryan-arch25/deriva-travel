import 'dotenv/config'
import express from 'express'
import { listLeads, createLead, updateLead } from './lib/leads-store.js'
import { listItineraries, getItinerary, createItinerary, updateItinerary, deleteItinerary } from './lib/itineraries-store.js'

const ADVISOR_TOKEN = process.env.ADVISOR_AUTH_TOKEN || 'deriva2024'
const isAuthorized = (req) => req.headers['x-advisor-auth'] === ADVISOR_TOKEN

const app = express()
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const { system, messages, maxTokens = 1024 } = req.body
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: maxTokens, system, messages }),
    })
    const data = await response.json()
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'API error' })
    res.json({ text: data.content[0].text })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/leads', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const leads = await listLeads()
    res.json({ leads })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/leads', async (req, res) => {
  const body = req.body || {}
  if (!body.name || !body.email) return res.status(400).json({ error: 'Missing required fields' })
  try {
    const lead = await createLead(body)
    res.json({ ok: true, id: lead.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/leads', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
  const { id, ...patch } = req.body || {}
  if (!id) return res.status(400).json({ error: 'id required' })
  try {
    const lead = await updateLead(id, patch)
    if (!lead) return res.status(404).json({ error: 'Lead not found' })
    res.json({ ok: true, lead })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/itineraries', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const id = req.query?.id
    if (id) {
      const it = await getItinerary(id)
      if (!it) return res.status(404).json({ error: 'Not found' })
      return res.json({ itinerary: it })
    }
    const itineraries = await listItineraries()
    res.json({ itineraries })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/itineraries', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const it = await createItinerary(req.body || {})
    res.json({ itinerary: it })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/itineraries', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
  const { id, ...patch } = req.body || {}
  if (!id) return res.status(400).json({ error: 'id required' })
  try {
    const it = await updateItinerary(id, patch)
    if (!it) return res.status(404).json({ error: 'Not found' })
    res.json({ itinerary: it })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/itineraries', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
  const id = req.query?.id
  if (!id) return res.status(400).json({ error: 'id required' })
  try {
    const deleted = await deleteItinerary(id)
    if (!deleted) return res.status(404).json({ error: 'Not found' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('Deriva API server on http://localhost:3001'))
