'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'

export default function NewLetterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const receiverId = searchParams.get('to')
  
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [receiverName, setReceiverName] = useState('ユーザー')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (!receiverId) {
      router.push('/users')
      return
    }

    const fetchReceiver = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', receiverId)
        .single()
      
      if (data?.nickname) {
        setReceiverName(data.nickname)
      }
    }
    fetchReceiver()
  }, [receiverId, router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { session } } = await supabase.auth.getSession()
    
    if (session && receiverId) {
      const { error } = await supabase
        .from('letters')
        .insert({
          sender_id: session.user.id,
          receiver_id: receiverId,
          content: content,
          is_read: false
        })

      if (!error) {
        router.push('/letters')
      } else {
        console.error(error)
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-start pt-12">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          新しい手紙を書く / 새 편지 쓰기
        </h1>
        <div className="mb-4 text-purple-600 font-medium">
          宛先: {receiverName} / 받는 사람: {receiverName}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea 
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="ここに手紙の本文を書いてください。のんびり、思いを込めて... / 여기에 편지 본문을 작성해 주세요. 여유를 가지고 마음을 담아서..."
              className="w-full border border-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" 
            />
          </div>
          <div className="flex justify-end space-x-4 pt-2">
            <Button 
              type="button" 
              variant="ghost"
              onClick={() => router.back()}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700"
            >
              キャンセル / 취소
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !content.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 rounded-full"
            >
              {loading ? '送信中...' : '手紙を送る ✨ / 편지 보내기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}