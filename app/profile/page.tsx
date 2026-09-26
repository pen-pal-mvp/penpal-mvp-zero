'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  const [nickname, setNickname] = useState('')
  const [mbti, setMbti] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (data) {
        setNickname(data.nickname || '')
        setMbti(data.mbti || '')
        setBio(data.bio || '')
      }
      setLoading(false)
    }
    fetchProfile()
  }, [router, supabase])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        nickname,
        mbti,
        bio,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id)

    if (error) {
      console.error('Update error:', error)
      setMessage('更新に失敗しました。')
    } else {
      setMessage('プロフィールを更新しました！')
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto w-full px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-purple-600">PenPal</span>
          <nav className="flex space-x-6 text-sm font-medium">
            <Link href="/letters" className="text-gray-500 hover:text-purple-600 transition-colors pb-1">
              レター一覧
            </Link>
            <Link href="/users" className="text-gray-500 hover:text-purple-600 transition-colors pb-1">
              探す
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-4 flex justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full border border-gray-100 h-fit mt-4">
          <h1 className="text-xl font-bold mb-6 text-gray-800">
            マイプロフィール / 마이 프로필
          </h1>

          {loading ? (
            <div className="text-gray-500 text-sm">読み込み中...</div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ペンネーム / 닉네임
                </label>
                <Input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="ペンネームを入力"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MBTI
                </label>
                <Input
                  type="text"
                  value={mbti}
                  onChange={(e) => setMbti(e.target.value.toUpperCase())}
                  placeholder="例: INTP"
                  maxLength={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  自己紹介 / 자기소개
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="自己紹介を入力してください"
                  rows={4}
                />
              </div>

              {message && (
                <p className="text-sm text-center text-purple-600 font-medium">{message}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={saving}
              >
                {saving ? '保存中...' : '変更を保存する / 저장하기'}
              </Button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
            <Link href="/letters" className="block">
              <Button variant="outline" className="w-full">
                レター一覧へ / 편지 목록으로
              </Button>
            </Link>

            <Button
              variant="ghost"
              className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleSignOut}
            >
              ログアウト / 로그아웃
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}