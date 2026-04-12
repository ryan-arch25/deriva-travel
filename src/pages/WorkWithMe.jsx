import { useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const colors = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18', white: '#FDFAF5',
}

const WHAT_I_OFFER = [
  'A day-by-day itinerary built around how you actually travel, not a template',
  'Restaurant picks that are current, not whatever topped a list two years ago',
  'Hotel recommendations chosen for character, location, and value instead of star ratings',
  'Full service option available. I handle all bookings including tours, hotels, and ground transportation',
  'One round of revisions included',
]

const HOW_IT_WORKS = [
  { num: '01', text: 'Share your idea with me' },
  { num: '02', text: 'We talk through the details' },
  { num: '03', text: 'I take it from there' },
]

const initialForm = { name: '', email: '', destinations: '', dates: '', partySize: '', tripNotes: '', referral: '' }

export default function WorkWithMe() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const labelStyle = { fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.tan, display: 'block', marginBottom: '0.5rem' }
  const inputStyle = { width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: colors.ink, backgroundColor: colors.white, border: `1px solid ${colors.sand}`, padding: '0.75rem 1rem', outline: 'none', marginBottom: '1.5rem', appearance: 'none' }
  const selectStyle = { ...inputStyle, cursor: 'pointer', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239E8660' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', paddingRight: '2.5rem' }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      // Fire both endpoints in parallel. Formspree handles email
      // notification, /api/leads stores the lead in the dashboard.
      const [formspreeRes] = await Promise.all([
        fetch('https://formspree.io/f/mgopjvbz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(form),
        }),
        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }).catch(() => {}),
      ])
      if (!formspreeRes.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or email directly.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
        <Nav />
        <div style={{ maxWidth: '620px', margin: '0 auto', padding: '8rem 2rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ width: '3rem', height: '1px', backgroundColor: colors.gold, marginBottom: '2rem' }} />
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.gold, marginBottom: '1.5rem' }}>Received</p>
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(1.9rem, 3.8vw, 2.5rem)', fontWeight: '500', color: colors.ink, lineHeight: '1.25' }}>
            Thanks for reaching out. I'll be in touch within 24 hours to schedule a quick call to talk through your trip.
          </h2>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
      <Nav />
      <div style={{ paddingTop: '60px' }}>
        <div className="hero-mobile" style={{ position: 'relative', height: '60vh', minHeight: '420px', overflow: 'hidden' }}>
          <img src="/images/work-with-me-hero.jpg" alt="Vintage Fiat 500 on a coastal road in Capri" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(20,18,14,0.15) 0%, rgba(20,18,14,0) 40%, rgba(20,18,14,0.35) 100%)' }} />
        </div>
        <div style={{ backgroundColor: colors.parchment, borderBottom: `1px solid ${colors.sand}`, padding: '5rem 2rem 4rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '1rem' }}>Work With Me</p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '400', color: colors.ink, letterSpacing: '0.03em', marginBottom: '1rem', lineHeight: '1.1' }}>Europe, planned properly.</h1>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', fontWeight: '400', color: colors.charcoal, maxWidth: '560px', lineHeight: '1.6', marginBottom: '1.5rem' }}>The difference between a good trip and a great one is almost never the destination. It is the details. Fill out the form and lets talk about yours.</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', fontWeight: '400', color: colors.charcoal, maxWidth: '520px', lineHeight: '1.6', marginBottom: '1.5rem' }}>Most itineraries are built from the same ten articles. Mine aren't.</p>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', fontWeight: '300', color: colors.mid, maxWidth: '560px', lineHeight: '1.8', marginBottom: '1rem' }}>I stay current on what's actually worth your time in Europe right now. The restaurants people are talking about, the neighborhoods that haven't tipped yet, the hotels that deliver. You get a real plan from someone who pays attention.</p>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', fontWeight: '300', color: colors.mid, maxWidth: '560px', lineHeight: '1.8' }}>I work with a limited number of clients at a time. If you're serious about the trip, fill out the form below and I'll be in touch to set up a call.</p>
          </div>
        </div>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', marginBottom: '5rem' }}>
            <div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '1.5rem' }}>What I Offer</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {WHAT_I_OFFER.map((item, i) => (
                  <li key={i} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: colors.charcoal, lineHeight: '1.7', paddingLeft: '1.25rem', position: 'relative', marginBottom: '0.75rem' }}>
                    <span style={{ position: 'absolute', left: 0, color: colors.gold }}>+</span>{item}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '2rem', padding: '1.25rem', border: `1px solid ${colors.sand}`, backgroundColor: colors.white }}>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.tan, marginBottom: '0.5rem' }}>Pricing</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: colors.ink }}>Two ways to work together.</p>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: colors.mid, marginTop: '0.75rem', lineHeight: '1.65' }}>
                  <span style={{ color: colors.ink }}>Standard.</span> Custom day by day itinerary with restaurant picks, hotel recommendations, and logistics. You handle your own bookings. Starting at $150.
                </p>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: colors.mid, marginTop: '0.6rem', lineHeight: '1.65' }}>
                  <span style={{ color: colors.ink }}>Full Service.</span> Everything in the standard itinerary plus I handle all bookings for you. Starting at $250.
                </p>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', fontWeight: '300', color: colors.tan, marginTop: '0.75rem' }}>Final price confirmed before work begins.</p>
              </div>
            </div>
            <div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '1.5rem' }}>How It Works</p>
              {HOW_IT_WORKS.map((step, i) => (
                <div key={step.num} style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: i < HOW_IT_WORKS.length - 1 ? `1px solid ${colors.sand}` : 'none' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: colors.sand, flexShrink: 0 }}>{step.num}</span>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: colors.charcoal, lineHeight: '1.6' }}>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${colors.sand}`, paddingTop: '4rem' }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '0.75rem' }}>Start Here</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: '400', color: colors.ink, marginBottom: '1rem' }}>Tell me about your trip. The more specific you are, the better the plan.</h2>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', fontWeight: '300', color: colors.mid, lineHeight: '1.7', maxWidth: '560px', marginBottom: '2.5rem' }}>
              Fill out the form below and we'll set up a short call to talk through your trip. No commitment required. Just a conversation.
            </p>
            <form onSubmit={handleSubmit} style={{ maxWidth: '620px' }}>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${colors.sand}` }}>About You</p>
              <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div><label style={labelStyle} htmlFor="name">Full name</label><input id="name" name="name" type="text" required value={form.name} onChange={handleChange} style={inputStyle} placeholder="Jane Smith" /></div>
                <div><label style={labelStyle} htmlFor="email">Email</label><input id="email" name="email" type="email" required value={form.email} onChange={handleChange} style={inputStyle} placeholder="jane@email.com" /></div>
              </div>

              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${colors.sand}`, marginTop: '1rem' }}>Trip Details</p>
              <label style={labelStyle} htmlFor="destinations">Destination(s) you're considering</label>
              <input id="destinations" name="destinations" type="text" required value={form.destinations} onChange={handleChange} style={inputStyle} placeholder="Portugal, Italy, both..." />
              <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div><label style={labelStyle} htmlFor="dates">Travel dates</label><input id="dates" name="dates" type="text" value={form.dates} onChange={handleChange} style={inputStyle} placeholder="June 2025, flexible..." /></div>
                <div><label style={labelStyle} htmlFor="partySize">Party size</label><input id="partySize" name="partySize" type="text" value={form.partySize} onChange={handleChange} style={inputStyle} placeholder="2, 4, 6..." /></div>
              </div>
              <label style={labelStyle} htmlFor="tripNotes">Tell me about the trip</label>
              <textarea id="tripNotes" name="tripNotes" rows={5} value={form.tripNotes} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'system-ui, sans-serif' }} placeholder="Slow and food-focused. Prefer smaller towns. Flights already booked into Lisbon. Allergic to shellfish..." />

              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${colors.sand}`, marginTop: '1rem' }}>One Last Thing</p>
              <label style={labelStyle} htmlFor="referral">How did you hear about Deriva?</label>
              <select id="referral" name="referral" value={form.referral} onChange={handleChange} style={selectStyle}>
                <option value="">Select...</option>
                <option value="instagram">Instagram</option>
                <option value="friend">Friend or word of mouth</option>
                <option value="google">Google search</option>
                <option value="blog">Blog or article</option>
                <option value="returning">Returning client</option>
                <option value="other">Other</option>
              </select>

              {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: '300', color: '#B85C45', marginBottom: '1rem' }}>{error}</p>}
              <button type="submit" disabled={submitting} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.white, backgroundColor: submitting ? colors.tan : colors.gold, border: 'none', padding: '1rem 2.5rem', cursor: submitting ? 'not-allowed' : 'pointer', marginTop: '0.5rem', transition: 'background-color 0.2s ease' }} onMouseEnter={e => { if (!submitting) e.target.style.backgroundColor = '#8A7550' }} onMouseLeave={e => { if (!submitting) e.target.style.backgroundColor = colors.gold }}>{submitting ? 'Sending...' : 'Send My Brief'}</button>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', fontWeight: '300', color: colors.tan, marginTop: '1.25rem', lineHeight: '1.6' }}>I'll be in touch to set up a call. No commitment until we've talked.</p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
