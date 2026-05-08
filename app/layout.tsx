import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EduIQ Chikasha Sovereign Edition',
  description: 'EduIQ Chikasha Sovereign Edition — Student Mental Health Intelligence',
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
        background: '#0d1117',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        {children}
      </body>
    </html>
  )
}
