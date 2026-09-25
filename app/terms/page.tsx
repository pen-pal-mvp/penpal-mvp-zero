'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function TermsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      // getSession() ではなく、サーバー検証を伴う getUser() を使用
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
      } else {
        setIsVerifying(false)
      }
    }
    verifyAuth()
  }, [router, supabase])

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) return null

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm text-center">
        <h1 className="text-2xl font-bold mb-6">利用規約 / 이용약관</h1>
        <p className="mb-8 text-gray-600">
          韓国と日本の言葉や文化を学びながら、手紙を交換しませんか？デジタル時代だからこそ、相手を想い、手紙を書く時間を大切にするプラットフォームです。
        </p>
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors font-bold disabled:bg-blue-300"
        >
          {isLoading ? '処理中...' : 'プレミアムプランに登録（¥300/月）'}
        </button>
      </div>
    </div>
  )
}