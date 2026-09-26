'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function LetterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [letter, setLetter] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchLetter = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
        return
      }

      // 特定の手紙を取得
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .eq('id', params.id as string)
        .single()

      if (error || !data) {
        router.push('/letters')
        return
      }
      setLetter(data)

      // 宛先が自分かつ未読の場合、既読（is_read = true）に更新
      if (!data.is_read && data.receiver_id === session.user.id) {
        await supabase
          .from('letters')
          .update({ is_read: true })
          .eq('id', data.id)
      }
      setLoading(false)
    }
    fetchLetter()
  }, [params.id, router, supabase])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto w-full px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-purple-600">PenPal</span>
          <nav className="flex space-x-6 text-sm font-medium">
            <Link href="/letters" className="text-gray-500 hover:text-purple-600 transition-colors pb-1">受信箱に戻る</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-4 flex justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full border border-gray-100 h-fit mt-4">
          {loading ? (
            <div className="text-gray-500 text-sm">読み込み中...</div>
          ) : letter ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-gray-800 mb-2">手紙の詳細 / 편지 내용</h1>
                <div className="text-sm text-gray-500">
                  受信日: {new Date(letter.created_at).toLocaleString()}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[200px] text-gray-700 whitespace-pre-wrap">
                {letter.content}
              </div>

              <Link 
                href={`/letters/new?to=${letter.sender_id}`}
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center p-3 rounded-lg font-medium transition-colors"
              >
                返信を書く / 답장 쓰기
              </Link>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}