'use client'
import { useState } from 'react'

const C = {
  bg: '#0d1117',
  surface: '#161b22',
  surfaceAlt: '#1c2230',
  border: 'rgba(29,233,182,0.15)',
  borderStrong: 'rgba(29,233,182,0.3)',
  divider: 'rgba(255,255,255,0.06)',
  teal: '#1de9b6',
  tealDim: 'rgba(29,233,182,0.08)',
  text: '#ffffff',
  muted: 'rgba(255,255,255,0.6)',
  mutedFaint: 'rgba(255,255,255,0.4)',
  high: '#ff4757',
  medium: '#ffa502',
  low: '#2ed573',
  good: '#2ed573',
  pinkAlert: '#ff4757',
}

const STUDENT = {
  name: 'Jordan Culwell',
  eid: '2026-00441',
  grade: '9th Grade',
  school: 'Ada High School',
  provider: 'Dr. Sarah Mills, LCSW',
  score: 65,
  level: 'Moderate Concern',
  summary: 'Sleep and emotional regulation need attention. Physical activity declining this week.',
  activeAlerts: 2,
  flaggedDays: 2,
  observations: 3,
  attendance: 87,
}

const OBSERVATIONS = [
  { class: 'Math', teacher: 'Mr. Thompson', date: 'Today', sev: 'medium', text: 'Jordan seemed withdrawn and did not participate in group work. Completed individual assignments.' },
  { class: 'English', teacher: 'Ms. Rivera', date: 'Yesterday', sev: 'low', text: 'Good day. Jordan contributed to class discussion and turned in essay on time.' },
  { class: 'PE', teacher: 'Coach Davis', date: 'Apr 24', sev: 'high', text: 'Sat out of activity claiming headache. Third time this month.' },
  { class: 'Science', teacher: 'Ms. Chen', date: 'Apr 23', sev: 'low', text: 'Lab partner reported Jordan was quiet. Lab completed successfully.' },
]

const ALERTS = [
  { title: 'Sleep deficit detected', sev: 'high', source: 'Wearable', icon: '😴', text: 'Average sleep 5.4 hours over past 7 days. Target is 8 to 10 hours for age 14.' },
  { title: 'Academic engagement drop', sev: 'medium', source: 'School', icon: '📉', text: 'Teacher observation: Jordan has been disengaged in 3 of last 5 classes. Assignments incomplete.' },
  { title: 'Activity below baseline', sev: 'medium', source: 'Wearable', icon: '⚡', text: 'Steps average 3,200 this week versus 6,800 baseline. Significant reduction in physical activity.' },
]

const DOMAINS = [
  { name: 'Emotional Regulation', icon: '💗', score: 58, tone: 'medium' },
  { name: 'Social Connection', icon: '👥', score: 72, tone: 'good' },
  { name: 'Academic Engagement', icon: '📚', score: 64, tone: 'medium' },
  { name: 'Sleep and Recovery', icon: '🌙', score: 45, tone: 'high' },
  { name: 'Physical Activity', icon: '⚡', score: 78, tone: 'good' },
  { name: 'Home Environment', icon: '🏠', score: 70, tone: 'good' },
]

const FITBIT = {
  device: 'Fitbit Charge 6',
  hr: '73 bpm',
  steps: '3,238',
  sleep: '5h 24m',
  spo2: '96%',
  hrv: '34 ms',
  calories: '1248 kcal',
}

const RESOURCES = [
  { icon: '💬', name: 'Crisis Text Line', detail: 'Text HOME to 741741' },
  { icon: '☎️', name: '988 Suicide and Crisis Lifeline', detail: 'Call or text 988 anytime' },
  { icon: '🏫', name: 'Ada Schools Counseling', detail: 'Ms. Johnson · Room 104' },
  { icon: '🏛', name: 'Chickasaw Nation Behavioral Health', detail: '580-436-7220' },
  { icon: '💛', name: 'NAMI Oklahoma', detail: 'namiok.org · 1-800-583-1264' },
]

