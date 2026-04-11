import { useState, useEffect, useMemo } from 'react'

const C = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18',
  white: '#FDFAF5', terracotta: '#B85C45',
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
  textTransform: 'uppercase', color: C.white, backgroundColor: C.terracotta, border: 'none',
  padding: '0.7rem 1.3rem', cursor: 'pointer',
}
const ghostBtn = {
  ...primaryBtn, backgroundColor: 'transparent', color: C.terracotta,
  border: `1px solid ${C.terracotta}`,
}
const softBtn = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em',
  textTransform: 'uppercase', color: C.mid, backgroundColor: 'transparent',
  border: `1px solid ${C.sand}`, padding: '0.5rem 0.9rem', cursor: 'pointer',
}

const DESTS = ['All', 'Italy', 'Portugal', 'Spain', 'Iceland']
const ADD_DEST_TAGS = ['Italy', 'Portugal', 'Spain', 'Iceland', 'General', 'Hotels', 'Food']

const gnews = (q) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`

const FEED_SOURCES = [
  ...['Italy travel', 'Rome restaurants', 'Florence travel', 'Amalfi coast', 'Sicily travel', 'Lake Como'].map((q) => ({ url: gnews(q), tag: 'Italy' })),
  ...['Lisbon restaurants', 'Portugal travel', 'Porto travel', 'Algarve'].map((q) => ({ url: gnews(q), tag: 'Portugal' })),
  ...['Spain travel', 'Madrid restaurants', 'Barcelona travel', 'San Sebastian food'].map((q) => ({ url: gnews(q), tag: 'Spain' })),
  ...['Iceland travel', 'Reykjavik restaurants', 'Iceland tourism'].map((q) => ({ url: gnews(q), tag: 'Iceland' })),
  { url: 'https://www.eater.com/rss/index.xml', tag: 'General' },
  { url: 'https://www.cntraveler.com/feed/rss', tag: 'General' },
  { url: 'https://www.travelandleisure.com/rss', tag: 'General' },
  { url: 'https://www.timeout.com/travel/rss', tag: 'General' },
  { url: 'https://www.lonelyplanet.com/news/feed', tag: 'General' },
]

const DEFAULT_FOLLOWING = [
  { id: 'f1', name: 'Hotels Above Par', url: 'https://hotelsaboveparweekly.substack.com/feed', tag: 'Hotels' },
  { id: 'f2', name: 'Katie Parla', url: 'https://katieparla.substack.com/feed', tag: 'Italy' },
  { id: 'f3', name: 'Elizabeth Minchilli', url: 'https://elizabethminchilli.substack.com/feed', tag: 'Italy' },
  { id: 'f4', name: 'Portugalist', url: 'https://www.portugalist.com/feed/', tag: 'Portugal' },
  { id: 'f5', name: 'Grantourismo', url: 'https://grantourismotravels.com/feed/', tag: 'General' },
]

const DEFAULT_INSTAGRAM = [
  { id: 'ig1', handle: 'italytravel', tag: 'Italy', notes: '' },
  { id: 'ig2', handle: 'rome.guide', tag: 'Italy', notes: '' },
  { id: 'ig3', handle: 'florenceitaly', tag: 'Italy', notes: '' },
  { id: 'ig4', handle: 'visitportugal', tag: 'Portugal', notes: '' },
  { id: 'ig5', handle: 'lisbonlovers', tag: 'Portugal', notes: '' },
  { id: 'ig6', handle: 'spain', tag: 'Spain', notes: '' },
  { id: 'ig7', handle: 'madrid_food', tag: 'Spain', notes: '' },
  { id: 'ig8', handle: 'icelandair', tag: 'Iceland', notes: '' },
  { id: 'ig9', handle: 'visiticeland', tag: 'Iceland', notes: '' },
  { id: 'ig10', handle: 'hotelsabovepar', tag: 'Hotels', notes: '' },
  { id: 'ig11', handle: 'tablethotels', tag: 'Hotels', notes: '' },
  { id: 'ig12', handle: 'eater', tag: 'Food', notes: '' },
  { id: 'ig13', handle: 'bonappetit', tag: 'Food', notes: '' },
]

const EXAMPLE_PROMPTS = [
  'Best new restaurants in Lisbon opening in 2026',
  'Is Trastevere still worth staying in or too touristy?',
  'Boutique hotels in Sicily under $300 per night',
  'What neighborhoods are locals eating in Florence right now',
  'Best skip the line tours for the Vatican',
  'What is trending in Reykjavik for travelers right now',
]

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw == null) return initial
      return JSON.parse(raw)
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  }, [key, value])
  return [value, setValue]
}

function formatDate(raw) {
  if (!raw) return ''
  const d = new Date(raw)
  if (isNaN(d.getTime())) return ''
  const now = Date.now()
  const diff = now - d.getTime()
  const day = 24 * 60 * 60 * 1000
  if (diff < 60 * 60 * 1000) return `${Math.max(1, Math.round(diff / 60000))}m ago`
  if (diff < day) return `${Math.round(diff / (60 * 60 * 1000))}h ago`
  if (diff < 7 * day) return `${Math.round(diff / day)}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function cleanHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function SectionHeader({ label, title }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.25rem' }}>{label}</p>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: C.ink, margin: 0 }}>{title}</h2>
    </div>
  )
}

