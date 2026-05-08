'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Could not send sign-in link. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    }
    setLoading(false)
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0d1117',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '24px',
    }}>
      <div style={{
        background: '#161b22',
        border: '1px solid rgba(0,212,170,0.15)',
        borderRadius: '12px',
        padding: '48px 40px',
        maxWidth: '420px',
        width: '100%',
      }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px', lineHeight: 1 }}>🎓</div>
          <h1 style={{ color: '#ffffff', fontSize: '36px', fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.5px' }}>
            EduIQ
          </h1>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', fontWeight: 600, margin: '0 0 12px' }}>
            Sovereign Edition
          </div>
          <p style={{ color: '#00d4aa', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0, fontWeight: 600 }}>
            Student Mental Health Intelligence
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px', color: '#00d4aa' }}>✓</div>
            <p style={{ color: '#ffffff', fontSize: '16px', margin: '0 0 8px', fontWeight: 600 }}>Check your email</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>A secure sign-in link has been sent to {email}</p>
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#0d1117',
                border: '1px solid rgba(0,212,170,0.15)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '15px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '16px',
              }}
            />
            <button
              onClick={handleLogin}
              disabled={loading || !email}
              style={{
                width: '100%',
                padding: '14px',
                background: loading || !email ? 'rgba(0,212,170,0.4)' : '#00d4aa',
                border: 'none',
                borderRadius: '8px',
                color: '#0d1117',
                fontSize: '13px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontWeight: 700,
                cursor: loading || !email ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {loading ? 'Sending...' : 'Send Secure Link'}
            </button>
            {error && (
              <p style={{ color: '#ff4757', fontSize: '12px', textAlign: 'center', margin: '12px 0 0', lineHeight: 1.5 }}>
                {error}
              </p>
            )}
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textAlign: 'center', margin: '20px 0 0' }}>
              HIPAA aligned · No passwords stored · Magic link expires in 1 hour
            </p>
          </>
        )}

        <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', letterSpacing: '1px' }}>
            🛡 Sovereign Prompt Shield v2.0
          </span>
        </div>
      </div>
    </main>
  )
}
