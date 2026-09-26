import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // プロフィール一覧を取得（作成順や任意のソートを適用）
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch error:', error.message)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">ユーザーを探す / 유저 찾기</h1>
          <Link href="/letters" className="text-sm text-gray-500 hover:underline text-right">
            ← 受信箱へ戻る<br />수신함으로 돌아가기
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles && profiles.length > 0 ? (
            profiles.map((profile: any) => (
              <div key={profile.id} className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center border border-gray-100">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  {profile.mbti || 'N/A'}
                </div>
                <h2 className="text-xl font-bold mb-2">
                  {profile.nickname || '新規ユーザー'}
                </h2>
                <p className="text-gray-600 mb-6 text-sm flex-grow whitespace-pre-wrap">
                  {profile.bio || 'よろしくお願いします。 / 잘 부탁드립니다.'}
                </p>
                <Link
                  href={`/letters/new?to=${profile.id}`}
                  className="w-full bg-purple-600 text-white py-3 rounded-full font-bold hover:bg-purple-700 transition flex flex-col items-center justify-center"
                >
                  <span>手紙を書く ✨</span>
                  <span className="text-xs font-normal">편지 쓰기</span>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-600">ユーザーが見つかりません。</p>
          )}
        </div>
      </div>
    </div>
  )
}