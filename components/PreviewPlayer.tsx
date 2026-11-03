'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const LIMIT_SECONDS = 10

declare global {
  interface Window { YT?: any; onYouTubeIframeAPIReady?: () => void }
}

let apiPromise: Promise<void> | null = null
function loadApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve()
  apiPromise ??= new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve() }
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(s)
  })
  return apiPromise
}

interface Props { videoId: string; title: string; ctaHref: string; ctaLabel: string }

/** Plays the first 10 seconds, then pauses and covers the player with a call to action. */
export default function PreviewPlayer({ videoId, title, ctaHref, ctaLabel }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    let player: any
    let timer: ReturnType<typeof setInterval> | undefined
    let dead = false

    const check = () => {
      const t = player?.getCurrentTime?.()
      if (typeof t === 'number' && t >= LIMIT_SECONDS) {
        player.pauseVideo()
        clearInterval(timer)
        setLocked(true)
      }
    }

    loadApi().then(() => {
      if (dead || !host.current) return
      const el = document.createElement('div')
      host.current.appendChild(el)
      player = new window.YT.Player(el, {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, fs: 0, disablekb: 1, origin: window.location.origin },
        events: {
          onStateChange: (e: any) => { if (e.data === 1 && !timer) timer = setInterval(check, 200) },
        },
      })
    })

    return () => { dead = true; clearInterval(timer); player?.destroy?.() }
  }, [videoId])

  return (
    <div className="relative aspect-video bg-black">
      <div ref={host} className="absolute inset-0 [&_iframe]:w-full [&_iframe]:h-full" aria-label={title} />
      {locked && (
        <div className="absolute inset-0 z-10 bg-black/85 flex flex-col items-center justify-center text-center text-white p-6 gap-3">
          <Lock size={32} />
          <p className="font-bold text-lg">Hết {LIMIT_SECONDS} giây xem thử</p>
          <p className="text-sm text-white/80 max-w-sm">Đăng ký và hoàn tất thanh toán để xem toàn bộ video và tài liệu.</p>
          <Link href={ctaHref} className="bg-[#6C3CC9] hover:bg-[#5829A8] rounded-full px-6 py-2.5 font-semibold text-sm">{ctaLabel}</Link>
        </div>
      )}
    </div>
  )
}
