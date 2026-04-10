import { Link } from 'react-router-dom'

const colors = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18', white: '#FDFAF5',
}

export default function DestinationFooter({ country, whyCopy }) {
  return (
    <div style={{ marginTop: '5rem', paddingTop: '4rem', borderTop: `1px solid ${colors.sand}` }}>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: colors.tan,
        marginBottom: '1.25rem',
      }}>
        Why {country}
      </p>
      <p style={{
        fontFamily: 'Georgia, serif',
        fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
        fontWeight: '400',
        color: colors.ink,
        lineHeight: '1.75',
        maxWidth: '720px',
        marginBottom: '5rem',
      }}>
        {whyCopy}
      </p>

      <div style={{ paddingTop: '3rem', borderTop: `1px solid ${colors.sand}` }}>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: colors.tan,
          marginBottom: '1rem',
        }}>
          Plan This Trip
        </p>
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.3rem',
          fontWeight: '400',
          color: colors.ink,
          lineHeight: '1.5',
          marginBottom: '2rem',
        }}>
          Want a custom itinerary for {country}? This is what I do.
        </p>
        <Link to="/work-with-me" style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: colors.white,
          backgroundColor: colors.gold,
          padding: '1rem 2rem',
          textDecoration: 'none',
          border: '1px solid #9E8660',
          display: 'inline-block',
        }}>
          Work With Me
        </Link>
      </div>
    </div>
  )
}
