import { redirect } from 'next/navigation'
import AuthForm from '@/components/AuthForm'
import { getUser } from '@/lib/auth'

export const metadata = { title: 'Đăng ký — Lập Nghiệp Shopee' }

export default async function Page() {
  if (await getUser()) redirect('/payment')
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <AuthForm mode="register" />
    </div>
  )
}
