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
  ...[
    'Rome restaurant opening 2026',
    'Florence food scene 2026',
    'Sicily travel guide',
    'Lake Como hotel',
    'Amalfi coast restaurants',
    'Rome neighborhood guide',
    'Milan design food culture',
    'Puglia travel',
  ].map((q) => ({ url: gnews(q), tag: 'Italy' })),
  ...[
    'Lisbon restaurant opening 2026',
    'Porto food scene',
    'Portugal boutique hotel',
    'Lisbon neighborhood guide',
    'Algarve travel 2026',
    'Alentejo wine food',
  ].map((q) => ({ url: gnews(q), tag: 'Portugal' })),
  ...[
    'Barcelona restaurant 2026',
    'Madrid food scene',
    'San Sebastian gastronomy',
    'Spain boutique hotel',
    'Seville travel guide',
  ].map((q) => ({ url: gnews(q), tag: 'Spain' })),
  ...[
    'Reykjavik restaurant 2026',
    'Iceland travel guide',
    'Iceland boutique hotel',
    'Iceland food culture',
  ].map((q) => ({ url: gnews(q), tag: 'Iceland' })),
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml', tag: 'General' },
  { url: 'https://www.theguardian.com/travel/rss', tag: 'General' },
  { url: 'https://www.cntraveler.com/feed/rss', tag: 'General' },
  { url: 'https://www.eater.com/rss/index.xml', tag: 'General' },
  { url: 'https://www.foodandwine.com/rss', tag: 'General' },
  { url: 'https://monocle.com/feed/', tag: 'General' },
  { url: 'https://www.timeout.com/travel/rss', tag: 'General' },
  { url: 'https://www.theflorentine.net/feed', tag: 'Italy' },
  { url: 'https://www.portugalresident.com/feed', tag: 'Portugal' },
  { url: 'https://www.icelandreview.com/feed', tag: 'Iceland' },
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

