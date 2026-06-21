const Stripe = require('stripe');
const env = require('../config/env');

function getStripe() {
  if (!env.stripeSecretKey) {
    return null;
  }

  return new Stripe(env.stripeSecretKey);
}

async function createConsultationCheckout(request, response, next) {
  try {
    const stripe = getStripe();

    if (!stripe) {
      return response.status(503).json({
        message: 'Payment gateway is not configured yet. Add STRIPE_SECRET_KEY in backend/.env.',
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: env.consultationCurrency,
            unit_amount: env.consultationAmount,
            product_data: {
              name: 'Website Consultation',
              description: 'A one-on-one consultation to plan your website idea.',
            },
          },
        },
      ],
      success_url: `${env.siteUrl}/?payment=success#consultation`,
      cancel_url: `${env.siteUrl}/?payment=cancelled#consultation`,
    });

    return response.status(200).json({ url: session.url });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createConsultationCheckout,
};
