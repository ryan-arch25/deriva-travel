import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const C = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18',
  white: '#FDFAF5', terracotta: '#B85C45',
}

const lbl = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em',
  textTransform: 'uppercase', color: C.tan, display: 'block', marginBottom: '0.5rem',
}
const inputStyle = {
  width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: '1rem', fontWeight: '300',
  color: C.ink, backgroundColor: C.white, border: `1px solid ${C.sand}`, padding: '0.75rem 1rem',
  outline: 'none', boxSizing: 'border-box', marginBottom: '1rem',
}
const btnStyle = {
  width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em',
  textTransform: 'uppercase', color: C.white, backgroundColor: C.gold, border: 'none',
  padding: '0.9rem', cursor: 'pointer',
}
const linkStyle = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em',
  color: C.mid, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline',
  padding: 0,
}
const errStyle = { fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: '#9E6060', marginBottom: '1rem' }

function Shell({ children }) {
  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '380px', width: '100%' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.ink, marginBottom: '0.35rem' }}>Deriva</p>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.tan, marginBottom: '2.5rem' }}>Advisor</p>
        {children}
      </div>
    </div>
  )
}

function LoginForm({ onSuccess, onForgot, needsSetup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (needsSetup) {
      if (password.length < 8) { setError('Password must be at least 8 characters.'); setLoading(false); return }
      if (password !== confirm) { setError('Passwords do not match.'); setLoading(false); return }
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'setup', email: email.trim(), password }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error); setLoading(false); return }
        onSuccess()
      } catch { setError('Something went wrong.'); setLoading(false) }
      return
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: email.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      onSuccess()
    } catch { setError('Something went wrong.'); setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit}>
      {needsSetup && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: C.charcoal, lineHeight: '1.6', marginBottom: '1.5rem' }}>
          Set your password for the first time.
        </p>
      )}
      <label style={lbl}>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus autoComplete="email" style={inputStyle} />
      <label style={lbl}>{needsSetup ? 'Create Password' : 'Password'}</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={needsSetup ? 'new-password' : 'current-password'} style={inputStyle} />
      {needsSetup && (
        <>
          <label style={lbl}>Confirm Password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" style={inputStyle} />
        </>
      )}
      {error && <p style={errStyle}>{error}</p>}
      <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }}>
        {loading ? 'Working...' : needsSetup ? 'Set Password' : 'Sign In'}
      </button>
      {!needsSetup && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button type="button" onClick={onForgot} style={linkStyle}>Forgot Password</button>
        </div>
      )}
    </form>
  )
}

function TwoFactorForm({ onSuccess, onRestart }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-2fa', code: code.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.restart) { onRestart(data.error); return }
        setError(data.error)
        setLoading(false)
        return
      }
      onSuccess()
    } catch { setError('Something went wrong.'); setLoading(false) }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'resend-code' }) })
      setResent(true)
      setTimeout(() => setResent(false), 3000)
    } catch {}
    setResending(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.charcoal, lineHeight: '1.6', marginBottom: '1.5rem' }}>
        A verification code was sent to your email.
      </p>
      <label style={lbl}>6-digit code</label>
      <input
        type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6}
        value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
        autoFocus autoComplete="one-time-code"
        style={{ ...inputStyle, textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em' }}
      />
      {error && <p style={errStyle}>{error}</p>}
      <button type="submit" disabled={loading || code.length !== 6} style={{ ...btnStyle, opacity: loading || code.length !== 6 ? 0.6 : 1 }}>
        {loading ? 'Verifying...' : 'Verify'}
      </button>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button type="button" onClick={handleResend} disabled={resending} style={linkStyle}>
          {resent ? 'Code sent' : resending ? 'Sending...' : 'Resend code'}
        </button>
      </div>
    </form>
  )
}

function ForgotForm({ onBack }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'forgot', email: email.trim() }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to send reset email.')
        setLoading(false)
        return
      }
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.charcoal, lineHeight: '1.6', marginBottom: '1.5rem' }}>
          If an account exists with that email, a password reset link has been sent.
        </p>
        <button onClick={onBack} style={linkStyle}>Back to sign in</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.charcoal, lineHeight: '1.6', marginBottom: '1.5rem' }}>
        Enter your email and we will send a password reset link.
      </p>
      <label style={lbl}>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus style={inputStyle} />
      {error && <p style={errStyle}>{error}</p>}
      <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button type="button" onClick={onBack} style={linkStyle}>Back to sign in</button>
      </div>
    </form>
  )
}

function ResetPasswordForm({ token }) {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    fetch(`/api/auth?action=validate-reset&token=${token}`).then((r) => {
      if (!r.ok) setInvalid(true)
    }).catch(() => setInvalid(true))
  }, [token])

  if (invalid) {
    return (
      <div>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: '#9E6060', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          This reset link is invalid or has expired.
        </p>
        <button onClick={() => navigate('/advisor')} style={linkStyle}>Back to sign in</button>
      </div>
    )
  }

  if (done) {
    return (
      <div>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.charcoal, lineHeight: '1.6', marginBottom: '1.5rem' }}>
          Your password has been reset. You can now sign in.
        </p>
        <button onClick={() => navigate('/advisor')} style={{ ...btnStyle, textDecoration: 'none', display: 'block', textAlign: 'center' }}>Sign In</button>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset-password', token, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      setDone(true)
    } catch { setError('Something went wrong.'); setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.charcoal, lineHeight: '1.6', marginBottom: '1.5rem' }}>
        Choose a new password.
      </p>
      <label style={lbl}>New Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" style={inputStyle} />
      <label style={lbl}>Confirm Password</label>
      <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" style={inputStyle} />
      {error && <p style={errStyle}>{error}</p>}
      <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }}>
        {loading ? 'Saving...' : 'Reset Password'}
      </button>
    </form>
  )
}

export default function AdvisorLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resetToken = searchParams.get('token')
  const [step, setStep] = useState('loading')
  const [needsSetup, setNeedsSetup] = useState(false)
  const [restartMsg, setRestartMsg] = useState('')

  useEffect(() => {
    if (resetToken) { setStep('reset'); return }
    fetch('/api/auth?action=session').then((r) => r.json()).then((data) => {
      if (data.authenticated) { navigate('/advisor/dashboard'); return }
      if (data.needsSetup) { setNeedsSetup(true); setStep('login'); return }
      setStep('login')
    }).catch(() => setStep('login'))
  }, [])

  if (step === 'loading') {
    return <Shell><p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: C.tan }}>Loading...</p></Shell>
  }

  if (step === 'reset') {
    return <Shell><ResetPasswordForm token={resetToken} /></Shell>
  }

  if (step === 'forgot') {
    return <Shell><ForgotForm onBack={() => setStep('login')} /></Shell>
  }

  if (step === '2fa') {
    return (
      <Shell>
        <TwoFactorForm
          onSuccess={() => navigate('/advisor/dashboard')}
          onRestart={(msg) => { setRestartMsg(msg); setStep('login') }}
        />
      </Shell>
    )
  }

  return (
    <Shell>
      {restartMsg && <p style={errStyle}>{restartMsg}</p>}
      <LoginForm
        needsSetup={needsSetup}
        onSuccess={() => { setRestartMsg(''); setStep('2fa') }}
        onForgot={() => setStep('forgot')}
      />
    </Shell>
  )
}
