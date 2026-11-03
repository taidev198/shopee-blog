import Link from 'next/link'
import { PlayCircle } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import { sections, videoCount, thumb } from '@/data/lessons'

export default function Home({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || '').toLowerCase()
  const list = q
    ? sections.filter((s) => (s.title + s.summary + s.resources.map((r) => r.title).join(' ')).toLowerCase().includes(q))
    : sections

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 grid lg:grid-cols-[280px_1fr] gap-6">
      <aside className="hidden lg:block"><div className="sticky top-24"><Sidebar /></div></aside>
      <div>
        <div className="rounded-3xl bg-gradient-to-r from-[#6C3CC9] to-[#8B5CF6] text-white p-8 mb-8">
          <h1 className="text-3xl font-extrabold">Danh sách bài học Shopee</h1>
          <p className="mt-2 text-white/90 max-w-2xl">
            {sections.length} chuyên đề · {videoCount} video YouTube cùng bảng tính và công cụ đi kèm — từ phân tích đối thủ, SEO, quảng cáo đến traffic ngoại sàn.
          </p>
        </div>

        {q && <p className="mb-4 text-sm text-[#64748B]">Kết quả cho “{searchParams.q}”: {list.length} chuyên đề</p>}

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {list.map((s) => {
            const first = s.resources.find((r) => r.videoId)
            return (
              <Link key={s.slug} href={`/lessons/${s.slug}`} className="group bg-white rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
                <div className="aspect-video bg-[#EDE9FE] relative">
                  {first?.videoId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb(first.videoId)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">{s.icon}</div>
                  )}
                  <span className="absolute top-3 left-3 bg-white/95 text-[#6C3CC9] text-xs font-bold px-2.5 py-1 rounded-full">Phần {s.order}</span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="font-bold text-[#1F2937] group-hover:text-[#6C3CC9] leading-snug">{s.icon} {s.title}</h2>
                  <p className="text-sm text-[#64748B] mt-1.5 line-clamp-2">{s.summary}</p>
                  <div className="mt-auto pt-3 flex items-center gap-1.5 text-xs text-[#6C3CC9] font-semibold">
                    <PlayCircle size={14} /> {s.resources.length} tài nguyên
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
