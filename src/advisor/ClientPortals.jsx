import { useState, useEffect } from 'react'

const C = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18',
  white: '#FDFAF5', terracotta: '#B85C45', olive: '#6B7A45',
}
const ADVISOR_TOKEN = 'deriva2024'
const headers = { 'Content-Type': 'application/json', 'x-advisor-auth': ADVISOR_TOKEN }

const lbl = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em',
  textTransform: 'uppercase', color: C.tan, display: 'block', marginBottom: '0.5rem',
}
const softBtn = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em',
  textTransform: 'uppercase', color: C.mid, backgroundColor: 'transparent',
  border: `1px solid ${C.sand}`, padding: '0.5rem 0.9rem', cursor: 'pointer',
}

function SectionHeader({ label, title }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.25rem' }}>{label}</p>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: C.ink, margin: 0 }}>{title}</h2>
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return ''
  try { return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) } catch { return '' }
}

export default function ClientPortals() {
  const [portals, setPortals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copiedSlug, setCopiedSlug] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/portal', { headers })
      const data = await res.json()
      if (res.ok) setPortals(data.portals || [])
      else setError(data.error || 'Failed to load')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (slug) => {
    if (!confirm(`Delete portal "${slug}"? The client will lose access.`)) return
    try {
      await fetch(`/api/portal?slug=${encodeURIComponent(slug)}`, { method: 'DELETE', headers })
      setPortals(portals.filter((p) => p.slug !== slug))
    } catch {}
  }

  const copyLink = (slug) => {
    const url = `https://deriva.travel/trip/${slug}`
    navigator.clipboard?.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  return (
    <div>
      <SectionHeader label="Client Portals" title="Active trip portals." />

      {loading && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.tan }}>Loading...</p>}
      {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#9E6060' }}>{error}</p>}

      {!loading && portals.length === 0 && !error && (
        <div style={{ backgroundColor: C.parchment, border: `1px solid ${C.sand}`, padding: '1.5rem 1.75rem' }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.mid, lineHeight: '1.7', marginBottom: '0.75rem' }}>
            No active portals yet. Publish an itinerary to the portal from the Itinerary Builder to create one.
          </p>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: C.tan, lineHeight: '1.6' }}>
            A demo portal is available at <strong style={{ color: C.charcoal, fontWeight: '400' }}>deriva.travel/trip/sarah-como-2026</strong> with password <strong style={{ color: C.charcoal, fontWeight: '400' }}>como2026</strong>.
          </p>
        </div>
      )}

      {portals.length > 0 && (
        <div className="portals-table" style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white, overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1fr 0.8fr 0.8fr auto', gap: '1rem', padding: '1rem 1.25rem', borderBottom: `1px solid ${C.sand}`, backgroundColor: C.parchment, minWidth: '700px' }}>
            {['Client', 'Trip', 'Slug', 'Status', 'Created', ''].map((h) => (
              <span key={h} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.tan }}>{h}</span>
            ))}
          </div>
          {portals.map((p) => (
            <div key={p.slug} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1fr 0.8fr 0.8fr auto', gap: '1rem', padding: '1rem 1.25rem', borderBottom: `1px solid ${C.sand}`, alignItems: 'center', minWidth: '700px' }}>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.ink }}>{p.clientName || '—'}</span>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: C.charcoal }}>{p.tripName || '—'}</span>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: C.mid, fontFamily: 'monospace' }}>{p.slug}</span>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: p.status === 'Active' ? C.olive : C.tan }}>{p.status || 'Active'}</span>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: C.tan }}>{formatDate(p.createdAt)}</span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => copyLink(p.slug)} style={softBtn}>
                  {copiedSlug === p.slug ? 'Copied' : 'Copy Link'}
                </button>
                <a href={`/trip/${p.slug}`} target="_blank" rel="noopener noreferrer" style={{ ...softBtn, textDecoration: 'none', display: 'inline-block' }}>Open</a>
                <button onClick={() => handleDelete(p.slug)} style={{ ...softBtn, color: C.terracotta, borderColor: C.terracotta }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .portals-table { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  )
}
