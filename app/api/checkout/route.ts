import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 環境変数に依存せず、リクエスト元のドメインを動的に取得
    const origin = request.headers.get('origin') || '[https://penpal-mvp-zero.vercel.app](https://penpal-mvp-zero.vercel.app)'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      // 決済完了後は設計図通りにプロフィール作成画面へ遷移
      success_url: `${origin}/profile/new`,
      cancel_url: `${origin}/terms`,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}