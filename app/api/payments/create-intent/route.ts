// app/api/payments/create-intent/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const { amount, lawyerStripeId, caseId } = await req.json();

    if (!amount || !lawyerStripeId || !caseId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
      capture_method: 'manual', // Funds will be held until captured
      metadata: { caseId, lawyerId: lawyerStripeId },
    });

    // You'll need to save the paymentIntent.id to your database
    // to track the payment's status.

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
