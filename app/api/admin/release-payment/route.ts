// app/api/admin/release-payment/route.ts
// Note: This route must be protected by middleware to only allow admins.

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const { paymentIntentId, amount, lawyerStripeAccountId } = await req.json();

    if (!paymentIntentId || !amount || !lawyerStripeAccountId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Capture the previously created Payment Intent
    const capturedIntent = await stripe.paymentIntents.capture(paymentIntentId);

    // Create a transfer to the lawyer's connected account
    const transfer = await stripe.transfers.create({
      amount: amount * 100 * 0.9, // Transfer 90% (assuming 10% platform fee)
      currency: 'usd',
      destination: lawyerStripeAccountId,
      transfer_group: `case_transfer_${capturedIntent.metadata.caseId}`,
    });

    // Update the payment status in your database to 'RELEASED'
    // You'll also need to update the case status to 'CLOSED'

    return NextResponse.json({ success: true, transferId: transfer.id });
  } catch (error) {
    console.error('Error releasing funds:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
