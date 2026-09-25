'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.push('/?error=auth-failed')
        return
      }

      // ユーザーのプロフィールから決済状態を取得
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', session.user.id)
        .single()

      if (profile?.is_premium) {
        // 会員（既存ユーザー）の動線：受信箱へ
        router.push('/letters')
      } else {
        // 非会員（新規・未決済ユーザー）の動線：利用規約/決済へ
        router.push('/terms')
      }
    }
    
    handleAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-600 font-medium">認証を確立しています... / 인증 확인 중...</div>
    </div>
  )
}