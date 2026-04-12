import { useState, useEffect, useMemo } from 'react'

const C = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18',
  white: '#FDFAF5', terracotta: '#B85C45',
}
const ADVISOR_TOKEN = 'deriva2024'
const headers = { 'Content-Type': 'application/json', 'x-advisor-auth': ADVISOR_TOKEN }

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
  border: `1px solid ${C.sand}`, padding: '0.45rem 0.8rem', cursor: 'pointer',
}

const DERIVA_VOICE = `Write in first person. Be specific not generic. No em dashes or double dashes of any kind. No marketing language. No superlatives like amazing, incredible, unmissable. No bullet points. No lists. Sound like a well traveled person giving honest advice to a friend. Reference real places, real details, real observations when possible. Keep it short. Say one thing well rather than many things adequately. Never use the word journey. Never use the phrase hidden gem. Use commas and periods instead of dashes.`

const PLATFORMS = ['instagram', 'twitter', 'substack']
const PLATFORM_LABELS = { instagram: 'Instagram', twitter: 'Tweet', substack: 'Substack' }

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

// ── DRAFTING TOOL ──────────────────────────────────────────────────────────
function DraftingTool({ drafts, setDrafts, saveDraft }) {
  const [mode, setMode] = useState('article')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)

  const generate = async () => {
    const text = input.trim()
    if (!text || loading) return
    setLoading(true)
    setError('')
    setResults(null)

    const context = mode === 'article'
      ? `The user has shared an article or URL. Use web search if it looks like a URL to understand what the article says, then draft content inspired by it. The article or URL: ${text}`
      : `The user wants to write about this topic or idea: ${text}`

    const prompt = `${context}

Generate exactly three content drafts. Return valid JSON only, no markdown fencing. The format:
{
  "instagram": "3 to 5 sentence caption. Conversational, one strong observation or recommendation. Sounds like a knowledgeable friend sharing something worth knowing. No hashtags. No emojis unless they feel natural. End with something that invites engagement, a question or an observation that makes someone want to respond.",
  "twitter": "One punchy sentence or take. Under 280 characters. Sounds like a real person with a point of view, not a brand account. Specific and direct. No hashtags. No filler.",
  "substack": "Opening paragraph of a longer piece. 4 to 6 sentences. Hooks the reader with a specific observation, a question, or a moment. Does not summarize. It pulls the reader in. Written in first person."
}`

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `You are the voice of Deriva, a travel advisory brand focused on Italy, Portugal, Spain, and Iceland. ${DERIVA_VOICE}`,
          messages: [{ role: 'user', content: prompt }],
          maxTokens: 1500,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Generation failed')
      const data = await res.json()
      const cleaned = data.text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      const parsed = JSON.parse(cleaned)
      setResults({
        instagram: parsed.instagram || '',
        twitter: parsed.twitter || '',
        substack: parsed.substack || '',
      })
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyText = (text) => {
    navigator.clipboard?.writeText(text)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setMode('article')}
          style={{ ...softBtn, color: mode === 'article' ? C.white : C.mid, backgroundColor: mode === 'article' ? C.terracotta : 'transparent', borderColor: mode === 'article' ? C.terracotta : C.sand }}
        >
          Start from an article
        </button>
        <button
          onClick={() => setMode('topic')}
          style={{ ...softBtn, color: mode === 'topic' ? C.white : C.mid, backgroundColor: mode === 'topic' ? C.terracotta : 'transparent', borderColor: mode === 'topic' ? C.terracotta : C.sand }}
        >
          Start from a topic
        </button>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={lbl}>{mode === 'article' ? 'Paste a URL or article text' : 'What do you want to write about?'}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'article'
            ? 'Paste a link or the text of an article you want to turn into content...'
            : 'A topic, thought, observation, or recommendation...'}
          rows={3}
          style={{ ...inp, resize: 'vertical' }}
        />
      </div>

      <button onClick={generate} disabled={loading || !input.trim()} style={{ ...primaryBtn, opacity: loading || !input.trim() ? 0.6 : 1, marginBottom: '1.5rem' }}>
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#9E6060', marginBottom: '1rem' }}>{error}</p>}

      {loading && (
        <div style={{ padding: '1.25rem', border: `1px solid ${C.sand}`, backgroundColor: C.parchment, marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.tan, margin: 0 }}>Writing three drafts in Deriva's voice...</p>
        </div>
      )}

      {results && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {PLATFORMS.map((platform) => (
            <DraftCard
              key={platform}
              platform={platform}
              text={results[platform]}
              onChange={(val) => setResults({ ...results, [platform]: val })}
              onCopy={() => copyText(results[platform])}
              onSave={() => saveDraft(platform, results[platform], input.trim())}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function DraftCard({ platform, text, onChange, onCopy, onSave }) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    onSave()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white, padding: '1.25rem' }}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.75rem' }}>
        {PLATFORM_LABELS[platform]}
      </p>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        rows={platform === 'twitter' ? 3 : platform === 'substack' ? 6 : 5}
        style={{ ...inp, resize: 'vertical', lineHeight: '1.7', marginBottom: '0.75rem' }}
      />
      {platform === 'twitter' && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', color: text.length > 280 ? '#9E6060' : C.tan, marginBottom: '0.5rem' }}>
          {text.length}/280
        </p>
      )}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={handleCopy} style={softBtn}>{copied ? 'Copied' : 'Copy'}</button>
        <button onClick={handleSave} style={{ ...softBtn, color: saved ? C.terracotta : C.mid, borderColor: saved ? C.terracotta : C.sand }}>
          {saved ? 'Saved' : 'Save to Calendar'}
        </button>
      </div>
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
              <th style={{ width: '80px', padding: '0.5rem', fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.tan, textAlign: 'left' }}></th>
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
            {PLATFORMS.map((platform) => (
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
                        padding: '0.35rem',
                        verticalAlign: 'top',
                        borderBottom: `1px solid ${C.sand}`,
                        borderLeft: `1px solid ${C.sand}`,
                        backgroundColor: isToday ? '#F5EDE0' : 'transparent',
                        minHeight: '50px',
                        minWidth: '80px',
                      }}
                    >
                      {items.map((item) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={() => setDragId(item.id)}
                          style={{
                            backgroundColor: C.parchment,
                            border: `1px solid ${C.sand}`,
                            padding: '0.35rem 0.5rem',
                            marginBottom: '0.25rem',
                            cursor: 'grab',
                            fontFamily: 'system-ui, sans-serif',
                            fontSize: '0.7rem',
                            color: C.charcoal,
                            lineHeight: '1.4',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {item.text.slice(0, 80)}
                        </div>
                      ))}
                      {items.length === 0 && (
                        <div style={{ height: '40px', opacity: 0.3 }} />
                      )}
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
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tan }}>
              {formatDate(d.createdAt)}
            </span>
            {d.scheduledDate && (
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.terracotta }}>
                Scheduled: {formatDate(d.scheduledDate)}
              </span>
            )}
            {!d.scheduledDate && (
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tan }}>
                Unscheduled
              </span>
            )}
          </div>
          {editingId === d.id ? (
            <textarea
              value={d.text}
              onChange={(e) => onUpdateText(d.id, e.target.value)}
              rows={4}
              style={{ ...inp, resize: 'vertical', lineHeight: '1.7', marginBottom: '0.75rem' }}
            />
          ) : (
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.7', marginBottom: '0.75rem', whiteSpace: 'pre-wrap' }}>
              {d.text}
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setEditingId(editingId === d.id ? null : d.id)} style={softBtn}>
              {editingId === d.id ? 'Done' : 'Edit'}
            </button>
            <button onClick={() => navigator.clipboard?.writeText(d.text)} style={softBtn}>Copy</button>
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
    fetch('/api/content', { headers })
      .then((r) => r.json())
      .then((d) => { setDrafts(d.drafts || []); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  const saveDraft = async (platform, text, prompt) => {
    const scheduledDate = dateKey(new Date())
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers,
        body: JSON.stringify({ platform, text, prompt, scheduledDate }),
      })
      const data = await res.json()
      if (data.draft) setDrafts([data.draft, ...drafts])
    } catch {}
  }

  const updateDraftSchedule = async (id, scheduledDate) => {
    try {
      await fetch('/api/content', {
        method: 'PATCH',
        headers,
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
        headers,
        body: JSON.stringify({ id, text }),
      })
    } catch {}
  }

  const handleDelete = async (id) => {
    setDrafts(drafts.filter((d) => d.id !== id))
    try {
      await fetch(`/api/content?id=${id}`, { method: 'DELETE', headers })
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

      {tab === 'draft' && (
        <div>
          <SectionHeader label="Content" title="Draft something in Deriva's voice." />
          <DraftingTool drafts={drafts} setDrafts={setDrafts} saveDraft={saveDraft} />
          <div style={{ marginTop: '3rem' }}>
            <SectionHeader label="Calendar" title="Weekly content schedule." />
            {loaded && <Calendar drafts={drafts} updateDraftSchedule={updateDraftSchedule} />}
          </div>
        </div>
      )}

      {tab === 'saved' && (
        <SavedDrafts drafts={drafts} onDelete={handleDelete} onUpdateText={updateDraftText} />
      )}
    </div>
  )
}
