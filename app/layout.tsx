import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EduIQ Sovereign',
  description: 'Child Mental Health Early Warning System — Sovereign Shield Technologies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        background: '#0f1f0f',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}>
        {children}
      </body>
    </html>
  )
}
