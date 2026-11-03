import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTopButton from '@/components/BackToTopButton'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: 'Lập Nghiệp Shopee — Danh sách bài học',
  description: 'Tổng hợp bài học bán hàng Shopee, Lazada, TikTok từ YouTube',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <BackToTopButton />
        <Footer />
      </body>
    </html>
  )
}
