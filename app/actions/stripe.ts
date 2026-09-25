'use server'

import Stripe from 'stripe'
import { redirect } from 'next/navigation'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
})

export async function createCheckoutSession(userId: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    client_reference_id: userId,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile/new`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
  })

  if (session.url) {
    redirect(session.url)
  }
}