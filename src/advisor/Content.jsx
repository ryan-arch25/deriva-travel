import { useState, useEffect, useMemo } from 'react'

const C = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18',
  white: '#FDFAF5', terracotta: '#B85C45',
}
const ADVISOR_TOKEN = 'deriva2024'
const apiHeaders = { 'Content-Type': 'application/json', 'x-advisor-auth': ADVISOR_TOKEN }

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
const softBtn = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em',
  textTransform: 'uppercase', color: C.mid, backgroundColor: 'transparent',
  border: `1px solid ${C.sand}`, padding: '0.45rem 0.8rem', cursor: 'pointer',
}

const DERIVA_VOICE = `Write in first person. Be specific not generic. No em dashes anywhere. No dashes of any kind. No marketing language. No superlatives like amazing, incredible, unmissable. No bullet points inside the actual draft content. Sound like a well traveled knowledgeable person giving honest advice to a friend. Reference real places, real details, and real observations when possible. Keep it tight. Say one thing well rather than many things adequately. Never use the word journey. Never use the phrase hidden gem. Never use the phrase off the beaten path. Write the way a sharp, warm, specific travel writer would. Direct, no fluff.`

const CALENDAR_PLATFORMS = ['instagram', 'substack']
const PLATFORM_LABELS = { instagram: 'Instagram', substack: 'Substack' }

const SUBSTACK_FORMATS = [
  { id: 'note', label: 'Note', desc: 'A short take for the Substack feed' },
  { id: 'thread', label: 'Thread', desc: 'A series of connected posts that tell a story' },
  { id: 'link-post', label: 'Link Post', desc: 'A sharp reaction to a link you want to share' },
  { id: 'article', label: 'Article', desc: 'A full piece with a hook and structure to build from' },
]

const FORMAT_LABELS = { note: 'Note', thread: 'Thread', 'link-post': 'Link Post', article: 'Article' }

const FORMAT_PROMPTS = {
  note: `Generate a Substack Note. A short standalone social post for the Substack feed. Exactly 2 to 3 sentences. One specific observation, take, or recommendation. Reads like something a well traveled person would post on the fly. No intro, no outro, no context setting. Just the take. Target 40 to 60 words. Return the text only, no JSON, no labels, no formatting.`,
  thread: `Generate a Substack Thread. A series of connected short posts that unfold like a story. Exactly 4 to 6 short paragraphs, each one a single beat or idea that builds on the last. Each paragraph is 1 to 3 sentences. Reads like someone walking you through something they know well. No headers, no bullet points, just flowing short paragraphs. Target 150 to 250 words. Return the text only, no JSON, no labels, no formatting.`,
  'link-post': `Generate a Substack Link Post. A short take above a shared link. Exactly 1 to 2 sentences that make someone want to click through. Opinionated and specific. Not a summary, a reaction or a reason to care. Target 20 to 40 words. Return the text only, no JSON, no labels, no formatting.`,
  article: `Generate a Substack Article starter. First: a strong opening paragraph that hooks the reader in 4 to 6 sentences. Then: a suggested structure for the rest of the piece as 3 to 5 section headings each with one sentence describing what that section covers. Separate the opening paragraph from the section outline with a blank line. Format the outline as "Section Name: one sentence description" on each line. Target 150 to 200 words total. Return the text only, no JSON, no labels, no markdown formatting.`,
}

const COPY_LABELS = {
  instagram: 'Copy for Instagram',
  note: 'Copy for Substack',
  thread: 'Copy for Substack',
  'link-post': 'Copy for Substack',
  article: 'Copy Opening',
}