const SHIELD_FACTS = [
  { label: 'Architecture', value: 'Zero-Knowledge Dual Layer' },
  { label: 'Student PII', value: 'Hashed before AI transmission' },
  { label: 'School Data', value: 'Protected at browser edge' },
  { label: 'Parent Data', value: 'Consent-governed access' },
  { label: 'HIPAA Aligned', value: 'Architecture by design' },
  { label: 'FERPA Aligned', value: 'Student data never sold' },
]

const HASH_DEMO = [
  { plain: 'Jordan Culwell', hash: 'ZK:A4F2C801083D' },
  { plain: 'DOB 03/14/2012', hash: 'ZK:B7E32D041A9C' },
  { plain: 'ID EIQ-00441', hash: 'ZK:C1A9F5638E2D' },
  { plain: 'Ada High School', hash: 'ZK:D8B2E417BF6C' },
]

const AI_GREETING =
  "Hello! I'm the EduIQ AI wellness assistant. Jordan's overall wellness score is 64 this week, with sleep and emotional regulation flagged as areas needing attention. Everything you share is protected by the Sovereign Shield. How can I help?"

const AI_PROMPTS = ["Jordan's sleep concern", 'What does the score mean', 'School engagement']

type Role = 'parent' | 'school' | 'student'

const NAV: Record<Role, { id: string; label: string; icon: string }[]> = {
  parent: [
    { id: 'home', label: 'HOME', icon: '🏠' },
    { id: 'school', label: 'SCHOOL', icon: '🏫' },
    { id: 'ai', label: 'AI', icon: '🧠' },
    { id: 'help', label: 'HELP', icon: '💛' },
    { id: 'shield', label: 'SHIELD', icon: '🔒' },
  ],
  school: [
    { id: 'observe', label: 'OBSERVE', icon: '👁' },
    { id: 'dashboard', label: 'DASHBOARD', icon: '📊' },
    { id: 'ai', label: 'AI', icon: '🧠' },
    { id: 'resources', label: 'RESOURCES', icon: '💛' },
    { id: 'shield', label: 'SHIELD', icon: '🔒' },
  ],
  student: [
    { id: 'home', label: 'HOME', icon: '🏠' },
    { id: 'check-in', label: 'CHECK-IN', icon: '✅' },
    { id: 'ai', label: 'AI', icon: '🧠' },
    { id: 'support', label: 'SUPPORT', icon: '💛' },
    { id: 'shield', label: 'SHIELD', icon: '🔒' },
  ],
}

const DEFAULT_SECTION: Record<Role, string> = {
  parent: 'school',
  school: 'dashboard',
  student: 'home',
}

const sevColor = (sev: string) =>
  sev === 'high' ? C.high : sev === 'medium' ? C.medium : C.low

export default function SovereignDashboard() {
  const [role, setRole] = useState<Role>('parent')
  const [section, setSection] = useState<string>(DEFAULT_SECTION.parent)

  function setRoleAndSection(r: Role) {
    setRole(r)
    setSection(DEFAULT_SECTION[r])
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      color: C.text,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      paddingBottom: '88px',
    }}>
      <AppHeader />
      <RoleTabs role={role} onChange={setRoleAndSection} />
      <div style={{ padding: '0 16px' }}>
        <SectionView role={role} section={section} />
      </div>
      <BottomNav role={role} section={section} onSection={setSection} />
    </div>
  )
}

