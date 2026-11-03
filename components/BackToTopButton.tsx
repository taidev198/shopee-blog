'use client'

import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      aria-label="Trở về đầu trang"
      className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-[#6C3CC9] hover:bg-[#5829A8] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
    >
      <ArrowUp size={20} />
    </button>
  )
}
