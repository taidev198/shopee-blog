'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export interface MobileLink { href: string; label: string }

export default function MobileMenu({ links }: { links: MobileLink[] }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="lg:hidden ml-auto p-2 rounded-lg hover:bg-[#F5F3FF]" onClick={() => setOpen(!open)} aria-label="Menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <div className="lg:hidden absolute left-0 right-0 top-16 bg-white border-t border-b border-[#E5E7EB] px-4 py-3 max-h-[70vh] overflow-y-auto shadow-md">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-[14px] font-semibold text-[#1F2937] hover:text-[#6C3CC9] px-3 py-2.5 rounded-xl hover:bg-[#F5F3FF]">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
