const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || !currency) {
    return res.status(400).json({ message: 'Amount and currency required' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount),         // kuruş olarak verilmeli
      currency: currency.toLowerCase(), // örn: "usd"
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
};

module.exports = { createPaymentIntent };
