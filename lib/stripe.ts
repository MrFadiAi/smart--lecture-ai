import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const PLANS = {
  free: { name: 'مجاني', price: 0, priceId: null, minutes: 30 },
  student: { name: 'طالب', price: 9.99, priceId: 'price_student_xxx', minutes: 300 },
  pro: { name: 'محترف', price: 19.99, priceId: 'price_pro_xxx', minutes: 9999 },
};
