import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pin Plan - Fitness Cycle Tracker',
  description: 'Advanced fitness cycle tracking with AI diagnostics, macro tracking, and performance analytics',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%230ea5e9" width="100" height="100"/><text x="50" y="65" font-size="60" font-weight="bold" fill="white" text-anchor="middle">PP</text></svg>',
  },
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
