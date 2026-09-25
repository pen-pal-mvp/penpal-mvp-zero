import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  // nextパラメータが指定されていない場合は /letters へリダイレクト
  const next = searchParams.get('next') ?? '/letters'

  if (code) {
    const supabase = await createClient()
    // codeをセッション情報と交換する（PKCE対応）
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const url = request.nextUrl.clone()
      url.pathname = next
      url.searchParams.delete('code')
      return NextResponse.redirect(url)
    }
  }

  // エラー時はエラーページへ
  const errorUrl = request.nextUrl.clone()
  errorUrl.pathname = '/error'
  return NextResponse.redirect(errorUrl)
}