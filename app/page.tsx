'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    const res = await fetch('/api/auth/send-magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.ok) setSent(true)
    setLoading(false)
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2e1a 0%, #0f1f0f 60%, #1c1200 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(212,175,55,0.3)',
        borderRadius: '2px',
        padding: '56px 48px',
        maxWidth: '420px',
        width: '100%',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ color: '#d4af37', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>
            Sovereign Shield Technologies
          </div>
          <h1 style={{ color: '#f5f0e8', fontSize: '36px', fontWeight: '300', margin: '0 0 8px' }}>
            EduIQ Sovereign
          </h1>
          <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '14px', margin: 0 }}>
            Child Mental Health Early Warning System
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', color: '#d4af37' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>✦</div>
            <p style={{ color: '#f5f0e8', fontSize: '16px', margin: '0 0 8px' }}>Check your email</p>
            <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '13px' }}>A secure sign-in link has been sent to {email}</p>
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
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '2px',
                color: '#f5f0e8',
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
                background: loading ? 'rgba(212,175,55,0.3)' : '#d4af37',
                border: 'none',
                borderRadius: '2px',
                color: '#0f1f0f',
                fontSize: '13px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {loading ? 'Sending...' : 'Send Secure Link'}
            </button>
            <p style={{ color: 'rgba(245,240,232,0.3)', fontSize: '11px', textAlign: 'center', marginTop: '20px' }}>
              HIPAA compliant · No passwords stored · Magic link expires in 1 hour
            </p>
          </>
        )}
      </div>
    </main>
  )
}
