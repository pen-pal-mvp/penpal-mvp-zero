'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function submitLetter(formData: FormData) {
  const content = formData.get('content') as string
  
  if (!content) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { error } = await supabase
    .from('letters')
    .insert({
      sender_id: user.id,
      content: content,
    })

  if (error) {
    console.error('Letter insert error:', error)
    redirect('/dashboard?error=SubmitFailed')
  }

  redirect('/letters')
}