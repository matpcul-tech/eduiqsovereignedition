'use client'

interface Props {
  score: number | null
}

export default function EarlyWarningScore({ score }: Props) {
  if (score === null) return null
  const level = score <= 2 ? 'critical' : score <= 4 ? 'concern' : score <= 6 ? 'watch' : 'good'
  const colors: Record<string, string> = {
    critical: '#e05252',
    concern: '#e08c52',
    watch: '#d4af37',
    good: '#52a852',
  }
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ color: colors[level], fontSize: '32px', fontWeight: '300', lineHeight: 1 }}>
        {score.toFixed(1)}
      </div>
      <div style={{ color: colors[level], fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>
        {level}
      </div>
    </div>
  )
}
