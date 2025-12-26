import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sway - Ireland\'s Remote Job Database',
  description: 'Get notified about remote jobs or let employers find you. Powered by Grow Remote.',
  // Google Search Console verification will be added here if using meta tag method
  // Format: verification: { google: 'verification-code-here' }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

