'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'

export default function NewProfilePage() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [mbti, setMbti] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: session.user.id,
          nickname: nickname.trim(),
          mbti: mbti.trim().toUpperCase()
        })

      if (!error) {
        router.push('/letters')
      } else {
        console.error('Profile update error:', JSON.stringify(error, null, 2))
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          プロフィール作成 / 프로필 작성
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ニックネーム / 닉네임
            </label>
            <input 
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="例: 太郎 / 타로"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MBTI (任意 / 선택 사항)
            </label>
            <input 
              type="text"
              maxLength={4}
              value={mbti}
              onChange={(e) => setMbti(e.target.value)}
              placeholder="例: INTP"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all uppercase" 
            />
          </div>
          <div suppressHydrationWarning>
            <Button 
              type="submit" 
              disabled={loading || nickname.trim() === ''}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-medium h-auto py-3"
              suppressHydrationWarning
            >
              {loading ? '保存中...' : 'はじめる / 시작하기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}