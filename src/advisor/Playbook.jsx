import { useState, useEffect } from 'react'

const C = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18',
  white: '#FDFAF5', terracotta: '#B85C45',
}

const label = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em',
  textTransform: 'uppercase', color: C.tan,
}
const body = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300',
  color: C.charcoal, lineHeight: '1.75',
}
const primaryBtn = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em',
  textTransform: 'uppercase', color: C.white, backgroundColor: C.terracotta, border: 'none',
  padding: '0.6rem 1.25rem', cursor: 'pointer',
}
const ghostBtn = {
  ...primaryBtn, backgroundColor: 'transparent', color: C.terracotta,
  border: `1px solid ${C.terracotta}`,
}

function Collapsible({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderTop: `1px solid ${C.sand}`, padding: '1.75rem 0' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', fontWeight: '400', color: C.ink, margin: 0 }}>
          {title}
        </h3>
        <span style={{ ...label, color: C.terracotta, fontSize: '0.7rem' }}>
          {open ? '— Hide' : '+ Show'}
        </span>
      </button>
      {open && <div style={{ marginTop: '1.5rem' }}>{children}</div>}
    </div>
  )
}

// ── 1. Discovery Call Checklist ──────────────────────────────────────────────

const CHECKLIST_ITEMS = [
  'What are your full travel dates, departure and return?',
  'Where are you flying from?',
  'How many people are traveling, and who — couple, family with kids, group of friends?',
  'Which cities or regions are you thinking?',
  'Have you already booked anything — flights, accommodation?',
  'What is your rough budget for accommodation per night?',
  'How would you describe your travel style — packed itinerary or slow and relaxed?',
  'What matters most to you on this trip — food, culture, outdoor activities, nightlife, shopping?',
  'Anything you have already ruled out or done before that you want to avoid?',
  'How do you like to get around — rental car, trains, taxis?',
  'How are you getting from the airport or train station to your accommodation — do you want a car service arranged or will you sort transport yourself?',
]

function DiscoveryChecklist() {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('deriva_playbook_checklist') || '[]') } catch { return [] }
  })
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('deriva_playbook_checklist_notes') || '{}') } catch { return {} }
  })

  useEffect(() => {
    localStorage.setItem('deriva_playbook_checklist', JSON.stringify(checked))
  }, [checked])

  useEffect(() => {
    localStorage.setItem('deriva_playbook_checklist_notes', JSON.stringify(notes))
  }, [notes])

  const toggle = (i) => setChecked(c => c.includes(i) ? c.filter(x => x !== i) : [...c, i])
  const updateNote = (i, v) => setNotes(n => ({ ...n, [i]: v }))
  const reset = () => { setChecked([]); setNotes({}) }

  return (
    <div>
      <p style={{ ...body, marginBottom: '1.5rem', color: C.mid }}>
        Work through these during a call. Progress saves automatically.
      </p>
      <div>
        {CHECKLIST_ITEMS.map((q, i) => {
          const isChecked = checked.includes(i)
          return (
            <div
              key={i}
              style={{
                padding: '1rem', marginBottom: '0.5rem',
                backgroundColor: isChecked ? C.parchment : C.white,
                border: `1px solid ${C.sand}`,
                transition: 'background-color 0.15s',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(i)}
                  style={{ marginTop: '0.2rem', accentColor: C.terracotta, width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{
                  ...body,
                  color: isChecked ? C.mid : C.ink,
                  textDecoration: isChecked ? 'line-through' : 'none',
                }}>
                  {q}
                </span>
              </label>
              <textarea
                value={notes[i] || ''}
                onChange={(e) => updateNote(i, e.target.value)}
                placeholder="Notes..."
                rows={2}
                style={{
                  display: 'block', boxSizing: 'border-box',
                  marginTop: '0.75rem', marginLeft: '2rem', width: 'calc(100% - 2rem)',
                  fontFamily: 'system-ui, sans-serif', fontSize: '0.82rem', fontWeight: '300',
                  color: C.charcoal, backgroundColor: C.cream,
                  border: `1px solid ${C.sand}`, borderRadius: 0,
                  padding: '0.55rem 0.75rem', outline: 'none', resize: 'vertical',
                  lineHeight: '1.55',
                }}
              />
            </div>
          )
        })}
      </div>
      <button onClick={reset} style={{ ...ghostBtn, marginTop: '1.5rem' }}>Reset Checklist</button>
    </div>
  )
}

// ── 2. The Process ───────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  { n: '01', title: 'Lead comes in', timing: 'Within 24 hours',
    desc: 'Client submits Work With Me form. Reply within 24 hours to schedule a discovery call.' },
  { n: '02', title: 'Discovery call', timing: '20 to 30 minutes',
    desc: 'Use the checklist above. End the call by naming your price and asking if they want to move forward.' },
  { n: '03', title: 'Payment', timing: 'Before work begins',
    desc: 'If yes, send a Stripe payment link. Work starts when payment is received. Pricing starts at $150, final price based on trip length and complexity.' },
  { n: '04', title: 'Build the itinerary', timing: '3 to 7 days',
    desc: 'Use the Itinerary Builder. Start with what you have. Flights and hotel confirmations can be added later as the client books.' },
  { n: '05', title: 'Deliver', timing: 'Email from hello@deriva.travel',
    desc: 'Export the branded HTML itinerary and send to the client.' },
  { n: '06', title: 'Revisions', timing: 'One round included',
    desc: 'Incorporate flight info, hotel swaps, or feedback. Send updated version.' },
  { n: '07', title: 'Done', timing: 'Close out',
    desc: 'Archive the client in the dashboard.' },
]

