'use client'

import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import { login, register, type FormState } from '@/app/actions'

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} className="w-full bg-[#6C3CC9] hover:bg-[#5829A8] disabled:opacity-60 text-white font-semibold rounded-full py-2.5 transition-colors">
      {pending ? 'Đang xử lý...' : label}
    </button>
  )
}

const field = 'w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C3CC9]'

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [state, action] = useFormState<FormState, FormData>(mode === 'login' ? login : register, {})
  const isLogin = mode === 'login'
  return (
    <form action={action} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 space-y-4">
      <h1 className="text-2xl font-extrabold text-[#064C60]">{isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}</h1>
      {!isLogin && <input name="name" required placeholder="Họ và tên" autoComplete="name" className={field} />}
      <input name="email" type="email" required placeholder="Email" autoComplete="email" className={field} />
      <input name="password" type="password" required minLength={isLogin ? undefined : 8} placeholder={isLogin ? 'Mật khẩu' : 'Mật khẩu (tối thiểu 8 ký tự)'} autoComplete={isLogin ? 'current-password' : 'new-password'} className={field} />
      {state.error && <p role="alert" className="text-sm text-red-600">{state.error}</p>}
      <Submit label={isLogin ? 'Đăng nhập' : 'Đăng ký'} />
      <p className="text-sm text-[#64748B] text-center">
        {isLogin ? <>Chưa có tài khoản? <Link href="/register" className="text-[#6C3CC9] font-semibold">Đăng ký</Link></> : <>Đã có tài khoản? <Link href="/login" className="text-[#6C3CC9] font-semibold">Đăng nhập</Link></>}
      </p>
    </form>
  )
}
