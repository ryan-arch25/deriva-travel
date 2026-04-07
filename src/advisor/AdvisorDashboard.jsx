import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

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
  bark: '#2A2520',
}

const sections = [
  { label: 'New Client Brief', desc: 'Enter client details and generate a full research brief.' },
  { label: 'My Spots', desc: 'Upload and manage your personally vetted places.' },
  { label: 'Research Tool', desc: 'Freeform AI research assistant for destination questions.' },
  { label: 'Client Notes', desc: 'Lightweight notes and status tracker per client.' },
]

export default function AdvisorDashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!sessionStorage.getItem('deriva_advisor')) {
      navigate('/advisor')
    }
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('deriva_advisor')
    navigate('/advisor')
  }

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
      <div style={{
        borderBottom: `1px solid ${colors.sand}`,
        padding: '0 2rem',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.cream,
      }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: colors.ink }}>
          Deriva Advisor
        </p>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.tan, textDecoration: 'none' }}>
            Public Site
          </Link>
          <button onClick={handleLogout} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.mid, background: 'none', border: 'none', cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '0.75rem' }}>
          Advisor Platform
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: '400', color: colors.ink, marginBottom: '3rem' }}>
          Dashboard
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0',
          border: `1px solid ${colors.sand}`,
        }}>
          {sections.map((s, i) => (
            <div key={s.label} style={{
              padding: '2rem',
              borderRight: i % 2 === 0 ? `1px solid ${colors.sand}` : 'none',
              borderBottom: i < 2 ? `1px solid ${colors.sand}` : 'none',
              backgroundColor: colors.white,
            }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400', color: colors.ink, marginBottom: '0.5rem' }}>
                {s.label}
              </h2>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: '300', color: colors.mid, lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {s.desc}
              </p>
              <span style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: colors.tan,
                border: `1px solid ${colors.sand}`,
                padding: '0.25rem 0.6rem',
              }}>
                Coming in Phase 2
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