function Process() {
  return (
    <div>
      {PROCESS_STEPS.map((s, i) => (
        <div key={s.n} style={{
          display: 'flex', gap: '1.5rem',
          paddingBottom: '1.5rem', marginBottom: '1.5rem',
          borderBottom: i < PROCESS_STEPS.length - 1 ? `1px solid ${C.sand}` : 'none',
        }}>
          <div style={{
            fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: C.terracotta,
            minWidth: '32px', paddingTop: '0.1rem',
          }}>{s.n}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', marginBottom: '0.35rem' }}>
              <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: '400', color: C.ink, margin: 0 }}>
                {s.title}
              </h4>
              <span style={{ ...label, fontSize: '0.6rem' }}>{s.timing}</span>
            </div>
            <p style={{ ...body, margin: 0 }}>{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── 3. Pricing Guide ─────────────────────────────────────────────────────────

const STANDARD_PRICING = [
  { who: 'Solo or couple', trip: '1 city, up to 5 days', price: '$150' },
  { who: 'Solo or couple', trip: 'Multi-city, up to 10 days', price: '$200' },
  { who: 'Family or group', trip: '1 city, up to 5 days', price: '$225' },
  { who: 'Family or group', trip: 'Multi-city, up to 10 days', price: '$275' },
  { who: 'Any size', trip: '10+ days extended trip', price: '$300+', note: 'Quote individually' },
]

const FULL_SERVICE_PRICING = [
  { who: 'Solo or couple', trip: '1 city, up to 5 days', price: '$250' },
  { who: 'Solo or couple', trip: 'Multi-city, up to 10 days', price: '$350' },
  { who: 'Family or group', trip: '1 city, up to 5 days', price: '$375' },
  { who: 'Family or group', trip: 'Multi-city, up to 10 days', price: '$450' },
  { who: 'Any size', trip: '10+ days extended trip', price: '$500+', note: 'Quote individually' },
]

function PricingTable({ rows }) {
  return (
    <div style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white }}>
      <div className="pricing-row pricing-header" style={{
        display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr',
        padding: '1rem 1.25rem', borderBottom: `1px solid ${C.sand}`,
        backgroundColor: C.parchment,
      }}>
        <span style={label}>Party</span>
        <span style={label}>Trip</span>
        <span style={{ ...label, textAlign: 'right' }}>Starting at</span>
      </div>
      {rows.map((row, i) => (
        <div key={i} className="pricing-row" style={{
          display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr',
          padding: '1.1rem 1.25rem', alignItems: 'center',
          borderBottom: i < rows.length - 1 ? `1px solid ${C.sand}` : 'none',
        }}>
          <span style={{ ...body, color: C.ink, margin: 0 }}>{row.who}</span>
          <div>
            <div style={{ ...body, color: C.ink, margin: 0 }}>{row.trip}</div>
            {row.note && <div style={{ ...body, fontSize: '0.75rem', color: C.mid, marginTop: '0.2rem' }}>{row.note}</div>}
          </div>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: C.terracotta, textAlign: 'right' }}>
            {row.price}
          </span>
        </div>
      ))}
    </div>
  )
}

function PricingTier({ heading, description, rows }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <p style={{ ...label, color: C.terracotta, marginBottom: '0.5rem' }}>{heading}</p>
      <p style={{ ...body, color: C.charcoal, marginTop: 0, marginBottom: '1rem', maxWidth: '620px' }}>
        {description}
      </p>
      <PricingTable rows={rows} />
    </div>
  )
}

