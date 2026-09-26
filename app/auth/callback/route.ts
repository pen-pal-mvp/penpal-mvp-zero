import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.session) {
      // プロフィールテーブルから現在のステータスを取得するわ
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium, nickname')
        .eq('id', data.session.user.id)
        .single()

      // 1. 決済手続き前の場合は利用規約・決済画面へ
      if (!profile?.is_premium) {
        return NextResponse.redirect(requestUrl.origin + '/terms')
      }
      
      // 2. 決済済みでプロフィール作成前の場合は作成画面へ
      if (!profile?.nickname) {
        return NextResponse.redirect(requestUrl.origin + '/profile/new')
      }
      
      // 3. 全ての登録が完了している場合は受信箱へ
      return NextResponse.redirect(requestUrl.origin + '/letters')
    }
  }

  // 上記以外の場合はトップページへ戻るわ
  return NextResponse.redirect(requestUrl.origin + '/')
}