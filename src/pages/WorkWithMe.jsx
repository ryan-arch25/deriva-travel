import { useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const colors = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18', white: '#FDFAF5',
}

const WHAT_I_OFFER = [
  'Custom Europe itineraries built around how you actually travel',
  'Curated restaurant and hotel picks -- only places worth your time',
  'Day by day planning with logistics handled',
  'One round of revisions included',
]

const HOW_IT_WORKS = [
  { num: '01', text: 'Fill out the intake form below' },
  { num: '02', text: 'Ryan reviews and follows up within 48 hours' },
  { num: '03', text: 'Receive your custom itinerary as a clean PDF' },
]

const initialForm = { name: '', email: '', destinations: '', dates: '', length: '', party: '', partySize: '', budget: '', interests: '', alreadyBooked: '', notes: '', avoid: '', referral: '' }

export default function WorkWithMe() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const labelStyle = { fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.tan, display: 'block', marginBottom: '0.5rem' }
  const inputStyle = { width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: colors.ink, backgroundColor: colors.white, border: `1px solid ${colors.sand}`, padding: '0.75rem 1rem', outline: 'none', marginBottom: '1.5rem', appearance: 'none' }
  const selectStyle = { ...inputStyle, cursor: 'pointer', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239E8660' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', paddingRight: '2.5rem' }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true) }

  if (submitted) {
    return (
      <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
        <Nav />
        <div style={{ maxWidth: '620px', margin: '0 auto', padding: '8rem 2rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ width: '3rem', height: '1px', backgroundColor: colors.gold, marginBottom: '2rem' }} />
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.gold, marginBottom: '1rem' }}>Brief Received</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.25rem', fontWeight: '400', color: colors.ink, marginBottom: '1.5rem', lineHeight: '1.2' }}>Thank you, {form.name.split(' ')[0] || 'you'}.</h2>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', fontWeight: '300', color: colors.mid, lineHeight: '1.8', marginBottom: '1.5rem' }}>
            I review every brief personally. Expect a response at <strong style={{ fontWeight: '400', color: colors.charcoal }}>{form.email}</strong> within 48 hours.
          </p>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', fontWeight: '300', color: colors.mid, lineHeight: '1.8', marginBottom: '2.5rem' }}>
            If {form.destinations || 'your trip'} sounds like something I can do well, I'll say so. If not, I'll point you in the right direction.
          </p>
          <div style={{ padding: '1.5rem', border: `1px solid ${colors.sand}`, backgroundColor: colors.white }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.tan, marginBottom: '0.5rem' }}>What Happens Next</p>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: '300', color: colors.charcoal, lineHeight: '1.7' }}>
              I'll review your brief, follow up with any questions, confirm pricing, and then build your itinerary from scratch. The whole process usually takes 5 to 7 days.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
      <Nav />
      <div style={{ paddingTop: '60px' }}>
        <div style={{ backgroundColor: colors.parchment, borderBottom: `1px solid ${colors.sand}`, padding: '5rem 2rem 4rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '1rem' }}>Work With Me</p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '400', color: colors.ink, letterSpacing: '0.03em', marginBottom: '1rem', lineHeight: '1.1' }}>Custom trip planning,<br />built from scratch.</h1>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '1rem', fontWeight: '300', color: colors.mid, maxWidth: '520px', lineHeight: '1.7' }}>Not a template. Not an algorithm. A plan that fits how you actually travel.</p>
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
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: colors.ink }}>Custom itineraries starting at $150</p>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: colors.mid, marginTop: '0.35rem' }}>Final pricing depends on trip complexity. I'll confirm before we begin.</p>
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
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: '400', color: colors.ink, marginBottom: '0.5rem' }}>Tell me about your trip.</h2>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', fontWeight: '300', color: colors.mid, marginBottom: '2.5rem', lineHeight: '1.6' }}>The more specific you are, the better the plan.</p>
            <form onSubmit={handleSubmit} style={{ maxWidth: '620px' }}>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${colors.sand}` }}>About You</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div><label style={labelStyle} htmlFor="name">Full name</label><input id="name" name="name" type="text" required value={form.name} onChange={handleChange} style={inputStyle} placeholder="Jane Smith" /></div>
                <div><label style={labelStyle} htmlFor="email">Email</label><input id="email" name="email" type="email" required value={form.email} onChange={handleChange} style={inputStyle} placeholder="jane@email.com" /></div>
              </div>

              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${colors.sand}`, marginTop: '1rem' }}>Trip Details</p>
              <label style={labelStyle} htmlFor="destinations">Destination(s) you're considering</label>
              <input id="destinations" name="destinations" type="text" required value={form.destinations} onChange={handleChange} style={inputStyle} placeholder="Portugal, Italy, both..." />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div><label style={labelStyle} htmlFor="dates">Travel dates</label><input id="dates" name="dates" type="text" value={form.dates} onChange={handleChange} style={inputStyle} placeholder="June 2025, flexible..." /></div>
                <div><label style={labelStyle} htmlFor="length">Trip length</label><input id="length" name="length" type="text" value={form.length} onChange={handleChange} style={inputStyle} placeholder="10 days, 2 weeks..." /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label style={labelStyle} htmlFor="party">Travel party</label>
                  <select id="party" name="party" value={form.party} onChange={handleChange} style={selectStyle}>
                    <option value="">Select...</option>
                    <option value="solo">Solo</option>
                    <option value="couple">Couple</option>
                    <option value="friends">Friends</option>
                    <option value="family">Family</option>
                    <option value="group">Group</option>
                  </select>
                </div>
                <div><label style={labelStyle} htmlFor="partySize">Party size</label><input id="partySize" name="partySize" type="text" value={form.partySize} onChange={handleChange} style={inputStyle} placeholder="2, 4, 6..." /></div>
                <div>
                  <label style={labelStyle} htmlFor="budget">Budget tier</label>
                  <select id="budget" name="budget" value={form.budget} onChange={handleChange} style={selectStyle}>
                    <option value="">Select...</option>
                    <option value="budget">Budget-conscious</option>
                    <option value="mid-range">Mid-range</option>
                    <option value="splurge">Splurge</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${colors.sand}`, marginTop: '1rem' }}>Preferences</p>
              <label style={labelStyle} htmlFor="interests">Interests and priorities</label>
              <textarea id="interests" name="interests" rows={3} value={form.interests} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'system-ui, sans-serif' }} placeholder="Food and wine, architecture, hiking, art, nightlife, beaches, local markets..." />
              <label style={labelStyle} htmlFor="notes">Vibe and pace notes</label>
              <textarea id="notes" name="notes" rows={3} value={form.notes} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'system-ui, sans-serif' }} placeholder="Slow and food-focused. Prefer smaller towns. Love wine bars and long lunches..." />
              <label style={labelStyle} htmlFor="avoid">Anything to avoid</label>
              <textarea id="avoid" name="avoid" rows={2} value={form.avoid} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'system-ui, sans-serif' }} placeholder="Big tourist sites, long bus rides, spicy food, hostels..." />
              <label style={labelStyle} htmlFor="alreadyBooked">Anything already booked</label>
              <textarea id="alreadyBooked" name="alreadyBooked" rows={2} value={form.alreadyBooked} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'system-ui, sans-serif' }} placeholder="Flights, hotels, specific restaurants, tours..." />

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

              <button type="submit" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.white, backgroundColor: colors.gold, border: 'none', padding: '1rem 2.5rem', cursor: 'pointer', marginTop: '0.5rem', transition: 'background-color 0.2s ease' }} onMouseEnter={e => e.target.style.backgroundColor = '#8A7550'} onMouseLeave={e => e.target.style.backgroundColor = colors.gold}>Send My Brief</button>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', fontWeight: '300', color: colors.tan, marginTop: '1.25rem', lineHeight: '1.6' }}>I'll respond within 48 hours. No commitment until we've talked.</p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
