import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // ユーザーが存在しない（未認証）場合はトップページへ弾く（認証ガード）
  if (!user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold mb-4">ダッシュボード / 대시보드</h1>
        <p className="text-gray-600 mb-8">ようこそ、{user.email} さん</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/letters" className="block p-6 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
            <h2 className="text-lg font-bold text-blue-800 mb-2">受信箱 / 받은 편지함</h2>
            <p className="text-sm text-blue-600">届いた手紙を確認する</p>
          </Link>
          
          <Link href="/letters/new" className="block p-6 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
            <h2 className="text-lg font-bold text-green-800 mb-2">手紙を書く / 편지 쓰기</h2>
            <p className="text-sm text-green-600">新しい手紙を作成する</p>
          </Link>
        </div>
      </div>
    </div>
  )
}