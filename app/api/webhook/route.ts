import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function POST(request: Request) {
  // 環境変数の状態観測用ログ
  console.log('--- Debug Info ---')
  console.log('SERVICE_KEY is undefined?', !process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log('Are ANON and SERVICE keys exactly identical?', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log('------------------')

  const payload = await request.text()
  const sig = request.headers.get('stripe-signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId || session.client_reference_id

    if (userId) {
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', userId)

      if (error) {
        console.error('DB Update Error:', error.message)
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}