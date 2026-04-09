import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const colors = {
  cream: '#F5F0E8', sand: '#D8CCBA', tan: '#C8B89A', gold: '#9E8660',
  mid: '#7A6E62', ink: '#1E1C18', white: '#FDFAF5',
}

const PASSPHRASE = 'deriva2024'

export default function AdvisorLogin() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value === PASSPHRASE) { sessionStorage.setItem('deriva_advisor', 'true'); navigate('/advisor/dashboard') }
    else { setError(true); setValue('') }
  }

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '360px', width: '100%' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: colors.ink, marginBottom: '2.5rem' }}>Deriva</p>
        <form onSubmit={handleSubmit}>
          <label style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.tan, display: 'block', marginBottom: '0.5rem' }}>Passphrase</label>
          <input
            type="password"
            value={value}
            onChange={e => { setValue(e.target.value); setError(false) }}
            autoFocus
            style={{ width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: '1rem', color: colors.ink, backgroundColor: colors.white, border: `1px solid ${error ? '#9E6060' : colors.sand}`, padding: '0.75rem 1rem', outline: 'none', marginBottom: '1rem' }}
          />
          {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: '#9E6060', marginBottom: '1rem' }}>Incorrect passphrase.</p>}
          <button type="submit" style={{ width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.white, backgroundColor: colors.gold, border: 'none', padding: '0.9rem', cursor: 'pointer' }}>Enter</button>
        </form>
      </div>
    </div>
  )
}