function AppHeader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #1a3d3a 0%, #0d1117 100%)',
          border: `1px solid ${C.borderStrong}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
        }}>🎓</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.3px' }}>EduIQ</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 600 }}>Chikasha Sovereign Edition</span>
          </div>
          <div style={{ color: C.teal, fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>
            Student Mental Health Intelligence
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.1 }}>{STUDENT.name}</div>
        <div style={{ color: C.muted, fontSize: '10px', marginTop: '2px', letterSpacing: '0.5px' }}>EID: {STUDENT.eid}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.good, boxShadow: '0 0 6px rgba(46,213,115,0.7)' }} />
          <span style={{ color: C.teal, fontSize: '9px', fontWeight: 700, letterSpacing: '1px' }}>SHIELD ON</span>
        </div>
      </div>
    </div>
  )
}

function RoleTabs({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  const tabs: { id: Role; label: string; icon: string }[] = [
    { id: 'parent', label: 'Parent', icon: '👪' },
    { id: 'school', label: 'School', icon: '🏫' },
    { id: 'student', label: 'Student', icon: '⭐' },
  ]
  return (
    <div style={{ display: 'flex', gap: '8px', padding: '12px 16px' }}>
      {tabs.map(t => {
        const active = role === t.id
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '20px',
              background: active ? C.teal : C.surface,
              color: active ? '#0d1117' : C.muted,
              border: active ? 'none' : `1px solid ${C.border}`,
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function BottomNav({ role, section, onSection }: { role: Role; section: string; onSection: (s: string) => void }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: C.surface,
      borderTop: `1px solid ${C.border}`,
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0 14px',
    }}>
      {NAV[role].map(item => {
        const active = section === item.id
        return (
          <button
            key={item.id}
            onClick={() => onSection(item.id)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '4px',
              color: active ? C.teal : C.mutedFaint,
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px' }}>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function SectionView({ role, section }: { role: Role; section: string }) {
  const key = `${role}:${section}`
  switch (key) {
    case 'parent:home':
      return <ParentHome />
    case 'parent:school':
      return <SchoolObservations showLogForm />
    case 'parent:ai':
      return <WellnessAI />
    case 'parent:help':
      return <SupportResources withCrisis />
    case 'parent:shield':
      return <ShieldPanel />
    case 'school:observe':
      return <SchoolObservations showLogForm />
    case 'school:dashboard':
      return <SchoolDashboard />
    case 'school:ai':
      return <WellnessAI />
    case 'school:resources':
      return <SupportResources />
    case 'school:shield':
      return <ShieldPanel />
    case 'student:home':
      return <StudentHome />
    case 'student:check-in':
      return <StudentCheckIn />
    case 'student:ai':
      return <WellnessAI studentMode />
    case 'student:support':
      return <SupportResources studentMode />
    case 'student:shield':
      return <ShieldPanel />
    default:
      return <SchoolObservations showLogForm />
  }
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div style={{ color: C.teal, fontSize: '11px', letterSpacing: '2px', fontWeight: 700, textTransform: 'uppercase', margin: '20px 0 12px' }}>
      {label}
    </div>
  )
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '12px',
      padding: '16px',
      ...style,
    }}>
      {children}
    </div>
  )
}

function ParentHome() {
  return <SchoolObservations showLogForm />
}

function SchoolObservations({ showLogForm = false }: { showLogForm?: boolean }) {
  return (
    <div>
      <SectionHeading label="School Observations" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
        <Stat color={C.high} value={STUDENT.flaggedDays} label="Flagged Days" />
        <Stat color={C.medium} value={STUDENT.observations} label="Observations" />
        <Stat color={C.good} value={`${STUDENT.attendance}%`} label="Attendance" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
        {OBSERVATIONS.map(o => (
          <Card key={o.class}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>{o.class}</div>
                <div style={{ color: C.muted, fontSize: '11px', marginTop: '2px' }}>{o.teacher} · {o.date}</div>
              </div>
              <SeverityPill sev={o.sev} />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: 1.5, marginTop: '10px' }}>
              {o.text}
            </div>
          </Card>
        ))}
      </div>
      {showLogForm && <LogObservationForm />}
    </div>
  )
}

function Stat({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <Card style={{ textAlign: 'center', padding: '14px 8px' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '10px', color: C.muted, marginTop: '4px', letterSpacing: '0.3px' }}>{label}</div>
    </Card>
  )
}

function SeverityPill({ sev }: { sev: string }) {
  return (
    <span style={{
      color: sevColor(sev),
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      padding: '3px 10px',
      borderRadius: '20px',
      border: `1px solid ${sevColor(sev)}`,
      background: `${sevColor(sev)}1a`,
    }}>{sev}</span>
  )
}

function LogObservationForm() {
  const [text, setText] = useState('')
  return (
    <>
      <SectionHeading label="Log New Observation" />
      <Card>
        <textarea
          placeholder="Describe your observation..."
          value={text}
          onChange={e => setText(e.target.value)}
          style={{
            width: '100%',
            minHeight: '90px',
            padding: '12px',
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            color: C.text,
            fontSize: '13px',
            fontFamily: 'inherit',
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box',
            marginBottom: '12px',
          }}
        />
        <button
          onClick={() => { if (text.trim()) { setText(''); alert('Observation submitted (demo)') } }}
          style={{
            padding: '12px 20px',
            background: C.teal,
            color: C.bg,
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Submit Observation
        </button>
      </Card>
    </>
  )
}

function SchoolDashboard() {
  return (
    <div>
      <Card style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a3d3a, #0d1117)',
            border: `1px solid ${C.borderStrong}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            flexShrink: 0,
          }}>🎓</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>{STUDENT.name}</div>
            <div style={{ color: C.muted, fontSize: '12px', marginTop: '2px' }}>{STUDENT.grade} · {STUDENT.school}</div>
            <div style={{ color: C.muted, fontSize: '12px' }}>Provider: {STUDENT.provider}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
          <ScoreRing value={STUDENT.score} />
          <div style={{ flex: 1 }}>
            <div style={{ color: C.medium, fontSize: '14px', fontWeight: 700 }}>{STUDENT.level}</div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', lineHeight: 1.5, marginTop: '4px' }}>{STUDENT.summary}</div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '8px',
              padding: '4px 10px',
              background: 'rgba(255,71,87,0.1)',
              border: '1px solid rgba(255,71,87,0.3)',
              borderRadius: '20px',
              color: C.high,
              fontSize: '11px',
              fontWeight: 700,
            }}>+ {STUDENT.activeAlerts} Active Alerts</div>
          </div>
        </div>
      </Card>

      <Card style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>⌚</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{FITBIT.device}</div>
              <div style={{ fontSize: '10px', color: C.good }}>● Connected · Synced just now</div>
            </div>
          </div>
          <button style={{
            padding: '6px 12px',
            background: 'transparent',
            border: `1px solid ${C.borderStrong}`,
            color: C.teal,
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>Sync Now</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <Metric value={FITBIT.hr} label="Heart Rate" color={C.high} />
          <Metric value={FITBIT.steps} label="Steps" color={C.teal} />
          <Metric value={FITBIT.sleep} label="Sleep" color="#a78bfa" />
          <Metric value={FITBIT.spo2} label="SpO2" color={C.good} />
          <Metric value={FITBIT.hrv} label="HRV" color={C.medium} />
          <Metric value={FITBIT.calories} label="Calories" color={C.medium} />
        </div>
      </Card>

      <SectionHeading label="Active Alerts" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {ALERTS.map(a => (
          <Card key={a.title}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                <span style={{ fontSize: '20px', lineHeight: 1 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{a.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', marginTop: '4px', lineHeight: 1.5 }}>{a.text}</div>
                  <div style={{ color: C.muted, fontSize: '10px', marginTop: '6px', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>{a.source}</div>
                </div>
              </div>
              <SeverityPill sev={a.sev} />
            </div>
          </Card>
        ))}
      </div>

      <SectionHeading label="Wellness Domains" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {DOMAINS.map(d => (
          <Card key={d.name} style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '18px' }}>{d.icon}</span>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>{d.name}</div>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginBottom: '6px' }}>
              <div style={{ height: '100%', width: `${d.score}%`, background: sevColor(d.tone), borderRadius: '2px' }} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: sevColor(d.tone) }}>{d.score}<span style={{ color: C.mutedFaint, fontWeight: 400, fontSize: '10px' }}>/100</span></div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ScoreRing({ value }: { value: number }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const color = value >= 70 ? C.good : value >= 50 ? C.medium : C.high
  return (
    <div style={{ position: 'relative', width: '70px', height: '70px', flexShrink: 0 }}>
      <svg width="70" height="70">
        <circle cx="35" cy="35" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
        <circle
          cx="35" cy="35" r={r}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - value / 100)}
          strokeLinecap="round"
          transform="rotate(-90 35 35)"
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '20px', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '8px', color: C.muted, letterSpacing: '1px', marginTop: '2px' }}>SCORE</div>
      </div>
    </div>
  )
}

