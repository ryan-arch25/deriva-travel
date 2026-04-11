import { useState, useEffect, useMemo } from 'react'

const C = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18',
  white: '#FDFAF5', terracotta: '#B85C45',
}

const ADVISOR_TOKEN = 'deriva2024'
const PLATFORMS = ['Viator', 'GetYourGuide', 'Booking.com', 'Other']

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

async function api(method, body, idParam) {
  const query = idParam ? `?id=${encodeURIComponent(idParam)}` : ''
  const opts = { method, headers: { 'x-advisor-auth': ADVISOR_TOKEN } }
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  const res = await fetch(`/api/affiliates${query}`, opts)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `${res.status}`)
  return data
}

function Row({ entry, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(entry)
  const [copied, setCopied] = useState(false)

  useEffect(() => { setDraft(entry) }, [entry])

  const save = async () => {
    await onSave(draft)
    setEditing(false)
  }

  const copy = () => {
    if (!entry.url) return
    navigator.clipboard.writeText(entry.url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }

  if (editing) {
    return (
      <div style={{ padding: '1.25rem', backgroundColor: C.white, border: `1px solid ${C.sand}`, marginBottom: '0.75rem' }}>
        <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1rem', marginBottom: '0.75rem' }}>
          <div>
            <label style={{ ...lbl, fontSize: '0.58rem' }}>Platform</label>
            <select value={draft.platform} onChange={e => setDraft({ ...draft, platform: e.target.value })} style={inp}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={{ ...lbl, fontSize: '0.58rem' }}>Label</label>
            <input value={draft.label} onChange={e => setDraft({ ...draft, label: e.target.value })} style={inp} />
          </div>
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ ...lbl, fontSize: '0.58rem' }}>URL</label>
          <input value={draft.url} onChange={e => setDraft({ ...draft, url: e.target.value })} style={inp} placeholder="https://..." />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ ...lbl, fontSize: '0.58rem' }}>Notes</label>
          <textarea value={draft.notes || ''} onChange={e => setDraft({ ...draft, notes: e.target.value })} rows={2} style={{ ...inp, resize: 'vertical' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={save} style={primaryBtn}>Save</button>
          <button onClick={() => { setDraft(entry); setEditing(false) }} style={{ ...ghostBtn, color: C.mid, borderColor: C.sand }}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem 1.25rem', backgroundColor: C.white, border: `1px solid ${C.sand}`, marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: C.ink, margin: '0 0 0.25rem' }}>{entry.label || 'Untitled'}</p>
          <a
            href={entry.url}
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.78rem', color: C.gold, wordBreak: 'break-all', textDecoration: 'none' }}
          >
            {entry.url || 'No URL set'}
          </a>
          {entry.notes && (
            <p style={{ ...body, fontSize: '0.8rem', color: C.mid, margin: '0.5rem 0 0' }}>{entry.notes}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <button onClick={copy} style={{ ...primaryBtn, padding: '0.5rem 0.85rem', fontSize: '0.58rem' }}>
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={() => setEditing(true)} style={{ ...ghostBtn, padding: '0.5rem 0.85rem', fontSize: '0.58rem', color: C.mid, borderColor: C.sand }}>
            Edit
          </button>
          <button onClick={() => onDelete(entry.id)} style={{ background: 'none', border: 'none', fontFamily: 'system-ui, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.tan, cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Affiliates() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api('GET')
      setEntries(data.affiliates || [])
    } catch {
      setError('Could not load affiliates. Check that /api/affiliates is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const add = async () => {
    try {
      const data = await api('POST', { platform: 'Other', label: 'New Link', url: '' })
      setEntries(prev => [...prev, data.affiliate])
    } catch (err) {
      setError(err.message)
    }
  }

  const save = async (entry) => {
    try {
      const data = await api('PATCH', entry)
      setEntries(prev => prev.map(e => e.id === entry.id ? data.affiliate : e))
    } catch (err) {
      setError(err.message)
    }
  }

  const del = async (id) => {
    if (!confirm('Delete this affiliate link?')) return
    try {
      await api('DELETE', undefined, id)
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const grouped = useMemo(() => {
    const order = [...PLATFORMS]
    const map = {}
    for (const p of order) map[p] = []
    for (const e of entries) {
      const key = order.includes(e.platform) ? e.platform : 'Other'
      map[key].push(e)
    }
    return order.map(p => ({ platform: p, items: map[p] }))
  }, [entries])

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.25rem' }}>Affiliates</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: C.ink, margin: 0 }}>Affiliate link library.</h2>
        </div>
        <button onClick={add} style={primaryBtn}>Add Link</button>
      </div>
      {error && <p style={{ ...body, color: C.terracotta, marginBottom: '1rem' }}>{error}</p>}
      {loading && <p style={{ ...body, color: C.mid }}>Loading…</p>}
      {!loading && grouped.map(group => (
        <div key={group.platform} style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.terracotta, marginBottom: '1rem', fontWeight: '500' }}>
            {group.platform}
          </h3>
          {group.items.length === 0 ? (
            <p style={{ ...body, fontSize: '0.82rem', color: C.mid, fontStyle: 'italic' }}>No links saved for this platform.</p>
          ) : (
            group.items.map(e => <Row key={e.id} entry={e} onSave={save} onDelete={del} />)
          )}
        </div>
      ))}
    </div>
  )
}
