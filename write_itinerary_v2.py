import os

PART1 = """\
import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { jsPDF } from 'jspdf'

const C = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18',
  white: '#FDFAF5', bark: '#2A2520',
}

const lbl = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em',
  textTransform: 'uppercase', color: C.tan, display: 'block', marginBottom: '0.5rem',
}
const inp = {
  width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300',
  color: C.ink, backgroundColor: C.white, border: `1px solid ${C.sand}`, padding: '0.75rem 1rem',
  outline: 'none', appearance: 'none', boxSizing: 'border-box',
}
const primaryBtn = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em',
  textTransform: 'uppercase', color: C.white, backgroundColor: C.gold, border: 'none',
  padding: '0.75rem 1.5rem', cursor: 'pointer',
}
const ghostBtn = {
  ...primaryBtn, backgroundColor: 'transparent', color: C.tan, border: `1px solid ${C.sand}`,
}

async function callAI({ system, messages, maxTokens = 1024 }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, messages, maxTokens }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`${res.status}: ${body.error || res.statusText}`)
  }
  const data = await res.json()
  return data.text
}

function SectionHeader({ label, title }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.25rem' }}>{label}</p>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: C.ink }}>{title}</h2>
    </div>
  )
}

function ClientBriefTool() {
  const [form, setForm] = useState({ name: '', destinations: '', dates: '', length: '', party: '', budget: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [brief, setBrief] = useState('')
  const [error, setError] = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const text = await callAI({
        system: `You are a research assistant for a professional travel advisor. Generate a concise working brief for a client trip. Use plain text with ## section headers. Include: Key Questions to Clarify (follow-ups for the client), Destination Notes (what matters about each place for this trip type), Neighborhoods to Focus On, Must-Book Items (restaurants, experiences, stays that need advance reservation), Logistics to Handle, and Seasonal Considerations. Be specific. Write for an experienced advisor, not a tourist. No filler.`,
        messages: [{ role: 'user', content: `Client: ${form.name}\\nDestinations: ${form.destinations}\\nTravel dates: ${form.dates}\\nTrip length: ${form.length}\\nParty: ${form.party}\\nBudget: ${form.budget}\\nNotes: ${form.notes || 'none'}` }],
        maxTokens: 2048,
      })
      setBrief(text)
    } catch (err) {
      setError(`API error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (brief) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.25rem' }}>Research Brief</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: C.ink }}>{form.name}</h2>
          </div>
          <button onClick={() => setBrief('')} style={ghostBtn}>New Brief</button>
        </div>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.85', whiteSpace: 'pre-wrap', backgroundColor: C.parchment, padding: '2rem', border: `1px solid ${C.sand}` }}>
          {brief}
        </div>
      </div>
    )
  }

  return (
    <div>
      <SectionHeader label="New Client Brief" title="Generate a research brief." />
      <form onSubmit={handleSubmit} style={{ maxWidth: '560px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Client name</label><input value={form.name} onChange={set('name')} required style={inp} placeholder="Jane Smith" /></div>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Destinations</label><input value={form.destinations} onChange={set('destinations')} required style={inp} placeholder="Portugal, Spain" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Travel dates</label><input value={form.dates} onChange={set('dates')} style={inp} placeholder="May 10-24" /></div>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Trip length</label><input value={form.length} onChange={set('length')} style={inp} placeholder="2 weeks" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Party</label><input value={form.party} onChange={set('party')} style={inp} placeholder="Couple" /></div>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Budget</label><input value={form.budget} onChange={set('budget')} style={inp} placeholder="Mid-range, occasional splurge" /></div>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={lbl}>Notes</label>
          <textarea value={form.notes} onChange={set('notes')} rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="Food-focused. No chain hotels. Interested in wine regions..." />
        </div>
        {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#9E6060', marginBottom: '1rem' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ ...primaryBtn, backgroundColor: loading ? C.tan : C.gold, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Generating...' : 'Generate Brief'}
        </button>
      </form>
    </div>
  )
}

function MySpots() {
  const [spots, setSpots] = useState(() => { try { return JSON.parse(localStorage.getItem('deriva_spots') || '[]') } catch { return [] } })
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', city: '', neighborhood: '', category: 'Restaurant', priceTier: '$$', note: '' })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const saveSpots = (updated) => { setSpots(updated); localStorage.setItem('deriva_spots', JSON.stringify(updated)) }
  const addSpot = (e) => {
    e.preventDefault()
    saveSpots([...spots, { ...form, id: Date.now() }])
    setForm({ name: '', city: '', neighborhood: '', category: 'Restaurant', priceTier: '$$', note: '' })
    setAdding(false)
  }
  const sel = { ...inp, cursor: 'pointer' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <SectionHeader label="My Spots" title={`${spots.length} spot${spots.length !== 1 ? 's' : ''}`} />
        {!adding && <button onClick={() => setAdding(true)} style={{ ...primaryBtn, marginTop: '1.5rem' }}>Add Spot</button>}
      </div>
      {adding && (
        <form onSubmit={addSpot} style={{ marginBottom: '2rem', padding: '2rem', border: `1px solid ${C.sand}`, backgroundColor: C.parchment }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: '400', color: C.ink, marginBottom: '1.5rem' }}>New Spot</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Name</label><input value={form.name} onChange={set('name')} required style={inp} placeholder="Restaurant or hotel name" /></div>
            <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>City</label><input value={form.city} onChange={set('city')} required style={inp} placeholder="Lisbon" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Neighborhood</label><input value={form.neighborhood} onChange={set('neighborhood')} style={inp} placeholder="Chiado" /></div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={lbl}>Category</label>
              <select value={form.category} onChange={set('category')} style={sel}>
                <option>Restaurant</option><option>Stay</option><option>Bar</option><option>Experience</option><option>Other</option>
              </select>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={lbl}>Price tier</label>
              <select value={form.priceTier} onChange={set('priceTier')} style={sel}>
                <option>$</option><option>$$</option><option>$$$</option><option>$$$$</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={lbl}>Note</label>
            <textarea value={form.note} onChange={set('note')} rows={2} style={{ ...inp, resize: 'vertical' }} placeholder="Why this place. What to order. When to go." />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" style={primaryBtn}>Save Spot</button>
            <button type="button" onClick={() => setAdding(false)} style={ghostBtn}>Cancel</button>
          </div>
        </form>
      )}
      {spots.length === 0 && !adding && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: C.mid }}>No spots yet. Add your first one.</p>
      )}
      {spots.map(spot => (
        <div key={spot.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', borderBottom: `1px solid ${C.sand}`, padding: '1.25rem 0', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: '400', color: C.ink }}>{spot.name}</h3>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', color: C.gold }}>{spot.priceTier}</span>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tan, border: `1px solid ${C.sand}`, padding: '0.15rem 0.4rem' }}>{spot.category}</span>
            </div>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', color: C.tan, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {[spot.neighborhood, spot.city].filter(Boolean).join(' \u00b7 ')}
            </p>
            {spot.note && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', fontWeight: '300', color: C.mid, lineHeight: '1.6' }}>{spot.note}</p>}
          </div>
          <button onClick={() => saveSpots(spots.filter(s => s.id !== spot.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tan, padding: '0.25rem', flexShrink: 0 }}>Remove</button>
        </div>
      ))}
    </div>
  )
}

function ResearchTool() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const updated = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setInput('')
    setLoading(true)
    try {
      const text = await callAI({
        system: `You are a research assistant for a professional travel advisor. Answer questions about European destinations, restaurants, hotels, logistics, and trip planning. Be specific and direct. Write for an experienced advisor. No filler, no tourism clich\u00e9s.`,
        messages: updated,
      })
      setMessages([...updated, { role: 'assistant', content: text }])
    } catch (err) {
      setMessages([...updated, { role: 'assistant', content: `API error: ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  const STARTERS = [
    'Best neighborhoods in Seville for a couple in October?',
    'Restaurants in Porto that need booking months ahead?',
    'How should I structure 10 days in Sicily?',
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', minHeight: '500px' }}>
      <SectionHeader label="Research Tool" title="Ask anything." />
      {messages.length === 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          {STARTERS.map(q => (
            <button key={q} onClick={() => setInput(q)} style={{ display: 'block', fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: C.mid, background: 'none', border: `1px solid ${C.sand}`, padding: '0.6rem 1rem', cursor: 'pointer', marginBottom: '0.5rem', textAlign: 'left', width: '100%', maxWidth: '500px' }}>
              {q}
            </button>
          ))}
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.4rem' }}>
              {msg.role === 'user' ? 'You' : 'Deriva'}
            </p>
            <div style={{ maxWidth: '80%', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.75', backgroundColor: msg.role === 'user' ? C.parchment : C.white, border: `1px solid ${C.sand}`, padding: '1rem 1.25rem', whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.4rem' }}>Deriva</p>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: C.tan, border: `1px solid ${C.sand}`, padding: '1rem 1.25rem' }}>Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', borderTop: `1px solid ${C.sand}`, paddingTop: '1rem', flexShrink: 0 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          rows={2}
          placeholder="Ask about a destination, neighborhood, restaurant... (Enter to send)"
          style={{ ...inp, flex: 1, resize: 'none' }}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{ ...primaryBtn, alignSelf: 'flex-end', backgroundColor: loading || !input.trim() ? C.tan : C.gold, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
          Send
        </button>
      </div>
    </div>
  )
}

function ClientNotes() {
  const [clients, setClients] = useState(() => { try { return JSON.parse(localStorage.getItem('deriva_client_notes') || '[]') } catch { return [] } })
  const [activeId, setActiveId] = useState(null)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  const persist = (updated) => { setClients(updated); localStorage.setItem('deriva_client_notes', JSON.stringify(updated)) }
  const addClient = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    const c = { id: Date.now(), name: newName.trim(), note: '', updatedAt: new Date().toLocaleDateString() }
    persist([...clients, c])
    setActiveId(c.id)
    setNewName('')
    setAdding(false)
  }
  const updateNote = (id, note) => {
    persist(clients.map(c => c.id === id ? { ...c, note, updatedAt: new Date().toLocaleDateString() } : c))
  }
  const active = clients.find(c => c.id === activeId)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <SectionHeader label="Client Notes" title={`${clients.length} client${clients.length !== 1 ? 's' : ''}`} />
        {!adding && <button onClick={() => setAdding(true)} style={{ ...primaryBtn, marginTop: '1.5rem' }}>Add Client</button>}
      </div>
      {adding && (
        <form onSubmit={addClient} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <input value={newName} onChange={e => setNewName(e.target.value)} autoFocus placeholder="Client name" style={{ ...inp, flex: 1 }} required />
          <button type="submit" style={primaryBtn}>Add</button>
          <button type="button" onClick={() => setAdding(false)} style={ghostBtn}>Cancel</button>
        </form>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: clients.length > 0 ? '200px 1fr' : '1fr', gap: '2rem' }}>
        {clients.length > 0 && (
          <div style={{ borderRight: `1px solid ${C.sand}`, paddingRight: '1.5rem' }}>
            {clients.map(c => (
              <button key={c.id} onClick={() => setActiveId(c.id)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.75rem 1rem', backgroundColor: activeId === c.id ? C.parchment : 'transparent', border: 'none', borderBottom: `1px solid ${C.sand}`, cursor: 'pointer' }}>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: activeId === c.id ? '400' : '300', color: activeId === c.id ? C.ink : C.charcoal }}>{c.name}</p>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', color: C.tan, marginTop: '0.2rem' }}>{c.updatedAt}</p>
              </button>
            ))}
          </div>
        )}
        <div>
          {active ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400', color: C.ink }}>{active.name}</h3>
                <button onClick={() => { persist(clients.filter(c => c.id !== active.id)); setActiveId(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tan }}>Remove</button>
              </div>
              <textarea value={active.note} onChange={e => updateNote(active.id, e.target.value)} placeholder="Trip details, preferences, status, follow-up items..." style={{ ...inp, resize: 'vertical', minHeight: '300px', lineHeight: '1.75' }} />
            </div>
          ) : (
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: C.mid }}>
              {clients.length > 0 ? 'Select a client.' : 'No clients yet. Add one to start.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const SEL_STYLE = {
  ...inp,
  cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239E8660' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 1rem center',
  paddingRight: '2.5rem',
}

function ItineraryBuilder() {
  const [form, setForm] = useState({ name: '', destination: '', dates: '', length: '', pace: 'balanced', interests: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState(null)
  const [error, setError] = useState(null)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setItinerary(null)

    const prompt = `Create a detailed day-by-day itinerary for this trip:

Client: ${form.name}
Destination: ${form.destination}
Travel dates: ${form.dates}
Trip length: ${form.length}
Pace: ${form.pace}
Interests: ${form.interests}
Notes: ${form.notes || 'None'}

Return a JSON object with exactly this structure:
{
  "clientName": "client name",
  "destination": "destination name",
  "dates": "travel dates",
  "days": [
    {
      "dayNumber": 1,
      "title": "Short evocative title, e.g. Arrive in Lisbon",
      "morning": "2-3 sentences. Specific place names, neighborhoods, what to do. Direct.",
      "afternoon": "2-3 sentences. Specific places and experiences. Direct.",
      "evening": "2-3 sentences. Name a specific restaurant and why it fits tonight.",
      "logisticsNote": "One practical note: transit, booking requirement, or timing.",
      "derivaTip": "One opinionated sentence. The thing most visitors miss or get wrong about this day."
    }
  ]
}

Generate exactly the right number of days for the trip length. Name actual neighborhoods, restaurants, and experiences. No generic travel advice. Return valid JSON only. No markdown.`

    try {
      const text = await callAI({
        system: `You are Deriva's travel curator. Editorial, knowledgeable, direct. Sound like a well-traveled friend who actually went. Short sentences. No filler. Occasionally opinionated. Never use em dashes.`,
        messages: [{ role: 'user', content: prompt }],
        maxTokens: 4096,
      })
      const cleaned = text.trim().replace(/^```(?:json)?\\n?/, '').replace(/\\n?```$/, '')
      const data = JSON.parse(cleaned)
      setItinerary(data)
    } catch (err) {
      setError(`Could not generate itinerary: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.tan, marginBottom: '1rem' }}>Building Itinerary</p>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: '400', color: C.ink, marginBottom: '0.75rem' }}>
          Planning {form.length} in {form.destination}...
        </p>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', fontWeight: '300', color: C.mid }}>
          This takes about 20 seconds.
        </p>
      </div>
    )
  }

  if (itinerary) {
    return <ItineraryView itinerary={itinerary} onReset={() => setItinerary(null)} />
  }

  return (
    <div>
      <SectionHeader label="Itinerary Builder" title="Build a day-by-day itinerary." />
      <form onSubmit={handleSubmit} style={{ maxWidth: '560px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Client name</label><input value={form.name} onChange={set('name')} required style={inp} placeholder="Jane Smith" /></div>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Destination</label><input value={form.destination} onChange={set('destination')} required style={inp} placeholder="Portugal" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Travel dates</label><input value={form.dates} onChange={set('dates')} style={inp} placeholder="May 10-24, 2025" /></div>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Trip length</label><input value={form.length} onChange={set('length')} required style={inp} placeholder="10 days" /></div>
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={lbl}>Pace</label>
          <select value={form.pace} onChange={set('pace')} style={SEL_STYLE}>
            <option value="slow">Slow and deep</option>
            <option value="balanced">Balanced</option>
            <option value="packed">Packed</option>
          </select>
        </div>
        <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Interests</label><input value={form.interests} onChange={set('interests')} style={inp} placeholder="Food, wine, architecture, coastal walks..." /></div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={lbl}>Notes</label>
          <textarea value={form.notes} onChange={set('notes')} rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="No chain hotels, vegetarian options needed, celebrating anniversary..." />
        </div>
        {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#9E6060', marginBottom: '1rem' }}>{error}</p>}
        <button type="submit" style={primaryBtn}>Build Itinerary</button>
      </form>
    </div>
  )
}
"""
PART2 = """\

function ItineraryView({ itinerary, onReset }) {
  const exportPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' })
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()
    const margin = 60
    const cw = pageW - margin * 2
    let y = margin

    const toRgb = hex => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
    const tc = hex => doc.setTextColor(...toRgb(hex))
    const fc = hex => doc.setFillColor(...toRgb(hex))
    const dc = hex => doc.setDrawColor(...toRgb(hex))
    const bg = () => { fc('#F5F0E8'); doc.rect(0, 0, pageW, pageH, 'F') }
    const guard = needed => { if (y + needed > pageH - margin) { doc.addPage(); bg(); y = margin } }

    bg()

    // ── Document header ──
    tc('#9E8660'); doc.setFont('times', 'normal'); doc.setFontSize(9); doc.setCharSpace(4)
    doc.text('DERIVA', margin, y); doc.setCharSpace(0)
    tc('#C8B89A'); doc.setFont('helvetica', 'normal'); doc.setFontSize(8)
    const dateStr = itinerary.dates.toUpperCase()
    doc.text(dateStr, pageW - margin - doc.getTextWidth(dateStr), y)
    y += 20

    tc('#1E1C18'); doc.setFont('times', 'normal'); doc.setFontSize(30)
    doc.text(itinerary.destination, margin, y); y += 10

    tc('#C8B89A'); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setCharSpace(1.5)
    doc.text(`Prepared for ${itinerary.clientName.toUpperCase()}`, margin, y)
    doc.setCharSpace(0); y += 26

    dc('#D8CCBA'); doc.setLineWidth(0.5); doc.line(margin, y, pageW - margin, y); y += 34

    // ── Days ──
    for (const day of itinerary.days) {
      guard(80)

      // Parchment day header block
      fc('#EDE6D8'); dc('#D8CCBA'); doc.setLineWidth(0.3)
      const hdrH = 54
      doc.rect(margin, y, cw, hdrH, 'FD')

      // DAY label
      tc('#9E8660'); doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setCharSpace(2)
      doc.text('DAY', margin + 14, y + 15); doc.setCharSpace(0)

      // Large day number
      tc('#C8B89A'); doc.setFont('times', 'normal'); doc.setFontSize(34)
      doc.text(String(day.dayNumber).padStart(2, '0'), margin + 14, y + hdrH - 10)

      // Title — vertically centered in header
      tc('#1E1C18'); doc.setFont('times', 'normal'); doc.setFontSize(15)
      doc.text(day.title, margin + 72, y + hdrH / 2 + 6)

      // Gold underline beneath title
      dc('#9E8660'); doc.setLineWidth(0.5)
      const titleW = doc.getTextWidth(day.title)
      doc.line(margin + 72, y + hdrH / 2 + 9, margin + 72 + titleW, y + hdrH / 2 + 9)

      y += hdrH + 22

      // ── Morning / Afternoon / Evening — vertical flow ──
      for (const { label, text } of [
        { label: 'Morning', text: day.morning },
        { label: 'Afternoon', text: day.afternoon },
        { label: 'Evening', text: day.evening },
      ]) {
        doc.setFontSize(10)
        const lines = doc.splitTextToSize(text, cw - 18)
        guard(16 + lines.length * 15 + 18)

        // Small label
        tc('#C8B89A'); doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setCharSpace(1.5)
        doc.text(label.toUpperCase(), margin, y); doc.setCharSpace(0); y += 12

        // Gold accent dot
        fc('#9E8660'); doc.circle(margin + 3, y - 3, 2, 'F')

        // Body text, slightly indented
        tc('#3A3630'); doc.setFont('helvetica', 'normal'); doc.setFontSize(10)
        doc.text(lines, margin + 14, y); y += lines.length * 15 + 20
      }

      // ── Logistics box ──
      doc.setFontSize(9.5)
      const logLines = doc.splitTextToSize(day.logisticsNote, cw - 92)
      const boxH = Math.max(logLines.length * 13 + 24, 38)
      guard(boxH + 16)
      fc('#EDE6D8'); dc('#D8CCBA'); doc.setLineWidth(0.3)
      doc.rect(margin, y, cw, boxH, 'FD')
      tc('#9E8660'); doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setCharSpace(1.5)
      doc.text('LOGISTICS', margin + 12, y + 15); doc.setCharSpace(0)
      tc('#3A3630'); doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5)
      doc.text(logLines, margin + 92, y + 15)
      y += boxH + 16

      // ── Deriva tip ──
      doc.setFontSize(10)
      const tipLines = doc.splitTextToSize(day.derivaTip, cw - 20)
      guard(tipLines.length * 15 + 22)
      dc('#9E8660'); doc.setLineWidth(2)
      doc.line(margin, y - 3, margin, y + tipLines.length * 15 + 3)
      tc('#9E8660'); doc.setFont('times', 'italic'); doc.setFontSize(10)
      doc.text(tipLines, margin + 14, y); y += tipLines.length * 15 + 28

      // ── Day rule ──
      guard(28)
      dc('#D8CCBA'); doc.setLineWidth(0.3)
      doc.line(margin, y, pageW - margin, y); y += 32
    }

    doc.save(`Deriva-${itinerary.destination}-${itinerary.clientName.replace(/\\s+/g, '-')}.pdf`)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.25rem' }}>Itinerary</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: '400', color: C.ink, marginBottom: '0.35rem' }}>{itinerary.destination}</h2>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tan }}>
            {itinerary.clientName} &nbsp;\u00b7&nbsp; {itinerary.dates}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
          <button onClick={exportPDF} style={primaryBtn}>Export PDF</button>
          <button onClick={onReset} style={ghostBtn}>New Itinerary</button>
        </div>
      </div>
      {itinerary.days.map(day => <DayCard key={day.dayNumber} day={day} />)}
    </div>
  )
}

function DayCard({ day }) {
  const SECTIONS = [
    { label: 'Morning', text: day.morning },
    { label: 'Afternoon', text: day.afternoon },
    { label: 'Evening', text: day.evening },
  ]

  return (
    <div style={{ marginBottom: '2rem', backgroundColor: C.white, border: `1px solid ${C.sand}`, overflow: 'hidden' }}>

      {/* Parchment day header */}
      <div style={{ backgroundColor: C.parchment, borderBottom: `1px solid ${C.sand}`, padding: '1.5rem 2.5rem 1.25rem' }}>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.6rem' }}>
          Day {day.dayNumber}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.25rem' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '3.5rem', fontWeight: '400', color: C.sand, lineHeight: '1', flexShrink: 0 }}>
            {String(day.dayNumber).padStart(2, '0')}
          </span>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: '400', color: C.ink, letterSpacing: '0.02em', lineHeight: '1.25' }}>
            {day.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '2rem 2.5rem' }}>

        {/* Vertical timeline */}
        <div style={{ position: 'relative', paddingLeft: '6.5rem' }}>
          {/* Connecting line */}
          <div style={{ position: 'absolute', left: '5rem', top: '7px', bottom: '7px', width: '1px', backgroundColor: C.sand }} />

          {SECTIONS.map(({ label, text }, i) => (
            <div key={label} style={{ position: 'relative', marginBottom: i < 2 ? '2.25rem' : 0 }}>
              {/* Left label */}
              <p style={{
                position: 'absolute', left: '-6.5rem', width: '4.5rem', textAlign: 'right', top: '1px',
                fontFamily: 'system-ui, sans-serif', fontSize: '0.55rem', letterSpacing: '0.15em',
                textTransform: 'uppercase', color: C.tan, lineHeight: '1.4',
              }}>{label}</p>
              {/* Hollow gold dot on the line */}
              <div style={{
                position: 'absolute', left: 'calc(-1.5rem)', top: '5px',
                transform: 'translateX(-50%)',
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: C.white, border: `1.5px solid ${C.gold}`,
              }} />
              {/* Text */}
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.8' }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Logistics callout */}
        <div style={{
          marginTop: '2rem',
          padding: '0.875rem 1.25rem',
          backgroundColor: C.parchment,
          borderLeft: `3px solid ${C.sand}`,
          display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
        }}>
          <p style={{
            fontFamily: 'system-ui, sans-serif', fontSize: '0.55rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: C.gold, flexShrink: 0, paddingTop: '3px',
          }}>Logistics</p>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: '300', color: C.mid, lineHeight: '1.65' }}>
            {day.logisticsNote}
          </p>
        </div>

        {/* Deriva tip */}
        <div style={{ marginTop: '1.25rem', paddingLeft: '1.25rem', borderLeft: `2px solid ${C.gold}` }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', fontStyle: 'italic', color: C.gold, lineHeight: '1.65' }}>
            {day.derivaTip}
          </p>
        </div>
      </div>
    </div>
  )
}

const NAV = [
  { id: 'brief', label: 'New Client Brief' },
  { id: 'itinerary', label: 'Itinerary Builder' },
  { id: 'spots', label: 'My Spots' },
  { id: 'research', label: 'Research Tool' },
  { id: 'notes', label: 'Client Notes' },
]

export default function AdvisorDashboard() {
  const navigate = useNavigate()
  const [section, setSection] = useState('brief')

  useEffect(() => {
    if (!sessionStorage.getItem('deriva_advisor')) navigate('/advisor')
  }, [])

  const handleLogout = () => { sessionStorage.removeItem('deriva_advisor'); navigate('/advisor') }

  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh' }}>
      <div style={{ borderBottom: `1px solid ${C.sand}`, padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.cream, position: 'sticky', top: 0, zIndex: 10 }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.ink }}>Deriva Advisor</p>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.tan, textDecoration: 'none' }}>Public Site</Link>
          <button onClick={handleLogout} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.mid, background: 'none', border: 'none', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>
      <div style={{ display: 'flex', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ width: '220px', flexShrink: 0, borderRight: `1px solid ${C.sand}`, padding: '2.5rem 0', minHeight: 'calc(100vh - 60px)', position: 'sticky', top: '60px', alignSelf: 'flex-start' }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)} style={{ display: 'block', width: '100%', textAlign: 'left', fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', letterSpacing: '0.1em', color: section === item.id ? C.ink : C.tan, fontWeight: section === item.id ? '400' : '300', backgroundColor: 'transparent', border: 'none', borderLeft: section === item.id ? `2px solid ${C.gold}` : '2px solid transparent', padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
              {item.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, padding: '2.5rem 3rem', minWidth: 0 }}>
          {section === 'brief' && <ClientBriefTool />}
          {section === 'itinerary' && <ItineraryBuilder />}
          {section === 'spots' && <MySpots />}
          {section === 'research' && <ResearchTool />}
          {section === 'notes' && <ClientNotes />}
        </div>
      </div>
    </div>
  )
}
"""

path = os.path.expanduser('~/deriva/src/advisor/AdvisorDashboard.jsx')
with open(path, 'w') as f:
    f.write(PART1 + PART2)
print(f'Written: {path}')
