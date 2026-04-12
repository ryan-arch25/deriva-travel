import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const colors = {
  cream: '#F5F0E8',
  sand: '#D8CCBA',
  gold: '#9E8660',
  charcoal: '#3A3630',
  ink: '#1E1C18',
}

export default function Nav() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const isDark = location.pathname === '/'

  const navStyle = {
    borderTop: '3px solid #B85C45',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: scrolled ? colors.cream : 'transparent',
    borderBottom: scrolled ? `1px solid ${colors.sand}` : '1px solid transparent',
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
    padding: '0 2rem',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  const wordmarkStyle = {
    fontFamily: 'Georgia, serif',
    fontSize: '1.1rem',
    letterSpacing: '0.35em',
    fontWeight: '400',
    color: colors.ink,
    textDecoration: 'none',
    textTransform: 'uppercase',
  }

  const linkStyle = {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '0.7rem',
    letterSpacing: '0.18em',
    fontWeight: '400',
    color: colors.charcoal,
    textDecoration: 'none',
    textTransform: 'uppercase',
  }

  const linksWrap = {
    display: 'flex',
    gap: '2.5rem',
    alignItems: 'center',
  }

  return (
    <>
      <nav style={navStyle}>
        <Link to="/" style={wordmarkStyle}>Deriva</Link>

        {/* Desktop links */}
        <div style={{ ...linksWrap, display: 'flex' }} className="nav-desktop">
          <Link to="/destinations" style={linkStyle}>Destinations</Link>
          <Link to="/#how-it-works" style={linkStyle}>How It Works</Link>
          <Link to="/work-with-me" style={linkStyle}>Work With Me</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            flexDirection: 'column',
            gap: '5px',
          }}
          className="nav-hamburger"
          aria-label="Toggle menu"
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block',
              width: '22px',
              height: '1px',
              backgroundColor: colors.ink,
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          backgroundColor: colors.cream,
          borderBottom: `1px solid ${colors.sand}`,
          zIndex: 99,
          padding: '1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          <Link to="/destinations" style={linkStyle} onClick={() => setMenuOpen(false)}>Destinations</Link>
          <Link to="/#how-it-works" style={linkStyle} onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link to="/work-with-me" style={linkStyle} onClick={() => setMenuOpen(false)}>Work With Me</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}
