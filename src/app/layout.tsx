import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AI News Daily - 매일 아침 AI 뉴스',
  description: '매일 아침 6:30, 카테고리별 인기 뉴스를 한눈에. AI 뉴스 최우선 큐레이션.',
  keywords: ['AI', '뉴스', '인공지능', '기술', 'tech news', 'AI news'],
  openGraph: {
    title: 'AI News Daily',
    description: '매일 아침 AI 뉴스 큐레이션',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
