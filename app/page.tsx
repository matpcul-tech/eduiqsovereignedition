'use client'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

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

        <button
          onClick={() => router.push('/dashboard/educator')}
          style={{
            width: '100%',
            padding: '14px',
            background: '#00d4aa',
            border: 'none',
            borderRadius: '8px',
            color: '#0d1117',
            fontSize: '13px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Enter Dashboard
        </button>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textAlign: 'center', margin: '20px 0 0' }}>
          Open access · Sign-in temporarily disabled
        </p>

        <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', letterSpacing: '1px' }}>
            🛡 Sovereign Prompt Shield v2.0
          </span>
        </div>
      </div>
    </main>
  )
}
