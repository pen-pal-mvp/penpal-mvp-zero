'use client'

import { useState } from 'react'
import { createCheckoutSession } from '@/app/actions/stripe'
import { Button } from '@/components/ui/button'

export default function CheckoutButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      await createCheckoutSession(userId)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={loading}
      className="bg-amber-500 hover:bg-amber-600 text-white w-full"
    >
      {loading ? '処理中... / 처리 중...' : 'プレミアム登録 / 프리미엄 등록'}
    </Button>
  )
}