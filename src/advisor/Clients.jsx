import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const C = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18',
  white: '#FDFAF5', terracotta: '#B85C45',
}

const ADVISOR_TOKEN = 'deriva2024'

const lbl = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em',
  textTransform: 'uppercase', color: C.tan, display: 'block', marginBottom: '0.5rem',
}
const inp = {
  width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300',
  color: C.ink, backgroundColor: C.white, border: `1px solid ${C.sand}`, padding: '0.7rem 0.9rem',
  outline: 'none', appearance: 'none', boxSizing: 'border-box',
}
const primaryBtn = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em',
  textTransform: 'uppercase', color: C.white, backgroundColor: C.terracotta, border: 'none',
  padding: '0.7rem 1.4rem', cursor: 'pointer',
}
const ghostBtn = {
  ...primaryBtn, backgroundColor: 'transparent', color: C.terracotta,
  border: `1px solid ${C.terracotta}`,
}
const body = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300',
  color: C.charcoal, lineHeight: '1.7',
}

const STAGES = [
  { id: 'Call Scheduled', color: '#C89A3C', bg: '#F7ECD3' },
  { id: 'Payment Pending', color: '#C89A3C', bg: '#F7ECD3' },
  { id: 'Building', color: '#4A6FA5', bg: '#DDE6F2' },
  { id: 'Delivered', color: '#7A5AA0', bg: '#E8DEF0' },
  { id: 'Complete', color: '#5B8A5F', bg: '#DCEADE' },
]

const SERVICE_TIERS = [
  { id: 'standard', label: 'Standard' },
  { id: 'fullService', label: 'Full Service' },
]

const BOOKING_TYPES = ['Hotel', 'Tour', 'Restaurant', 'Transport', 'Other']
const BOOKING_STATUSES = ['Recommendation', 'Pending', 'Confirmed']
const EMAIL_TYPES = [
  'Initial Reply',
  'Post-Call Follow Up',
  'Payment Link',
  'Itinerary Delivery',
  'Revision Delivered',
  'Other',
]

async function api(method, body, idParam) {
  const query = idParam ? `?id=${encodeURIComponent(idParam)}` : ''
  const opts = { method, headers: { 'x-advisor-auth': ADVISOR_TOKEN } }
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  const res = await fetch(`/api/clients${query}`, opts)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `${res.status}`)
  return data
}

function StageBadge({ stage }) {
  const def = STAGES.find(s => s.id === stage) || STAGES[0]
  return (
    <span style={{
      display: 'inline-block', fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem',
      letterSpacing: '0.15em', textTransform: 'uppercase', color: def.color,
      backgroundColor: def.bg, padding: '0.35rem 0.65rem', border: `1px solid ${def.color}22`,
    }}>
      {def.id}
    </span>
  )
}

function TierBadge({ tier }) {
  const label = tier === 'fullService' ? 'Full Service' : 'Standard'
  return (
    <span style={{
      display: 'inline-block', fontFamily: 'system-ui, sans-serif', fontSize: '0.58rem',
      letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold,
      backgroundColor: C.parchment, padding: '0.3rem 0.55rem', border: `1px solid ${C.sand}`,
    }}>
      {label}
    </span>
  )
}

function SectionHeader({ label, title, right }) {
  return (
    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
      <div>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.25rem' }}>{label}</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: C.ink, margin: 0 }}>{title}</h2>
      </div>
      {right}
    </div>
  )
}

