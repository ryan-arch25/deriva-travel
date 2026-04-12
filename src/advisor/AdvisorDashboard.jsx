import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import Playbook from './Playbook'
import Clients from './Clients'
import Affiliates from './Affiliates'
import Research from './Research'
import Content from './Content'
import ClientPortals from './ClientPortals'
import * as icelandData from '../data/iceland'
import * as italyData from '../data/italy'
import * as spainData from '../data/spain'
import * as portugalData from '../data/portugal'

const C = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18',
  white: '#FDFAF5', bark: '#2A2520', terracotta: '#B85C45',
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

// ── New Client Brief ─────────────────────────────────────────────────────────

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
        messages: [{ role: 'user', content: `Client: ${form.name}\nDestinations: ${form.destinations}\nTravel dates: ${form.dates}\nTrip length: ${form.length}\nParty: ${form.party}\nBudget: ${form.budget}\nNotes: ${form.notes || 'none'}` }],
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
        <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Client name</label><input value={form.name} onChange={set('name')} required style={inp} placeholder="Jane Smith" /></div>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Destinations</label><input value={form.destinations} onChange={set('destinations')} required style={inp} placeholder="Portugal, Spain" /></div>
        </div>
        <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Travel dates</label><input value={form.dates} onChange={set('dates')} style={inp} placeholder="May 10-24" /></div>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Trip length</label><input value={form.length} onChange={set('length')} style={inp} placeholder="2 weeks" /></div>
        </div>
        <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
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

// ── My Spots ─────────────────────────────────────────────────────────────────

// Build a single list of curated picks from each country's data file at module
// load. Each entry is tagged with its country so the dashboard can filter.
const CURATED_SPOTS = [
  ...icelandData.restaurants.map(s => ({ ...s, country: 'Iceland', source: 'curated' })),
  ...icelandData.stays.map(s => ({ ...s, country: 'Iceland', source: 'curated' })),
  ...italyData.restaurants.map(s => ({ ...s, country: 'Italy', source: 'curated' })),
  ...italyData.stays.map(s => ({ ...s, country: 'Italy', source: 'curated' })),
  ...spainData.restaurants.map(s => ({ ...s, country: 'Spain', source: 'curated' })),
  ...spainData.stays.map(s => ({ ...s, country: 'Spain', source: 'curated' })),
  ...portugalData.restaurants.map(s => ({ ...s, country: 'Portugal', source: 'curated' })),
  ...portugalData.stays.map(s => ({ ...s, country: 'Portugal', source: 'curated' })),
].map((s, i) => ({ ...s, id: s.id ?? `curated_${i}` }))

