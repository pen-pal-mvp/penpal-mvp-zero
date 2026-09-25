import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import CheckoutButton from '@/components/CheckoutButton'

export default async function TermsPage() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">利用規約 / 이용약관</h1>
        <div className="h-64 overflow-y-auto border p-4 mb-6 text-sm text-gray-600 bg-gray-50 rounded">
          <p className="mb-4">1. 本サービスはプレミアム登録（サブスクリプション）を前提としたクローズドなプラットフォームです。</p>
          <p>1. 본 서비스는 프리미엄 등록(구독)을 전제로 한 폐쇄형 플랫폼입니다.</p>
        </div>
        <CheckoutButton userId={session.user.id} />
      </div>
    </div>
  )
}