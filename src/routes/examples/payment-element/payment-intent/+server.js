import { json } from '@sveltejs/kit';
import Stripe from 'stripe'

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'])

export async function POST({ request }) {
  const { product, businessId } = await request.json()

  const paymentIntent = await stripe.subscriptions.create({
      "metadata": {
        "business_id": businessId,
        "type": "business_listing_plan",
        "product": product
      },
      "items": {
        "0": {
          "price": "price_1KNp0qKOURBwtsKiahwlTtus"
        }
      },
      "customer": ''

  })

  return json({
  clientSecret: paymentIntent.client_secret
})
}
