import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { getAdminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  const adminDb = getAdminDb();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId && plan) {
      // Update user plan in Firestore
      await adminDb.collection('users').doc(userId).update({
        plan,
        stripeSubscriptionId: session.subscription,
      });
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    // Find user by Stripe customer ID and update
    const usersSnapshot = await adminDb
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .get();

    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      await adminDb.collection('users').doc(userDoc.id).update({
        plan: subscription.status === 'active' ? 'pro' : 'free',
      });
    }
  }

  return new Response(null, { status: 200 });
}