function FileSection({ title, children }) {
  return (
    <div style={{ marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: `1px solid ${C.sand}` }}>
      <h3 style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.terracotta, marginBottom: '1.25rem', fontWeight: '500' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

// ── Client List ──────────────────────────────────────────────────────────────

function ClientList({ onOpen }) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api('GET')
      setClients(data.clients || [])
    } catch {
      setError('Could not load clients. Check that /api/clients is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    try {
      const data = await api('POST', { name: 'New Client' })
      onOpen(data.client.id)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <SectionHeader
        label="Clients"
        title={loading ? 'Loading…' : `${clients.length} active client${clients.length === 1 ? '' : 's'}`}
        right={<button onClick={handleAdd} style={primaryBtn}>Add Client</button>}
      />
      {error && <p style={{ ...body, color: C.terracotta, marginBottom: '1rem' }}>{error}</p>}
      {!loading && clients.length === 0 && (
        <div style={{ padding: '3rem 2rem', border: `1px dashed ${C.sand}`, textAlign: 'center' }}>
          <p style={{ ...body, color: C.mid }}>No clients yet. Add one after a discovery call converts.</p>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {clients.map(c => {
          const dates = c.departDate && c.returnDate
            ? `${c.departDate} to ${c.returnDate}`
            : (c.departDate || c.returnDate || 'Dates TBD')
          return (
            <button
              key={c.id}
              onClick={() => onOpen(c.id)}
              style={{
                textAlign: 'left', backgroundColor: C.white, border: `1px solid ${C.sand}`,
                padding: '1.25rem', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: C.ink, margin: 0 }}>{c.name || 'Untitled'}</p>
                <TierBadge tier={c.serviceTier} />
              </div>
              <p style={{ ...body, fontSize: '0.82rem', color: C.charcoal, margin: '0 0 0.25rem' }}>{c.destinations || 'Destination TBD'}</p>
              <p style={{ ...body, fontSize: '0.78rem', color: C.mid, margin: '0 0 1rem' }}>{dates}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <StageBadge stage={c.stage} />
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.terracotta }}>
                  Open
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Client File ──────────────────────────────────────────────────────────────

function ClientFile({ id, onBack, onNavigateItinerary }) {
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saveState, setSaveState] = useState('idle')
  const saveTimer = useRef(null)
  const latest = useRef(null)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const data = await api('GET', undefined, id)
        setClient(data.client)
        latest.current = data.client
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const scheduleSave = () => {
    setSaveState('saving')
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        const payload = { id, ...latest.current }
        delete payload.createdAt
        await api('PATCH', payload)
        setSaveState('saved')
        setTimeout(() => setSaveState('idle'), 1200)
      } catch {
        setSaveState('error')
      }
    }, 700)
  }

  const patch = (updates) => {
    setClient(prev => {
      const next = { ...prev, ...updates }
      latest.current = next
      return next
    })
    scheduleSave()
  }

  const handleDelete = async () => {
    if (!confirm(`Delete ${client.name}? This cannot be undone.`)) return
    try {
      await api('DELETE', undefined, id)
      onBack()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p style={{ ...body, color: C.mid }}>Loading…</p>
  if (error || !client) return (
    <div>
      <button onClick={onBack} style={ghostBtn}>Back to Clients</button>
      <p style={{ ...body, color: C.terracotta, marginTop: '1rem' }}>{error || 'Client not found.'}</p>
    </div>
  )

  const saveText = {
    idle: '', saving: 'Saving…', saved: 'Saved', error: 'Save failed',
  }[saveState]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button onClick={onBack} style={{ ...ghostBtn, fontSize: '0.6rem', padding: '0.55rem 1rem' }}>
          ← Back to Clients
        </button>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {saveText && (
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: saveState === 'error' ? C.terracotta : C.mid }}>
              {saveText}
            </span>
          )}
          <button onClick={handleDelete} style={{ ...ghostBtn, fontSize: '0.6rem', padding: '0.55rem 1rem', color: C.mid, borderColor: C.sand }}>
            Delete
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <p style={lbl}>Client File</p>
        <input
          value={client.name}
          onChange={(e) => patch({ name: e.target.value })}
          style={{ ...inp, fontFamily: 'Georgia, serif', fontSize: '1.7rem', padding: '0.3rem 0', border: 'none', backgroundColor: 'transparent', marginBottom: '0.75rem' }}
        />
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ ...lbl, margin: 0 }}>Stage</label>
          <select
            value={client.stage}
            onChange={(e) => patch({ stage: e.target.value })}
            style={{ ...inp, width: 'auto', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
          >
            {STAGES.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
          </select>
          <StageBadge stage={client.stage} />
        </div>
      </div>

      <FileSection title="1. Contact Info">
        <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.5rem' }}>
          <div><label style={lbl}>Full name</label><input value={client.name} onChange={e => patch({ name: e.target.value })} style={inp} /></div>
          <div><label style={lbl}>Email</label><input value={client.email} onChange={e => patch({ email: e.target.value })} style={inp} placeholder="jane@email.com" /></div>
          <div><label style={lbl}>Phone (optional)</label><input value={client.phone} onChange={e => patch({ phone: e.target.value })} style={inp} /></div>
          <div><label style={lbl}>How they found Deriva (optional)</label><input value={client.referral} onChange={e => patch({ referral: e.target.value })} style={inp} placeholder="Instagram, referral, etc." /></div>
        </div>
      </FileSection>

      <FileSection title="2. Trip Details">
        <div style={{ marginBottom: '1rem' }}>
          <label style={lbl}>Destination(s)</label>
          <input value={client.destinations} onChange={e => patch({ destinations: e.target.value })} style={inp} placeholder="Portugal, Spain" />
        </div>
        <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.5rem', marginBottom: '1rem' }}>
          <div><label style={lbl}>Departure date</label><input type="date" value={client.departDate} onChange={e => patch({ departDate: e.target.value })} style={inp} /></div>
          <div><label style={lbl}>Return date</label><input type="date" value={client.returnDate} onChange={e => patch({ returnDate: e.target.value })} style={inp} /></div>
          <div><label style={lbl}>Number of travelers</label><input value={client.travelers} onChange={e => patch({ travelers: e.target.value })} style={inp} placeholder="2" /></div>
          <div><label style={lbl}>Who is traveling</label><input value={client.travelerDescription} onChange={e => patch({ travelerDescription: e.target.value })} style={inp} placeholder="Couple, family with kids, etc." /></div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={lbl}>Cities or regions</label>
          <input value={client.citiesRegions} onChange={e => patch({ citiesRegions: e.target.value })} style={inp} placeholder="Lisbon, Porto, Douro Valley" />
        </div>
        <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.5rem', marginBottom: '1rem' }}>
          <div>
            <label style={lbl}>Service tier</label>
            <select value={client.serviceTier} onChange={e => patch({ serviceTier: e.target.value })} style={inp}>
              {SERVICE_TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Budget per night</label><input value={client.budgetPerNight} onChange={e => patch({ budgetPerNight: e.target.value })} style={inp} placeholder="$200 to $350" /></div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={lbl}>Travel style notes</label>
          <textarea value={client.travelStyle} onChange={e => patch({ travelStyle: e.target.value })} rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="Slow, food focused, prefers smaller towns..." />
        </div>
        <div>
          <label style={lbl}>Already booked or ruled out</label>
          <textarea value={client.avoidOrBooked} onChange={e => patch({ avoidOrBooked: e.target.value })} rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="Flights into Lisbon already booked. No all-inclusive resorts." />
        </div>
      </FileSection>

      <FileSection title="3. Discovery Call Notes">
        <textarea
          value={client.discoveryNotes}
          onChange={e => patch({ discoveryNotes: e.target.value })}
          rows={8}
          style={{ ...inp, resize: 'vertical', lineHeight: '1.65' }}
          placeholder="Notes from the discovery call..."
        />
      </FileSection>

      <FileSection title="4. Payment">
        <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem 1.5rem', marginBottom: '1rem' }}>
          <div><label style={lbl}>Service tier price</label><input value={client.price} onChange={e => patch({ price: e.target.value })} style={inp} placeholder="$250" /></div>
          <div>
            <label style={lbl}>Deposit amount</label>
            <input
              value={client.deposit?.amount || ''}
              onChange={e => patch({ deposit: { ...(client.deposit || {}), amount: e.target.value } })}
              style={inp}
              placeholder="$125"
            />
          </div>
          <div>
            <label style={lbl}>Deposit status</label>
            <select
              value={client.deposit?.status || 'Pending'}
              onChange={e => patch({ deposit: { ...(client.deposit || {}), status: e.target.value } })}
              style={inp}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div>
            <label style={lbl}>Balance amount</label>
            <input
              value={client.balance?.amount || ''}
              onChange={e => patch({ balance: { ...(client.balance || {}), amount: e.target.value } })}
              style={inp}
              placeholder="$125"
            />
          </div>
          <div>
            <label style={lbl}>Balance status</label>
            <select
              value={client.balance?.status || 'Pending'}
              onChange={e => patch({ balance: { ...(client.balance || {}), status: e.target.value } })}
              style={inp}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
        <div>
          <label style={lbl}>Payment notes</label>
          <textarea value={client.paymentNotes} onChange={e => patch({ paymentNotes: e.target.value })} rows={2} style={{ ...inp, resize: 'vertical' }} placeholder="Stripe link sent on..." />
        </div>
      </FileSection>

      <BookingTracker client={client} patch={patch} />

      <FileSection title="6. Client Notes">
        <textarea
          value={client.clientNotes}
          onChange={e => patch({ clientNotes: e.target.value })}
          rows={6}
          style={{ ...inp, resize: 'vertical', lineHeight: '1.65' }}
          placeholder="Ongoing notes, preferences, anything that carries across the engagement..."
        />
      </FileSection>

      <EmailLog client={client} patch={patch} />

      <ItineraryLink client={client} patch={patch} onNavigateItinerary={onNavigateItinerary} />
    </div>
  )
}

// ── Booking Tracker ──────────────────────────────────────────────────────────

function BookingTracker({ client, patch }) {
  const bookings = client.bookings || []
  const [copiedId, setCopiedId] = useState(null)

  const add = () => {
    const row = {
      id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: '', type: 'Tour', status: 'Recommendation',
      confirmation: '', cost: '', affiliateLink: '', notes: '',
    }
    patch({ bookings: [...bookings, row] })
  }

  const update = (i, key, value) => {
    const next = bookings.map((b, idx) => idx === i ? { ...b, [key]: value } : b)
    patch({ bookings: next })
  }

  const remove = (i) => {
    patch({ bookings: bookings.filter((_, idx) => idx !== i) })
  }

  const copy = (id, url) => {
    if (!url) return
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1200)
    })
  }

  return (
    <FileSection title="5. Booking Tracker">
      {bookings.length === 0 && (
        <p style={{ ...body, fontSize: '0.82rem', color: C.mid, fontStyle: 'italic', marginBottom: '1rem' }}>
          No bookings yet. Add tours, hotels, restaurants, or transport as you recommend or confirm them.
        </p>
      )}
      <div>
        {bookings.map((b, i) => (
          <div key={b.id} style={{
            padding: '1.25rem', marginBottom: '1rem',
            backgroundColor: C.white, border: `1px solid ${C.sand}`,
          }}>
            <div className="booking-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem 1rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ ...lbl, fontSize: '0.58rem' }}>Item</label>
                <input value={b.name} onChange={e => update(i, 'name', e.target.value)} style={inp} placeholder="Vatican Skip the Line Tour" />
              </div>
              <div>
                <label style={{ ...lbl, fontSize: '0.58rem' }}>Type</label>
                <select value={b.type} onChange={e => update(i, 'type', e.target.value)} style={inp}>
                  {BOOKING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ ...lbl, fontSize: '0.58rem' }}>Status</label>
                <select value={b.status} onChange={e => update(i, 'status', e.target.value)} style={inp}>
                  {BOOKING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="booking-row" style={{ display: 'grid', gridTemplateColumns: b.status === 'Confirmed' ? '1.2fr 0.8fr 2fr' : '0.8fr 2fr', gap: '0.75rem 1rem', marginBottom: '0.75rem' }}>
              {b.status === 'Confirmed' && (
                <div>
                  <label style={{ ...lbl, fontSize: '0.58rem' }}>Confirmation #</label>
                  <input value={b.confirmation} onChange={e => update(i, 'confirmation', e.target.value)} style={inp} />
                </div>
              )}
              <div>
                <label style={{ ...lbl, fontSize: '0.58rem' }}>Cost</label>
                <input value={b.cost} onChange={e => update(i, 'cost', e.target.value)} style={inp} placeholder="$85" />
              </div>
              <div>
                <label style={{ ...lbl, fontSize: '0.58rem' }}>Affiliate link</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input value={b.affiliateLink} onChange={e => update(i, 'affiliateLink', e.target.value)} style={{ ...inp, flex: 1 }} placeholder="https://..." />
                  <button
                    type="button"
                    onClick={() => copy(b.id, b.affiliateLink)}
                    style={{ ...ghostBtn, padding: '0.55rem 0.8rem', fontSize: '0.58rem' }}
                  >
                    {copiedId === b.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ ...lbl, fontSize: '0.58rem' }}>Notes</label>
                <input value={b.notes} onChange={e => update(i, 'notes', e.target.value)} style={inp} />
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                style={{ ...ghostBtn, padding: '0.55rem 0.8rem', fontSize: '0.58rem', color: C.mid, borderColor: C.sand }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={add} style={{ ...primaryBtn, marginTop: '0.5rem' }}>Add Booking</button>
    </FileSection>
  )
}

// ── Email Log ────────────────────────────────────────────────────────────────

function EmailLog({ client, patch }) {
  const entries = client.emailLog || []

  const add = () => {
    const today = new Date().toISOString().slice(0, 10)
    const entry = {
      id: `em_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      date: today,
      type: 'Initial Reply',
      notes: '',
    }
    patch({ emailLog: [entry, ...entries] })
  }

  const update = (id, key, value) => {
    patch({ emailLog: entries.map(e => e.id === id ? { ...e, [key]: value } : e) })
  }

  const remove = (id) => {
    patch({ emailLog: entries.filter(e => e.id !== id) })
  }

  const sorted = useMemo(() => [...entries].sort((a, b) => (b.date || '').localeCompare(a.date || '')), [entries])

  return (
    <FileSection title="7. Email Log">
      {sorted.length === 0 && (
        <p style={{ ...body, fontSize: '0.82rem', color: C.mid, fontStyle: 'italic', marginBottom: '1rem' }}>
          No emails logged yet.
        </p>
      )}
      {sorted.map(e => (
        <div key={e.id} className="email-row" style={{
          display: 'grid', gridTemplateColumns: '140px 200px 1fr auto', gap: '0.75rem',
          alignItems: 'center', marginBottom: '0.75rem',
          padding: '0.85rem', backgroundColor: C.white, border: `1px solid ${C.sand}`,
        }}>
          <input type="date" value={e.date} onChange={ev => update(e.id, 'date', ev.target.value)} style={{ ...inp, padding: '0.55rem 0.65rem', fontSize: '0.8rem' }} />
          <select value={e.type} onChange={ev => update(e.id, 'type', ev.target.value)} style={{ ...inp, padding: '0.55rem 0.65rem', fontSize: '0.8rem' }}>
            {EMAIL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input value={e.notes} onChange={ev => update(e.id, 'notes', ev.target.value)} style={{ ...inp, padding: '0.55rem 0.65rem', fontSize: '0.8rem' }} placeholder="Notes (optional)" />
          <button
            type="button"
            onClick={() => remove(e.id)}
            style={{ background: 'none', border: 'none', fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.tan, cursor: 'pointer' }}
          >
            Remove
          </button>
        </div>
      ))}
      <button onClick={add} style={{ ...primaryBtn, marginTop: '0.5rem' }}>Add Email Entry</button>
    </FileSection>
  )
}

// ── Itinerary Link ───────────────────────────────────────────────────────────

function ItineraryLink({ client, patch, onNavigateItinerary }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const handleCreate = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-advisor-auth': ADVISOR_TOKEN },
        body: JSON.stringify({
          clientName: client.name,
          destination: client.destinations,
          dates: client.departDate && client.returnDate ? `${client.departDate} to ${client.returnDate}` : '',
          travelers: client.travelerDescription || client.travelers || '',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create itinerary')
      patch({ itineraryId: data.itinerary.id })
      onNavigateItinerary(data.itinerary.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h3 style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.terracotta, marginBottom: '1.25rem', fontWeight: '500' }}>
        8. Itinerary
      </h3>
      {client.itineraryId ? (
        <div>
          <p style={{ ...body, marginBottom: '1rem' }}>This client has an itinerary in progress.</p>
          <button onClick={() => onNavigateItinerary(client.itineraryId)} style={primaryBtn}>Open Itinerary</button>
        </div>
      ) : (
        <div>
          <p style={{ ...body, marginBottom: '1rem', color: C.mid }}>No itinerary yet for this client.</p>
          <button onClick={handleCreate} disabled={busy} style={{ ...primaryBtn, opacity: busy ? 0.6 : 1 }}>
            {busy ? 'Creating…' : 'Create Itinerary'}
          </button>
          {error && <p style={{ ...body, color: C.terracotta, marginTop: '0.75rem' }}>{error}</p>}
        </div>
      )}
    </div>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────

export default function Clients() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialId = useMemo(() => {
    const match = location.pathname.match(/^\/advisor\/clients\/(.+)$/)
    return match ? decodeURIComponent(match[1]) : null
  }, [location.pathname])
  const [activeId, setActiveId] = useState(initialId)

  useEffect(() => {
    if (activeId) {
      const target = `/advisor/clients/${encodeURIComponent(activeId)}`
      if (location.pathname !== target) navigate(target, { replace: true })
    } else if (location.pathname !== '/advisor/clients') {
      navigate('/advisor/clients', { replace: true })
    }
  }, [activeId])

  const handleOpen = (id) => setActiveId(id)
  const handleBack = () => setActiveId(null)
  const handleNavigateItinerary = (itineraryId) => {
    // Send the user to the Itinerary Builder section. The builder loads by list
    // state, so we just flip section and let them click in. The simplest robust
    // path is to navigate to the dashboard and set section via URL hash.
    navigate(`/advisor/dashboard#itinerary=${itineraryId}`)
  }

  return activeId
    ? <ClientFile id={activeId} onBack={handleBack} onNavigateItinerary={handleNavigateItinerary} />
    : <ClientList onOpen={handleOpen} />
}
