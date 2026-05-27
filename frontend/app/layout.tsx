import type { Metadata } from 'next'
import { Syne, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { WebSocketProvider } from '@/components/providers/WebSocketProvider'
import { StoreProvider } from '@/components/providers/StoreProvider'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ReviewOS — AI Code Review Dashboard',
  description:
    'Production-grade AI-powered GitHub pull request review dashboard. Real-time streaming code analysis powered by Claude.',
  keywords: ['code review', 'AI', 'GitHub', 'pull requests', 'dashboard'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg-primary text-text-primary font-mono antialiased">
        <StoreProvider>
          <QueryProvider>
            <WebSocketProvider>
              {children}
            </WebSocketProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
