'use client'
import { useState } from 'react'

interface Props {
  studentId: string
  onSuccess: () => void
}

export default function ObservationForm({ studentId, onSuccess }: Props) {
  const [form, setForm] = useState({
    behavioral_score: 7,
    behavioral_notes: '',
    academic_score: 7,
    academic_notes: '',
    attendance_score: 7,
    attendance_notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/observations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, student_id: studentId }),
    })
    if (res.ok) {
      onSuccess()
    } else {
      const { error: e } = await res.json()
      setError(e || 'Failed to save')
    }
    setLoading(false)
  }

  const colors = {
    teal: '#00d4aa',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(0,212,170,0.15)',
    surface: '#0d1117',
  }

  const ScoreSlider = ({ label, field, notesField }: { label: string, field: string, notesField: string }) => (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label style={{ color: colors.muted, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>{label}</label>
        <span style={{ color: colors.teal, fontSize: '18px', fontWeight: 700 }}>{(form as any)[field]}</span>
      </div>
      <input
        type="range" min={0} max={10} value={(form as any)[field]}
        onChange={e => setForm(prev => ({ ...prev, [field]: parseInt(e.target.value) }))}
        style={{ width: '100%', accentColor: colors.teal, marginBottom: '8px' }}
      />
      <input
        type="text"
        placeholder={`${label} notes (no student names or identifiers)`}
        value={(form as any)[notesField]}
        onChange={e => setForm(prev => ({ ...prev, [notesField]: e.target.value }))}
        style={{ width: '100%', padding: '10px 12px', background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '6px', color: colors.text, fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
      />
    </div>
  )

  return (
    <div style={{ marginTop: '20px', padding: '20px', background: '#0d1117', border: `1px solid ${colors.border}`, borderRadius: '8px' }}>
      <ScoreSlider label="Behavioral" field="behavioral_score" notesField="behavioral_notes" />
      <ScoreSlider label="Academic" field="academic_score" notesField="academic_notes" />
      <ScoreSlider label="Attendance" field="attendance_score" notesField="attendance_notes" />
      {error && <p style={{ color: '#ff4757', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
      <button
        onClick={submit} disabled={loading}
        style={{ padding: '12px 24px', background: colors.teal, border: 'none', borderRadius: '6px', color: '#0d1117', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
      >
        {loading ? 'Saving...' : 'Save Observation'}
      </button>
    </div>
  )
}
