'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { query } from '@/lib/db'
import { createSession, destroySession, getUser, toUser } from '@/lib/auth'

export interface FormState { error?: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const str = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v.trim() : '')

export async function register(_: FormState, fd: FormData): Promise<FormState> {
  const name = str(fd.get('name'))
  const email = str(fd.get('email')).toLowerCase()
  const password = typeof fd.get('password') === 'string' ? (fd.get('password') as string) : ''
  if (!name) return { error: 'Vui lòng nhập họ tên.' }
  if (!EMAIL_RE.test(email)) return { error: 'Email không hợp lệ.' }
  if (password.length < 8) return { error: 'Mật khẩu tối thiểu 8 ký tự.' }

  let id: number
  try {
    const hash = await bcrypt.hash(password, 10)
    const rows = await query<{ id: number }>(
      'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [email, name, hash],
    )
    id = rows[0].id
  } catch (e: any) {
    if (e?.code === '23505' || /duplicate|unique/i.test(String(e?.message))) return { error: 'Email này đã được đăng ký.' }
    throw e
  }
  await createSession(id)
  redirect('/payment')
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd.get('email')).toLowerCase()
  const password = typeof fd.get('password') === 'string' ? (fd.get('password') as string) : ''
  const rows = await query('SELECT * FROM users WHERE email = $1', [email])
  const ok = rows[0] && (await bcrypt.compare(password, rows[0].password_hash))
  if (!ok) return { error: 'Email hoặc mật khẩu không đúng.' }
  await createSession(rows[0].id)
  redirect(toUser(rows[0]).hasAccess ? '/' : '/payment')
}

export async function logout() {
  destroySession()
  redirect('/')
}

/** Learner says "I have transferred the money" -> waits for admin. */
export async function requestApproval(fd: FormData) {
  const user = await getUser()
  if (!user) redirect('/login')
  if (user.hasAccess) redirect('/payment')
  const note = str(fd.get('note')).slice(0, 500)
  await query(
    "UPDATE users SET status = 'pending', pay_note = $2, requested_at = now(), decided_at = NULL WHERE id = $1",
    [user.id, note || null],
  )
  revalidatePath('/payment')
  redirect('/payment')
}

export async function decide(fd: FormData) {
  const admin = await getUser()
  if (!admin?.isAdmin) redirect('/')
  const id = Number(fd.get('id'))
  const decision = fd.get('decision')
  if (!Number.isInteger(id) || (decision !== 'approved' && decision !== 'rejected')) return
  await query('UPDATE users SET status = $2, decided_at = now() WHERE id = $1', [id, decision])
  revalidatePath('/admin')
}
