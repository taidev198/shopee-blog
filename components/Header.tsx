import Link from 'next/link'
import { Search } from 'lucide-react'
import { sections } from '@/data/lessons'
import MobileMenu from './MobileMenu'

const nav = [
  { label: '📚 TẤT CẢ BÀI HỌC', href: '/' },
  { label: '🚀 QUẢNG CÁO', href: '/lessons/quang-cao-shopee-nang-cao' },
  { label: '🌐 TRAFFIC', href: '/lessons/traffic-ngoai-san' },
  { label: '🎵 TIKTOK', href: '/lessons/tiktok' },
  { label: '❓ FAQ', href: '/lessons/cau-hoi-thuong-gap' },
]

export default function Header() {
  const mobileLinks = sections.map((s) => ({ href: `/lessons/${s.slug}`, label: `${s.icon} ${s.order}. ${s.title}` }))
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center shadow-md">
            <span className="text-white font-extrabold text-xs tracking-tight">LN</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-extrabold text-[#1F2937] text-base leading-tight">Lập Nghiệp Shopee</div>
            <div className="text-[10px] text-[#64748B] leading-tight">Danh sách bài học</div>
          </div>
        </Link>

        {/* Plain GET form: works without client JS, handled by the server in app/page.tsx */}
        <form action="/" method="get" className="flex-1 max-w-xs hidden md:flex items-center gap-2 bg-[#F3F4FF] rounded-full px-4 py-2 border border-[#E5E7EB] focus-within:border-[#6C3CC9] transition-colors">
          <Search size={14} className="text-[#64748B] shrink-0" />
          <input name="q" placeholder="Tìm bài học..." className="bg-transparent flex-1 text-sm outline-none placeholder:text-[#94A3B8]" />
        </form>

        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {nav.map((i) => (
            <Link key={i.href} href={i.href} className="text-[13px] font-semibold text-[#1F2937] hover:text-[#6C3CC9] px-3 py-2 rounded-lg hover:bg-[#F5F3FF] transition-colors">
              {i.label}
            </Link>
          ))}
        </nav>

        <MobileMenu links={mobileLinks} />
      </div>
    </header>
  )
}
