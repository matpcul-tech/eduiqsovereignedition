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
    bg: '#0d1117',
    surface: '#161b22',
    border: 'rgba(0,212,170,0.15)',
    teal: '#00d4aa',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.6)',
    critical: '#ff4757',
    concern: '#ff6b35',
    watch: '#ffa502',
    good: '#2ed573',
  }

  const userId = (user.id || '').toString().slice(0, 8).toUpperCase()
  const navTabs = [
    { label: 'Parent', active: false },
    { label: 'School', active: true },
    { label: 'Student', active: false },
  ]

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text, fontFamily: 'system-ui, -apple-system, sans-serif', padding: '24px 32px' }}>
      {/* App Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: `1px solid ${colors.border}`, marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px', lineHeight: 1 }}>🎓</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.1 }}>EduIQ</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600 }}>Sovereign Edition</span>
            </div>
            <div style={{ color: colors.teal, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>Student Mental Health Intelligence</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{user.full_name || 'Educator'}</div>
            <div style={{ color: colors.muted, fontSize: '11px', letterSpacing: '1px' }}>ID: {userId}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(46,213,115,0.08)', border: `1px solid rgba(46,213,115,0.3)`, borderRadius: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.good, display: 'inline-block', boxShadow: '0 0 8px rgba(46,213,115,0.6)' }} />
            <span style={{ color: colors.teal, fontSize: '10px', letterSpacing: '1.5px', fontWeight: 700 }}>SHIELD ON</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {navTabs.map(tab => (
          <div
            key={tab.label}
            style={{
              padding: '10px 24px',
              borderRadius: '20px',
              background: tab.active ? colors.teal : colors.surface,
              color: tab.active ? '#ffffff' : colors.muted,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'default',
              border: tab.active ? 'none' : `1px solid ${colors.border}`,
              transition: 'all 0.2s',
              userSelect: 'none',
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Welcome / Stats Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Welcome, {user.full_name || 'Educator'}</h1>
          <p style={{ color: colors.muted, fontSize: '13px', margin: '4px 0 0' }}>{user.school_name}{user.tribal_affiliation ? ` · ${user.tribal_affiliation}` : ''}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: colors.critical, fontSize: '32px', fontWeight: 700, lineHeight: 1 }}>{criticalStudents.length}</div>
          <div style={{ color: colors.muted, fontSize: '11px', letterSpacing: '1px', marginTop: '4px' }}>STUDENTS NEEDING ATTENTION</div>
        </div>
      </div>

      {/* Student Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {students.map(student => {
          const latest = student.eduiq_observations?.[0]
          const ews = latest?.ews_score ?? null
          const level = ews === null ? 'none' : ews <= 2 ? 'critical' : ews <= 4 ? 'concern' : ews <= 6 ? 'watch' : 'good'
          const levelColor = { critical: colors.critical, concern: colors.concern, watch: colors.watch, good: colors.good, none: colors.muted }[level]
          const isSelected = selectedStudent?.id === student.id

          return (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              style={{
                background: colors.surface,
                border: `1px solid ${isSelected ? colors.teal : colors.border}`,
                borderRadius: '8px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isSelected ? '0 0 0 1px rgba(0,212,170,0.4)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{student.full_name}</div>
                  <div style={{ color: colors.muted, fontSize: '12px' }}>Grade {student.grade}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {ews !== null ? (
                    <>
                      <div style={{ color: levelColor, fontSize: '24px', fontWeight: 700, lineHeight: 1 }}>{ews.toFixed(1)}</div>
                      <div style={{ color: levelColor, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>{level}</div>
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
                      <div style={{ color: colors.muted, fontSize: '9px', letterSpacing: '1px', marginBottom: '4px', fontWeight: 600 }}>{label}</div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
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
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>{selectedStudent.full_name}</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowObsForm(!showObsForm)}
                style={{ padding: '10px 20px', background: colors.teal, border: 'none', borderRadius: '6px', color: colors.bg, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Log Observation
              </button>
              <button
                onClick={() => getInsight(selectedStudent.id)}
                disabled={loadingInsight}
                style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${colors.teal}`, borderRadius: '6px', color: colors.teal, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {loadingInsight ? 'Analyzing...' : 'AI Insight'}
              </button>
            </div>
          </div>

          {showObsForm && (
            <ObservationForm studentId={selectedStudent.id} onSuccess={() => setShowObsForm(false)} />
          )}

          {aiInsight && (
            <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(0,212,170,0.05)', border: `1px solid ${colors.border}`, borderRadius: '6px' }}>
              <div style={{ color: colors.teal, fontSize: '10px', letterSpacing: '2px', marginBottom: '12px', fontWeight: 700 }}>SOVEREIGN AI INSIGHT</div>
              <p style={{ margin: 0, lineHeight: '1.7', color: colors.text, fontSize: '14px' }}>{aiInsight}</p>
            </div>
          )}
        </div>
      )}

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '20px 24px' }}>
          <div style={{ color: colors.teal, fontSize: '10px', letterSpacing: '2px', marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase' }}>Recent Alerts</div>
          {alerts.map((alert, i) => (
            <div key={alert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === alerts.length - 1 ? 'none' : `1px solid rgba(255,255,255,0.06)` }}>
              <div>
                <span style={{ color: alert.alert_level === 'critical' ? colors.critical : alert.alert_level === 'concern' ? colors.concern : colors.watch, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 700, marginRight: '12px' }}>
                  {alert.alert_level}
                </span>
                <span style={{ fontSize: '14px' }}>{alert.eduiq_students?.full_name}</span>
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