function Metric({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div style={{
      background: C.surfaceAlt,
      border: `1px solid ${C.border}`,
      borderRadius: '8px',
      padding: '10px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '15px', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '9px', color: C.muted, marginTop: '2px', letterSpacing: '0.3px' }}>{label}</div>
    </div>
  )
}

function WellnessAI({ studentMode = false }: { studentMode?: boolean }) {
  return (
    <div>
      <Card style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #1a3d3a, #0d1117)',
          border: `1px solid ${C.borderStrong}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
        }}>🧠</div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700 }}>EduIQ Wellness AI</div>
          <div style={{ color: C.muted, fontSize: '10px' }}>Student Mental Health Intelligence · <span style={{ color: C.teal }}>Shield Active</span></div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
        {AI_PROMPTS.map(p => (
          <button key={p} style={{
            padding: '8px 12px',
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '20px',
            color: C.muted,
            fontSize: '11px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>{p}</button>
        ))}
      </div>

      <Card style={{ marginTop: '16px', background: '#1c2230' }}>
        <div style={{ color: 'rgba(255,255,255,0.92)', fontSize: '13px', lineHeight: 1.6 }}>
          {studentMode
            ? "Hi Jordan! I'm your EduIQ wellness assistant. Whatever you share is hashed and shielded before any AI reads it. What's on your mind today?"
            : AI_GREETING}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: C.muted }}>🛡 EduIQ AI</span>
          <span style={{
            fontSize: '9px',
            color: C.teal,
            background: C.tealDim,
            border: `1px solid ${C.border}`,
            padding: '2px 8px',
            borderRadius: '20px',
            fontWeight: 700,
            letterSpacing: '0.5px',
          }}>🔒 Shield Protected</span>
        </div>
      </Card>
    </div>
  )
}

function SupportResources({ withCrisis = false, studentMode = false }: { withCrisis?: boolean; studentMode?: boolean }) {
  return (
    <div>
      <SectionHeading label="Support Resources" />
      {withCrisis && (
        <Card style={{ background: 'rgba(255,71,87,0.06)', border: '1px solid rgba(255,71,87,0.3)' }}>
          <div style={{ color: C.high, fontSize: '14px', fontWeight: 700 }}>⚠ {studentMode ? 'You are not alone' : 'Jordan is in crisis right now'}</div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', marginTop: '8px', lineHeight: 1.5 }}>
            {studentMode
              ? 'If you are in immediate danger, call 911. For crisis support any time, text or call 988.'
              : 'If you believe Jordan is in immediate danger, call 911. For mental health crisis support, contact the 988 Lifeline immediately.'}
          </div>
          <button style={{
            marginTop: '10px',
            padding: '10px 18px',
            background: C.high,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>📞 Call 988 Now</button>
        </Card>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
        {RESOURCES.map(r => (
          <Card key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: C.tealDim,
              border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
              flexShrink: 0,
            }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{r.name}</div>
              <div style={{ color: C.teal, fontSize: '11px', marginTop: '2px' }}>{r.detail}</div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        color: C.teal,
        fontSize: '10px',
        letterSpacing: '2px',
        fontWeight: 700,
      }}>
        ALL OBSERVATIONS ARE SHARED
      </div>
    </div>
  )
}

function ShieldPanel() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '16px' }}>
        <Stat color={C.teal} value="0" label="Queries Protected" />
        <Stat color={C.teal} value="0" label="ZK Hashed" />
        <Stat color={C.teal} value="0" label="Student Data Leaked" />
      </div>

      <Card style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700 }}>Sovereign Prompt Shield v2.0</div>
          <span style={{
            fontSize: '9px',
            color: C.teal,
            background: C.tealDim,
            border: `1px solid ${C.border}`,
            padding: '3px 8px',
            borderRadius: '20px',
            fontWeight: 700,
            letterSpacing: '0.5px',
          }}>ZK ACTIVE</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {SHIELD_FACTS.map(f => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ color: C.muted, fontSize: '12px' }}>{f.label}</span>
              <span style={{ color: C.teal, fontSize: '12px', fontWeight: 600, textAlign: 'right' }}>{f.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <SectionHeading label="Live Hash Demo" />
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {HASH_DEMO.map(h => (
            <div key={h.plain} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: C.text, fontSize: '12px' }}>{h.plain}</span>
              <span style={{ color: C.mutedFaint, fontSize: '12px' }}>→</span>
              <span style={{ color: C.teal, fontSize: '11px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{h.hash}</span>
            </div>
          ))}
        </div>
      </Card>

      <SectionHeading label="Audit Log" />
      <Card>
        <div style={{ color: C.muted, fontSize: '12px', lineHeight: 1.6 }}>
          Every observation, every AI query, every export is signed and stored on the sovereign audit ledger. Tribal data stays sovereign by design — no third-party can read, train on, or resell student records.
        </div>
      </Card>
    </div>
  )
}

function StudentHome() {
  return (
    <div>
      <SectionHeading label="Your Day" />
      <Card style={{ marginTop: '16px', textAlign: 'center', padding: '24px' }}>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>👋</div>
        <div style={{ fontSize: '18px', fontWeight: 700 }}>Hi {STUDENT.name.split(' ')[0]}</div>
        <div style={{ color: C.muted, fontSize: '13px', marginTop: '6px', lineHeight: 1.5 }}>
          Your wellness check-in helps your support team understand what you need. Everything you share is hashed and shielded.
        </div>
      </Card>
      <SectionHeading label="This Week" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        <Stat color={C.teal} value="65" label="Wellness Score" />
        <Stat color={C.medium} value="5h 24m" label="Avg Sleep" />
        <Stat color={C.good} value="3" label="Check-ins" />
      </div>
    </div>
  )
}

function StudentCheckIn() {
  return (
    <div>
      <SectionHeading label="How are you feeling?" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
        {[
          { e: '😄', l: 'Great' },
          { e: '🙂', l: 'OK' },
          { e: '😐', l: 'Meh' },
          { e: '😕', l: 'Low' },
          { e: '😢', l: 'Rough' },
        ].map(m => (
          <Card key={m.l} style={{ textAlign: 'center', padding: '14px 6px', cursor: 'pointer' }}>
            <div style={{ fontSize: '28px', marginBottom: '4px' }}>{m.e}</div>
            <div style={{ fontSize: '10px', color: C.muted, fontWeight: 600 }}>{m.l}</div>
          </Card>
        ))}
      </div>
      <SectionHeading label="Quick Note" />
      <Card>
        <textarea
          placeholder="Anything you want your support team to know? (optional)"
          style={{
            width: '100%',
            minHeight: '90px',
            padding: '12px',
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            color: C.text,
            fontSize: '13px',
            fontFamily: 'inherit',
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box',
            marginBottom: '12px',
          }}
        />
        <button style={{
          padding: '12px 20px',
          background: C.teal,
          color: C.bg,
          border: 'none',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}>Submit Check-in</button>
      </Card>
    </div>
  )
}
