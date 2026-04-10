import { useState } from 'react'

const C = { cream:'#F5F0E8', parchment:'#EDE6D8', sand:'#D8CCBA', tan:'#C8B89A',
  gold:'#9E8660', mid:'#7A6E62', charcoal:'#3A3630', ink:'#1E1C18', white:'#FDFAF5' }

const SYS = `You are Deriva's travel curator. Editorial, knowledgeable, direct.
Never say "hidden gem." Never say "off the beaten path." Never sound like TripAdvisor.
Sound like a well-traveled friend who actually went. Short sentences. No filler.
Never use em dashes.`

export default function RecommendationEngine({ destination, restaurants, stays }) {
  const [vibe, setVibe] = useState('')
  const [party, setParty] = useState('')
  const [notes, setNotes] = useState('')
  const [email, setEmail] = useState('')
  const [stage, setStage] = useState('form') // form | email | loading | results
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const lbl = { fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.18em',
    textTransform:'uppercase', color:C.tan, display:'block', marginBottom:'0.5rem' }
  const inp = { width:'100%', fontFamily:'system-ui, sans-serif', fontSize:'0.9rem', fontWeight:'300',
    color:C.ink, backgroundColor:C.white, border:`1px solid ${C.sand}`, padding:'0.75rem 1rem',
    outline:'none', appearance:'none' }
  const sel = { ...inp, cursor:'pointer',
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239E8660' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat:'no-repeat', backgroundPosition:'right 1rem center', paddingRight:'2.5rem' }
  const btn = (loading) => ({ fontFamily:'system-ui, sans-serif', fontSize:'0.7rem',
    letterSpacing:'0.18em', textTransform:'uppercase', color:C.white,
    backgroundColor: loading ? C.tan : C.gold, border:'none', padding:'1rem 2rem',
    cursor: loading ? 'not-allowed' : 'pointer', width:'100%' })

  const goToEmail = (e) => { e.preventDefault(); setError(null); setStage('email') }

  const submitEmail = async (e) => {
    e.preventDefault()
    setError(null)
    setStage('loading')

    // Log the email submission (fire and forget — don't block picks if it fails)
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: destination, email, vibe, party, notes }),
    }).catch(() => {})

    const rData = restaurants.map(r => `${r.name} (${r.city}, ${r.neighborhood}) -- ${r.priceTier} -- ${r.note}`).join('\n')
    const sData = stays.map(s => `${s.name} (${s.city}, ${s.neighborhood}) -- ${s.priceTier} -- ${s.note}`).join('\n')
    const msg = `A traveler is planning a trip to ${destination}.
Vibe: ${vibe}
Party: ${party}
Notes: ${notes || 'none'}

RESTAURANTS:
${rData}

STAYS:
${sData}

Return JSON only, no markdown:
{
  "intro": "2 sentences max, in Deriva voice",
  "restaurants": [{"name":"","city":"","neighborhood":"","priceTier":"","note":""}],
  "stays": [{"name":"","city":"","neighborhood":"","priceTier":"","note":""}],
  "oneThingNotToMiss": "A single specific experience in ${destination} the traveler should not skip given their vibe and party. Confident, specific, 2-3 sentences. Sounds like a well-traveled friend, not a travel aggregator. Not a listicle. Name a place, a moment, a time of day."
}
Pick 3-4 restaurants and 2-3 stays from the provided data only. The oneThingNotToMiss should NOT be from the lists -- it is a single experience or moment, like a sunset walk, an early-morning market, a specific drive, a ritual.`

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: SYS, messages: [{ role: 'user', content: msg }], maxTokens: 1500 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      const cleaned = data.text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      const parsed = JSON.parse(cleaned)
      setResults(parsed)
      setStage('results')

      // Submit the picks + user email to Formspree (fire and forget).
      // Same endpoint as the contact form. Formspree notifies the form owner
      // only -- the user-facing picks email is handled separately by Resend.
      const recap = buildPicksRecap(destination, parsed)

      fetch('https://formspree.io/f/mgopjvbz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `Deriva picks generated — ${destination}`,
          _replyto: email,
          formType: 'picks',
          country: destination,
          email,
          vibe,
          party,
          notes: notes || '',
          picksRecap: recap,
        }),
      }).catch(() => {})

      // Also send the polished templated picks email via Resend (fire and forget).
      // Runs in parallel with the Formspree submission. If Resend fails, the user
      // still gets the Formspree autoresponse and the form owner still gets notified.
      fetch('/api/send-picks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email, country: destination, picks: parsed }),
      }).catch(() => {})
    } catch {
      setError('Could not get picks right now. Try again in a moment.')
      setStage('email')
    }
  }

  return (
    <div style={{ paddingTop:'3rem', borderTop:`1px solid ${C.sand}`, marginTop:'3rem' }}>
      <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.2em',
        textTransform:'uppercase', color:C.tan, marginBottom:'0.75rem' }}>Get Picks For Your Trip</p>
      <h2 style={{ fontFamily:'Georgia, serif', fontSize:'1.6rem', fontWeight:'400', color:C.ink, marginBottom:'0.5rem' }}>Tell me about the trip.</h2>
      <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.9rem', fontWeight:'300', color:C.mid,
        lineHeight:'1.6', marginBottom:'2rem', maxWidth:'480px' }}>Three questions. I will filter the picks to match.</p>

      {stage === 'form' && (
        <form onSubmit={goToEmail} style={{ maxWidth:'560px' }}>
          <div style={{ marginBottom:'1.5rem' }}>
            <label style={lbl} htmlFor="rec-vibe">What is the vibe?</label>
            <select id="rec-vibe" value={vibe} onChange={e=>setVibe(e.target.value)} required style={sel}>
              <option value="">Select...</option>
              <option value="relaxed and slow">Relaxed and slow</option>
              <option value="food-focused">Food-focused</option>
              <option value="cultural and exploratory">Cultural and exploratory</option>
              <option value="active and outdoor">Active and outdoor</option>
              <option value="romantic">Romantic</option>
              <option value="mix of everything">Mix of everything</option>
            </select>
          </div>
          <div style={{ marginBottom:'1.5rem' }}>
            <label style={lbl} htmlFor="rec-party">Who is coming?</label>
            <select id="rec-party" value={party} onChange={e=>setParty(e.target.value)} required style={sel}>
              <option value="">Select...</option>
              <option value="solo">Solo</option>
              <option value="couple">Partner / couple</option>
              <option value="friends">Friends</option>
              <option value="family with kids">Family with kids</option>
              <option value="group">Group</option>
            </select>
          </div>
          <div style={{ marginBottom:'2rem' }}>
            <label style={lbl} htmlFor="rec-notes">Anything specific? (optional)</label>
            <textarea id="rec-notes" value={notes} onChange={e=>setNotes(e.target.value)}
              placeholder="Budget range, dietary needs, things to avoid..." rows={3}
              style={{ ...inp, resize:'vertical', fontFamily:'system-ui, sans-serif' }} />
          </div>
          <button type="submit" style={btn(false)}>Get My Picks</button>
        </form>
      )}

      {stage === 'email' && (
        <form onSubmit={submitEmail} style={{ maxWidth:'560px' }}>
          <div style={{ padding:'1.5rem', backgroundColor:C.parchment, border:`1px solid ${C.sand}`, marginBottom:'1.5rem' }}>
            <p style={{ fontFamily:'Georgia, serif', fontSize:'1.05rem', color:C.ink, marginBottom:'0.5rem' }}>
              One step before your picks.
            </p>
            <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.85rem', fontWeight:'300', color:C.mid, lineHeight:'1.6' }}>
              Drop your email and I will send the picks straight to you. No spam, no list rental, just the occasional update when something good is worth sharing.
            </p>
          </div>
          <div style={{ marginBottom:'1.5rem' }}>
            <label style={lbl} htmlFor="rec-email">Email</label>
            <input id="rec-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required
              placeholder="you@email.com" style={inp} />
          </div>
          {error && <div style={{ marginBottom:'1rem', padding:'0.75rem 1rem', border:`1px solid ${C.tan}`,
            fontFamily:'system-ui, sans-serif', fontSize:'0.85rem', color:C.charcoal }}>{error}</div>}
          <button type="submit" style={btn(false)}>Get My Picks</button>
          <button type="button" onClick={() => setStage('form')} style={{ marginTop:'0.75rem',
            background:'none', border:'none', cursor:'pointer', fontFamily:'system-ui, sans-serif',
            fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', color:C.tan }}>
            Back
          </button>
        </form>
      )}

      {stage === 'loading' && (
        <div style={{ maxWidth:'560px', padding:'2rem', border:`1px solid ${C.sand}`, backgroundColor:C.white }}>
          <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.18em',
            textTransform:'uppercase', color:C.tan, marginBottom:'0.75rem' }}>Working on it</p>
          <p style={{ fontFamily:'Georgia, serif', fontSize:'1.2rem', color:C.ink }}>
            Pulling your picks for {destination}...
          </p>
        </div>
      )}

      {stage === 'results' && results && (
        <div style={{ marginTop:'2rem', maxWidth:'720px' }}>
          <p style={{ fontFamily:'Georgia, serif', fontSize:'1.05rem', fontStyle:'italic', color:C.charcoal,
            lineHeight:'1.7', marginBottom:'2.5rem', borderLeft:`2px solid ${C.gold}`, paddingLeft:'1.25rem' }}>
            {results.intro}
          </p>

          {results.restaurants?.length > 0 && (
            <div style={{ marginBottom:'2.5rem' }}>
              <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.18em',
                textTransform:'uppercase', color:C.tan, marginBottom:'1rem' }}>Where to Eat</p>
              {results.restaurants.map((r,i) => <SpotCard key={i} spot={r} />)}
            </div>
          )}

          {results.stays?.length > 0 && (
            <div style={{ marginBottom:'2.5rem' }}>
              <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.18em',
                textTransform:'uppercase', color:C.tan, marginBottom:'1rem' }}>Where to Stay</p>
              {results.stays.map((s,i) => <SpotCard key={i} spot={s} />)}
            </div>
          )}

          {results.oneThingNotToMiss && (
            <div style={{ padding:'1.75rem', border:`1px solid ${C.gold}`, backgroundColor:C.white }}>
              <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.18em',
                textTransform:'uppercase', color:C.gold, marginBottom:'0.75rem' }}>One Thing Not To Miss</p>
              <p style={{ fontFamily:'Georgia, serif', fontSize:'1.05rem', color:C.ink, lineHeight:'1.7' }}>
                {results.oneThingNotToMiss}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function buildPicksRecap(country, picks) {
  const lines = []
  lines.push(`DERIVA PICKS — ${country.toUpperCase()}`)
  lines.push('')
  if (picks.intro) { lines.push(picks.intro); lines.push('') }
  if (picks.restaurants?.length) {
    lines.push('WHERE TO EAT')
    for (const r of picks.restaurants) {
      lines.push(`- ${r.name} (${r.priceTier}) — ${r.neighborhood}, ${r.city}`)
      if (r.note) lines.push(`  ${r.note}`)
    }
    lines.push('')
  }
  if (picks.stays?.length) {
    lines.push('WHERE TO STAY')
    for (const s of picks.stays) {
      lines.push(`- ${s.name} (${s.priceTier}) — ${s.neighborhood}, ${s.city}`)
      if (s.note) lines.push(`  ${s.note}`)
    }
    lines.push('')
  }
  if (picks.oneThingNotToMiss) {
    lines.push('ONE THING NOT TO MISS')
    lines.push(picks.oneThingNotToMiss)
  }
  return lines.join('\n')
}

function SpotCard({ spot }) {
  const C = { sand:'#D8CCBA', tan:'#C8B89A', gold:'#9E8660', mid:'#7A6E62', ink:'#1E1C18' }
  return (
    <div style={{ padding:'1.25rem', borderBottom:`1px solid ${C.sand}`, display:'flex',
      justifyContent:'space-between', gap:'1rem' }}>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:'0.75rem', marginBottom:'0.25rem' }}>
          <h4 style={{ fontFamily:'Georgia, serif', fontSize:'1rem', fontWeight:'400', color:C.ink }}>{spot.name}</h4>
          <span style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.1em', color:C.gold }}>{spot.priceTier}</span>
        </div>
        <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.75rem', color:C.tan, marginBottom:'0.5rem',
          textTransform:'uppercase', letterSpacing:'0.08em' }}>{spot.neighborhood}, {spot.city}</p>
        <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.875rem', fontWeight:'300', color:C.mid, lineHeight:'1.6' }}>{spot.note}</p>
      </div>
    </div>
  )
}