const DESTINATIONS_INFO = [
  {
    id: 'italy',
    name: 'Italy',
    overview: [
      "Italy is not one country, it is a stack of regions that happen to share a passport. The north and the south can feel like different worlds, with different food, different rhythms, and different relationships to time. A trip that treats Florence and Palermo as variations on a theme will miss almost everything that matters. The first thing to internalize is that local and seasonal are not buzzwords here, they are how the entire culture organizes its day. If a restaurant in Bologna is serving the same menu it served in July, something is wrong.",
      "Rome and Florence pull a lot of the same clients but they reward completely different approaches. Rome is layered, scrappy, and best when you let it set the pace. Florence is compact and precise, and the trick there is staying long enough to leave the historical center for a real meal. Both cities have a heavy daytripper problem and both punish people who try to hit the highlights in two days.",
      "Lake Como is a specific kind of luxury that does not translate well to people who think luxury means a five star buffet. The point is the proportion, the lemons, the slow boat from Bellagio, and a long lunch on a terrace where nothing is rushing you. Sicily and Puglia are the regions to send curious clients who already know Italy and want something that feels less performed.",
    ],
    keyThings: [
      'Tipping is not expected. Rounding up the bill or leaving a euro or two for excellent service is plenty. Coperto on the bill is a cover charge, not a tip.',
      'Lunch is the main meal in many regions, especially Sunday lunch. Dinner can be lighter and later, often starting at 8pm or 9pm.',
      'Aperitivo is a real cultural ritual between roughly 6pm and 8pm, not just a marketing term. In Milan it can replace dinner if you commit to it.',
      'Avoid restaurants with photo menus, multilingual chalkboards, and hosts pulling people in off the street, especially within 200 meters of a major landmark.',
      'August is when Italians leave the cities for the coast. Many of the best restaurants close for two or three weeks. Plan around it.',
      'Churches enforce dress codes. Shoulders and knees covered, no exceptions at the Vatican or the Duomo.',
      'On regional trains you must validate paper tickets in the green or yellow machines on the platform before boarding. Fines for skipping this are real.',
    ],
  },
  {
    id: 'portugal',
    name: 'Portugal',
    overview: [
      "Portugal punches well above its weight, and Lisbon is the clearest example. It is a small capital with the food scene of a city three times its size, an architecture and tile tradition that rewards walking with no plan, and a music tradition (fado) that holds the city's emotional center. The melancholy people talk about is real, and so is the warmth that sits right next to it. The country is gentler than Spain and slower than Italy, and that is the feature, not the bug.",
      "Porto is consistently underrated. It feels more honest than Lisbon, more compact, and the food and wine are doing more interesting things than most visitors realize. The Douro Valley is one of the great wine regions in Europe and almost no one outside the trade treats it that way. Send curious eaters and drinkers there with two or three nights at minimum.",
      "The Alentejo is the quiet choice for serious travelers. Wide open landscape, ancient hilltop towns, very good wine, and almost no crowds. It rewards people who want to slow down and read the room. The Algarve is its own thing, beach-driven and seasonal, best in shoulder months when the heat and the crowds back off.",
    ],
    keyThings: [
      'Tipping is not mandatory but 5 to 10 percent is appreciated for good service. Round up at cafes.',
      'Dinner starts late by Northern European standards, usually 8pm or after. Make reservations the day of for anywhere serious.',
      'Lisbon is built on hills and the cobblestones are slick when wet. Bring shoes with grip.',
      'Uber and Bolt both work well in Lisbon and Porto. Cheaper and easier than taxis.',
      'The Time Out Market is fine for a beer and a snack. Do not make it your primary food experience in Lisbon.',
      'Many of the best small restaurants do not take reservations and fill up by 8pm. Show up early or be ready to wait.',
      'Pastel de nata is famous for a reason but the food culture goes much deeper. Seafood, bifana, ameijoas, the cheeses from the Serra da Estrela. Push past the obvious.',
    ],
  },
  {
    id: 'spain',
    name: 'Spain',
    overview: [
      "Spain is regional in a way most American travelers underestimate. Barcelona and Madrid are not two flavors of the same city, they are genuinely different places with different languages, different politics, different food, and different ideas about how to be a city. The same is true comparing Andalusia to the Basque Country or Galicia to Catalonia. A trip that treats Spain as a single country will miss the point.",
      "San Sebastian is one of the world's great food destinations and it earns the reputation. The pintxos bars in the Parte Vieja are the obvious starting point but the real story is the density of serious restaurants in and around the city. People plan entire trips around it and they are right to. Madrid does not get the credit it deserves for its food scene either, especially the markets and the older taverns.",
      "Spanish meal culture is intense and on its own clock. Lunch is long and serious, dinner is late and social, and the spaces between are filled with coffee, wine, and small bites. Trying to force the day into a North American or even Northern European rhythm is the single fastest way to have a bad time. Spain is also routinely underplanned, especially Andalusia in spring and the Basque Country in summer.",
    ],
    keyThings: [
      'Lunch runs roughly 2pm to 4pm. Dinner starts at 9pm and a 10pm or 11pm reservation is normal. Adjust the day around it.',
      'Tipping is not expected. A euro or two on a coffee or beer, a few euros on a nice dinner is generous.',
      'Pintxos is the Basque word and the format is small bites on bread, often with a toothpick. Tapas is the southern format and is broader. They are not interchangeable.',
      'Siesta is real outside the big cities. Many shops and small restaurants close from roughly 2pm to 5pm. Plan errands and museums around it.',
      'Barcelona pickpocketing is real, especially on La Rambla, the metro, and around Sagrada Familia. Front pockets, no phone on the table at outdoor cafes.',
      'San Sebastian restaurants book months out, especially the three star tier and the well known mid range spots. Reserve before booking flights for serious food trips.',
      'In Andalusia in July and August the heat is no joke. Mornings, late evenings, and indoor lunches are how locals do it.',
    ],
  },
  {
    id: 'iceland',
    name: 'Iceland',
    overview: [
      "Iceland operates at a scale that is hard to grasp from photos. The landscape is bigger and emptier than first time visitors expect, and that is the entire point. People come for waterfalls and glaciers and end up most affected by the long stretches of nothing in between. The country rewards travelers who let the landscape do the work and resist the urge to overschedule.",
      "The Ring Road is a great trip if you have at least eight to ten days. For shorter visits it is overrated and turns into a driving marathon that misses the actual experience. A more honest plan for a four to seven day trip is to base out of Reykjavik and the south coast, or to fly to Akureyri and explore the north. Reykjavik itself is smaller than people imagine, more like a creative neighborhood than a capital, and that is part of the charm.",
      "The seasons here are not metaphors. Winter is dark and dramatic and the right call for Northern Lights and ice caves. Summer is bright around the clock and the right call for hiking, puffins, and the highlands. Choosing the wrong season for the wrong reason is the most common mistake. Iceland rewards curiosity over itinerary, and the best moments are usually the unscheduled ones.",
    ],
    keyThings: [
      'Tipping is not customary anywhere. Service is included and rounding up is the most you would do.',
      'Everything is expensive. Budget accordingly, especially restaurants and alcohol. A nice dinner for two can easily run 200 dollars or more.',
      'Weather changes fast and often. Dress in layers, always have a waterproof shell, and check road and weather conditions daily on vedur.is and road.is.',
      'Northern Lights tours and ice cave tours book up. Reserve before the trip if either is a priority.',
      'A rental car is strongly recommended outside Reykjavik. Tour buses are an option but limit you. A 4x4 is needed for any F road or the highlands in summer.',
      'Tap water is among the best in the world. Skip the bottled water entirely.',
      'In June and July the sun barely sets. Blackout curtains, a sleep mask, and a flexible idea of bedtime matter more than people expect.',
    ],
  },
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

// ── DESTINATIONS TAB ────────────────────────────────────────────────────────
function DestinationsTab() {
  const [notes, setNotes] = useLocalStorage('deriva_research_destination_notes', {})
  const [open, setOpen] = useState(() => ({ italy: true, portugal: false, spain: false, iceland: false }))

  const toggle = (id) => setOpen({ ...open, [id]: !open[id] })
  const updateNote = (id, value) => setNotes({ ...notes, [id]: value })

  return (
    <div>
      <SectionHeader label="Destinations" title="Knowledge reference for the four." />
      {DESTINATIONS_INFO.map((d) => {
        const isOpen = open[d.id]
        return (
          <div key={d.id} style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white, marginBottom: '1rem' }}>
            <button
              onClick={() => toggle(d.id)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                padding: '1.1rem 1.5rem',
                borderBottom: isOpen ? `1px solid ${C.sand}` : 'none',
              }}
            >
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: C.ink }}>{d.name}</span>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: C.tan, letterSpacing: '0.1em' }}>
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && (
              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.75rem' }}>
                    Overview
                  </p>
                  {d.overview.map((para, i) => (
                    <p key={i} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.85', marginBottom: '1rem' }}>
                      {para}
                    </p>
                  ))}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.75rem' }}>
                    Key Things to Know
                  </p>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {d.keyThings.map((item, i) => (
                      <li
                        key={i}
                        style={{
                          fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', fontWeight: '300',
                          color: C.charcoal, lineHeight: '1.7', marginBottom: '0.7rem',
                          paddingLeft: '1rem', position: 'relative',
                        }}
                      >
                        <span style={{ position: 'absolute', left: 0, color: C.terracotta }}>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.75rem' }}>
                    Your Notes
                  </p>
                  <textarea
                    value={notes[d.id] || ''}
                    onChange={(e) => updateNote(d.id, e.target.value)}
                    placeholder="Add your own notes, observations, and things you have learned about this destination..."
                    rows={6}
                    style={{ ...inp, resize: 'vertical', lineHeight: '1.7' }}
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── ROOT ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'feed', label: 'Feed' },
  { id: 'following', label: 'Following' },
  { id: 'destinations', label: 'Destinations' },
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
      {tab === 'destinations' && <DestinationsTab />}
      {tab === 'research' && <ResearchSearchTab savedItems={savedItems} setSavedItems={setSavedItems} />}
      {tab === 'instagram' && <InstagramTab />}
      {tab === 'saved' && <SavedTab savedItems={savedItems} setSavedItems={setSavedItems} />}
    </div>
  )
}
