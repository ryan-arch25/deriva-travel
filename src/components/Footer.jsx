import { Link } from 'react-router-dom'

const colors = {
  bark: '#2A2520',
  tan: '#C8B89A',
  sand: '#D8CCBA',
  mid: '#7A6E62',
}

export default function Footer() {
  const wrapStyle = {
    backgroundColor: colors.bark,
    padding: '3rem 2rem',
    marginTop: '6rem',
  }

  const innerStyle = {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  }

  const topRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '2rem',
  }

  const wordmarkStyle = {
    fontFamily: 'Georgia, serif',
    fontSize: '1rem',
    letterSpacing: '0.35em',
    color: colors.tan,
    textDecoration: 'none',
    textTransform: 'uppercase',
  }

  const taglineStyle = {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    color: colors.mid,
    textTransform: 'uppercase',
    marginTop: '0.5rem',
  }

  const linkStyle = {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    color: colors.mid,
    textDecoration: 'none',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '0.75rem',
  }

  const linkHover = {
    color: colors.tan,
  }

  const dividerStyle = {
    borderTop: `1px solid #3A3630`,
    paddingTop: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  }

  const copyStyle = {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    color: colors.mid,
    textTransform: 'uppercase',
  }

  return (
    <footer style={wrapStyle}>
      <div style={innerStyle}>
        <div style={topRow}>
          <div>
            <Link to="/" style={wordmarkStyle}>Deriva</Link>
            <p style={taglineStyle}>Travel with Intent</p>
          </div>
          <div>
            <Link to="/destinations" style={linkStyle}>Destinations</Link>
            <Link to="/work-with-me" style={linkStyle}>Work With Me</Link>
            <a href="https://instagram.com" style={linkStyle} target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>

        <div style={dividerStyle}>
          <p style={copyStyle}>&copy; {new Date().getFullYear()} Deriva. All rights reserved.</p>
          <Link
            to="/advisor"
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              color: '#3A3630',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            Advisor
          </Link>
        </div>
      </div>
    </footer>
  )
}
