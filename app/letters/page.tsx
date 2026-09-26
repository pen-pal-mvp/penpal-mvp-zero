'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function LettersPage() {
  const [letters, setLetters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchLetters = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
        return
      }

      // ログインユーザー宛の手紙を取得
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .eq('receiver_id', session.user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setLetters(data)
      }
      setLoading(false)
    }
    fetchLetters()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto w-full px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-purple-600">PenPal</span>
          <nav className="flex space-x-6 text-sm font-medium">
            <Link href="/users" className="text-gray-500 hover:text-purple-600 transition-colors pb-1">探す</Link>
            <Link href="/profile" className="text-gray-500 hover:text-purple-600 transition-colors pb-1">設定</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-4 flex justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full border border-gray-100 h-fit mt-4">
          <h1 className="text-xl font-bold mb-6 text-gray-800">受信箱 / 받은 편지함</h1>
          
          {loading ? (
            <div className="text-gray-500 text-sm">読み込み中...</div>
          ) : letters.length === 0 ? (
            <div className="text-gray-500 text-sm">手紙はまだありません。</div>
          ) : (
            <div className="space-y-4">
              {letters.map((letter) => (
                <Link 
                  key={letter.id} 
                  href={`/letters/${letter.id}`} 
                  className={`block p-4 border rounded-lg transition-colors ${letter.is_read ? 'border-gray-200 bg-white' : 'border-purple-200 bg-purple-50'}`}
                >
                  <div className="font-bold text-gray-700">{letter.is_read ? '既読の手紙' : '未読の手紙'}</div>
                  <div className="text-sm text-gray-500 mt-1 truncate">{letter.content}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}