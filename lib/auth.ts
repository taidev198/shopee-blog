import { cache } from 'react'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { query } from './db'

const COOKIE = 'session'
const MAX_AGE = 60 * 60 * 24 * 30

function secret() {
  const s = process.env.AUTH_SECRET
  if (!s && process.env.NODE_ENV === 'production') throw new Error('AUTH_SECRET is required in production')
  return new TextEncoder().encode(s || 'dev-only-secret-change-me')
}

export interface User {
  id: number
  email: string
  name: string
  status: 'none' | 'pending' | 'approved' | 'rejected'
  payNote: string | null
  isAdmin: boolean
  /** may watch full videos and open resources */
  hasAccess: boolean
}

export const adminEmails = () =>
  (process.env.ADMIN_EMAIL || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)

export const payCode = (id: number) => `LN${String(id).padStart(4, '0')}`

export function toUser(r: any): User {
  const isAdmin = adminEmails().includes(String(r.email).toLowerCase())
  return {
    id: r.id,
    email: r.email,
    name: r.name,
    status: r.status,
    payNote: r.pay_note,
    isAdmin,
    hasAccess: isAdmin || r.status === 'approved',
  }
}

export async function createSession(userId: number) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret())
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export function destroySession() {
  cookies().delete(COOKIE)
}

/** Current user, re-read from the DB so an admin approval takes effect immediately. */
export const getUser = cache(async (): Promise<User | null> => {
  const token = cookies().get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret())
    const rows = await query('SELECT * FROM users WHERE id = $1', [payload.uid])
    return rows[0] ? toUser(rows[0]) : null
  } catch {
    return null
  }
})