function SectionHeader({ label, title }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.25rem' }}>{label}</p>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: C.ink, margin: 0 }}>{title}</h2>
    </div>
  )
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function dateKey(d) {
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

function getWeekDays(offset) {
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + offset * 7)
  monday.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function copyText(text) {
  navigator.clipboard?.writeText(text)
}

// ── INSTAGRAM GENERATOR ────────────────────────────────────────────────────
function InstagramGenerator({ saveDraft }) {
  const [mode, setMode] = useState('topic')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const generate = async () => {
    const text = input.trim()
    if (!text || loading) return
    setLoading(true)
    setError('')
    setResult('')

    const context = mode === 'article'
      ? `The user has shared an article or URL. If it looks like a URL, understand what the article says, then draft content inspired by it. The article or URL: ${text}`
      : `The user wants to write about this topic or idea: ${text}`

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `You are the voice of Deriva, a travel advisory brand focused on Italy, Portugal, Spain, and Iceland. ${DERIVA_VOICE}`,
          messages: [{ role: 'user', content: `${context}\n\nGenerate an Instagram caption. 3 to 5 sentences. Conversational, one strong observation or recommendation. Sounds like a knowledgeable friend sharing something worth knowing. No hashtags. No emojis unless they feel natural. End with something that invites engagement, a question or an observation that makes someone want to respond. Return the caption text only, no JSON, no labels.` }],
          maxTokens: 500,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Generation failed')
      const data = await res.json()
      setResult(data.text.trim())
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => { copyText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handleSave = () => { saveDraft('instagram', result, input.trim(), ''); setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: '1rem' }}>Instagram</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => setMode('article')} style={{ ...softBtn, color: mode === 'article' ? C.white : C.mid, backgroundColor: mode === 'article' ? C.terracotta : 'transparent', borderColor: mode === 'article' ? C.terracotta : C.sand }}>From an article</button>
        <button onClick={() => setMode('topic')} style={{ ...softBtn, color: mode === 'topic' ? C.white : C.mid, backgroundColor: mode === 'topic' ? C.terracotta : 'transparent', borderColor: mode === 'topic' ? C.terracotta : C.sand }}>From a topic</button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'article' ? 'Paste a link or article text...' : 'A topic, thought, or observation...'}
        rows={3}
        style={{ ...inp, resize: 'vertical', marginBottom: '0.75rem' }}
      />

      <button onClick={generate} disabled={loading || !input.trim()} style={{ ...primaryBtn, opacity: loading || !input.trim() ? 0.6 : 1, marginBottom: '1rem' }}>
        {loading ? 'Writing...' : 'Generate'}
      </button>

      {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#9E6060', marginBottom: '0.75rem' }}>{error}</p>}

      {loading && !result && (
        <div style={{ padding: '1rem', border: `1px solid ${C.sand}`, backgroundColor: C.parchment }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.tan, margin: 0 }}>Drafting caption...</p>
        </div>
      )}

      {result && (
        <div style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white, padding: '1rem' }}>
          <textarea value={result} onChange={(e) => setResult(e.target.value)} rows={5} style={{ ...inp, resize: 'vertical', lineHeight: '1.7', marginBottom: '0.75rem' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleCopy} style={softBtn}>{copied ? 'Copied' : 'Copy for Instagram'}</button>
            <button onClick={handleSave} style={{ ...softBtn, color: saved ? C.terracotta : C.mid, borderColor: saved ? C.terracotta : C.sand }}>{saved ? 'Saved' : 'Save to Calendar'}</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── SUBSTACK GENERATOR ─────────────────────────────────────────────────────
function SubstackGenerator({ saveDraft }) {
  const [format, setFormat] = useState('note')
  const [mode, setMode] = useState('topic')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const activeFormat = SUBSTACK_FORMATS.find((f) => f.id === format)

  const generate = async () => {
    const text = input.trim()
    if (!text || loading) return
    setLoading(true)
    setError('')
    setResult('')

    const context = mode === 'article'
      ? `The user has shared an article or URL. If it looks like a URL, understand what the article says, then draft content inspired by it. The article or URL: ${text}`
      : `The user wants to write about this topic or idea: ${text}`

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `You are the voice of Deriva, a travel advisory brand focused on Italy, Portugal, Spain, and Iceland. ${DERIVA_VOICE}`,
          messages: [{ role: 'user', content: `${context}\n\n${FORMAT_PROMPTS[format]}` }],
          maxTokens: format === 'note' || format === 'link-post' ? 300 : 1200,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Generation failed')
      const data = await res.json()
      setResult(data.text.trim())
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => { copyText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handleSave = () => { saveDraft('substack', result, input.trim(), format); setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const rows = format === 'note' || format === 'link-post' ? 3 : format === 'thread' ? 10 : 8

  return (
    <div>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: '1rem' }}>Substack</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
        {SUBSTACK_FORMATS.map((f) => {
          const active = format === f.id
          return (
            <button key={f.id} onClick={() => setFormat(f.id)} style={{ ...softBtn, color: active ? C.white : C.mid, backgroundColor: active ? C.terracotta : 'transparent', borderColor: active ? C.terracotta : C.sand }}>
              {f.label}
            </button>
          )
        })}
      </div>
      {activeFormat && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: C.mid, marginBottom: '1rem', lineHeight: '1.5' }}>
          {activeFormat.desc}
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => setMode('article')} style={{ ...softBtn, color: mode === 'article' ? C.white : C.mid, backgroundColor: mode === 'article' ? C.terracotta : 'transparent', borderColor: mode === 'article' ? C.terracotta : C.sand }}>From an article</button>
        <button onClick={() => setMode('topic')} style={{ ...softBtn, color: mode === 'topic' ? C.white : C.mid, backgroundColor: mode === 'topic' ? C.terracotta : 'transparent', borderColor: mode === 'topic' ? C.terracotta : C.sand }}>From a topic</button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'article' ? 'Paste a link or article text...' : 'A topic, thought, or observation...'}
        rows={3}
        style={{ ...inp, resize: 'vertical', marginBottom: '0.75rem' }}
      />

      <button onClick={generate} disabled={loading || !input.trim()} style={{ ...primaryBtn, opacity: loading || !input.trim() ? 0.6 : 1, marginBottom: '1rem' }}>
        {loading ? 'Writing...' : 'Generate'}
      </button>

      {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#9E6060', marginBottom: '0.75rem' }}>{error}</p>}

      {loading && !result && (
        <div style={{ padding: '1rem', border: `1px solid ${C.sand}`, backgroundColor: C.parchment }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.tan, margin: 0 }}>Drafting {activeFormat?.label?.toLowerCase() || 'content'}...</p>
        </div>
      )}

      {result && (
        <div style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white, padding: '1rem' }}>
          <textarea value={result} onChange={(e) => setResult(e.target.value)} rows={rows} style={{ ...inp, resize: 'vertical', lineHeight: '1.7', marginBottom: '0.75rem' }} />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={handleCopy} style={softBtn}>{copied ? 'Copied' : COPY_LABELS[format]}</button>
            <button onClick={handleSave} style={{ ...softBtn, color: saved ? C.terracotta : C.mid, borderColor: saved ? C.terracotta : C.sand }}>{saved ? 'Saved' : 'Save to Calendar'}</button>
            {format === 'article' && (
              <a href="https://derivatravel.substack.com/publish" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', color: C.terracotta, textDecoration: 'none', letterSpacing: '0.1em' }}>
                Open Substack to write the full piece
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── CALENDAR ───────────────────────────────────────────────────────────────
function Calendar({ drafts, updateDraftSchedule }) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [dragId, setDragId] = useState(null)
  const days = getWeekDays(weekOffset)
  const today = dateKey(new Date())

  const byDatePlatform = useMemo(() => {
    const map = {}
    for (const d of drafts) {
      if (!d.scheduledDate) continue
      const key = `${d.scheduledDate}_${d.platform}`
      if (!map[key]) map[key] = []
      map[key].push(d)
    }
    return map
  }, [drafts])

  const handleDrop = (day) => {
    if (!dragId) return
    updateDraftSchedule(dragId, dateKey(day))
    setDragId(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={() => setWeekOffset(weekOffset - 1)} style={softBtn}>Previous Week</button>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: C.charcoal }}>
          {formatDate(days[0])} to {formatDate(days[6])}
        </p>
        <button onClick={() => setWeekOffset(weekOffset + 1)} style={softBtn}>Next Week</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
          <thead>
            <tr>
              <th style={{ width: '80px', padding: '0.5rem' }}></th>
              {days.map((d, i) => {
                const dk = dateKey(d)
                const isToday = dk === today
                return (
                  <th key={dk} style={{ padding: '0.5rem', fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isToday ? C.terracotta : C.tan, textAlign: 'center', borderBottom: `1px solid ${C.sand}` }}>
                    {DAY_NAMES[i]} {d.getDate()}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {CALENDAR_PLATFORMS.map((platform) => (
              <tr key={platform}>
                <td style={{ padding: '0.5rem', fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, verticalAlign: 'top' }}>
                  {PLATFORM_LABELS[platform]}
                </td>
                {days.map((d) => {
                  const dk = dateKey(d)
                  const items = byDatePlatform[`${dk}_${platform}`] || []
                  const isToday = dk === today
                  return (
                    <td
                      key={dk}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(d)}
                      style={{
                        padding: '0.35rem', verticalAlign: 'top',
                        borderBottom: `1px solid ${C.sand}`, borderLeft: `1px solid ${C.sand}`,
                        backgroundColor: isToday ? '#F5EDE0' : 'transparent',
                        minHeight: '50px', minWidth: '80px',
                      }}
                    >
                      {items.map((item) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={() => setDragId(item.id)}
                          style={{
                            backgroundColor: C.parchment, border: `1px solid ${C.sand}`,
                            padding: '0.35rem 0.5rem', marginBottom: '0.25rem', cursor: 'grab',
                            fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem',
                            color: C.charcoal, lineHeight: '1.4',
                            overflow: 'hidden', display: '-webkit-box',
                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {item.format && (
                            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.terracotta, marginRight: '0.35rem' }}>
                              {FORMAT_LABELS[item.format] || item.format}
                            </span>
                          )}
                          {item.text.slice(0, 60)}
                        </div>
                      ))}
                      {items.length === 0 && <div style={{ height: '40px', opacity: 0.3 }} />}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── SAVED DRAFTS ───────────────────────────────────────────────────────────
function SavedDrafts({ drafts, onDelete, onUpdateText }) {
  const [editingId, setEditingId] = useState(null)

  return (
    <div>
      <SectionHeader label="Saved" title="All drafts." />
      {drafts.length === 0 && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.tan }}>No drafts saved yet.</p>
      )}
      {drafts.map((d) => (
        <div key={d.id} style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white, padding: '1.25rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold }}>
              {PLATFORM_LABELS[d.platform] || d.platform}
            </span>
            {d.format && (
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.terracotta }}>
                {FORMAT_LABELS[d.format] || d.format}
              </span>
            )}
            {!d.format && d.platform === 'instagram' && (
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.terracotta }}>
                Caption
              </span>
            )}
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tan }}>
              {formatDate(d.createdAt)}
            </span>
            {d.scheduledDate ? (
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.terracotta }}>
                Scheduled: {formatDate(d.scheduledDate)}
              </span>
            ) : (
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tan }}>
                Unscheduled
              </span>
            )}
          </div>
          {editingId === d.id ? (
            <textarea value={d.text} onChange={(e) => onUpdateText(d.id, e.target.value)} rows={4} style={{ ...inp, resize: 'vertical', lineHeight: '1.7', marginBottom: '0.75rem' }} />
          ) : (
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.7', marginBottom: '0.75rem', whiteSpace: 'pre-wrap' }}>
              {d.text}
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setEditingId(editingId === d.id ? null : d.id)} style={softBtn}>
              {editingId === d.id ? 'Done' : 'Edit'}
            </button>
            <button onClick={() => copyText(d.text)} style={softBtn}>
              {d.platform === 'instagram' ? 'Copy for Instagram' : COPY_LABELS[d.format] || 'Copy'}
            </button>
            <button onClick={() => onDelete(d.id)} style={{ ...softBtn, color: C.terracotta, borderColor: C.terracotta }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── ROOT ───────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'draft', label: 'Draft' },
  { id: 'saved', label: 'Saved' },
]

export default function Content() {
  const [tab, setTab] = useState('draft')
  const [drafts, setDrafts] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/content', { headers: apiHeaders })
      .then((r) => r.json())
      .then((d) => {
        const filtered = (d.drafts || []).filter((x) => x.platform !== 'twitter')
        setDrafts(filtered)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const saveDraft = async (platform, text, prompt, format) => {
    const scheduledDate = dateKey(new Date())
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify({ platform, format, text, prompt, scheduledDate }),
      })
      const data = await res.json()
      if (data.draft) setDrafts([data.draft, ...drafts])
    } catch {}
  }

  const updateDraftSchedule = async (id, scheduledDate) => {
    try {
      await fetch('/api/content', {
        method: 'PATCH',
        headers: apiHeaders,
        body: JSON.stringify({ id, scheduledDate }),
      })
      setDrafts(drafts.map((d) => (d.id === id ? { ...d, scheduledDate, updatedAt: new Date().toISOString() } : d)))
    } catch {}
  }

  const updateDraftText = async (id, text) => {
    setDrafts(drafts.map((d) => (d.id === id ? { ...d, text } : d)))
    try {
      await fetch('/api/content', {
        method: 'PATCH',
        headers: apiHeaders,
        body: JSON.stringify({ id, text }),
      })
    } catch {}
  }

  const handleDelete = async (id) => {
    setDrafts(drafts.filter((d) => d.id !== id))
    try {
      await fetch(`/api/content?id=${id}`, { method: 'DELETE', headers: apiHeaders })
    } catch {}
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.25rem', borderBottom: `1px solid ${C.sand}`, marginBottom: '2rem' }}>
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
                backgroundColor: 'transparent', border: 'none',
                borderBottom: active ? `2px solid ${C.terracotta}` : '2px solid transparent',
                padding: '0.9rem 1.1rem', marginBottom: '-1px',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'draft' && (
        <div>
          <SectionHeader label="Content" title="Draft something in Deriva's voice." />
          <div className="content-generators" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <InstagramGenerator saveDraft={saveDraft} />
            <SubstackGenerator saveDraft={saveDraft} />
          </div>
          <SectionHeader label="Calendar" title="Weekly content schedule." />
          {loaded && <Calendar drafts={drafts} updateDraftSchedule={updateDraftSchedule} />}
        </div>
      )}

      {tab === 'saved' && (
        <SavedDrafts drafts={drafts} onDelete={handleDelete} onUpdateText={updateDraftText} />
      )}

      <style>{`
        @media (max-width: 768px) {
          .content-generators { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
