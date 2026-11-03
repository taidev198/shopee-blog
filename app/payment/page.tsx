import { existsSync } from 'node:fs'
import path from 'node:path'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { getUser, payCode } from '@/lib/auth'
import { requestApproval } from '@/app/actions'
import { sections, videoCount } from '@/data/lessons'

export const metadata = { title: 'Mở khoá khoá học — Lập Nghiệp Shopee' }

const money = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' đ'

export default async function PaymentPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const price = Number(process.env.COURSE_PRICE || 0)
  const code = payCode(user.id)
  // Your own account image: drop it at public/stk.png (or .jpg/.jpeg/.webp)
  const stk = ['png', 'jpg', 'jpeg', 'webp'].map((e) => `stk.${e}`).find((f) => existsSync(path.join(process.cwd(), 'public', f))) ?? 'stk-default.svg'

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="rounded-3xl bg-gradient-to-r from-[#6C3CC9] to-[#8B5CF6] text-white p-8 mb-8">
        <p className="text-sm text-white/80">Xin chào, {user.name}</p>
        <h1 className="text-3xl font-extrabold mt-1">Mở khoá toàn bộ khoá học Shopee</h1>
        <p className="mt-2 text-white/90 max-w-2xl">
          {sections.length} chuyên đề · {videoCount} video xem đầy đủ · bảng tính, công cụ và nhóm Zalo đăng deal.
        </p>
      </div>

      {user.hasAccess ? (
        <div className="bg-white rounded-2xl border border-green-200 p-6 flex items-center gap-4">
          <CheckCircle2 className="text-green-600 shrink-0" size={36} />
          <div>
            <h2 className="font-bold text-lg text-[#1F2937]">Tài khoản đã được kích hoạt</h2>
            <p className="text-sm text-[#64748B]">Bạn có thể xem đầy đủ mọi bài học.</p>
            <Link href="/" className="inline-block mt-3 bg-[#6C3CC9] text-white font-semibold rounded-full px-5 py-2 text-sm">Vào học ngay</Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
            <h2 className="font-bold text-lg text-[#1F2937] mb-1">Bước 1 — Chuyển khoản</h2>
            <p className="text-3xl font-extrabold text-[#6C3CC9] mb-4">{money(price)}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/${stk}`} alt="Thông tin số tài khoản" className="w-full max-w-sm mx-auto rounded-xl border border-[#E5E7EB]" />
            <div className="mt-4 flex justify-between gap-4 text-sm"><span className="text-[#64748B]">Nội dung CK</span><b className="text-red-600">{code}</b></div>
            <p className="text-xs text-[#94A3B8] mt-3">Vui lòng ghi đúng nội dung chuyển khoản để admin đối soát nhanh.</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
            <h2 className="font-bold text-lg text-[#1F2937] mb-3">Bước 2 — Báo đã chuyển khoản</h2>
            {user.status === 'pending' && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                <Clock className="text-amber-600 shrink-0" />
                <p className="text-sm text-amber-900">Yêu cầu của bạn đang chờ admin duyệt. Sau khi duyệt, tải lại trang để xem đầy đủ bài học.</p>
              </div>
            )}
            {user.status === 'rejected' && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <XCircle className="text-red-600 shrink-0" />
                <p className="text-sm text-red-900">Yêu cầu chưa được duyệt (chưa nhận được tiền hoặc sai thông tin). Vui lòng kiểm tra và gửi lại.</p>
              </div>
            )}
            <form action={requestApproval} className="space-y-3">
              <textarea name="note" rows={3} defaultValue={user.payNote ?? ''} placeholder="Ghi chú (tuỳ chọn): tên người chuyển, giờ chuyển, ngân hàng..." className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C3CC9]" />
              <button className="w-full bg-[#6C3CC9] hover:bg-[#5829A8] text-white font-semibold rounded-full py-2.5">
                {user.status === 'pending' ? 'Gửi lại thông báo' : 'Tôi đã chuyển khoản'}
              </button>
            </form>
            <p className="text-sm text-[#64748B] mt-4">Admin sẽ kiểm tra giao dịch và kích hoạt tài khoản của bạn.</p>
          </div>
        </div>
      )}
    </div>
  )
}
