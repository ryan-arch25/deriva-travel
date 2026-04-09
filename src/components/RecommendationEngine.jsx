import { useState } from 'react'

const colors = {
  cream: '#F5F0E8',
  parchment: '#EDE6D8',
  sand: '#D8CCBA',
  tan: '#C8B89A',
  gold: '#9E8660',
  mid: '#7A6E62',
  charcoal: '#3A3630',
  ink: '#1E1C18',
  white: '#FDFAF5',
}

const SYSTEM_PROMPT = `You are Deriva's travel curator. You are editorial, knowledgeable, and direct.
You recommend places most people overlook. You never say "hidden gem."
You never say "off the beaten path." You never sound like TripAdvisor.
Sound like a well-traveled friend who actually went.
Short sentences. No filler. Occasionally opinionated.
Never use em dashes. Use commas or periods instead.`

export default function RecommendationEngine({ destination, restaurants, stays }) {
  const [vibe, setVibe] = useState('')
  const [party, setParty] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const labelStyle = {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '0.65rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: colors.tan,
    display: 'block',
    marginBottom: '0.5rem',
  }

  const inputStyle = {
    width: '100%',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '0.9rem',
    fontWeight: '300',
    color: colors.ink,
    backgroundColor: colors.white,
    border: `1px solid ${colors.sand}`,
    padding: '0.75rem 1rem',
    outline: 'none',
    appearance: 'none',
  }

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239E8660' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    paddingRight: '2.5rem',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResults(null)

    const restaurantData = restaurants.map(r =>
      `${r.name} (${r.city}, ${r.neighborhood}) -- ${r.priceTier} -- ${r.note}`
    ).join('\n')

    const stayData = stays.map(s =>
      `${s.name} (${s.city}, ${s.neighborhood}) -- ${s.priceTier} -- ${s.note}`
    ).join('\n')

    const userMessage = `
A traveler is planning a trip to ${destination} and wants personalized picks.

Their vibe: ${vibe}
Travel party: ${party}
Notes: ${notes || 'None provided'}

Here is the curated data to draw from:

RESTAURANTS:
${restaurantData}

STAYS:
${stayData}

Return a JSON object with this exact structure:
{
  "intro": "2 sentences max. Direct. No filler. Tell them what you picked and why it fits them.",
  "restaurants": [
    {
      "name": "restaurant name",
      "city": "city",
      "neighborhood": "neighborhood",
      "priceTier": "$ or $$ or $$$ or $$$$",
      "note": "1-2 sentences, Deriva voice. Why this one for them specifically."
    }
  ],
  "stays": [
    {
      "name": "hotel/stay name",
      "city": "city",
      "neighborhood": "neighborhood",
      "priceTier": "$ or $$ or $$$ or $$$$",
      "note": "1-2 sentences, Deriva voice. Why this one for them specifically."
    }
  ]
}

Pick 3-4 restaurants and 2-3 stays. Only pick from the provided data. No invented places.
Return valid JSON only. No markdown, no explanation outside the JSON.`

    try {
      const res = await fetch('/api/anthropic/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(`${res.status}: ${body.error?.message || res.statusText}`)
      }
      const data = await res.json()
      const text = data.content[0].text.trim()
      const json = JSON.parse(text)
      setResults(json)
    } catch (err) {
      console.error(err)
      setError(`Something went wrong: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: '3rem' }}>
      <div style={{
        borderTop: `1px solid ${colors.sand}`,
        paddingTop: '3rem',
      }}>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: colors.tan,
          marginBottom: '0.75rem',
        }}>
          Get Picks For Your Trip
        </p>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.6rem',
          fontWeight: '400',
          color: colors.ink,
          marginBottom: '0.5rem',
        }}>
          Tell me about the trip.
        </h2>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.9rem',
          fontWeight: '300',
          color: colors.mid,
          lineHeight: '1.6',
          marginBottom: '2rem',
          maxWidth: '480px',
        }}>
          Three questions. I will filter the picks to match.
        </p>

        <form onSubmit={handleSubmit} style={{ maxWidth: '560px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle} htmlFor="rec-vibe">What is the vibe?</label>
            <select
              id="rec-vibe"
              value={vibe}
              onChange={e => setVibe(e.target.value)}
              required
              style={selectStyle}
            >
              <option value="">Select...</option>
              <option value="relaxed and slow">Relaxed and slow</option>
              <option value="food-focused">Food-focused</option>
              <option value="cultural and exploratory">Cultural and exploratory</option>
              <option value="active and outdoor">Active and outdoor</option>
              <option value="romantic">Romantic</option>
              <option value="mix of everything">Mix of everything</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle} htmlFor="rec-party">Who is coming?</label>
            <select
              id="rec-party"
              value={party}
              onChange={e => setParty(e.target.value)}
              required
              style={selectStyle}
            >
              <option value="">Select...</option>
              <option value="solo">Solo</option>
              <option value="couple">Partner / couple</option>
              <option value="friends">Friends</option>
              <option value="family with kids">Family with kids</option>
              <option value="group">Group</option>
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={labelStyle} htmlFor="rec-notes">Anything specific? (optional)</label>
            <textarea
              id="rec-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Budget range, dietary needs, things to avoid..."
              rows={3}
              style={{
                ...inputStyle,
                resize: 'vertical',
                fontFamily: 'system-ui, sans-serif',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: colors.white,
              backgroundColor: loading ? colors.tan : colors.gold,
              border: 'none',
              padding: '1rem 2rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
            }}
          >
            {loading ? 'Getting your picks...' : 'Get My Picks'}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#FDF0E8',
            border: `1px solid ${colors.tan}`,
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.85rem',
            color: colors.charcoal,
          }}>
            {error}
          </div>
        )}

        {results && (
          <div style={{ marginTop: '3rem', maxWidth: '720px' }}>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.05rem',
              fontStyle: 'italic',
              color: colors.charcoal,
              lineHeight: '1.7',
              marginBottom: '2.5rem',
              borderLeft: `2px solid ${colors.gold}`,
              paddingLeft: '1.25rem',
            }}>
              {results.intro}
            </p>

            {results.restaurants?.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: colors.tan,
                  marginBottom: '1rem',
                }}>
                  Where to Eat
                </p>
                {results.restaurants.map((r, i) => (
                  <SpotCard key={i} spot={r} />
                ))}
              </div>
            )}

            {results.stays?.length > 0 && (
              <div>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: colors.tan,
                  marginBottom: '1rem',
                }}>
                  Where to Stay
                </p>
                {results.stays.map((s, i) => (
                  <SpotCard key={i} spot={s} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SpotCard({ spot }) {
  return (
    <div style={{
      padding: '1.25rem',
      borderBottom: `1px solid ${colors.sand}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '1rem',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <h4 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1rem',
            fontWeight: '400',
            color: colors.ink,
          }}>
            {spot.name}
          </h4>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            color: colors.gold,
          }}>
            {spot.priceTier}
          </span>
        </div>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.75rem',
          color: colors.tan,
          marginBottom: '0.5rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          {spot.neighborhood}, {spot.city}
        </p>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.875rem',
          fontWeight: '300',
          color: colors.mid,
          lineHeight: '1.6',
        }}>
          {spot.note}
        </p>
      </div>
    </div>
  )
}
