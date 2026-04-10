import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const colors = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18',
  white: '#FDFAF5', terracotta: '#B85C45',
}

const destinations = [
  { name: 'Portugal', slug: 'portugal', tagline: 'Lisbon, Porto, Alentejo, and the edges worth finding.' },
  { name: 'Italy', slug: 'italy', tagline: 'The south, the mountains, the places Tuscany forgot.' },
  { name: 'Iceland', slug: 'iceland', tagline: 'Westfjords, the Highlands, and everything past the tourist loop.' },
  { name: 'Spain', slug: 'spain', tagline: 'Basque Country, Andalusia, and the parts no one bothers with.' },
]

const steps = [
  { num: '01', title: 'Tell me where you want to go', body: 'Browse destinations, get instant picks tailored to your trip, or work with me directly for a fully custom itinerary.' },
  { num: '02', title: 'Get a custom itinerary', body: 'A day-by-day plan built from scratch. The right neighborhoods, the right restaurants, the right pace for how you travel.' },
  { num: '03', title: 'Travel with confidence', body: 'Every detail handled. Bookings, logistics, and backup options. You show up. Everything else is taken care of.' },
]

export default function Home() {
  const sectionLabelStyle = {
    fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em',
    textTransform: 'uppercase', color: colors.tan, marginBottom: '1rem',
  }
  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
      <Nav />

      <section className="home-hero" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
        <div className="home-hero-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8rem 4rem 6rem 4rem' }}>
          <p style={{ ...sectionLabelStyle, color: colors.terracotta }}>Deriva</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.8rem, 4vw, 5rem)', fontWeight: '400', letterSpacing: '0.05em', color: colors.ink, lineHeight: '1.1', marginBottom: '1.5rem', borderLeft: '3px solid #B85C45', paddingLeft: '1.5rem' }}>
            Europe,<br />Done Right.
          </h1>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(1rem, 1.5vw, 1.1rem)', fontWeight: '300', color: colors.mid, lineHeight: '1.6', maxWidth: '380px', marginBottom: '2.5rem' }}>
            Custom trip planning for people who travel with intention.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/work-with-me" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.white, backgroundColor: colors.gold, padding: '1rem 2rem', textDecoration: 'none', border: '1px solid #9E8660' }}>
              Work With Me
            </Link>
          </div>
        </div>
        <div className="home-hero-photo" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
          <img src="/images/hero.jpg" alt="Dolomites Italy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        </div>
      </section>

      <section style={{ padding: '5rem 0', borderTop: '1px solid #D8CCBA', borderBottom: '1px solid #D8CCBA', backgroundColor: colors.parchment }}>
        <div style={{ padding: '0 2rem', maxWidth: '1100px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>Destinations</p>
        </div>
        <div className="home-destinations" style={{ display: 'flex', overflowX: 'auto', gap: '0', padding: '0', maxWidth: '1100px', margin: '0 auto', scrollbarWidth: 'none' }}>
          {destinations.map((d, i) => (
            <div key={d.slug} style={{ minWidth: '280px', flex: '1', borderRight: i < destinations.length - 1 ? '1px solid #D8CCBA' : 'none', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '340px', overflow: 'hidden' }}>
                <img src={`/images/${d.slug}.jpg`} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(30,28,24,0.8) 0%, rgba(30,28,24,0.25) 60%, transparent 100%)', display: 'flex', alignItems: 'flex-end', padding: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: '400', letterSpacing: '0.05em', color: '#FDFAF5', margin: 0 }}>{d.name}</h3>
                </div>
              </div>
              <div style={{ padding: '1.5rem 2rem 2rem' }}>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: '300', color: colors.mid, lineHeight: '1.6', marginBottom: '1.25rem' }}>{d.tagline}</p>
                <Link to={`/destinations/${d.slug}`} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.gold, textDecoration: 'none', borderBottom: '1px solid #9E8660', paddingBottom: '2px' }}>Explore</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <p style={sectionLabelStyle}>How It Works</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '3rem 4rem', marginTop: '2rem' }}>
          {steps.map(step => (
            <div key={step.num}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: colors.sand, marginBottom: '1rem', letterSpacing: '0.05em' }}>{step.num}</p>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400', color: colors.ink, marginBottom: '0.75rem' }}>{step.title}</h3>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: colors.mid, lineHeight: '1.7' }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ backgroundColor: colors.parchment, borderTop: '1px solid #D8CCBA', borderBottom: '1px solid #D8CCBA', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>About Deriva</p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight: '400', color: colors.ink, lineHeight: '1.75', marginBottom: '1.5rem' }}>
            Deriva exists for people who are tired of going somewhere and feeling like they went nowhere.
          </p>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', fontWeight: '300', color: colors.mid, lineHeight: '1.8', marginBottom: '1rem' }}>
            Every recommendation is personal. Every itinerary is built from scratch. The goal is not to show you Europe. It is to show you a version of Europe that actually fits how you travel.
          </p>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', fontWeight: '300', color: colors.mid, lineHeight: '1.8' }}>
            No templates. No aggregated reviews. No lists of the same twelve restaurants. Just good judgment, applied to your trip.
          </p>
          <div style={{ marginTop: '2.5rem' }}>
            <Link to="/work-with-me" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.gold, textDecoration: 'none', borderBottom: '1px solid #9E8660', paddingBottom: '2px' }}>Work With Me</Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .home-hero {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          .home-hero-text {
            padding: 4rem 2rem !important;
            order: 1;
          }
          .home-hero-photo {
            min-height: 50vh !important;
            order: 2;
          }
          .home-destinations {
            flex-direction: column !important;
            overflow-x: visible !important;
          }
          .home-destinations > div {
            min-width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid #D8CCBA;
          }
          .home-destinations > div:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </div>
  )
}