import Link from 'next/link'
import { sections } from '@/data/lessons'

export default function Sidebar({ active }: { active?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm">
      <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Danh mục bài học</span>
      <div className="space-y-0.5">
        {sections.map((s) => (
          <Link
            key={s.slug}
            href={`/lessons/${s.slug}`}
            className={`flex items-start gap-2 px-2 py-2 rounded-lg text-[13px] transition-colors ${
              active === s.slug ? 'bg-[#EDE9FE] text-[#6C3CC9] font-semibold' : 'text-[#475569] hover:bg-[#F5F3FF] hover:text-[#1F2937]'
            }`}
          >
            <span className="shrink-0">{s.icon}</span>
            <span className="leading-snug">{s.order}. {s.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
