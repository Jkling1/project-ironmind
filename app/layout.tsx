import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Project IronMind | 365-Day Transformation',
  description: 'Your journey to Ironman greatness starts here',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
