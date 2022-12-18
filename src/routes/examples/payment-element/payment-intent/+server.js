import { json, Cookies } from '@sveltejs/kit';
import Stripe from 'stripe'

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'])

export async function POST({ request }) {
  const { product, businessId, fpemail, customerId } = await request.json()

  // const customer = await stripe.customers.create({
  //   description: 'Test customer',
  //   email: fpemail,
  // });


  // function product_price(product) {
  //   return (product === 'price_1MFmJRKKYtAddcLeaYxkzZNm' ? 3900 : 27900);
  // }


  
  // const paymentIntent = await stripe.paymentIntents.create({
  //     amount: product_price(product),
  //     currency: 'AUD',
  //     payment_method_types: ['card'],
  //   })


  // stripe.paymentMethods.attach(
  //   paymentIntent.payment_method, {
  //     customer: customer.id
  //   }
  // )
  
  // const subscribe = await stripe.subscriptions.create({
  //     "metadata": {
  //       "business_id": businessId,
  //       "type": "business_listing_plan",
  //       "product": product
  //     },
  //     "items": {
  //       "0": {
  //         "price": "price_1MFmJRKKYtAddcLeaYxkzZNm"
  //       }
  //     },
  //     "customer": customer.id
  // })


  // async function createCustomer(){

  //   const customer = await stripe.customers.create({
  //       description: 'New customer - ' + fpemail,
  //       email: fpemail
  //   });
    
  //   return customer.id
  // }

  const customer_test = await stripe.customers.create({
    description: 'Test customer',
    email: fpemail
  });


  // custId = createCustomer()
  // console.log('magic')
  // console.log(customerId) 
  // let customer_id = createCustomer()

  // console.log(customer_id)

  const subscription = await stripe.subscriptions.create({
    "metadata": {
      "business_id": businessId,
      "type": "business_listing_plan",
      "product": product
    },
    "items": {
      "0": {
        "price": "price_1MFmJRKKYtAddcLeaYxkzZNm"
      }
    },
    customer: customer_test.id,
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
})


  return json({
  subscriptionId: subscription.id,
  custId_server: customer_test.id,
  clientSecret: subscription.latest_invoice.payment_intent.client_secret
})
}
