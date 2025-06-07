'use client'

import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react'
import { confirmPayment } from '@/lib/actions/booking'
import { toast } from 'sonner'

// 初始化Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  clientSecret: string
  orderId: string
  amount: number
  onSuccess: () => void
  onError: (error: string) => void
}

function CheckoutForm({ clientSecret, amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setError('支付表单未正确加载')
      setProcessing(false)
      return
    }

    // 确认支付
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        }
      }
    )

    if (stripeError) {
      setError(stripeError.message || '支付失败')
      setProcessing(false)
      onError(stripeError.message || '支付失败')
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setSucceeded(true)
      setProcessing(false)
      
      // 确认支付成功
      const result = await confirmPayment(paymentIntent.id)
      if (result.success) {
        toast.success('支付成功！')
        onSuccess()
      } else {
        setError(result.error || '确认支付失败')
        onError(result.error || '确认支付失败')
      }
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg border p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">完成支付</h3>
          <p className="text-2xl font-bold text-blue-600">¥{(amount / 100).toFixed(2)}</p>
        </div>

        {succeeded ? (
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h4 className="text-lg font-semibold text-green-900">支付成功！</h4>
              <p className="text-green-700">您的订单已确认，请查看订单详情。</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                银行卡信息
              </label>
              <div className="border rounded-md p-3 bg-gray-50">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!stripe || processing || succeeded}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  支付 ¥{(amount / 100).toFixed(2)}
                </>
              )}
            </Button>
          </form>
        )}

        <div className="text-xs text-gray-500 text-center">
          <p>您的支付信息通过SSL加密保护</p>
          <p>支持Visa、Mastercard、American Express等主要银行卡</p>
        </div>
      </div>
    </div>
  )
}

export function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
} 