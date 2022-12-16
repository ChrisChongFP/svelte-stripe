import { json } from '@sveltejs/kit';
import Stripe from 'stripe'

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'])

export async function POST({request}) {
  const {
    fpemail
  } = await request.json()
  const {
    businessId
  } = await request.json()
  const {
    product
  } = await request.json()



  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'AUD',
    payment_method_types: ['card'],
    fpemail,
    businessId,
    product
  })

  console.log(paymentIntent.client_secret);

  return json({
  clientSecret: paymentIntent.client_secret
})
}
