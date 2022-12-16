import { json } from '@sveltejs/kit';
import Stripe from 'stripe'

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'])

export async function POST({ request }) {
  const { product, businessId } = await request.json()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'aud',
      "metadata": {
        "business_id": businessId,
        "type": "business_listing_plan",
        "product": product
      },
      automatic_payment_methods: {
      enabled: true,
    }
  })

  return json({
  clientSecret: paymentIntent.client_secret
})
}
