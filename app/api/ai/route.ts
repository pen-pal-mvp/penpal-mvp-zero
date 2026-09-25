import { NextResponse } from 'next/server'
import { ratelimit } from '@/utils/upstash/ratelimit'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  // 1. クライアントのIPアドレスを取得してレートリミットを検証
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)

  // 制限を超過した場合は429エラーを即時返却しAPIを保護
  if (!success) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  try {
    const { text } = await req.json()
    
    // 2. OpenAI APIによる日韓言語の処理（翻訳・解析）
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'あなたは日韓ペンパルプラットフォームの優秀なアシスタントです。入力されたテキストを自然な言語へ翻訳、または文意を解析して出力してください。' 
        },
        { role: 'user', content: text }
      ],
    })

    return NextResponse.json({ result: response.choices[0].message.content })
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}