function DestinationFilter({ value, onChange, options = DESTS }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
      {options.map((d) => {
        const active = value === d
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            style={{
              fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', cursor: 'pointer',
              color: active ? C.white : C.mid,
              backgroundColor: active ? C.terracotta : 'transparent',
              border: `1px solid ${active ? C.terracotta : C.sand}`,
              padding: '0.45rem 0.95rem',
            }}
          >
            {d}
          </button>
        )
      })}
    </div>
  )
}

function ArticleCard({ item, onSave, saved }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.sand}`, padding: '1rem 0' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold }}>
          {item.feedTitle || cleanHost(item.sourceUrl || item.link)}
        </span>
        {item.tag && (
          <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tan }}>
            · {item.tag}
          </span>
        )}
        {item.pubDate && (
          <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tan }}>
            · {formatDate(item.pubDate)}
          </span>
        )}
      </div>
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', fontWeight: '400', color: C.ink, textDecoration: 'none', lineHeight: '1.4', display: 'block', marginBottom: '0.5rem' }}
      >
        {item.title}
      </a>
      {item.description && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.6', marginBottom: '0.6rem' }}>
          {item.description}
        </p>
      )}
      {onSave && (
        <button
          onClick={() => onSave(item)}
          style={{
            ...softBtn,
            color: saved ? C.terracotta : C.mid,
            borderColor: saved ? C.terracotta : C.sand,
          }}
        >
          {saved ? 'Saved' : 'Save'}
        </button>
      )}
    </div>
  )
}

// ── FEED TAB ────────────────────────────────────────────────────────────────
function FeedTab({ savedItems, setSavedItems }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dest, setDest] = useState('All')
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/rss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: FEED_SOURCES }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Feed fetch failed')
      const data = await res.json()
      const merged = (data.feeds || []).flatMap((f) =>
        (f.items || []).map((it) => ({ ...it, tag: it.tag || f.tag }))
      )
      merged.sort((a, b) => {
        const da = new Date(a.pubDate).getTime() || 0
        const db = new Date(b.pubDate).getTime() || 0
        return db - da
      })
      setItems(merged)
      setLastRefreshed(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    if (dest === 'All') return items.slice(0, 60)
    const tagged = items.filter((it) => it.tag === dest)
    const general = items.filter((it) => it.tag === 'General').slice(0, 5)
    return [...tagged, ...general].slice(0, 15)
  }, [items, dest])

  const isSaved = (it) => savedItems.some((s) => s.link === it.link)
  const toggleSave = (it) => {
    if (isSaved(it)) {
      setSavedItems(savedItems.filter((s) => s.link !== it.link))
    } else {
      setSavedItems([
        { id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, savedAt: new Date().toISOString(), notes: '', source: 'feed', ...it },
        ...savedItems,
      ])
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <SectionHeader label="Feed" title="Latest travel news." />
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {lastRefreshed && (
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', color: C.tan, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Updated {formatDate(lastRefreshed.toISOString())}
            </span>
          )}
          <button onClick={load} disabled={loading} style={{ ...primaryBtn, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
      <DestinationFilter value={dest} onChange={setDest} />
      {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#9E6060', marginBottom: '1rem' }}>{error}</p>}
      {loading && items.length === 0 && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.tan }}>Pulling feeds from a lot of sources. This takes a few seconds.</p>
      )}
      {!loading && filtered.length === 0 && !error && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.tan }}>No articles yet.</p>
      )}
      <div>
        {filtered.map((it, i) => (
          <ArticleCard key={`${it.link}_${i}`} item={it} onSave={toggleSave} saved={isSaved(it)} />
        ))}
      </div>
    </div>
  )
}

// ── FOLLOWING TAB ───────────────────────────────────────────────────────────
function FollowingTab({ savedItems, setSavedItems }) {
  const [sources, setSources] = useLocalStorage('deriva_research_following', DEFAULT_FOLLOWING)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dest, setDest] = useState('All')
  const [adding, setAdding] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newName, setNewName] = useState('')
  const [newTag, setNewTag] = useState('General')

  const load = async () => {
    if (!sources.length) { setItems([]); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/rss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: sources.map((s) => ({ url: s.url, tag: s.tag })) }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Feed fetch failed')
      const data = await res.json()
      const merged = (data.feeds || []).flatMap((f, idx) => {
        const src = sources[idx]
        return (f.items || []).slice(0, 5).map((it) => ({
          ...it,
          tag: src?.tag || 'General',
          feedTitle: src?.name || f.feedTitle || cleanHost(src?.url || ''),
          sourceId: src?.id,
        }))
      })
      merged.sort((a, b) => (new Date(b.pubDate).getTime() || 0) - (new Date(a.pubDate).getTime() || 0))
      setItems(merged)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [sources.length])

  const addSource = () => {
    const url = newUrl.trim()
    const name = newName.trim() || cleanHost(url) || 'New source'
    if (!url) return
    setSources([{ id: `f_${Date.now()}`, name, url, tag: newTag }, ...sources])
    setNewUrl(''); setNewName(''); setNewTag('General'); setAdding(false)
  }

  const removeSource = (id) => setSources(sources.filter((s) => s.id !== id))

  const filteredItems = useMemo(() => {
    if (dest === 'All') return items
    return items.filter((it) => it.tag === dest)
  }, [items, dest])

  const filteredSources = useMemo(() => {
    if (dest === 'All') return sources
    return sources.filter((s) => s.tag === dest)
  }, [sources, dest])

  const isSaved = (it) => savedItems.some((s) => s.link === it.link)
  const toggleSave = (it) => {
    if (isSaved(it)) setSavedItems(savedItems.filter((s) => s.link !== it.link))
    else setSavedItems([{ id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, savedAt: new Date().toISOString(), notes: '', source: 'following', ...it }, ...savedItems])
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <SectionHeader label="Following" title="Your curated sources." />
        <button onClick={() => setAdding(!adding)} style={primaryBtn}>{adding ? 'Cancel' : 'Add Source'}</button>
      </div>

      {adding && (
        <div style={{ backgroundColor: C.parchment, border: `1px solid ${C.sand}`, padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={lbl}>RSS feed URL or Substack URL</label>
            <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://example.substack.com/feed" style={inp} />
          </div>
          <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={lbl}>Name</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Publication name" style={inp} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={lbl}>Tag</label>
              <select value={newTag} onChange={(e) => setNewTag(e.target.value)} style={inp}>
                {ADD_DEST_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <button onClick={addSource} style={primaryBtn}>Add</button>
        </div>
      )}

      <DestinationFilter value={dest} onChange={setDest} />

      <div style={{ marginBottom: '1.5rem' }}>
        <p style={lbl}>Sources ({filteredSources.length})</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {filteredSources.map((s) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: `1px solid ${C.sand}`, padding: '0.4rem 0.75rem', backgroundColor: C.white }}>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: C.charcoal }}>{s.name}</span>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', color: C.tan, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.tag}</span>
              <button onClick={() => removeSource(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.tan, fontSize: '0.9rem', padding: 0, lineHeight: 1 }}>×</button>
            </div>
          ))}
        </div>
      </div>

      {loading && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.tan }}>Loading latest posts...</p>}
      {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#9E6060' }}>{error}</p>}

      <div>
        {filteredItems.map((it, i) => (
          <ArticleCard key={`${it.link}_${i}`} item={it} onSave={toggleSave} saved={isSaved(it)} />
        ))}
      </div>
    </div>
  )
}

// ── RESEARCH TAB ────────────────────────────────────────────────────────────
function ResearchSearchTab({ savedItems, setSavedItems }) {
  const [history, setHistory] = useLocalStorage('deriva_research_history', [])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const runQuery = async (text) => {
    const q = text.trim()
    if (!q || loading) return
    setLoading(true)
    setError('')
    setQuery('')
    try {
      const res = await fetch('/api/research-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Search failed')
      const data = await res.json()
      const entry = {
        id: `r_${Date.now()}`,
        query: q,
        answer: data.text,
        citations: data.citations || [],
        at: new Date().toISOString(),
      }
      setHistory([entry, ...history])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const saveResult = (entry) => {
    const alreadySaved = savedItems.some((s) => s.researchId === entry.id)
    if (alreadySaved) {
      setSavedItems(savedItems.filter((s) => s.researchId !== entry.id))
      return
    }
    setSavedItems([
      {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        researchId: entry.id,
        title: entry.query,
        description: entry.answer,
        citations: entry.citations,
        source: 'research',
        savedAt: new Date().toISOString(),
        notes: '',
        tag: 'General',
      },
      ...savedItems,
    ])
  }

  const isEntrySaved = (entry) => savedItems.some((s) => s.researchId === entry.id)

  return (
    <div>
      <SectionHeader label="Research" title="Ask anything about your destinations." />
      <form
        onSubmit={(e) => { e.preventDefault(); runQuery(query) }}
        style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about your destinations..."
          style={{ ...inp, flex: 1 }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !query.trim()} style={{ ...primaryBtn, opacity: loading || !query.trim() ? 0.6 : 1 }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {history.length === 0 && !loading && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ ...lbl, marginBottom: '0.75rem' }}>Try asking</p>
          {EXAMPLE_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => runQuery(q)}
              style={{ display: 'block', fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: '300', color: C.charcoal, background: C.white, border: `1px solid ${C.sand}`, padding: '0.7rem 1rem', cursor: 'pointer', marginBottom: '0.5rem', textAlign: 'left', width: '100%' }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ padding: '1.25rem', border: `1px solid ${C.sand}`, backgroundColor: C.parchment, marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.tan, margin: 0 }}>Searching the web and thinking this through...</p>
        </div>
      )}
      {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#9E6060', marginBottom: '1rem' }}>{error}</p>}

      {history.map((entry) => (
        <div key={entry.id} style={{ marginBottom: '1.75rem', border: `1px solid ${C.sand}`, backgroundColor: C.white, padding: '1.25rem 1.5rem' }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.4rem' }}>Question</p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: C.ink, marginBottom: '1rem', lineHeight: '1.5' }}>{entry.query}</p>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.4rem' }}>Answer</p>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
            {entry.answer}
          </div>
          {entry.citations?.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ ...lbl, marginBottom: '0.4rem' }}>Sources</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {entry.citations.map((c, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: C.terracotta, textDecoration: 'none' }}>
                      {c.title || cleanHost(c.url)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => saveResult(entry)} style={{ ...softBtn, color: isEntrySaved(entry) ? C.terracotta : C.mid, borderColor: isEntrySaved(entry) ? C.terracotta : C.sand }}>
              {isEntrySaved(entry) ? 'Saved' : 'Save'}
            </button>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', color: C.tan, alignSelf: 'center' }}>
              {formatDate(entry.at)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── INSTAGRAM TAB ───────────────────────────────────────────────────────────
function InstagramTab() {
  const [accounts, setAccounts] = useLocalStorage('deriva_research_instagram', DEFAULT_INSTAGRAM)
  const [dest, setDest] = useState('All')
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ handle: '', tag: 'Italy', notes: '' })
  const [editingNotes, setEditingNotes] = useState(null)

  const filtered = dest === 'All' ? accounts : accounts.filter((a) => a.tag === dest)
  const igOptions = ['All', 'Italy', 'Portugal', 'Spain', 'Iceland', 'Hotels', 'Food']

  const add = () => {
    const handle = form.handle.trim().replace(/^@/, '')
    if (!handle) return
    setAccounts([{ id: `ig_${Date.now()}`, handle, tag: form.tag, notes: form.notes.trim() }, ...accounts])
    setForm({ handle: '', tag: 'Italy', notes: '' })
    setAdding(false)
  }

  const remove = (id) => setAccounts(accounts.filter((a) => a.id !== id))
  const updateNotes = (id, notes) => setAccounts(accounts.map((a) => (a.id === id ? { ...a, notes } : a)))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <SectionHeader label="Instagram" title="Accounts to watch." />
        <button onClick={() => setAdding(!adding)} style={primaryBtn}>{adding ? 'Cancel' : 'Add Account'}</button>
      </div>

      {adding && (
        <div style={{ backgroundColor: C.parchment, border: `1px solid ${C.sand}`, padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={lbl}>Handle</label>
              <input value={form.handle} onChange={(e) => setForm({ ...form, handle: e.target.value })} placeholder="@account" style={inp} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={lbl}>Destination</label>
              <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} style={inp}>
                {['Italy', 'Portugal', 'Spain', 'Iceland', 'Hotels', 'Food'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={lbl}>Notes</label>
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="What to watch for" style={inp} />
          </div>
          <button onClick={add} style={primaryBtn}>Add</button>
        </div>
      )}

      <DestinationFilter value={dest} onChange={setDest} options={igOptions} />

      <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
        {filtered.map((a) => (
          <div key={a.id} style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white, padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
              <a
                href={`https://instagram.com/${a.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: C.ink, textDecoration: 'none' }}
              >
                @{a.handle}
              </a>
              <button onClick={() => remove(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.tan, fontSize: '1rem', padding: 0, lineHeight: 1 }}>×</button>
            </div>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.5rem' }}>{a.tag}</p>
            {editingNotes === a.id ? (
              <input
                value={a.notes}
                onChange={(e) => updateNotes(a.id, e.target.value)}
                onBlur={() => setEditingNotes(null)}
                onKeyDown={(e) => { if (e.key === 'Enter') setEditingNotes(null) }}
                autoFocus
                style={{ ...inp, fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
              />
            ) : (
              <p
                onClick={() => setEditingNotes(a.id)}
                style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: a.notes ? C.charcoal : C.tan, cursor: 'text', minHeight: '1.2em', margin: 0, fontStyle: a.notes ? 'normal' : 'italic' }}
              >
                {a.notes || 'Add notes'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SAVED TAB ───────────────────────────────────────────────────────────────
function SavedTab({ savedItems, setSavedItems }) {
  const [dest, setDest] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const savedOptions = ['All', 'Italy', 'Portugal', 'Spain', 'Iceland', 'General']

  const filtered = dest === 'All' ? savedItems : savedItems.filter((s) => s.tag === dest)

  const remove = (id) => setSavedItems(savedItems.filter((s) => s.id !== id))
  const updateItem = (id, patch) => setSavedItems(savedItems.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  return (
    <div>
      <SectionHeader label="Saved" title="Your personal library." />
      <DestinationFilter value={dest} onChange={setDest} options={savedOptions} />
      {filtered.length === 0 && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.tan }}>
          Nothing saved yet. Save articles from the Feed and Following tabs, or research results from the Research tab.
        </p>
      )}
      {filtered.map((item) => (
        <div key={item.id} style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white, padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold }}>
              {item.source === 'research' ? 'Research' : item.feedTitle || cleanHost(item.link)}
            </span>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tan }}>
              · {formatDate(item.savedAt)}
            </span>
          </div>
          {item.link ? (
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: C.ink, textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}>
              {item.title}
            </a>
          ) : (
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: C.ink, marginBottom: '0.5rem' }}>{item.title}</p>
          )}
          {item.description && (
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.charcoal, lineHeight: '1.7', marginBottom: '0.75rem', whiteSpace: 'pre-wrap' }}>
              {item.source === 'research' ? item.description : item.description}
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'center' }}>
            <select
              value={item.tag || 'General'}
              onChange={(e) => updateItem(item.id, { tag: e.target.value })}
              style={{ ...inp, width: 'auto', padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
            >
              {['Italy', 'Portugal', 'Spain', 'Iceland', 'General', 'Hotels', 'Food'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={() => setEditingId(editingId === item.id ? null : item.id)} style={softBtn}>
              {editingId === item.id ? 'Done' : 'Notes'}
            </button>
            <button onClick={() => remove(item.id)} style={{ ...softBtn, color: C.terracotta, borderColor: C.terracotta }}>
              Delete
            </button>
          </div>
          {editingId === item.id && (
            <textarea
              value={item.notes || ''}
              onChange={(e) => updateItem(item.id, { notes: e.target.value })}
              placeholder="good rec for Lake Como clients, verify still open, etc."
              rows={2}
              style={{ ...inp, resize: 'vertical', fontSize: '0.85rem' }}
            />
          )}
          {item.notes && editingId !== item.id && (
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: C.mid, fontStyle: 'italic', backgroundColor: C.parchment, padding: '0.6rem 0.8rem', borderLeft: `2px solid ${C.gold}` }}>
              {item.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// ── ROOT ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'feed', label: 'Feed' },
  { id: 'following', label: 'Following' },
  { id: 'research', label: 'Research' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'saved', label: 'Saved' },
]

export default function Research() {
  const [tab, setTab] = useState('feed')
  const [savedItems, setSavedItems] = useLocalStorage('deriva_research_saved', [])

  return (
    <div>
      <div className="research-tabs" style={{ display: 'flex', gap: '0.25rem', borderBottom: `1px solid ${C.sand}`, marginBottom: '2rem', flexWrap: 'wrap' }}>
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', cursor: 'pointer',
                color: active ? C.ink : C.tan,
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: active ? `2px solid ${C.terracotta}` : '2px solid transparent',
                padding: '0.9rem 1.1rem', marginBottom: '-1px',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'feed' && <FeedTab savedItems={savedItems} setSavedItems={setSavedItems} />}
      {tab === 'following' && <FollowingTab savedItems={savedItems} setSavedItems={setSavedItems} />}
      {tab === 'research' && <ResearchSearchTab savedItems={savedItems} setSavedItems={setSavedItems} />}
      {tab === 'instagram' && <InstagramTab />}
      {tab === 'saved' && <SavedTab savedItems={savedItems} setSavedItems={setSavedItems} />}
    </div>
  )
}
