"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createBrowserClient } from '@supabase/ssr'

// UIとロジックを分離した子コンポーネント
function LetterNewContent() {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const receiverId = searchParams.get('to')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleAiAction = async (action: 'translate' | 'proofread') => {
    if (!content) return
    setIsLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, action }),
      })
      const data = await response.json()
      if (response.ok) {
        setContent(data.result)
      } else {
        alert(data.error || 'エラーが発生しました')
      }
    } catch (error) {
      alert('通信エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
    if (!content || !receiverId) return
    setIsSending(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      alert('ログインが必要です')
      setIsSending(false)
      return
    }

    const { error } = await supabase
      .from('letters')
      .insert([
        {
          sender_id: session.user.id,
          receiver_id: receiverId,
          content: content,
          is_read: false
        }
      ])

    if (error) {
      alert(`送信エラー: ${error.message}\n詳細: ${error.details || 'なし'}`)
      setIsSending(false)
    } else {
      // 送信成功後は受信箱へ遷移
      router.push('/letters')
    }
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50 text-gray-800 flex justify-center items-start pt-10">
      <Card className="w-full max-w-2xl">
        <CardHeader className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">手紙を書く / 편지 쓰기</CardTitle>
            <Link href="/users">
              <Button variant="outline" size="sm">キャンセル / 취소</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">宛先 / 받는 사람</p>
            <p className="text-lg font-semibold border p-3 rounded-md bg-gray-100">
              {receiverId ? '選択したユーザー' : '宛先が指定されていません'}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <p className="text-sm font-medium text-gray-500">本文 / 본문</p>
              <div className="space-x-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                  onClick={() => handleAiAction('proofread')}
                  disabled={isLoading || !content}
                >
                  {isLoading ? '処理中...' : '推敲 / 교정'}
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                  onClick={() => handleAiAction('translate')}
                  disabled={isLoading || !content}
                >
                  {isLoading ? '処理中...' : '翻訳 / 번역'}
                </Button>
              </div>
            </div>
            <textarea
              className="flex min-h-[250px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="ここに手紙の本文を入力してください... / 여기에 편지 본문을 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              onClick={handleSend}
              disabled={isSending || !content || !receiverId}
            >
              {isSending ? '送信中...' : '送信する / 보내기'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Suspense境界でラップした親コンポーネントをデフォルトエクスポート
export default function LetterNew() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center bg-gray-50 text-gray-500">読み込み中...</div>}>
      <LetterNewContent />
    </Suspense>
  )
}