<script>
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { loadStripe } from '@stripe/stripe-js'
  import { Elements, CardNumber, CardExpiry, CardCvc } from '$lib'
  import { page } from '$app/stores'

  let stripe = null
  let error = null
  let cardElement
  let name
  let processing = false

  var url1 = new URL($page.url.href)
  var url = String(url1)
  var c = url1.searchParams.get('email')
  var d = url1.searchParams.get('businessId')

  let data = {
    fpemail : c,
    businessId: d
  }
  let fpemail = data.fpemail
  let product = 'price_1KNp0qKOURBwtsKiahwlTtus'
  let businessId = data.businessId


  onMount(async () => {
    stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  })

  async function createPaymentIntent() {
    const response = await fetch('/examples/credit-card/payment-intent', { method: 'POST' })
    const { clientSecret } = await response.json()

    return clientSecret
  }

  async function submit() {
    // avoid processing duplicates
    if (processing) return

    processing = true

    // create the payment intent server-side
    const clientSecret = await createPaymentIntent()

    // confirm payment with stripe
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
    console.log({result})

    if (result.error) {
      // payment failed, notify user
      error = result.error
      processing = false
    } else {
      // payment succeeded, redirect to "thank you" page
      goto('/examples/credit-card/thanks')
    }
  }
</script>

<h1>Credit Card Example</h1>

<nav>
  <a href="https://github.com/joshnuss/svelte-stripe/tree/main/src/routes/examples/credit-card">View code</a>
</nav>

{#if error}
  <p class=error>{error.message} Please try again.</p>
{/if}

{#if stripe}
  <Elements {stripe}>
    <form on:submit|preventDefault={submit}>
      <input name="name" bind:value={name} placeholder="Your name" disabled={processing}/>
      <input name="businessId" bind:value={businessId} placeholder="BusinessId" type="text" disabled={processing} />
      <input name="product" bind:value={product} type="text" disabled={processing} />
      <input name="fpemail" bind:value={fpemail} type="email" placeholder="email" disabled={processing} />

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

  .row {
    display: flex;
    flex-direction: row;
    gap: 5px;
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
