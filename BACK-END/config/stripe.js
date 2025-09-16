import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

console.log("Stripe Key in config:", process.env.STRIPE_SECRET_KEY ? "✅ Loaded" : "❌ Missing");

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: '2023-10-16'
});

export default stripeInstance;