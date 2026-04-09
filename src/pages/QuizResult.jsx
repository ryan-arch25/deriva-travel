import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

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

const DESTINATIONS = [
  { name: 'Portugal', slug: 'portugal' },
  { name: 'Italy', slug: 'italy' },
  { name: 'Iceland', slug: 'iceland' },
  { name: 'Spain', slug: 'spain' },
]

const SYSTEM_PROMPT = `You are Deriva's travel curator. You are editorial, knowledgeable, and direct.
You recommend places most people overlook. You never say "hidden gem."
You never say "off the beaten path." You never sound like TripAdvisor.
Sound like a well-traveled friend who actually went.
Short sentences. No filler. Occasionally opinionated.
Never use em dashes. Use commas or periods instead.`

export default function QuizResult() {
  const location = useLocation()
  const answers = location.state?.answers || {}
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!Object.keys(answers).length) {
      setError('No quiz answers found. Please take the quiz first.')
      setLoading(false)
      return
    }
    getMatch()
  }, [])

  const getMatch = async () => {
    const prompt = `A traveler has answered a destination matching quiz. Based on their answers, recommend the single best destination from this list: Portugal, Italy, Iceland, Spain.

Their answers:
- What's pulling them: ${answers.pull}
- Travel party: ${answers.party}
- Trip length: ${answers.length}
- Budget: ${answers.budget}
- Pace: ${answers.pace}
- Preferred setting: ${answers.place}
- What they want to feel: ${answers.feel}

Return a JSON object with this exact structure:
{
  "destination": "Portugal" or "Italy" or "Iceland" or "Spain",
  "explanation": "2-3 sentences max. Direct. Confident. Explain why this destination fits them specifically. Reference their answers. No filler. No generic travel-guide language."
}

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
          max_tokens: 256,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(`${res.status}: ${body.error?.message || res.statusText}`)
      }
      const data = await res.json()
      const text = data.content[0].text.trim()
      const json = JSON.parse(text)
      setResult(json)
    } catch (err) {
      console.error(err)
      setError(`Could not get your match: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const matchedDest = result
    ? DESTINATIONS.find(d => d.name.toLowerCase() === result.destination.toLowerCase())
    : null

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
      <Nav />
      <div style={{ paddingTop: '60px' }}>
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '6rem 2rem',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {loading && (
            <div>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: colors.tan,
                marginBottom: '1rem',
              }}>
                Finding your match
              </p>
              <p style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.5rem',
                color: colors.ink,
                fontWeight: '400',
              }}>
                Reading your answers...
              </p>
            </div>
          )}

          {error && (
            <div>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.9rem',
                color: colors.mid,
                marginBottom: '1.5rem',
              }}>
                {error}
              </p>
              <Link
                to="/quiz"
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.7rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: colors.white,
                  backgroundColor: colors.gold,
                  padding: '0.9rem 2rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Retake Quiz
              </Link>
            </div>
          )}

          {result && matchedDest && (
            <div>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: colors.tan,
                marginBottom: '1rem',
              }}>
                Your Match
              </p>
              <h1 style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontWeight: '400',
                color: colors.ink,
                letterSpacing: '0.04em',
                lineHeight: '1',
                marginBottom: '2rem',
              }}>
                {result.destination}
              </h1>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '1rem',
                fontWeight: '300',
                color: colors.charcoal,
                lineHeight: '1.75',
                maxWidth: '520px',
                marginBottom: '3rem',
                borderLeft: `2px solid ${colors.gold}`,
                paddingLeft: '1.25rem',
              }}>
                {result.explanation}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to={`/destinations/${matchedDest.slug}`}
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '0.7rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: colors.white,
                    backgroundColor: colors.gold,
                    padding: '1rem 2rem',
                    textDecoration: 'none',
                  }}
                >
                  Explore {result.destination}
                </Link>
                <Link
                  to="/work-with-me"
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '0.7rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: colors.ink,
                    backgroundColor: 'transparent',
                    padding: '1rem 2rem',
                    textDecoration: 'none',
                    border: `1px solid ${colors.sand}`,
                  }}
                >
                  Work With Me
                </Link>
              </div>

              <div style={{ marginTop: '3rem' }}>
                <Link
                  to="/quiz"
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: colors.tan,
                    textDecoration: 'none',
                    borderBottom: `1px solid ${colors.sand}`,
                    paddingBottom: '2px',
                  }}
                >
                  Retake Quiz
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
