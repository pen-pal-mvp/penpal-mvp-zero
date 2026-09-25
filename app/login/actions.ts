'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signInWithMagicLink(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error('マジックリンク送信エラー:', error.message)
    redirect('/?error=CouldNotSendEmail')
  }

  redirect('/check-email')
}