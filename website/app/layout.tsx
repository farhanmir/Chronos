import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chronos - Autonomous Code Runner',
  description: 'Break free from rate limits. Run code autonomously with smart Token Bucket rate limiting. Start a task, go to sleep, wake up to results.',
  keywords: ['gemini', 'gemini code', 'automation', 'ai', 'coding', 'developer tools', 'chronos'],
  authors: [{ name: 'Chronos' }],
  icons: {
    icon: '/iconlogo.png',
    apple: '/iconlogo.png',
  },
  openGraph: {
    title: 'Chronos - Autonomous Gemini Code Runner',
    description: 'Autonomous Gemini Code runner with high-performance rate limiting.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  )
}

