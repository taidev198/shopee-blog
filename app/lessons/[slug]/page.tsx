import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink, FileSpreadsheet, FolderOpen, Link2, ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import PreviewPlayer from '@/components/PreviewPlayer'
import { getUser } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import { sections, getSection, type Resource } from '@/data/lessons'
import { zaloGroups } from '@/data/zalo'

// Content depends on who is logged in, so this page must never be prerendered/cached.
export const dynamic = 'force-dynamic'

const icons = { sheet: FileSpreadsheet, folder: FolderOpen, link: Link2 } as const

interface Cta { href: string; label: string }

function Card({ r, access, cta }: { r: Resource; access: boolean; cta: Cta }) {
  if (r.kind === 'video' && r.videoId && !access) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <PreviewPlayer videoId={r.videoId} title={r.title} ctaHref={cta.href} ctaLabel={cta.label} />
        <div className="p-4 flex items-start justify-between gap-3">
          <h3 className="font-semibold text-[#1F2937] leading-snug">{r.title}</h3>
          <span className="shrink-0 text-xs font-semibold text-[#94A3B8] flex items-center gap-1"><Lock size={12} /> Xem thử 10s</span>
        </div>
      </div>
    )
  }
  if (r.kind !== 'video' && !access) {
    // the URL is deliberately not sent to the browser for locked resources
    return (
      <Link href={cta.href} className="bg-white rounded-2xl border border-dashed border-[#CBD5E1] p-4 flex items-center gap-4 hover:border-[#6C3CC9] transition">
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0"><Lock size={22} /></div>
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Dành cho học viên</div>
          <div className="font-semibold text-[#1F2937] leading-snug">{r.title}</div>
        </div>
      </Link>
    )
  }
  if (r.kind === 'video' && r.videoId) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="aspect-video bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${r.videoId}`}
            title={r.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        <div className="p-4 flex items-start justify-between gap-3">
          <h3 className="font-semibold text-[#1F2937] leading-snug">{r.title}</h3>
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs font-semibold text-[#6C3CC9] hover:underline flex items-center gap-1">
            YouTube <ExternalLink size={12} />
          </a>
        </div>
      </div>
    )
  }
  const Icon = icons[r.kind as keyof typeof icons] ?? Link2
  const label = r.kind === 'sheet' ? 'Google Sheet' : r.kind === 'folder' ? 'Google Drive' : 'Liên kết'
  return (
    <a href={r.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm hover:border-[#6C3CC9] transition p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-[#EDE9FE] text-[#6C3CC9] flex items-center justify-center shrink-0"><Icon size={22} /></div>
      <div className="min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">{label}</div>
        <div className="font-semibold text-[#1F2937] leading-snug">{r.title}</div>
      </div>
      <ExternalLink size={16} className="ml-auto text-[#94A3B8] shrink-0" />
    </a>
  )
}

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const section = getSection(params.slug)
  if (!section) notFound()
  const user = await getUser()
  const access = !!user?.hasAccess
  const cta: Cta = !user
    ? { href: '/register', label: 'Đăng ký để xem đầy đủ' }
    : { href: '/payment', label: 'Thanh toán để mở khoá' }
  const i = sections.indexOf(section)
  const prev = sections[i - 1]
  const next = sections[i + 1]
  const videos = section.resources.filter((r) => r.kind === 'video')
  const others = section.resources.filter((r) => r.kind !== 'video')

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 grid lg:grid-cols-[280px_1fr] gap-6">
      <aside className="hidden lg:block"><div className="sticky top-24"><Sidebar active={section.slug} /></div></aside>
      <div className="min-w-0">
        <nav className="text-xs text-[#64748B] mb-3"><Link href="/" className="hover:text-[#6C3CC9]">Trang chủ</Link> / Phần {section.order}</nav>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#064C60]">{section.icon} {section.order}. {section.title}</h1>
        <p className="text-[#64748B] mt-2 mb-6">{section.summary}</p>

        {!access && (
          <div className="mb-6 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] p-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#4C1D95]"><b>Bạn đang xem thử 10 giây đầu mỗi video.</b> {user ? 'Hoàn tất thanh toán và chờ admin duyệt để xem đầy đủ.' : 'Đăng ký tài khoản để mở khoá toàn bộ khoá học.'}</p>
            <Link href={cta.href} className="bg-[#6C3CC9] text-white text-sm font-semibold rounded-full px-5 py-2">{cta.label}</Link>
          </div>
        )}

        {videos.length > 0 && (
          <div className="grid xl:grid-cols-2 gap-5 mb-6">
            {videos.map((r) => <Card key={r.videoId! + r.title} r={r} access={access} cta={cta} />)}
          </div>
        )}
        {others.length > 0 && (
          <div className="space-y-3 mb-6">
            <h2 className="font-bold text-[#1F2937]">Tài liệu & công cụ</h2>
            {others.map((r) => <Card key={r.url} r={r} access={access} cta={cta} />)}
          </div>
        )}

        {section.hasZaloGroups && access && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 mb-6">
            <h2 className="font-bold text-[#1F2937] mb-3">Nhóm Zalo đăng deal ({zaloGroups.length})</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
              {zaloGroups.map((g, n) => (
                <a key={g} href={`https://zalo.me/g/${g}`} target="_blank" rel="noopener noreferrer" className="text-sm px-3 py-2 rounded-lg bg-[#F3F4FF] hover:bg-[#EDE9FE] text-[#1F2937] hover:text-[#6C3CC9] flex items-center justify-between">
                  <span>Nhóm {n + 1}</span><span className="text-[11px] text-[#94A3B8]">{g}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between gap-3 pt-4 border-t border-[#E5E7EB]">
          {prev ? <Link href={`/lessons/${prev.slug}`} className="flex items-center gap-1 text-sm font-semibold text-[#6C3CC9] hover:underline"><ChevronLeft size={16} />{prev.title}</Link> : <span />}
          {next ? <Link href={`/lessons/${next.slug}`} className="flex items-center gap-1 text-sm font-semibold text-[#6C3CC9] hover:underline text-right">{next.title}<ChevronRight size={16} /></Link> : <span />}
        </div>
      </div>
    </div>
  )
}
