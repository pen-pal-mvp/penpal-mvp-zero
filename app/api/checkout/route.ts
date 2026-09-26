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

    // Vercel環境かローカル環境かを静的に判定してURLを固定化
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://penpal-mvp-zero.vercel.app' 
      : 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      // 固定化したbaseUrlを使用して絶対パスを指定（確実な遷移）
      success_url: `${baseUrl}/profile/new`,
      cancel_url: `${baseUrl}/terms`,
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