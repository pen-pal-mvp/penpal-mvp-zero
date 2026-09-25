'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'

export default function NewProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [nickname, setNickname] = useState('')
  const [mbti, setMbti] = useState('')
  const [bio, setBio] = useState('')
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
      }
    }
    checkAuth()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      const { error } = await supabase
        .from('profiles')
        .update({
          nickname: nickname,
          mbti: mbti.toUpperCase(),
          bio: bio
        })
        .eq('id', session.user.id)

      if (!error) {
        router.push('/letters')
      } else {
        console.error(error)
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">プロフィール作成 / 프로필 작성</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ニックネーム / 닉네임</label>
            <input 
              type="text" 
              required
              maxLength={20}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border border-gray-300 rounded p-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MBTI</label>
            <input 
              type="text" 
              maxLength={4}
              value={mbti}
              onChange={(e) => setMbti(e.target.value)}
              className="w-full border border-gray-300 rounded p-2" 
              placeholder="INTP"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">自己紹介 / 자기소개</label>
            <textarea 
              maxLength={144}
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-gray-300 rounded p-2" 
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
          >
            {loading ? '保存中... / 저장 중...' : '完了して受信箱へ / 완료하고 수신함으로'}
          </Button>
        </form>
      </div>
    </div>
  )
}