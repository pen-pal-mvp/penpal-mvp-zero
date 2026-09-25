'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export default function LettersPage() {
  const router = useRouter()
  const [letters, setLetters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

      const { data, error } = await supabase
        .from('letters')
        .select(`
          id,
          content,
          is_read,
          created_at,
          profiles!letters_sender_id_fkey (nickname, mbti)
        `)
        .eq('receiver_id', session.user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setLetters(data)
      }
      setLoading(false)
    }

    fetchLetters()
  }, [router, supabase])

  if (loading) return <div className="p-8 text-center">読み込み中...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">受信箱 / 수신함</h1>
          <Link href="/users" className="text-purple-600 font-medium hover:underline">
            ユーザーを探す / 유저 찾기 →
          </Link>
        </div>

        {letters.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center text-gray-500 shadow-sm border border-gray-100">
            まだ手紙はありません。<br/>아직 편지가 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {letters.map((letter) => (
              <Link href={`/letters/${letter.id}`} key={letter.id} className="block">
                <Card className={`hover:border-purple-300 transition-colors ${!letter.is_read ? 'bg-purple-50/50 border-purple-200' : 'bg-white'}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {letter.profiles?.mbti || 'N/A'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {letter.profiles?.nickname || 'ユーザー'}
                          {!letter.is_read && (
                            <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">New</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                          {letter.content}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap pl-4">
                      {new Date(letter.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}