function MySpots() {
  const [customSpots, setCustomSpots] = useState(() => {
    try { return JSON.parse(localStorage.getItem('deriva_spots') || '[]') } catch { return [] }
  })
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', city: '', neighborhood: '', address: '', category: 'Restaurant', note: '' })
  const [countryFilter, setCountryFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const saveCustom = (updated) => {
    setCustomSpots(updated)
    localStorage.setItem('deriva_spots', JSON.stringify(updated))
  }

  const addSpot = (e) => {
    e.preventDefault()
    saveCustom([...customSpots, { ...form, id: `custom_${Date.now()}`, country: 'Custom', source: 'custom' }])
    setForm({ name: '', city: '', neighborhood: '', address: '', category: 'Restaurant', note: '' })
    setAdding(false)
  }

  // Normalize localStorage entries from older versions that don't have country/source fields
  const normalizedCustom = customSpots.map(s => ({ ...s, country: s.country || 'Custom', source: 'custom' }))

  const allSpots = useMemo(() => [...CURATED_SPOTS, ...normalizedCustom], [customSpots])

  const countries = useMemo(() => {
    const set = new Set(allSpots.map(s => s.country).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [allSpots])

  const categories = useMemo(() => {
    const set = new Set(allSpots.map(s => s.category).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [allSpots])

  const filteredSpots = useMemo(() => {
    return allSpots
      .filter(s => countryFilter === 'All' || s.country === countryFilter)
      .filter(s => categoryFilter === 'All' || s.category === categoryFilter)
      .sort((a, b) => {
        // Group by country, then by category, then by name
        if (a.country !== b.country) return (a.country || '').localeCompare(b.country || '')
        if ((a.category || '') !== (b.category || '')) return (a.category || '').localeCompare(b.category || '')
        return (a.name || '').localeCompare(b.name || '')
      })
  }, [allSpots, countryFilter, categoryFilter])

  const sel = { ...inp, cursor: 'pointer' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <SectionHeader label="My Spots" title={`${filteredSpots.length} of ${allSpots.length} spot${allSpots.length !== 1 ? 's' : ''}`} />
        {!adding && <button onClick={() => setAdding(true)} style={{ ...primaryBtn, marginTop: '1.5rem' }}>Add Custom Spot</button>}
      </div>

      {/* Filters */}
      <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem', maxWidth: '560px', marginBottom: '2rem' }}>
        <div>
          <label style={lbl}>Country</label>
          <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} style={sel}>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Category</label>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={sel}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {adding && (
        <form onSubmit={addSpot} style={{ marginBottom: '2rem', padding: '2rem', border: `1px solid ${C.sand}`, backgroundColor: C.parchment }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: '400', color: C.ink, marginBottom: '1.5rem' }}>New Custom Spot</p>
          <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Name</label><input value={form.name} onChange={set('name')} required style={inp} placeholder="Restaurant or hotel name" /></div>
            <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>City</label><input value={form.city} onChange={set('city')} required style={inp} placeholder="Lisbon" /></div>
          </div>
          <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Neighborhood</label><input value={form.neighborhood} onChange={set('neighborhood')} style={inp} placeholder="Chiado" /></div>
            <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Address</label><input value={form.address} onChange={set('address')} style={inp} placeholder="Rua de..." /></div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={lbl}>Category</label>
            <select value={form.category} onChange={set('category')} style={sel}>
              <option>Restaurant</option><option>Hotel</option><option>Bar</option><option>Café</option><option>Food Hall</option><option>Experience</option><option>Other</option>
            </select>
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

      {filteredSpots.length === 0 && !adding && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: C.mid }}>No spots match these filters.</p>
      )}

      {filteredSpots.map((spot, i) => {
        const prev = filteredSpots[i - 1]
        const showCountryHeader = !prev || prev.country !== spot.country
        return (
          <div key={spot.id}>
            {showCountryHeader && (
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginTop: i === 0 ? 0 : '2rem', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${C.gold}` }}>
                {spot.country}
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', borderBottom: `1px solid ${C.sand}`, padding: '1.25rem 0', alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: '400', color: C.ink }}>{spot.name}</h3>
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tan, border: `1px solid ${C.sand}`, padding: '0.15rem 0.4rem' }}>{spot.category}</span>
                </div>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', color: C.tan, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: spot.address ? '0.2rem' : '0.5rem' }}>
                  {[spot.neighborhood, spot.city].filter(Boolean).join(' · ')}
                </p>
                {spot.address && (
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', fontWeight: '300', color: C.tan, marginBottom: '0.5rem' }}>
                    {spot.address}
                  </p>
                )}
                {spot.note && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', fontWeight: '300', color: C.mid, lineHeight: '1.6' }}>{spot.note}</p>}
              </div>
              {spot.source === 'custom' && (
                <button onClick={() => saveCustom(customSpots.filter(s => s.id !== spot.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tan, padding: '0.25rem', flexShrink: 0 }}>Remove</button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Research Tool ─────────────────────────────────────────────────────────────

function BriefSection({ title, content }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.5rem' }}>{title}</p>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.75', whiteSpace: 'pre-wrap' }}>{content}</p>
    </div>
  )
}

function DestinationBrief({ brief }) {
  const sections = [
    ['Best Time to Visit Right Now', brief.bestTime],
    ["What's Changed Recently", brief.whatsChanged],
    ['Skip These (Overrated)', brief.skip],
    ['Don\'t Miss These (Underrated)', brief.dontMiss],
    ['Must-Book Restaurants', brief.restaurants],
    ['Best Stays by Budget', brief.stays],
    ['Key Logistics', brief.logistics],
  ]
  return (
    <div style={{ maxWidth: '100%', border: `1px solid ${C.sand}`, backgroundColor: C.white, padding: '1.75rem 1.5rem' }}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.4rem' }}>Destination Brief</p>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', fontWeight: '400', color: C.ink, marginBottom: '1.5rem' }}>{brief.destination}</p>
      <div style={{ width: '2.5rem', height: '1px', backgroundColor: C.sand, marginBottom: '1.5rem' }} />
      {sections.map(([title, content]) => content ? <BriefSection key={title} title={title} content={content} /> : null)}
    </div>
  )
}

function ResearchTool() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [briefMode, setBriefMode] = useState(false)
  const [briefDest, setBriefDest] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const generateBrief = async () => {
    const dest = briefDest.trim()
    if (!dest || loading) return
    setBriefMode(false)
    setBriefDest('')
    const userMsg = { role: 'user', content: `Destination brief: ${dest}` }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setLoading(true)
    try {
      const text = await callAI({
        system: `You are a sharp, opinionated travel research assistant for a professional travel advisor. You write destination briefs that cut through the noise. Be specific with names, neighborhoods, and prices. No filler, no clichés, no "something for everyone." Write like a well-connected advisor sharing intel with a peer. Do not use em dashes or double dashes anywhere in your output. Write in complete sentences using commas, periods, and parentheses instead.`,
        messages: [{ role: 'user', content: `Write a destination brief for ${dest}. Return a JSON object with exactly these keys:
{
  "destination": "destination name",
  "bestTime": "2 to 3 sentences on the best time to visit right now and why. Be specific about months and what changes.",
  "whatsChanged": "2 to 3 sentences on what has changed recently, like new openings, closures, neighborhoods shifting, policy changes, anything an advisor should know.",
  "skip": "3 to 5 specific places or experiences that are overrated. Name names. Explain briefly why each is a skip.",
  "dontMiss": "3 to 5 specific underrated spots, neighborhoods, or experiences most advisors don't know about. Be specific.",
  "restaurants": "4 to 6 specific restaurants worth booking. Include neighborhood, price tier, and what to order or why it matters. Current picks only.",
  "stays": "4 to 6 hotel recommendations organized by budget tier (mid-range, upscale, splurge). Include neighborhood and one sentence on why each.",
  "logistics": "3 to 5 practical notes: airport transfers, getting around, tipping, booking lead times, anything that saves the client friction."
}
Return valid JSON only. No markdown. Do not use em dashes or double dashes anywhere in the values.` }],
        maxTokens: 2048,
      })
      const cleaned = text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      const brief = JSON.parse(cleaned)
      setMessages([...updated, { role: 'assistant', content: brief, isBrief: true }])
    } catch (err) {
      setMessages([...updated, { role: 'assistant', content: `Could not generate brief: ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const updated = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setInput('')
    setLoading(true)
    try {
      const text = await callAI({
        system: `You are a research assistant for a professional travel advisor. Answer questions about European destinations, restaurants, hotels, logistics, and trip planning. Be specific and direct. Write for an experienced advisor. No filler, no tourism clichés.`,
        messages: updated.map(m => ({ role: m.role, content: typeof m.content === 'string' ? m.content : `[Destination brief for ${m.content.destination}]` })),
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
            {msg.isBrief ? (
              <DestinationBrief brief={msg.content} />
            ) : (
              <div style={{ maxWidth: '80%', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.75', backgroundColor: msg.role === 'user' ? C.parchment : C.white, border: `1px solid ${C.sand}`, padding: '1rem 1.25rem', whiteSpace: 'pre-wrap' }}>
                {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
              </div>
            )}
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
      {briefMode && (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', padding: '0.75rem 1rem', backgroundColor: C.parchment, border: `1px solid ${C.sand}` }}>
          <input value={briefDest} onChange={e => setBriefDest(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); generateBrief() } if (e.key === 'Escape') setBriefMode(false) }} placeholder="Enter a destination..." autoFocus style={{ ...inp, flex: 1, marginBottom: 0 }} />
          <button onClick={generateBrief} disabled={loading || !briefDest.trim()} style={{ ...primaryBtn, backgroundColor: loading || !briefDest.trim() ? C.tan : C.gold, cursor: loading || !briefDest.trim() ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>Generate</button>
          <button onClick={() => { setBriefMode(false); setBriefDest('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tan }}>Cancel</button>
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.75rem', borderTop: `1px solid ${C.sand}`, paddingTop: '1rem', flexShrink: 0 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {!briefMode && (
            <button onClick={() => setBriefMode(true)} disabled={loading} style={{ alignSelf: 'flex-start', fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: loading ? C.tan : C.gold, background: 'none', border: `1px solid ${loading ? C.sand : C.gold}`, padding: '0.4rem 0.85rem', cursor: loading ? 'not-allowed' : 'pointer' }}>Destination Brief</button>
          )}
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} rows={2} placeholder="Ask about a destination, neighborhood, restaurant... (Enter to send)" style={{ ...inp, flex: 1, resize: 'none', marginBottom: 0 }} />
        </div>
        <button onClick={send} disabled={loading || !input.trim()} style={{ ...primaryBtn, alignSelf: 'flex-end', backgroundColor: loading || !input.trim() ? C.tan : C.gold, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>Send</button>
      </div>
    </div>
  )
}

// ── Client Notes ──────────────────────────────────────────────────────────────

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
      <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: clients.length > 0 ? '200px 1fr' : '1fr', gap: '2rem' }}>
        {clients.length > 0 && (
          <div style={{ borderRight: `1px solid ${C.sand}`, paddingRight: '1.5rem' }}>
            {clients.map(c => (
              <button key={c.id} onClick={() => setActiveId(c.id)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.75rem 1rem', borderBottom: `1px solid ${C.sand}`, backgroundColor: activeId === c.id ? C.parchment : 'transparent', border: 'none', borderBottom: `1px solid ${C.sand}`, cursor: 'pointer' }}>
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

// ── Itinerary Builder ────────────────────────────────────────────────────────

const SEL_STYLE = {
  ...inp,
  cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239E8660' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 1rem center',
  paddingRight: '2.5rem',
}


// ── Itinerary Builder ─────────────────────────────────────────────────────────

const ITIN_ITEM_TYPES = [
  { value: 'meal', label: 'Meal' },
  { value: 'activity', label: 'Activity' },
  { value: 'transport', label: 'Transport' },
  { value: 'note', label: 'Note' },
]

const makeId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

async function itinFetch(method, body, idParam) {
  const query = idParam ? `?id=${encodeURIComponent(idParam)}` : ''
  const opts = {
    method,
    headers: { 'x-advisor-auth': 'deriva2024' },
  }
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  const res = await fetch(`/api/itineraries${query}`, opts)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `${res.status}`)
  return data
}

function ItineraryBuilder() {
  const [mode, setMode] = useState('list') // list | edit | preview
  const [itineraries, setItineraries] = useState([])
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error
  const saveTimer = useRef(null)
  const latestDataRef = useRef(null)

  const loadList = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await itinFetch('GET')
      setItineraries(data.itineraries || [])
    } catch (err) {
      setError('Could not load itineraries. Check that /api/itineraries is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadList() }, [])

  const openItinerary = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const data = await itinFetch('GET', undefined, id)
      setActive(data.itinerary)
      latestDataRef.current = data.itinerary
      setMode('edit')
    } catch (err) {
      setError('Could not load that itinerary.')
    } finally {
      setLoading(false)
    }
  }

  const createNew = async () => {
    setError(null)
    try {
      const data = await itinFetch('POST', { clientName: 'Untitled Itinerary' })
      setActive(data.itinerary)
      latestDataRef.current = data.itinerary
      setMode('edit')
      loadList()
    } catch (err) {
      setError('Could not create itinerary.')
    }
  }

  const removeItinerary = async (id) => {
    if (!confirm('Delete this itinerary? This cannot be undone.')) return
    try {
      await itinFetch('DELETE', undefined, id)
      loadList()
    } catch (err) {
      setError('Could not delete itinerary.')
    }
  }

  const updateActive = (updater) => {
    setActive(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      latestDataRef.current = next
      return next
    })
    setSaveState('saving')
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const toSave = latestDataRef.current
      if (!toSave?.id) return
      try {
        const { id, createdAt, updatedAt, ...fields } = toSave
        await itinFetch('PATCH', { id, ...fields })
        setSaveState('saved')
        loadList()
      } catch {
        setSaveState('error')
      }
    }, 1200)
  }

  const saveNow = async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    const toSave = latestDataRef.current
    if (!toSave?.id) return
    setSaveState('saving')
    try {
      const { id, createdAt, updatedAt, ...fields } = toSave
      await itinFetch('PATCH', { id, ...fields })
      setSaveState('saved')
      loadList()
    } catch {
      setSaveState('error')
    }
  }

  const backToList = async () => {
    await saveNow()
    setActive(null)
    setMode('list')
  }

  if (mode === 'list') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <SectionHeader label="Itinerary Builder" title={loading ? 'Loading…' : `${itineraries.length} itinerar${itineraries.length === 1 ? 'y' : 'ies'}`} />
          <button onClick={createNew} style={{ ...primaryBtn, marginTop: '1.5rem' }}>New Itinerary</button>
        </div>
        {error && <div style={{ padding: '1rem', border: `1px solid ${C.tan}`, marginBottom: '1.5rem', fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.charcoal }}>{error}</div>}
        {!loading && itineraries.length === 0 && !error && (
          <div style={{ padding: '2rem', border: `1px dashed ${C.sand}`, fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: C.mid }}>
            No itineraries yet. Click New Itinerary to start one.
          </div>
        )}
        {itineraries.map(it => (
          <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', borderBottom: `1px solid ${C.sand}`, padding: '1.25rem 0', alignItems: 'center' }}>
            <button onClick={() => openItinerary(it.id)} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: C.ink, marginBottom: '0.25rem' }}>{it.clientName || 'Untitled'}</p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: C.tan, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {[it.destination, it.dates, it.dayCount ? `${it.dayCount} day${it.dayCount !== 1 ? 's' : ''}` : null].filter(Boolean).join(' · ') || 'No details yet'}
              </p>
            </button>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', color: C.tan }}>{it.updatedAt ? new Date(it.updatedAt).toLocaleDateString() : ''}</span>
            <button onClick={() => removeItinerary(it.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tan, padding: '0.25rem' }}>Delete</button>
          </div>
        ))}
      </div>
    )
  }

  if (!active) return null

  const saveLabel = { idle: '', saving: 'Saving…', saved: 'Saved', error: 'Save failed' }[saveState]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <button onClick={backToList} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.tan, padding: 0, marginBottom: '0.75rem' }}>← All Itineraries</button>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: '400', color: C.ink, marginBottom: '0.25rem' }}>{active.clientName || 'Untitled Itinerary'}</p>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: C.tan, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {[active.destination, active.dates].filter(Boolean).join(' · ') || 'No destination yet'}
            {saveLabel && <span style={{ marginLeft: '1rem', color: saveState === 'error' ? C.terracotta : C.tan }}>· {saveLabel}</span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setMode('edit')} style={mode === 'edit' ? primaryBtn : ghostBtn}>Edit</button>
          <button onClick={() => setMode('preview')} style={mode === 'preview' ? primaryBtn : ghostBtn}>Preview</button>
        </div>
      </div>

      {mode === 'edit' && <ItineraryEdit itinerary={active} onChange={updateActive} />}
      {mode === 'preview' && <ItineraryPreview itinerary={active} />}
    </div>
  )
}

function ItineraryEdit({ itinerary, onChange }) {
  const patch = (fields) => onChange(prev => ({ ...prev, ...fields }))

  const addHotel = () => onChange(prev => ({
    ...prev,
    hotels: [...(prev.hotels || []), { id: makeId('hotel'), name: '', city: '', checkIn: '', checkOut: '', confirmation: '', link: '' }],
  }))
  const updateHotel = (id, fields) => onChange(prev => ({
    ...prev,
    hotels: (prev.hotels || []).map(h => h.id === id ? { ...h, ...fields } : h),
  }))
  const removeHotel = (id) => onChange(prev => ({ ...prev, hotels: (prev.hotels || []).filter(h => h.id !== id) }))

  const addFlight = () => onChange(prev => ({
    ...prev,
    flights: [...(prev.flights || []), { id: makeId('flight'), airline: '', flightNumber: '', from: '', to: '', departDate: '', departTime: '', arriveDate: '', arriveTime: '', confirmation: '' }],
  }))
  const updateFlight = (id, fields) => onChange(prev => ({
    ...prev,
    flights: (prev.flights || []).map(f => f.id === id ? { ...f, ...fields } : f),
  }))
  const removeFlight = (id) => onChange(prev => ({ ...prev, flights: (prev.flights || []).filter(f => f.id !== id) }))

  const addDay = () => onChange(prev => ({
    ...prev,
    days: [...(prev.days || []), { id: makeId('day'), date: '', city: '', title: '', items: [] }],
  }))
  const updateDay = (id, fields) => onChange(prev => ({
    ...prev,
    days: (prev.days || []).map(d => d.id === id ? { ...d, ...fields } : d),
  }))
  const removeDay = (id) => onChange(prev => ({ ...prev, days: (prev.days || []).filter(d => d.id !== id) }))
  const moveDay = (id, dir) => onChange(prev => {
    const days = [...(prev.days || [])]
    const i = days.findIndex(d => d.id === id)
    if (i === -1) return prev
    const j = i + dir
    if (j < 0 || j >= days.length) return prev
    ;[days[i], days[j]] = [days[j], days[i]]
    return { ...prev, days }
  })

  const addItem = (dayId) => {
    const day = (itinerary.days || []).find(d => d.id === dayId)
    if (!day) return
    updateDay(dayId, {
      items: [...(day.items || []), { id: makeId('item'), time: '', type: 'activity', label: '', link: '' }],
    })
  }
  const updateItem = (dayId, itemId, fields) => {
    const day = (itinerary.days || []).find(d => d.id === dayId)
    if (!day) return
    updateDay(dayId, { items: (day.items || []).map(it => it.id === itemId ? { ...it, ...fields } : it) })
  }
  const removeItem = (dayId, itemId) => {
    const day = (itinerary.days || []).find(d => d.id === dayId)
    if (!day) return
    updateDay(dayId, { items: (day.items || []).filter(it => it.id !== itemId) })
  }
  const moveItem = (dayId, itemId, dir) => {
    const day = (itinerary.days || []).find(d => d.id === dayId)
    if (!day) return
    const items = [...(day.items || [])]
    const i = items.findIndex(it => it.id === itemId)
    if (i === -1) return
    const j = i + dir
    if (j < 0 || j >= items.length) return
    ;[items[i], items[j]] = [items[j], items[i]]
    updateDay(dayId, { items })
  }

  const addDocument = () => onChange(prev => ({
    ...prev,
    documents: [...(prev.documents || []), { id: makeId('doc'), label: '', url: '' }],
  }))
  const updateDocument = (id, fields) => onChange(prev => ({
    ...prev,
    documents: (prev.documents || []).map(d => d.id === id ? { ...d, ...fields } : d),
  }))
  const removeDocument = (id) => onChange(prev => ({ ...prev, documents: (prev.documents || []).filter(d => d.id !== id) }))

  const sel = { ...inp, cursor: 'pointer' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Trip Details */}
      <section>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${C.sand}` }}>Trip Details</p>
        <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Client name</label><input value={itinerary.clientName || ''} onChange={e => patch({ clientName: e.target.value })} style={inp} placeholder="Jane Smith" /></div>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Destination(s)</label><input value={itinerary.destination || ''} onChange={e => patch({ destination: e.target.value })} style={inp} placeholder="Italy" /></div>
        </div>
        <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Travel dates</label><input value={itinerary.dates || ''} onChange={e => patch({ dates: e.target.value })} style={inp} placeholder="June 12-22, 2026" /></div>
          <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Travelers</label><input value={itinerary.travelers || ''} onChange={e => patch({ travelers: e.target.value })} style={inp} placeholder="2" /></div>
        </div>
        <label style={lbl}>Internal notes</label>
        <textarea value={itinerary.notes || ''} onChange={e => patch({ notes: e.target.value })} rows={3} style={{ ...inp, resize: 'vertical', fontFamily: 'system-ui, sans-serif' }} placeholder="Private notes about this client or trip. Not shown in the preview." />
      </section>

      {/* Hotels */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${C.sand}` }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold }}>Hotels</p>
          <button type="button" onClick={addHotel} style={ghostBtn}>Add Hotel</button>
        </div>
        {(itinerary.hotels || []).length === 0 && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.mid }}>No hotels yet.</p>}
        {(itinerary.hotels || []).map(h => (
          <div key={h.id} style={{ padding: '1.5rem', border: `1px solid ${C.sand}`, backgroundColor: C.white, marginBottom: '1rem' }}>
            <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0 1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>Hotel name</label><input value={h.name} onChange={e => updateHotel(h.id, { name: e.target.value })} style={inp} /></div>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>City</label><input value={h.city} onChange={e => updateHotel(h.id, { city: e.target.value })} style={inp} /></div>
            </div>
            <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>Check-in</label><input type="date" value={h.checkIn} onChange={e => updateHotel(h.id, { checkIn: e.target.value })} style={inp} /></div>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>Check-out</label><input type="date" value={h.checkOut} onChange={e => updateHotel(h.id, { checkOut: e.target.value })} style={inp} /></div>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>Confirmation #</label><input value={h.confirmation} onChange={e => updateHotel(h.id, { confirmation: e.target.value })} style={inp} /></div>
            </div>
            <div style={{ marginBottom: '1rem' }}><label style={lbl}>Booking link (optional)</label><input value={h.link} onChange={e => updateHotel(h.id, { link: e.target.value })} style={inp} placeholder="https://…" /></div>
            <button type="button" onClick={() => removeHotel(h.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tan, padding: 0 }}>Remove</button>
          </div>
        ))}
      </section>

      {/* Flights */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${C.sand}` }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold }}>Flights</p>
          <button type="button" onClick={addFlight} style={ghostBtn}>Add Flight</button>
        </div>
        {(itinerary.flights || []).length === 0 && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.mid }}>No flights yet.</p>}
        {(itinerary.flights || []).map(f => (
          <div key={f.id} style={{ padding: '1.5rem', border: `1px solid ${C.sand}`, backgroundColor: C.white, marginBottom: '1rem' }}>
            <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0 1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>Airline</label><input value={f.airline} onChange={e => updateFlight(f.id, { airline: e.target.value })} style={inp} /></div>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>Flight #</label><input value={f.flightNumber} onChange={e => updateFlight(f.id, { flightNumber: e.target.value })} style={inp} placeholder="AA 100" /></div>
            </div>
            <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>From</label><input value={f.from} onChange={e => updateFlight(f.id, { from: e.target.value })} style={inp} placeholder="JFK" /></div>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>To</label><input value={f.to} onChange={e => updateFlight(f.id, { to: e.target.value })} style={inp} placeholder="FCO" /></div>
            </div>
            <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0 1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>Depart date</label><input type="date" value={f.departDate} onChange={e => updateFlight(f.id, { departDate: e.target.value })} style={inp} /></div>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>Depart time</label><input type="time" value={f.departTime} onChange={e => updateFlight(f.id, { departTime: e.target.value })} style={inp} /></div>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>Arrive date</label><input type="date" value={f.arriveDate} onChange={e => updateFlight(f.id, { arriveDate: e.target.value })} style={inp} /></div>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>Arrive time</label><input type="time" value={f.arriveTime} onChange={e => updateFlight(f.id, { arriveTime: e.target.value })} style={inp} /></div>
            </div>
            <div style={{ marginBottom: '1rem' }}><label style={lbl}>Confirmation #</label><input value={f.confirmation} onChange={e => updateFlight(f.id, { confirmation: e.target.value })} style={inp} /></div>
            <button type="button" onClick={() => removeFlight(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tan, padding: 0 }}>Remove</button>
          </div>
        ))}
      </section>

      {/* Day by Day */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${C.sand}` }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold }}>Day by Day</p>
          <button type="button" onClick={addDay} style={ghostBtn}>Add Day</button>
        </div>
        {(itinerary.days || []).length === 0 && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.mid }}>No days yet.</p>}
        {(itinerary.days || []).map((d, i) => (
          <div key={d.id} style={{ padding: '1.5rem', border: `1px solid ${C.sand}`, backgroundColor: C.white, marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: C.ink }}>Day {i + 1}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" disabled={i === 0} onClick={() => moveDay(d.id, -1)} style={{ ...ghostBtn, padding: '0.4rem 0.75rem', opacity: i === 0 ? 0.3 : 1 }}>↑</button>
                <button type="button" disabled={i === (itinerary.days || []).length - 1} onClick={() => moveDay(d.id, 1)} style={{ ...ghostBtn, padding: '0.4rem 0.75rem', opacity: i === (itinerary.days || []).length - 1 ? 0.3 : 1 }}>↓</button>
                <button type="button" onClick={() => removeDay(d.id)} style={{ ...ghostBtn, padding: '0.4rem 0.75rem' }}>Delete</button>
              </div>
            </div>
            <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '0 1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>Date</label><input type="date" value={d.date} onChange={e => updateDay(d.id, { date: e.target.value })} style={inp} /></div>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>City</label><input value={d.city} onChange={e => updateDay(d.id, { city: e.target.value })} style={inp} placeholder="Florence" /></div>
              <div style={{ marginBottom: '1rem' }}><label style={lbl}>Title / theme</label><input value={d.title} onChange={e => updateDay(d.id, { title: e.target.value })} style={inp} placeholder="Arrival in Florence" /></div>
            </div>

            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.5rem' }}>Items</p>
            {(d.items || []).map((it, j) => (
              <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '90px 130px 1fr auto', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input value={it.time} onChange={e => updateItem(d.id, it.id, { time: e.target.value })} placeholder="9:00" style={{ ...inp, padding: '0.5rem 0.6rem', fontSize: '0.85rem' }} />
                <select value={it.type} onChange={e => updateItem(d.id, it.id, { type: e.target.value })} style={{ ...sel, padding: '0.5rem 0.6rem', fontSize: '0.85rem' }}>
                  {ITIN_ITEM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                  <input value={it.label} onChange={e => updateItem(d.id, it.id, { label: e.target.value })} placeholder="Lunch at Trattoria Cammillo" style={{ ...inp, padding: '0.5rem 0.6rem', fontSize: '0.85rem' }} />
                  <input value={it.link} onChange={e => updateItem(d.id, it.id, { link: e.target.value })} placeholder="Link (optional)" style={{ ...inp, padding: '0.5rem 0.6rem', fontSize: '0.85rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button type="button" disabled={j === 0} onClick={() => moveItem(d.id, it.id, -1)} style={{ ...ghostBtn, padding: '0.35rem 0.5rem', opacity: j === 0 ? 0.3 : 1 }}>↑</button>
                  <button type="button" disabled={j === (d.items || []).length - 1} onClick={() => moveItem(d.id, it.id, 1)} style={{ ...ghostBtn, padding: '0.35rem 0.5rem', opacity: j === (d.items || []).length - 1 ? 0.3 : 1 }}>↓</button>
                  <button type="button" onClick={() => removeItem(d.id, it.id)} style={{ ...ghostBtn, padding: '0.35rem 0.6rem' }}>×</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addItem(d.id)} style={{ ...ghostBtn, marginTop: '0.5rem' }}>Add Item</button>
          </div>
        ))}
      </section>

      {/* Documents */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${C.sand}` }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold }}>Documents</p>
          <button type="button" onClick={addDocument} style={ghostBtn}>Add Document</button>
        </div>
        {(itinerary.documents || []).length === 0 && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.mid }}>No documents yet.</p>}
        {(itinerary.documents || []).map(doc => (
          <div key={doc.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <input value={doc.label} onChange={e => updateDocument(doc.id, { label: e.target.value })} placeholder="Villa contract" style={inp} />
            <input value={doc.url} onChange={e => updateDocument(doc.id, { url: e.target.value })} placeholder="https://…" style={inp} />
            <button type="button" onClick={() => removeDocument(doc.id)} style={ghostBtn}>Remove</button>
          </div>
        ))}
      </section>
    </div>
  )
}

function ItineraryPreview({ itinerary }) {
  const html = useMemo(() => renderItineraryHtml(itinerary), [itinerary])

  const downloadHtml = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const safeName = (itinerary.clientName || 'itinerary').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
    a.href = url
    a.download = `${safeName}-itinerary.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button onClick={downloadHtml} style={primaryBtn}>Export as HTML</button>
      </div>
      <div style={{ border: `1px solid ${C.sand}`, overflow: 'hidden' }}>
        <iframe
          title="Itinerary preview"
          srcDoc={html}
          style={{ width: '100%', height: 'calc(100vh - 240px)', minHeight: '600px', border: 'none', backgroundColor: C.cream }}
        />
      </div>
    </div>
  )
}

// ── Itinerary HTML render ─────────────────────────────────────────────────────

const escapeHtml = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const safeUrl = (u = '') => {
  if (!u) return ''
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u
  return `https://${u}`
}

const formatIsoDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d)) return iso
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function renderItineraryHtml(it) {
  const title = escapeHtml(it.clientName || 'Deriva Itinerary')
  const destination = escapeHtml(it.destination || '')
  const dates = escapeHtml(it.dates || '')
  const travelers = escapeHtml(it.travelers || '')

  const metaParts = []
  if (destination) metaParts.push(destination)
  if (dates) metaParts.push(dates)
  if (travelers) metaParts.push(`${travelers} Traveler${travelers === '1' ? '' : 's'}`)
  const metaLine = metaParts.join(' &nbsp;·&nbsp; ')

  const sectionHeader = (label, name = '') => `
    <div class="section-header">
      <span class="tag">${escapeHtml(label)}</span>
      ${name ? `<h2 class="section-name">${escapeHtml(name)}</h2>` : ''}
      <span class="rule"></span>
    </div>
  `

  const flightsHtml = (it.flights || []).length === 0 ? '' : `
    <section class="block">
      ${sectionHeader('Flights')}
      ${(it.flights || []).map(f => `
        <div class="card">
          <div class="card-header-row">
            <div>
              <p class="card-title">${escapeHtml(f.airline || 'Flight')}${f.flightNumber ? ' ' + escapeHtml(f.flightNumber) : ''}</p>
              <p class="card-route">${escapeHtml(f.from || '')}${f.to ? ' &nbsp;→&nbsp; ' + escapeHtml(f.to) : ''}</p>
            </div>
            ${f.confirmation ? `<div class="confirmation"><span class="conf-label">Confirmation</span><span class="conf-value">${escapeHtml(f.confirmation)}</span></div>` : ''}
          </div>
          <div class="card-body">
            <div class="card-grid">
              ${f.departDate ? `<div><span class="meta-label">Depart</span><span class="meta-value">${escapeHtml(formatIsoDate(f.departDate))}${f.departTime ? ' · ' + escapeHtml(f.departTime) : ''}</span></div>` : ''}
              ${f.arriveDate ? `<div><span class="meta-label">Arrive</span><span class="meta-value">${escapeHtml(formatIsoDate(f.arriveDate))}${f.arriveTime ? ' · ' + escapeHtml(f.arriveTime) : ''}</span></div>` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </section>
  `

  const hotelsHtml = (it.hotels || []).length === 0 ? '' : `
    <section class="block">
      ${sectionHeader('Hotels')}
      ${(it.hotels || []).map(h => `
        <div class="card">
          <div class="card-header-row">
            <div>
              <p class="card-title">${escapeHtml(h.name || 'Hotel')}</p>
              <p class="card-route">${escapeHtml(h.city || '')}</p>
            </div>
            ${h.confirmation ? `<div class="confirmation"><span class="conf-label">Confirmation</span><span class="conf-value">${escapeHtml(h.confirmation)}</span></div>` : ''}
          </div>
          <div class="card-body">
            <div class="card-grid">
              ${h.checkIn ? `<div><span class="meta-label">Check-in</span><span class="meta-value">${escapeHtml(formatIsoDate(h.checkIn))}</span></div>` : ''}
              ${h.checkOut ? `<div><span class="meta-label">Check-out</span><span class="meta-value">${escapeHtml(formatIsoDate(h.checkOut))}</span></div>` : ''}
            </div>
            ${h.link ? `<p class="booking-link-wrap"><a class="booking-link" href="${escapeHtml(safeUrl(h.link))}" target="_blank" rel="noopener">View Booking →</a></p>` : ''}
          </div>
        </div>
      `).join('')}
    </section>
  `

  // Group consecutive days with the same city into city groups so each city
  // in a multi-city itinerary gets its own terracotta city header.
  const groups = []
  for (const day of (it.days || [])) {
    const city = day.city || ''
    if (!groups.length || groups[groups.length - 1].city !== city) {
      groups.push({ city, days: [] })
    }
    groups[groups.length - 1].days.push(day)
  }

  const renderItem = (item) => {
    const typeClass = {
      meal: 'item item-meal',
      activity: 'item item-activity',
      transport: 'item item-transport',
      note: 'item item-note',
    }[item.type] || 'item item-activity'
    const labelHtml = item.link
      ? `<a class="item-link" href="${escapeHtml(safeUrl(item.link))}" target="_blank" rel="noopener">${escapeHtml(item.label || '')}</a>`
      : escapeHtml(item.label || '')
    return `
      <div class="${typeClass}">
        <div class="item-time">${escapeHtml(item.time || '')}</div>
        <div class="item-body">
          <p class="item-type">${escapeHtml(item.type || 'activity')}</p>
          <p class="item-label">${labelHtml}</p>
        </div>
      </div>
    `
  }

  let dayIndex = 0
  const daysHtml = (it.days || []).length === 0 ? '' : `
    <section class="block">
      ${sectionHeader('Day by Day')}
      ${groups.map(group => {
        const cityHeader = group.city ? `
          <div class="city-header">
            <span class="tag">City</span>
            <h3 class="city-name">${escapeHtml(group.city)}</h3>
            <span class="rule"></span>
          </div>
        ` : ''
        const dayCards = group.days.map(d => {
          dayIndex += 1
          const num = String(dayIndex).padStart(2, '0')
          return `
            <div class="day-card">
              <div class="day-header">
                <div class="day-number">${num}</div>
                <div class="day-title">
                  ${d.date ? `<p class="day-date">${escapeHtml(formatIsoDate(d.date))}</p>` : ''}
                  ${d.title ? `<h3 class="day-theme">${escapeHtml(d.title)}</h3>` : ''}
                </div>
              </div>
              ${(d.items || []).length === 0 ? '' : `
                <div class="day-body">
                  ${(d.items || []).map(renderItem).join('')}
                </div>
              `}
            </div>
          `
        }).join('')
        return cityHeader + dayCards
      }).join('')}
    </section>
  `

  const documentsHtml = (it.documents || []).length === 0 ? '' : `
    <section class="block">
      ${sectionHeader('Documents')}
      <ul class="doc-list">
        ${(it.documents || []).map(d => `
          <li><a class="booking-link" href="${escapeHtml(safeUrl(d.url))}" target="_blank" rel="noopener">${escapeHtml(d.label || d.url || 'Document')} →</a></li>
        `).join('')}
      </ul>
    </section>
  `

  return `<!DOCTYPE html>
<!-- Deriva itinerary template v2 · dark hero + terracotta accents -->
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title} · Deriva Itinerary</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
<style>
  :root {
    --ink: #1e1a16;
    --cream: #f5f0e8;
    --white: #fdfaf5;
    --parchment: #ede5d0;
    --sand: #d8ccba;
    --tan: #c8b89a;
    --stone: #a89a82;
    --gold: #9e8660;
    --terracotta: #c0614a;
    --body: #3a3630;
    --muted: #7a6e62;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: var(--cream); }
  body {
    font-family: 'Jost', -apple-system, system-ui, sans-serif;
    color: var(--body);
    line-height: 1.65;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
  }
  a { color: inherit; text-decoration: none; }

  /* Hero */
  .hero {
    background: var(--ink);
    color: var(--cream);
    padding: 88px 48px 56px;
    text-align: center;
  }
  .hero-wordmark {
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 48px;
  }
  .hero-eyebrow {
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--tan);
    margin-bottom: 24px;
  }
  .hero h1 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    font-weight: 500;
    font-size: clamp(44px, 7vw, 82px);
    line-height: 1.05;
    color: var(--cream);
    margin-bottom: 28px;
  }
  .hero-meta {
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 40px;
  }
  .hero-divider {
    display: block;
    width: 48px;
    height: 1px;
    background: var(--gold);
    margin: 0 auto;
  }

  /* Contact strip */
  .contact-strip {
    background: var(--terracotta);
    color: var(--cream);
    text-align: center;
    padding: 16px 24px;
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
  }
  .contact-strip a {
    color: var(--cream);
    border-bottom: 1px solid rgba(245, 240, 232, 0.4);
    padding-bottom: 2px;
  }

  /* Page */
  .page { max-width: 820px; margin: 0 auto; padding: 72px 48px 32px; }
  .block { margin-bottom: 64px; }

  /* Section + city headers */
  .section-header, .city-header {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 28px;
  }
  .city-header { margin-top: 36px; margin-bottom: 20px; }

  .tag {
    display: inline-block;
    background: var(--terracotta);
    color: var(--cream);
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    padding: 6px 14px;
    flex-shrink: 0;
  }

  .section-header .rule,
  .city-header .rule {
    flex: 1;
    height: 1px;
    background: var(--sand);
  }

  .section-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 34px;
    font-weight: 500;
    color: var(--ink);
    line-height: 1;
    flex-shrink: 0;
  }
  .city-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 38px;
    font-weight: 500;
    color: var(--ink);
    line-height: 1;
    flex-shrink: 0;
  }

  /* Hotel + flight cards */
  .card {
    background: var(--white);
    border: 1px solid var(--sand);
    margin-bottom: 18px;
    overflow: hidden;
  }
  .card-header-row {
    background: var(--parchment);
    padding: 20px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    border-bottom: 1px solid var(--sand);
  }
  .card-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 24px;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.2;
    margin-bottom: 4px;
  }
  .card-route {
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .confirmation {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    text-align: right;
    flex-shrink: 0;
  }
  .conf-label {
    font-family: 'Jost', sans-serif;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .conf-value {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 18px;
    font-weight: 500;
    color: var(--gold);
    letter-spacing: 0.05em;
  }

  .card-body { padding: 22px 28px; }
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px 32px;
  }
  .card-grid > div { display: flex; flex-direction: column; gap: 4px; }
  .meta-label {
    font-family: 'Jost', sans-serif;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .meta-value {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 17px;
    color: var(--ink);
  }

  .booking-link-wrap { margin-top: 18px; }
  .booking-link {
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--terracotta);
    border-bottom: 1px solid var(--terracotta);
    padding-bottom: 2px;
  }

  /* Day cards */
  .day-card {
    background: var(--white);
    border: 1px solid var(--sand);
    margin-bottom: 22px;
    overflow: hidden;
  }
  .day-header {
    background: var(--parchment);
    padding: 24px 32px;
    display: flex;
    align-items: center;
    gap: 28px;
    border-bottom: 1px solid var(--sand);
  }
  .day-number {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 68px;
    font-weight: 500;
    color: var(--stone);
    line-height: 0.9;
    letter-spacing: -0.02em;
    flex-shrink: 0;
    min-width: 90px;
  }
  .day-title { flex: 1; }
  .day-date {
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--terracotta);
    margin-bottom: 6px;
  }
  .day-theme {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 28px;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.15;
  }

  .day-body {
    padding: 24px 32px 28px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Items */
  .item {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 20px;
    padding: 16px 20px;
    border-left: 3px solid var(--sand);
    background: var(--cream);
  }
  .item-time {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 18px;
    font-weight: 500;
    color: var(--gold);
    padding-top: 2px;
  }
  .item-type {
    font-family: 'Jost', sans-serif;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4px;
  }
  .item-label {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 19px;
    color: var(--ink);
    line-height: 1.4;
  }
  .item-link {
    color: var(--ink);
    border-bottom: 1px solid var(--terracotta);
    padding-bottom: 1px;
  }

  .item-meal {
    border-left-color: var(--gold);
    background: #faf4e6;
  }
  .item-meal .item-type { color: var(--gold); }

  .item-transport {
    background: transparent;
    border-left-color: var(--tan);
  }
  .item-transport .item-label {
    font-style: italic;
    color: var(--muted);
  }

  .item-note {
    background: transparent;
    border-left-color: var(--terracotta);
  }
  .item-note .item-type { color: var(--terracotta); }
  .item-note .item-label {
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: var(--muted);
    line-height: 1.7;
  }

  /* Documents */
  .doc-list { list-style: none; }
  .doc-list li {
    padding: 18px 0;
    border-bottom: 1px solid var(--sand);
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 20px;
  }
  .doc-list li:last-child { border-bottom: none; }

  /* Footer */
  .footer {
    background: var(--ink);
    color: var(--cream);
    text-align: center;
    padding: 56px 32px 48px;
    margin-top: 48px;
  }
  .footer-wordmark {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--cream);
    margin-bottom: 16px;
  }
  .footer-contact {
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
  }
  .footer-contact a {
    color: var(--gold);
    border-bottom: 1px solid rgba(158, 134, 96, 0.5);
    padding-bottom: 2px;
  }

  @media (max-width: 640px) {
    .page { padding: 48px 24px 24px; }
    .hero { padding: 64px 24px 40px; }
    .day-header { flex-direction: column; align-items: flex-start; gap: 8px; padding: 20px 24px; }
    .day-number { font-size: 48px; min-width: 0; }
    .day-body { padding: 20px 24px 24px; }
    .card-header-row { flex-direction: column; align-items: flex-start; gap: 12px; }
    .confirmation { align-items: flex-start; text-align: left; }
    .section-name, .city-name { font-size: 26px; }
    .item { grid-template-columns: 60px 1fr; gap: 14px; padding: 14px 16px; }
  }
