'use client'
import { useState } from 'react'
import EarlyWarningScore from '@/components/EarlyWarningScore'
import ObservationForm from '@/components/ObservationForm'

interface Props {
  user: any
  students: any[]
  alerts: any[]
}

export default function EducatorDashboard({ user, students, alerts }: Props) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [showObsForm, setShowObsForm] = useState(false)
  const [aiInsight, setAiInsight] = useState<string | null>(null)
  const [loadingInsight, setLoadingInsight] = useState(false)

  const criticalStudents = students.filter(s => {
    const latest = s.eduiq_observations?.[0]
    return latest && latest.ews_score <= 4
  })

  async function getInsight(studentId: string) {
    setLoadingInsight(true)
    const res = await fetch('/api/ai-insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, context: '' }),
    })
    const { insight } = await res.json()
    setAiInsight(insight)
    setLoadingInsight(false)
  }

  const colors = {
    bg: '#0f1f0f',
    surface: 'rgba(255,255,255,0.04)',
    border: 'rgba(212,175,55,0.2)',
    gold: '#d4af37',
    text: '#f5f0e8',
    muted: 'rgba(245,240,232,0.5)',
    critical: '#e05252',
    concern: '#e08c52',
    watch: '#d4af37',
    good: '#52a852',
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text, fontFamily: "'Cormorant Garamond', Georgia, serif", padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <div style={{ color: colors.gold, fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>EduIQ Sovereign — Educator View</div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '300' }}>Welcome, {user.full_name || 'Educator'}</h1>
          <p style={{ color: colors.muted, fontSize: '14px', margin: '4px 0 0' }}>{user.school_name} · {user.tribal_affiliation}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: colors.critical, fontSize: '32px', fontWeight: '300' }}>{criticalStudents.length}</div>
          <div style={{ color: colors.muted, fontSize: '12px', letterSpacing: '1px' }}>STUDENTS NEEDING ATTENTION</div>
        </div>
      </div>

      {/* Student Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {students.map(student => {
          const latest = student.eduiq_observations?.[0]
          const ews = latest?.ews_score ?? null
          const level = ews === null ? 'none' : ews <= 2 ? 'critical' : ews <= 4 ? 'concern' : ews <= 6 ? 'watch' : 'good'
          const levelColor = { critical: colors.critical, concern: colors.concern, watch: colors.watch, good: colors.good, none: colors.muted }[level]

          return (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              style={{
                background: selectedStudent?.id === student.id ? 'rgba(212,175,55,0.1)' : colors.surface,
                border: `1px solid ${selectedStudent?.id === student.id ? colors.gold : colors.border}`,
                borderRadius: '2px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>{student.full_name}</div>
                  <div style={{ color: colors.muted, fontSize: '12px' }}>Grade {student.grade}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {ews !== null ? (
                    <>
                      <div style={{ color: levelColor, fontSize: '24px', fontWeight: '300' }}>{ews.toFixed(1)}</div>
                      <div style={{ color: levelColor, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>{level}</div>
                    </>
                  ) : (
                    <div style={{ color: colors.muted, fontSize: '12px' }}>No data</div>
                  )}
                </div>
              </div>
              {latest && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  {[
                    { label: 'BEH', val: latest.behavioral_score },
                    { label: 'ACA', val: latest.academic_score },
                    { label: 'ATT', val: latest.attendance_score },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ flex: 1 }}>
                      <div style={{ color: colors.muted, fontSize: '9px', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: `${(val / 10) * 100}%`, background: val <= 4 ? colors.critical : val <= 6 ? colors.watch : colors.good, borderRadius: '2px', transition: 'width 0.6s' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Selected Student Actions */}
      {selectedStudent && (
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '2px', padding: '28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '300' }}>{selectedStudent.full_name}</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowObsForm(!showObsForm)}
                style={{ padding: '10px 20px', background: colors.gold, border: 'none', borderRadius: '2px', color: colors.bg, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Log Observation
              </button>
              <button
                onClick={() => getInsight(selectedStudent.id)}
                disabled={loadingInsight}
                style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${colors.gold}`, borderRadius: '2px', color: colors.gold, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {loadingInsight ? 'Analyzing...' : 'AI Insight'}
              </button>
            </div>
          </div>

          {showObsForm && (
            <ObservationForm studentId={selectedStudent.id} onSuccess={() => setShowObsForm(false)} />
          )}

          {aiInsight && (
            <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(212,175,55,0.05)', border: `1px solid ${colors.border}`, borderRadius: '2px' }}>
              <div style={{ color: colors.gold, fontSize: '10px', letterSpacing: '3px', marginBottom: '12px' }}>SOVEREIGN AI INSIGHT</div>
              <p style={{ margin: 0, lineHeight: '1.7', color: colors.text, fontSize: '15px' }}>{aiInsight}</p>
            </div>
          )}
        </div>
      )}

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div>
          <div style={{ color: colors.gold, fontSize: '10px', letterSpacing: '3px', marginBottom: '16px' }}>RECENT ALERTS</div>
          {alerts.map(alert => (
            <div key={alert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${colors.border}` }}>
              <div>
                <span style={{ color: alert.alert_level === 'critical' ? colors.critical : alert.alert_level === 'concern' ? colors.concern : colors.watch, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginRight: '12px' }}>
                  {alert.alert_level}
                </span>
                <span style={{ fontSize: '15px' }}>{alert.eduiq_students?.full_name}</span>
              </div>
              <div style={{ color: colors.muted, fontSize: '12px' }}>
                {new Date(alert.created_at).toLocaleDateString()}
                {alert.sms_sent && <span style={{ marginLeft: '8px', color: colors.good }}>SMS ✓</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
