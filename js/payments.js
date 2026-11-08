/* Enlighten payments adapter.
   Today: provider 'none' -> orders are saved as pending and invoiced manually.
   Later: set PROVIDER to 'paymob' (Egypt, EGP) or 'stripe' / 'lemonsqueezy' / 'paddle' (USA, USD)
   and implement start() to create a checkout session via a server endpoint
   (e.g. a Firebase Cloud Function: POST /createCheckout {orderId}) and redirect.
   The provider's webhook should then set orders/{orderId}.status = 'paid' and create licenses/{id}. */
window.EnlPayments = {
  PROVIDER: 'none',
  CHECKOUT_ENDPOINT: null,          // e.g. 'https://<region>-enlighten-website-75dfd.cloudfunctions.net/createCheckout'
  pickProvider(currency){ return this.PROVIDER; },
  async start(order){
    if (this.PROVIDER === 'none' || !this.CHECKOUT_ENDPOINT) return { mode: 'invoice' };
    const r = await fetch(this.CHECKOUT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.id, provider: this.pickProvider(order.currency) }) });
    const j = await r.json();            // expected: { url: 'https://checkout.provider.com/...' }
    if (j.url) { location.href = j.url; return { mode: 'redirect' }; }
    return { mode: 'invoice' };
  }
};
