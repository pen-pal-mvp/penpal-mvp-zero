'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LetterReadPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  // React.use() で params をアンラップして id を取得するわ
  const unwrappedParams = use(params)
  const letterId = unwrappedParams.id

  const [letter, setLetter] = useState<any>(null)
  const [translatedText, setTranslatedText] = useState<string>('')
  const [isTranslating, setIsTranslating] = useState(false)

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

      const { data, error } = await supabase
        .from('letters')
        .select(`
          *,
          profiles!letters_sender_id_fkey (nickname, mbti)
        `)
        .eq('id', letterId)
        .single()

      if (error || !data) {
        router.push('/letters')
        return
      }

      setLetter(data)

      if (!data.is_read && data.receiver_id === session.user.id) {
        await supabase.from('letters').update({ is_read: true }).eq('id', letterId)
      }

      setIsTranslating(true)
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: `以下の文章を相手の言語（日本語なら韓国語、韓国語なら日本語）に自然な表現で翻訳してください:\n\n${data.content}` }),
        })
        if (res.ok) {
          const aiData = await res.json()
          setTranslatedText(aiData.result)
        }
      } catch (e) {
        console.error('Translation error:', e)
      } finally {
        setIsTranslating(false)
      }
    }

    fetchLetter()
  }, [letterId, router, supabase])

  if (!letter) return <div className="p-8 text-center">読み込み中...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800">手紙を読む / 편지 읽기</h1>
          <Link href="/letters" className="text-sm text-gray-500 hover:text-gray-700">
            ← 受信箱へ戻る<br/>수신함으로 돌아가기
          </Link>
        </header>

        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {letter.profiles?.mbti || 'N/A'}
          </div>
          <h2 className="text-lg font-medium text-gray-900">
            {letter.profiles?.nickname || 'ユーザー'} からの手紙 / {letter.profiles?.nickname || '유저'}님의 편지
          </h2>
        </div>

        <section className="mb-10">
          <h3 className="text-sm font-bold text-gray-500 mb-4 flex items-center">
            <span className="mr-2">✉️</span> オリジナル（手紙本文） / 원본 (편지 본문)
          </h3>
          <div className="bg-gray-50 p-6 rounded-lg text-gray-800 whitespace-pre-wrap leading-relaxed">
            {letter.content}
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-sm font-bold text-purple-500 mb-4 flex items-center">
            <span className="mr-2">✨</span> AI自動翻訳 / AI 자동 번역
          </h3>
          <div className="bg-purple-50 p-6 rounded-lg text-gray-800 whitespace-pre-wrap leading-relaxed">
            {isTranslating ? '翻訳中... / 번역 중...' : translatedText}
          </div>
        </section>

        <div className="flex justify-between items-center mt-12 border-t pt-8">
          <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
            ブロック 🚫<br/>차단
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 h-auto" onClick={() => router.push(`/letters/reply?to=${letter.sender_id}`)}>
            手紙を書く ✨<br/>편지 쓰기
          </Button>
        </div>
      </div>
    </div>
  )
}