function PricingGuide() {
  return (
    <div>
      <PricingTier
        heading="Standard Itinerary"
        description="A fully custom day by day itinerary with restaurant picks, hotel recommendations, activities, and logistics. One round of revisions included. Client handles their own bookings."
        rows={STANDARD_PRICING}
      />
      <PricingTier
        heading="Full Service"
        description="Everything in the standard itinerary plus Ryan handles all bookings — tours, restaurants, hotels, and ground transportation. Affiliate links used where applicable."
        rows={FULL_SERVICE_PRICING}
      />
      <p style={{ ...body, fontSize: '0.8rem', color: C.mid, fontStyle: 'italic', marginTop: '1rem' }}>
        All prices are starting points. Final price confirmed before work begins. Full service itineraries may include affiliate links for tours, hotels, and experiences.
      </p>
    </div>
  )
}

// ── 4. Does / Does Not ───────────────────────────────────────────────────────

const DOES = [
  'Builds custom day by day itineraries from scratch',
  'Recommends restaurants, hotels, neighborhoods, and experiences',
  'Structures the trip around how the client actually travels',
  'Delivers a branded HTML itinerary document',
  'Includes one round of revisions',
  'Incorporates flight and booking info once provided by the client',
  'For full service clients, handles all bookings including tours, restaurants, hotels, and ground transportation',
  'Uses affiliate links for tours, hotels, and experiences where applicable',
]

const DOES_NOT = [
  'Book flights or handle airline reservations',
  'Negotiate rates or handle payments with third parties',
  'Guarantee availability of any recommendation',
  'Provide more than one round of revisions on the standard tier — additional revisions available at $25 each',
  'Cover destinations outside current focus without discussion',
]

