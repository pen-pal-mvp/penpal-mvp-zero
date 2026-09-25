import { NextResponse } from 'next/server'
import { ratelimit } from '@/utils/upstash/ratelimit'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    // クライアントのIPアドレスを取得（Vercel等のプロキシ環境対応）
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'

    // レートリミットの判定
    const { success, limit, reset, remaining } = await ratelimit.limit(ip)

    if (!success) {
      return NextResponse.json(
        { error: 'リクエスト制限を超過しました。しばらく待ってから再度お試しください。' },
        { 
          status: 429, 
          headers: { 
            'X-RateLimit-Limit': limit.toString(), 
            'X-RateLimit-Remaining': remaining.toString() 
          } 
        }
      )
    }

    const body = await req.json()
    const { prompt } = body

    // OpenAI APIへのリクエスト（ペンパル用の自己紹介作成アシスト等を想定）
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    })

    return NextResponse.json({ result: response.choices[0].message.content })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}