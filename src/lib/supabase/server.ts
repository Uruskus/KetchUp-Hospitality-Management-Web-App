'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value,
            ...options,
            // Ensure required properties are set
            path: options.path ?? '/',
            sameSite: options.sameSite ?? 'lax',
            httpOnly: options.httpOnly ?? true,
            secure: options.secure ?? process.env.NODE_ENV === 'production',
          })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value: '',
            ...options,
            path: options.path ?? '/',
            expires: new Date(0),
          })
        },
      },
    }
  )
}
