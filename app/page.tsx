'use client'
import { useRouter } from 'next/navigation'

const IDENTIFIERS = [
  { plain: 'Jordan Culwell', hash: 'ZK:A4F2C801' },
  { plain: 'DOB:2012-03-14', hash: 'ZK:B7E3D204' },
  { plain: 'ID:EIQ-00441', hash: 'ZK:C1A9F563' },
  { plain: 'Ada High School', hash: 'ZK:D8B2E417' },
]

export default function SplashPage() {
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
      color: '#ffffff',
    }}>
      <div style={{
        background: '#161b22',
        border: '1px solid rgba(29,233,182,0.25)',
        borderRadius: '16px',
        padding: '40px 28px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 0 0 1px rgba(29,233,182,0.08), 0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '32px', lineHeight: 1, marginBottom: '6px' }}>🎓</div>
          <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px', color: '#ffffff' }}>EduIQ</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>Chikasha Sovereign Edition</div>
          <div style={{ color: '#1de9b6', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, marginTop: '6px' }}>
            Student Mental Health Intelligence
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(29,233,182,0.1)',
            border: '1px solid rgba(29,233,182,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
          }}>
            🛡
          </div>
        </div>

        <h1 style={{
          color: '#1de9b6',
          fontSize: '22px',
          fontWeight: 700,
          textAlign: 'center',
          margin: '0 0 16px',
          letterSpacing: '-0.3px',
        }}>
          Student Data Protected
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '13px',
          lineHeight: 1.6,
          textAlign: 'center',
          margin: '0 0 24px',
        }}>
          EduIQ hashes all student identifiers, school records, and health information at your device before any AI processing. Jordan&apos;s data never reaches a commercial server in readable form.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {IDENTIFIERS.map(({ plain, hash }) => (
            <div key={plain} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '8px 12px',
              background: '#0d1117',
              border: '1px solid rgba(29,233,182,0.15)',
              borderRadius: '8px',
              fontSize: '11px',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}>
              <span style={{ color: '#1de9b6', fontWeight: 600 }}>{plain}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>→</span>
              <span style={{ color: 'rgba(29,233,182,0.7)' }}>{hash}</span>
            </div>
          ))}
        </div>

        <div style={{
          padding: '10px 14px',
          background: 'rgba(29,233,182,0.06)',
          border: '1px solid rgba(29,233,182,0.2)',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '10px', color: '#1de9b6', letterSpacing: '1.5px', fontWeight: 700 }}>
            🔒 SOVEREIGN PROMPT SHIELD V2.0 · FERPA AND HIPAA ALIGNED
          </span>
        </div>

        <button
          onClick={() => router.push('/dashboard/educator')}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(180deg, #1de9b6 0%, #0fbf86 100%)',
            border: 'none',
            borderRadius: '10px',
            color: '#0d1117',
            fontSize: '14px',
            letterSpacing: '0.5px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 4px 16px rgba(29,233,182,0.25)',
          }}
        >
          Enter EduIQ ⊙
        </button>
      </div>
    </main>
  )
}
