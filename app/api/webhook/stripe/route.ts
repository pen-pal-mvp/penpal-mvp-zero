import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-08-26.dahlia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    // 決済時に渡されたユーザーIDを取得
    const userId = session.client_reference_id

    if (userId) {
      // RLSをバイパスするためサービスロールキーでSupabaseクライアントを初期化
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', userId)

      if (error) {
        return NextResponse.json({ error: 'DB Update Error' }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}