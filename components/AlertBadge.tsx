'use client'

interface Props {
  level: 'watch' | 'concern' | 'critical'
}

export default function AlertBadge({ level }: Props) {
  const colors: Record<string, string> = {
    watch: '#d4af37',
    concern: '#e08c52',
    critical: '#e05252',
  }
  return (
    <span style={{
      color: colors[level],
      fontSize: '10px',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      padding: '3px 8px',
      border: `1px solid ${colors[level]}`,
      borderRadius: '2px',
    }}>
      {level}
    </span>
  )
}
