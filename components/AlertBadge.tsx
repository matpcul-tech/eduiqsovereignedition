'use client'

interface Props {
  level: 'watch' | 'concern' | 'critical'
}

export default function AlertBadge({ level }: Props) {
  const colors: Record<string, string> = {
    watch: '#ffa502',
    concern: '#ff6b35',
    critical: '#ff4757',
  }
  return (
    <span style={{
      color: colors[level],
      fontSize: '10px',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      fontWeight: 600,
      padding: '3px 8px',
      border: `1px solid ${colors[level]}`,
      borderRadius: '4px',
    }}>
      {level}
    </span>
  )
}
