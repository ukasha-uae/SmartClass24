/**
 * Payment Webhook Handler for Flutterwave
 * This endpoint receives payment confirmations from Flutterwave.
 *
 * SECURITY: Requests are accepted only when FLUTTERWAVE_SECRET_HASH is set
 * and the verif-hash signature is valid. Until then, the endpoint returns 503.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SECRET_HASH = process.env.FLUTTERWAVE_SECRET_HASH;

/** Flutterwave sends the secret hash you configure in the dashboard in the verif-hash header. */
function verifyFlutterwaveWebhook(signature: string | null): boolean {
  if (!SECRET_HASH || !signature) return false;
  const a = Buffer.from(signature, 'utf8');
  const b = Buffer.from(SECRET_HASH, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  try {
    // Reject all webhook payloads until signature verification is configured (production-safe)
    if (!SECRET_HASH) {
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const signature = req.headers.get('verif-hash');

    if (!verifyFlutterwaveWebhook(signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = body.event;

    switch (event) {
      case 'charge.completed':
        await handlePaymentSuccess(body.data);
        break;
      case 'charge.failed':
        await handlePaymentFailure(body.data);
        break;
      default:
        // Log without leaking event details in response
        if (process.env.NODE_ENV === 'development') {
          console.log('Unhandled webhook event:', event);
        }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(data: any) {
  // TODO: Implement when Flutterwave is integrated
  // 1. Extract transaction details from Flutterwave response
  // 2. Update transaction status in database
  // 3. Add coins or activate subscription
  // 4. Send confirmation email/notification
  
  console.log('Payment successful:', data);
  
  // Example structure:
  // const { tx_ref, customer, amount, currency, status } = data;
  // const userId = extractUserIdFromTxRef(tx_ref);
  // await updateTransactionStatus(userId, tx_ref, 'completed');
  // await processPaymentRewards(userId, amount, currency);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(data: any) {
  // TODO: Implement when Flutterwave is integrated
  // 1. Extract transaction details
  // 2. Update transaction status to 'failed'
  // 3. Log failure reason
  // 4. Notify user if needed
  
  console.log('Payment failed:', data);
}

