'use client'

interface Props {
  score: number | null
}

export default function EarlyWarningScore({ score }: Props) {
  if (score === null) return null
  const level = score <= 2 ? 'critical' : score <= 4 ? 'concern' : score <= 6 ? 'watch' : 'good'
  const colors: Record<string, string> = {
    critical: '#ff4757',
    concern: '#ff6b35',
    watch: '#ffa502',
    good: '#2ed573',
  }
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ color: colors[level], fontSize: '32px', fontWeight: 700, lineHeight: 1 }}>
        {score.toFixed(1)}
      </div>
      <div style={{ color: colors[level], fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
        {level}
      </div>
    </div>
  )
}
