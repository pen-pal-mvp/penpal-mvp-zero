'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', session.user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setUsers(data)
      }
      setLoading(false)
    }

    fetchUsers()
  }, [router, supabase])

  if (loading) return <div className="p-8 text-center">読み込み中...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">ユーザーを探す / 유저 찾기</h1>
          <Link href="/letters" className="text-sm text-gray-500 hover:text-gray-700">
            ← 受信箱へ戻る<br/>수신함으로 돌아가기
          </Link>
        </header>

        {users.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center text-gray-500 shadow-sm border border-gray-100">
            まだ他のユーザーがいません。<br/>아직 다른 유저가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id} className="bg-white hover:border-purple-300 transition-colors shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    {user.mbti || 'N/A'}
                  </div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    {user.nickname || 'ユーザー'}
                  </h2>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-3 min-h-[60px]">
                    {user.introduction || 'よろしくお願いします。 / 잘 부탁드립니다.'}
                  </p>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full" 
                    onClick={() => router.push(`/letters/new?to=${user.id}`)}
                  >
                    手紙を書く ✨<br/>편지 쓰기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}