</style>
</head>
<body>

<header class="hero">
  <p class="hero-wordmark">Deriva</p>
  <p class="hero-eyebrow">Itinerary</p>
  <h1>${title}</h1>
  ${metaLine ? `<p class="hero-meta">${metaLine}</p>` : ''}
  <span class="hero-divider"></span>
</header>

<div class="contact-strip">
  <a href="mailto:hello@deriva.travel">hello@deriva.travel</a>
</div>

<main class="page">
  ${flightsHtml}
  ${hotelsHtml}
  ${daysHtml}
  ${documentsHtml}
</main>

<footer class="footer">
  <p class="footer-wordmark">Deriva</p>
  <p class="footer-contact">
    <a href="mailto:hello@deriva.travel">hello@deriva.travel</a>
  </p>
</footer>

</body>
</html>`
}

// ── Leads Dashboard ───────────────────────────────────────────────────────────

const ADVISOR_TOKEN = 'deriva2024'
const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
]
const STATUS_STYLES = {
  new: { background: C.gold, color: C.white, border: C.gold },
  contacted: { background: C.parchment, color: C.charcoal, border: C.sand },
  in_progress: { background: C.sand, color: C.ink, border: C.tan },
  closed: { background: 'transparent', color: C.tan, border: C.sand },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.new
  const label = STATUS_OPTIONS.find(o => o.value === status)?.label || 'New'
  return (
    <span style={{
      display: 'inline-block', fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem',
      letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.3rem 0.65rem',
      backgroundColor: s.background, color: s.color, border: `1px solid ${s.border}`,
    }}>{label}</span>
  )
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function LeadDetailPanel({ lead, onClose, onUpdate }) {
  const [status, setStatus] = useState(lead.status)
  const [notes, setNotes] = useState(lead.notes || '')
  const [savingStatus, setSavingStatus] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)
  const notesTimer = useRef(null)

  // Reset local state when a different lead is selected
  useEffect(() => {
    setStatus(lead.status)
    setNotes(lead.notes || '')
  }, [lead.id])

  const persist = async (patch) => {
    const res = await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-advisor-auth': ADVISOR_TOKEN },
      body: JSON.stringify({ id: lead.id, ...patch }),
    })
    if (!res.ok) throw new Error('Save failed')
    const data = await res.json()
    onUpdate(data.lead)
  }

  const handleStatusChange = async (e) => {
    const next = e.target.value
    setStatus(next)
    setSavingStatus(true)
    try { await persist({ status: next }) } catch { /* swallow, leave UI as-is */ }
    finally { setSavingStatus(false) }
  }

  const handleNotesChange = (e) => {
    const next = e.target.value
    setNotes(next)
    setSavingNotes(true)
    if (notesTimer.current) clearTimeout(notesTimer.current)
    notesTimer.current = setTimeout(async () => {
      try { await persist({ notes: next }) } catch { /* swallow */ }
      finally { setSavingNotes(false) }
    }, 600)
  }

  const Field = ({ label, value }) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.35rem' }}>{label}</p>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{value || '—'}</p>
    </div>
  )

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(20,18,14,0.4)', zIndex: 50 }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '520px', backgroundColor: C.cream, borderLeft: `1px solid ${C.sand}`, zIndex: 51, overflowY: 'auto', padding: '2.5rem 2.5rem 4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.4rem' }}>Lead Detail</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: '400', color: C.ink }}>{lead.name}</p>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: C.mid, marginTop: '0.25rem' }}>Submitted {formatDate(lead.createdAt)}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.tan, padding: '0.25rem' }}>Close</button>
        </div>

        <Field label="Email" value={lead.email} />
        <Field label="Destinations" value={lead.destinations} />
        <Field label="Travel Dates" value={lead.dates} />
        <Field label="Party Size" value={lead.partySize} />
        <Field label="Tell Me About The Trip" value={lead.tripNotes} />
        <Field label="How They Heard About Deriva" value={lead.referral} />

        <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: `1px solid ${C.sand}` }}>
          <label style={lbl}>Status {savingStatus && <span style={{ color: C.tan, textTransform: 'none', letterSpacing: 0 }}>· saving</span>}</label>
          <select value={status} onChange={handleStatusChange} style={{ ...inp, cursor: 'pointer', marginBottom: '1.5rem' }}>
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <label style={lbl}>Private Notes {savingNotes && <span style={{ color: C.tan, textTransform: 'none', letterSpacing: 0 }}>· saving</span>}</label>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            rows={6}
            placeholder="Notes only you can see. Saved automatically."
            style={{ ...inp, resize: 'vertical', fontFamily: 'system-ui, sans-serif' }}
          />
        </div>
      </div>
    </>
  )
}

function LeadsDashboard() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeId, setActiveId] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/leads', { headers: { 'x-advisor-auth': ADVISOR_TOKEN } })
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (err) {
      setError('Could not load leads. Check that /api/leads is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleLeadUpdate = (updated) => {
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l))
  }

  const active = leads.find(l => l.id === activeId)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <SectionHeader label="Leads" title={loading ? 'Loading…' : `${leads.length} lead${leads.length !== 1 ? 's' : ''}`} />
        <button onClick={load} style={{ ...ghostBtn, marginTop: '1.5rem' }}>Refresh</button>
      </div>

      {error && (
        <div style={{ padding: '1rem', border: `1px solid ${C.tan}`, marginBottom: '1.5rem', fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.charcoal }}>{error}</div>
      )}

      {!loading && leads.length === 0 && !error && (
        <div style={{ padding: '2rem', border: `1px dashed ${C.sand}`, fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: C.mid }}>
          No leads yet. New Work With Me submissions will appear here.
        </div>
      )}

      {leads.length > 0 && (
        <div style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white }}>
          <div className="lead-row lead-row-header" style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1.4fr 1fr 110px 110px', gap: '1rem', padding: '0.85rem 1.25rem', borderBottom: `1px solid ${C.sand}`, backgroundColor: C.parchment, fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tan }}>
            <div>Type</div><div>Name</div><div>Email</div><div>Destination</div><div>Submitted</div><div>Status</div>
          </div>
          {leads.map(lead => (
            <button
              key={lead.id}
              onClick={() => setActiveId(lead.id)}
              className="lead-row"
              style={{
                display: 'grid', gridTemplateColumns: '120px 1fr 1.4fr 1fr 110px 110px', gap: '1rem',
                padding: '1rem 1.25rem', borderBottom: `1px solid ${C.sand}`, width: '100%',
                textAlign: 'left', background: 'none', border: 'none', borderBottom: `1px solid ${C.sand}`,
                cursor: 'pointer', alignItems: 'center', fontFamily: 'system-ui, sans-serif',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: C.tan, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Work With Me</div>
              <div style={{ fontSize: '0.875rem', color: C.ink, fontWeight: '400', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.name}</div>
              <div style={{ fontSize: '0.8rem', color: C.mid, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.email}</div>
              <div style={{ fontSize: '0.8rem', color: C.mid, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.destinations}</div>
              <div style={{ fontSize: '0.75rem', color: C.tan }}>{formatDate(lead.createdAt)}</div>
              <div><StatusBadge status={lead.status} /></div>
            </button>
          ))}
        </div>
      )}

      {active && <LeadDetailPanel lead={active} onClose={() => setActiveId(null)} onUpdate={handleLeadUpdate} />}
    </div>
  )
}

const NAV = [
  { id: 'leads', label: 'Leads' },
  { id: 'clients', label: 'Clients' },
  { id: 'portals', label: 'Client Portals' },
  { id: 'affiliates', label: 'Affiliates' },
  { id: 'brief', label: 'New Client Brief' },
  { id: 'itinerary', label: 'Itinerary Builder' },
  { id: 'playbook', label: 'Playbook' },
  { id: 'spots', label: 'My Spots' },
  { id: 'research', label: 'Research Tool' },
  { id: 'content', label: 'Content' },
  { id: 'notes', label: 'Client Notes' },
]

export default function AdvisorDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const sectionFromPath = (pathname) => {
    if (pathname === '/advisor/playbook') return 'playbook'
    if (pathname === '/advisor/affiliates') return 'affiliates'
    if (pathname === '/advisor/research') return 'research'
    if (pathname === '/advisor/content') return 'content'
    if (pathname.startsWith('/advisor/clients')) return 'clients'
    return 'leads'
  }
  const [section, setSection] = useState(sectionFromPath(location.pathname))

  useEffect(() => {
    setSection(sectionFromPath(location.pathname))
  }, [location.pathname])

  useEffect(() => {
    fetch('/api/auth?action=session').then((r) => r.json()).then((data) => {
      if (!data.authenticated) navigate('/advisor')
    }).catch(() => navigate('/advisor'))
  }, [])

  const handleLogout = async () => {
    try { await fetch('/api/auth?action=logout', { method: 'DELETE' }) } catch {}
    navigate('/advisor')
  }

  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh' }}>
      <div className="advisor-topbar" style={{ borderBottom: `1px solid ${C.sand}`, padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.cream, position: 'sticky', top: 0, zIndex: 10 }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.ink }}>Deriva Advisor</p>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.tan, textDecoration: 'none' }}>Public Site</Link>
          <button onClick={handleLogout} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.mid, background: 'none', border: 'none', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>
      <div className="advisor-shell" style={{ display: 'flex', maxWidth: '1300px', margin: '0 auto' }}>
        <div className="advisor-sidebar" style={{ width: '220px', flexShrink: 0, borderRight: `1px solid ${C.sand}`, padding: '2.5rem 0', minHeight: 'calc(100vh - 60px)', position: 'sticky', top: '60px', alignSelf: 'flex-start' }}>
          {NAV.map(item => {
            const handleClick = () => {
              const pathMap = {
                clients: '/advisor/clients',
                affiliates: '/advisor/affiliates',
                playbook: '/advisor/playbook',
                research: '/advisor/research',
                content: '/advisor/content',
              }
              if (pathMap[item.id]) navigate(pathMap[item.id])
              else if (location.pathname !== '/advisor/dashboard') navigate('/advisor/dashboard')
              setSection(item.id)
            }
            return (
              <button key={item.id} onClick={handleClick} style={{ display: 'block', width: '100%', textAlign: 'left', fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', letterSpacing: '0.1em', color: section === item.id ? C.ink : C.tan, fontWeight: section === item.id ? '400' : '300', backgroundColor: 'transparent', border: 'none', borderLeft: section === item.id ? `2px solid ${C.gold}` : '2px solid transparent', padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
                {item.label}
              </button>
            )
          })}
        </div>
        <div className="advisor-main" style={{ flex: 1, padding: '2.5rem 3rem', minWidth: 0 }}>
          {section === 'leads' && <LeadsDashboard />}
          {section === 'clients' && <Clients />}
          {section === 'affiliates' && <Affiliates />}
          {section === 'brief' && <ClientBriefTool />}
          {section === 'itinerary' && <ItineraryBuilder />}
          {section === 'playbook' && <Playbook />}
          {section === 'spots' && <MySpots />}
          {section === 'research' && <Research />}
          {section === 'content' && <Content />}
          {section === 'portals' && <ClientPortals />}
          {section === 'notes' && <ClientNotes />}
        </div>
      </div>
    </div>
  )
}
