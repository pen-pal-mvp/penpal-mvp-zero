'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function submitReply(content: string) {
  if (!content) return { error: '内容が空です' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // 返信内容をデータベースのlettersテーブルに保存
  const { error } = await supabase
    .from('letters')
    .insert({
      sender_id: user.id,
      content: content,
    })

  if (error) {
    console.error('Reply insert error:', error)
    return { error: '送信に失敗しました' }
  }

  // 保存成功後は受信箱へリダイレクト
  redirect('/letters')
}