function DoesDoesNot() {
  const Col = ({ heading, items, accent }) => (
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ ...label, color: accent, marginBottom: '1rem' }}>{heading}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((t, i) => (
          <li key={i} style={{
            ...body, color: C.ink,
            padding: '0.85rem 0',
            borderBottom: i < items.length - 1 ? `1px solid ${C.sand}` : 'none',
            position: 'relative', paddingLeft: '1.25rem',
          }}>
            <span style={{ position: 'absolute', left: 0, top: '0.85rem', color: accent }}>
              {heading.includes('Not') ? '×' : '✓'}
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
  return (
    <div className="does-columns" style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
      <Col heading="What Deriva Does" items={DOES} accent={C.gold} />
      <Col heading="What Deriva Does Not Do" items={DOES_NOT} accent={C.terracotta} />
    </div>
  )
}

// ── 5. Common Situations ─────────────────────────────────────────────────────

const SITUATIONS = [
  {
    title: 'Client does not want a call',
    scenario: 'Offer a detailed intake form as an alternative. Note that a call produces better results.',
    response: 'Totally fine — I can send over a short intake form instead. It covers the same ground and I will follow up with any questions.',
  },
  {
    title: 'Client pushes back on price',
    scenario: 'Do not discount. Explain what is included.',
    response: 'The price reflects a fully custom itinerary built around how you travel, not a template. I am happy to walk you through exactly what is included.',
  },
  {
    title: 'Client wants more than one round of revisions',
    scenario: 'Offer additional revisions at a flat rate.',
    response: 'One round is included in the base price. Additional revisions are $25 each — just let me know what you need.',
  },
  {
    title: 'Client does not have flight info yet',
    scenario: 'Build and deliver the itinerary without it. Incorporate flights in the revision round.',
    response: 'No problem — I will build everything around your dates and you can send flight details whenever you have them. I will incorporate them in the revision.',
  },
  {
    title: 'Client does not like a hotel pick',
    scenario: 'Swap it in the revision round. Ask on the call what kind of accommodation they want to avoid this.',
    response: 'Noted — I will find alternatives that are a better fit and include them in your revision.',
  },
]

function Situations() {
  return (
    <div>
      {SITUATIONS.map((s, i) => (
        <div key={i} style={{
          padding: '1.5rem', marginBottom: '1rem',
          backgroundColor: C.white, border: `1px solid ${C.sand}`,
        }}>
          <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: '400', color: C.ink, margin: '0 0 0.5rem' }}>
            {s.title}
          </h4>
          <p style={{ ...body, margin: '0 0 1rem', color: C.mid }}>{s.scenario}</p>
          <div style={{
            borderLeft: `2px solid ${C.terracotta}`, paddingLeft: '1rem',
          }}>
            <p style={{ ...label, fontSize: '0.6rem', marginBottom: '0.4rem' }}>Suggested response</p>
            <p style={{ ...body, margin: 0, color: C.charcoal, fontStyle: 'italic' }}>"{s.response}"</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── 6. Email Templates ───────────────────────────────────────────────────────

const DEFAULT_TEMPLATES = [
  {
    id: 'initial',
    name: 'Initial reply to new lead',
    subject: 'Re: Your Deriva Inquiry',
    body: 'Hi [Name], thanks for reaching out. Your trip sounds like a great one. I would love to learn more — here is a link to grab 20 minutes with me: [Calendly link]. Looking forward to talking. Ryan',
  },
  {
    id: 'followup',
    name: 'Post-call follow up with payment link',
    subject: 'Deriva — Next Steps',
    body: 'Hi [Name], great talking with you today. Based on what you shared, I am confident I can put together something really strong for your trip. The fee for your itinerary is $[amount]. You can pay here: [Stripe link]. Once payment is received I will get started. Ryan',
  },
  {
    id: 'delivery',
    name: 'Itinerary delivery',
    subject: 'Your Deriva Itinerary',
    body: 'Hi [Name], your itinerary is ready. I have attached it below. Everything is organized by day with restaurant picks, hotel details, and logistics. One round of revisions is included — just reply with any feedback and I will take care of it. Ryan',
  },
]

function EmailTemplates() {
  const [templates, setTemplates] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('deriva_playbook_templates') || 'null')
      if (saved && Array.isArray(saved) && saved.length === DEFAULT_TEMPLATES.length) return saved
    } catch {}
    return DEFAULT_TEMPLATES
  })
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    localStorage.setItem('deriva_playbook_templates', JSON.stringify(templates))
  }, [templates])

  const update = (id, field, value) => {
    setTemplates(ts => ts.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const copy = (t) => {
    const text = `Subject: ${t.subject}\n\n${t.body}`
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(t.id)
      setTimeout(() => setCopiedId(null), 1500)
    })
  }

  const reset = (id) => {
    const def = DEFAULT_TEMPLATES.find(t => t.id === id)
    if (def) setTemplates(ts => ts.map(t => t.id === id ? def : t))
  }

  const inp = {
    width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300',
    color: C.ink, backgroundColor: C.cream, border: `1px solid ${C.sand}`, padding: '0.65rem 0.85rem',
    outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div>
      {templates.map(t => (
        <div key={t.id} style={{
          padding: '1.5rem', marginBottom: '1rem',
          backgroundColor: C.white, border: `1px solid ${C.sand}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
            <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: '400', color: C.ink, margin: 0 }}>
              {t.name}
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => reset(t.id)} style={{
                ...ghostBtn, padding: '0.5rem 0.9rem', fontSize: '0.6rem',
                color: C.mid, borderColor: C.sand,
              }}>Reset</button>
              <button onClick={() => copy(t)} style={{
                ...primaryBtn, padding: '0.5rem 0.9rem', fontSize: '0.6rem',
              }}>
                {copiedId === t.id ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ ...label, fontSize: '0.6rem', display: 'block', marginBottom: '0.3rem' }}>Subject</label>
            <input
              value={t.subject}
              onChange={e => update(t.id, 'subject', e.target.value)}
              style={inp}
            />
          </div>
          <div>
            <label style={{ ...label, fontSize: '0.6rem', display: 'block', marginBottom: '0.3rem' }}>Body</label>
            <textarea
              value={t.body}
              onChange={e => update(t.id, 'body', e.target.value)}
              rows={6}
              style={{ ...inp, resize: 'vertical', lineHeight: '1.6' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main Playbook ────────────────────────────────────────────────────────────

export default function Playbook() {
  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ ...label, marginBottom: '0.25rem' }}>Playbook</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: C.ink, margin: '0 0 0.5rem' }}>
          How Deriva runs.
        </h2>
        <p style={{ ...body, color: C.mid, maxWidth: '560px', margin: 0 }}>
          Internal reference for running client work end to end. Process, pricing, scripts, and templates in one place.
        </p>
      </div>

      <Collapsible title="Discovery Call Checklist">
        <DiscoveryChecklist />
      </Collapsible>
      <Collapsible title="The Process">
        <Process />
      </Collapsible>
      <Collapsible title="Pricing Guide">
        <PricingGuide />
      </Collapsible>
      <Collapsible title="What Deriva Does and Does Not Do">
        <DoesDoesNot />
      </Collapsible>
      <Collapsible title="Handling Common Situations">
        <Situations />
      </Collapsible>
      <Collapsible title="Email Templates">
        <EmailTemplates />
      </Collapsible>
    </div>
  )
}
