import { redirect } from 'next/navigation'
import { getUser, payCode } from '@/lib/auth'
import { query } from '@/lib/db'
import { decide } from '@/app/actions'

export const metadata = { title: 'Admin — Lập Nghiệp Shopee' }

const label = { none: 'Chưa thanh toán', pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' } as const
const badge = { none: 'bg-slate-100 text-slate-600', pending: 'bg-amber-100 text-amber-800', approved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-700' } as const

export default async function AdminPage() {
  const me = await getUser()
  if (!me?.isAdmin) redirect('/')

  const users = await query(
    `SELECT id, email, name, status, pay_note, requested_at, created_at FROM users
     ORDER BY (status = 'pending') DESC, requested_at DESC NULLS LAST, created_at DESC`,
  )
  const fmt = (d: unknown) => (d ? new Date(d as string).toLocaleString('vi-VN') : '—')

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold text-[#064C60] mb-1">Duyệt học viên</h1>
      <p className="text-sm text-[#64748B] mb-6">{users.filter((u) => u.status === 'pending').length} yêu cầu đang chờ · {users.length} tài khoản</p>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[#64748B] border-b border-[#E5E7EB]">
            <tr>
              <th className="p-3">Học viên</th><th className="p-3">Mã CK</th><th className="p-3">Trạng thái</th>
              <th className="p-3">Ghi chú</th><th className="p-3">Gửi lúc</th><th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[#F1F5F9] align-top">
                <td className="p-3"><div className="font-semibold">{u.name}</div><div className="text-[#64748B]">{u.email}</div></td>
                <td className="p-3 font-mono">{payCode(u.id)}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge[u.status as keyof typeof badge]}`}>{label[u.status as keyof typeof label]}</span></td>
                <td className="p-3 max-w-[240px] break-words">{u.pay_note || '—'}</td>
                <td className="p-3 whitespace-nowrap">{fmt(u.requested_at)}</td>
                <td className="p-3">
                  <form action={decide} className="flex gap-2">
                    <input type="hidden" name="id" value={u.id} />
                    {u.status !== 'approved' && <button name="decision" value="approved" className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">Duyệt</button>}
                    {u.status !== 'rejected' && <button name="decision" value="rejected" className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">{u.status === 'approved' ? 'Thu hồi' : 'Từ chối'}</button>}
                  </form>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-[#64748B]">Chưa có học viên.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
