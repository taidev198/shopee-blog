import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink, FileSpreadsheet, FolderOpen, Link2, ChevronLeft, ChevronRight } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import { sections, getSection, type Resource } from '@/data/lessons'
import { zaloGroups } from '@/data/zalo'

export function generateStaticParams() {
  return sections.map((s) => ({ slug: s.slug }))
}

const icons = { sheet: FileSpreadsheet, folder: FolderOpen, link: Link2 } as const

function Card({ r }: { r: Resource }) {
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

export default function LessonPage({ params }: { params: { slug: string } }) {
  const section = getSection(params.slug)
  if (!section) notFound()
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

        {videos.length > 0 && (
          <div className="grid xl:grid-cols-2 gap-5 mb-6">
            {videos.map((r) => <Card key={r.videoId! + r.title} r={r} />)}
          </div>
        )}
        {others.length > 0 && (
          <div className="space-y-3 mb-6">
            <h2 className="font-bold text-[#1F2937]">Tài liệu & công cụ</h2>
            {others.map((r) => <Card key={r.url} r={r} />)}
          </div>
        )}

        {section.hasZaloGroups && (
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
