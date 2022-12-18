<script>
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { loadStripe } from '@stripe/stripe-js'
  import { Elements, Card, LinkAuthenticationElement, CardNumber, CardExpiry, CardCvc, PaymentElement } from '$lib'
  import { page } from '$app/stores'
  import { subscribe } from 'svelte/internal'
  import { localStorageStore } from 'fractils'

  
  let stripe = null
  let clientSecret = null
  let error = null
  let elements
  let processing = false
  let cardElement;

  var url1 = new URL($page.url.href)
  var url = String(url1)
  var c = url1.searchParams.get('email')
  var d = url1.searchParams.get('businessId')
  var e = url1.searchParams.get('customerId')

  let data = {
    fpemail : c,
    businessId: d,
    customerId: e
  };
  let fpemail = data.fpemail;
  let product = 'price_1KNp0qKOURBwtsKiahwlTtus';
  let businessId = data.businessId;

  let custId = localStorageStore('custId');
  let customerId = custId;

  console.log(custId)


  onMount(async () => {
    stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

    // create payment intent server side
    clientSecret = await createPaymentIntent()
  })

  async function createPaymentIntent() {
    const response = await fetch('/examples/payment-element/payment-intent', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        product: product,
        businessId: businessId,
        fpemail: fpemail,
        customerId: customerId ? customerId : null
      })
    })
    const { clientSecret, custId_server } = await response.json()
    custId = custId_server

    return clientSecret
  }

  // function subscibeToProduct(paymentMethod) {
  //   const response2 = fetch('/examples/payment-element/subscribe', {
  //     method: 'POST',
  //     headers: {
  //       'content-type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       product: product,
  //       businessId: businessId,
  //       fpemail: fpemail,
  //       paymentMethod: paymentMethod
  //     })
  //   })

  //   return response2
  // }
  

  async function submit() {
    // avoid processing duplicates
    if (processing) return
    processing = true

    // confirm payment with stripe
    // const result = await stripe
    //   .confirmPayment({
    //     elements,
    //     redirect: 'if_required'
    //   })

  const result = await stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name
        }
      }
    })

    // log results, for debugging
    // console.log({result})
    if (result.error) {
      // payment failed, notify user
      error = result.error
      processing = false
    } else {
      // console.log("Magic below")
      // subscibeToProduct(result)
      // console.log(result)

      // payment succeeded, redirect to "thank you" page
      goto('/examples/payment-element/thanks')
    }
  }

  // async function submit() {
  //   // avoid processing duplicates
  //   if (processing) return

  //   processing = true

  //   // confirm payment with stripe
  //   const result = await stripe
  //     .confirmCardPayment(clientSecret, {
  //       payment_method: {
  //         card: cardElement,
  //         billing_details: {
  //           email: fpemail
  //         }
  //       }
  //   })
  //   .then(function(result) {
  //     subscibeToProduct(result.payment_method.Card)
  //   });

  //   // log results, for debugging
  //   console.log({result})

  //   if (result.error) {
  //     // payment failed, notify user
  //     error = result.error
  //     processing = false
  //   } else {
  //     // payment succeeded, redirect to "thank you" page
  //     goto('/examples/payment-element/thanks')
  //   }
  // }
</script>

<h1>Payment Element Example</h1>

<nav>
  <a href="https://github.com/joshnuss/svelte-stripe/tree/main/src/routes/examples/payment-element">View code</a>
</nav>

{#if error}
  <p class=error>{error.message} Please try again.</p>
{/if}

{#if stripe && clientSecret}
  <!-- <Elements
    {stripe}
    {clientSecret}
    theme="flat"
    labels="floating"
    variables={{colorPrimary: '#7c4dff'}}
    rules={{'.Input': { border: 'solid 1px #0002' }}}
    bind:elements>
    <form on:submit|preventDefault={submit}>
      <LinkAuthenticationElement/>
      <Card/>
      <input name="businessId" bind:value={businessId} placeholder="BusinessId" type="text" disabled={processing} />
      <input name="product" bind:value={product} type="text" disabled={processing} />

      <button disabled={processing}>
        {#if processing}
          Processing...
        {:else}
          Pay
        {/if}
      </button>
    </form>
  </Elements> -->

  <Elements
    {stripe}
    {clientSecret}
    theme="none"
    labels="floating"
    variables={{colorPrimary: '#7c4dff'}}
    rules={{'.Input': { border: 'solid 1px #0002' }}}
    bind:elements>
    <form on:submit|preventDefault={submit}>
      <input name="businessId" bind:value={businessId} placeholder="BusinessId" type="text" disabled={processing} />
      <input name="product" bind:value={product} type="text" disabled={processing} />
      <input name="fpemail" bind:value={fpemail} type="text" disabled={processing} />

      <!-- <PaymentElement/> -->
      <CardNumber bind:element={cardElement} classes={{base: 'input'}}/>

      <div class="row">
        <CardExpiry classes={{base: 'input'}}/>
        <CardCvc classes={{base: 'input'}}/>
      </div>

      <button disabled={processing}>
        {#if processing}
          Processing...
        {:else}
          Pay
        {/if}
      </button>
    </form>
  </Elements>

  <!-- <Elements
    {stripe}
    {clientSecret}
    theme="none"
    labels="floating"
    variables={{colorPrimary: '#7c4dff'}}
    rules={{'.Input': { border: 'solid 1px #0002' }}}
    bind:elements>
    <form on:submit|preventDefault={submit}>
      <LinkAuthenticationElement/>

      <input name="businessId" bind:value={businessId} placeholder="BusinessId" type="text" disabled={processing} />
      <input name="product" bind:value={product} type="text" disabled={processing} />
      <input name="fpemail" bind:value={fpemail} type="text" disabled={processing} />
      <Card/>
  
      <button>Pay</button>
    </form>
  </Elements>
   -->

{:else}
  Loading...
{/if}

<style>
  .error {
    color: tomato;
    margin: 2rem 0 0;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 2rem 0;
  }

  
  input, :global(.input) {
    border: solid 1px var(--gray-color);
    padding: 1rem;
    border-radius: 5px;
    background: white;
  }

  .row :global(.input) {
    width: 20%;
  }

  button {
    padding: 1rem;
    border-radius: 5px;
    border: solid 1px #ccc;
    color: white;
    background: var(--link-color);
    font-size: 1.2rem;
    margin: 1rem 0;
  }
</style>
