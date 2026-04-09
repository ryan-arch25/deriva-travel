import { Link } from 'react-router-dom'
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
  bark: '#2A2520',
  white: '#FDFAF5',
}

const destinations = [
  {
    name: 'Portugal',
    slug: 'portugal',
    tagline: 'Lisbon, Porto, Alentejo, and the edges worth finding.',
  },
  {
    name: 'Italy',
    slug: 'italy',
    tagline: 'The south, the mountains, the places Tuscany forgot.',
  },
  {
    name: 'Iceland',
    slug: 'iceland',
    tagline: 'Westfjords, the Highlands, and everything past the tourist loop.',
  },
  {
    name: 'Spain',
    slug: 'spain',
    tagline: 'Basque Country, Andalusia, and the parts no one bothers with.',
  },
]

const steps = [
  {
    num: '01',
    title: 'Tell me how you travel',
    body: 'A seven-question quiz that cuts through preferences and gets to what kind of experience you actually want.',
  },
  {
    num: '02',
    title: 'Get a destination match',
    body: 'Curated restaurant picks, the right neighborhoods, and practical guidance -- all filtered for how you said you travel.',
  },
  {
    num: '03',
    title: 'Hire me to plan the whole thing',
    body: 'A custom day-by-day itinerary built from scratch. Not a template. Not an algorithm. A plan that fits.',
  },
]

export default function Home() {
  const sectionLabelStyle = {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: colors.tan,
    marginBottom: '1rem',
  }

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
      <Nav />

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '8rem 2rem 6rem',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <p style={sectionLabelStyle}>Deriva</p>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
          fontWeight: '400',
          letterSpacing: '0.05em',
          color: colors.ink,
          lineHeight: '1.1',
          marginBottom: '1.5rem',
          maxWidth: '700px',
        }}>
          Europe,<br />Done Right.
        </h1>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          fontWeight: '300',
          color: colors.mid,
          lineHeight: '1.6',
          maxWidth: '480px',
          marginBottom: '2.5rem',
        }}>
          Custom trip planning for people who travel with intention.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to="/work-with-me"
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: colors.white,
              backgroundColor: colors.gold,
              padding: '1rem 2rem',
              textDecoration: 'none',
              border: `1px solid ${colors.gold}`,
            }}
          >
            Work With Me
          </Link>
        </div>
      </section>

      {/* DESTINATION STRIP */}
      <section style={{
        padding: '5rem 0',
        borderTop: `1px solid ${colors.sand}`,
        borderBottom: `1px solid ${colors.sand}`,
        backgroundColor: colors.parchment,
      }}>
        <div style={{ padding: '0 2rem', maxWidth: '1100px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>Destinations</p>
        </div>
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '0',
          padding: '1rem 2rem',
          maxWidth: '1100px',
          margin: '0 auto',
          scrollbarWidth: 'none',
        }}>
          {destinations.map((d, i) => (
            <div
              key={d.slug}
              style={{
                minWidth: '260px',
                flex: '1',
                padding: '2rem',
                borderRight: i < destinations.length - 1 ? `1px solid ${colors.sand}` : 'none',
              }}
            >
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.4rem',
                fontWeight: '400',
                letterSpacing: '0.05em',
                color: colors.ink,
                marginBottom: '0.75rem',
              }}>
                {d.name}
              </h3>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.85rem',
                fontWeight: '300',
                color: colors.mid,
                lineHeight: '1.6',
                marginBottom: '1.5rem',
              }}>
                {d.tagline}
              </p>
              <Link
                to={`/destinations/${d.slug}`}
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: colors.gold,
                  textDecoration: 'none',
                  borderBottom: `1px solid ${colors.gold}`,
                  paddingBottom: '2px',
                }}
              >
                Explore
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{
        padding: '6rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <p style={sectionLabelStyle}>How It Works</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '3rem 4rem',
          marginTop: '2rem',
        }}>
          {steps.map(step => (
            <div key={step.num}>
              <p style={{
                fontFamily: 'Georgia, serif',
                fontSize: '2rem',
                color: colors.sand,
                marginBottom: '1rem',
                letterSpacing: '0.05em',
              }}>
                {step.num}
              </p>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.1rem',
                fontWeight: '400',
                color: colors.ink,
                marginBottom: '0.75rem',
                letterSpacing: '0.02em',
              }}>
                {step.title}
              </h3>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.9rem',
                fontWeight: '300',
                color: colors.mid,
                lineHeight: '1.7',
              }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT DERIVA */}
      <section style={{
        backgroundColor: colors.parchment,
        borderTop: `1px solid ${colors.sand}`,
        borderBottom: `1px solid ${colors.sand}`,
        padding: '6rem 2rem',
      }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>About Deriva</p>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            fontWeight: '400',
            color: colors.ink,
            lineHeight: '1.75',
            marginBottom: '1.5rem',
          }}>
            Deriva exists for people who are tired of going somewhere and feeling like they went nowhere.
          </p>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.95rem',
            fontWeight: '300',
            color: colors.mid,
            lineHeight: '1.8',
            marginBottom: '1rem',
          }}>
            Every recommendation is personal. Every itinerary is built from scratch. The goal is not to show you Europe -- it is to show you a version of Europe that actually fits how you travel.
          </p>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.95rem',
            fontWeight: '300',
            color: colors.mid,
            lineHeight: '1.8',
          }}>
            No templates. No aggregated reviews. No lists of the same twelve restaurants. Just good judgment, applied to your trip.
          </p>
          <div style={{ marginTop: '2.5rem' }}>
            <Link
              to="/work-with-me"
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.65rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: colors.gold,
                textDecoration: 'none',
                borderBottom: `1px solid ${colors.gold}`,
                paddingBottom: '2px',
              }}
            >
              Work With Me
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
