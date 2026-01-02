# MTN Mobile Money Integration Guide

## Current Status
✅ Payment structure and UI complete  
⏳ **Actual API integration pending**

## What's Needed for Real Payments

### Option 1: Paystack (Recommended for Ghana)
**Why Paystack:**
- Supports MTN Mobile Money in Ghana
- Easy integration
- Good documentation
- Webhook support

**Steps:**
1. Sign up at https://paystack.com
2. Get API keys (test and live)
3. Install: `npm install paystack`
4. Update `src/lib/payments.ts` to use Paystack API

**Implementation:**
```typescript
import Paystack from 'paystack';

const paystack = Paystack(process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY);

export async function initiateMTNPayment(request: PaymentRequest) {
  const response = await paystack.transaction.initialize({
    email: `${request.phoneNumber}@mtn.gh`, // Use phone as email
    amount: request.amount * 100, // Convert to pesewas
    currency: 'GHS',
    channels: ['mobile_money'], // MTN Mobile Money only
    metadata: {
      phone_number: request.phoneNumber,
      custom_fields: [
        {
          display_name: "MTN Mobile Money Number",
          variable_name: "phone_number",
          value: request.phoneNumber
        }
      ]
    }
  });
  
  return {
    transactionId: response.data.reference,
    status: 'processing',
    authorizationUrl: response.data.authorization_url,
    // ... rest
  };
}
```

### Option 2: Flutterwave
**Why Flutterwave:**
- Supports MTN Mobile Money
- Good for African markets
- Mobile Money support

**Steps:**
1. Sign up at https://flutterwave.com
2. Get API keys
3. Install: `npm install flutterwave-node-v3`
4. Update payment logic

### Option 3: Direct MTN Mobile Money API
**Why Direct:**
- No third-party fees
- Direct integration

**Requirements:**
- MTN Business account
- API credentials from MTN
- More complex setup

## Environment Variables Needed

Add to `.env.local`:
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYMENT_PROVIDER=paystack
```

## Webhook Setup

Create API route: `src/app/api/payments/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackWebhook } from '@/lib/payments';

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  // Verify webhook signature
  const isValid = verifyPaystackWebhook(req.headers, body);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  // Handle payment success
  if (body.event === 'charge.success') {
    const { reference, customer } = body.data;
    // Update user's coins/subscription
    await processPaymentSuccess(reference, customer.email);
  }
  
  return NextResponse.json({ received: true });
}
```

## What's Currently Simulated

1. **Payment Processing**: Currently returns mock response
2. **Payment Confirmation**: Auto-activates after 2 seconds (demo)
3. **Webhook Handling**: Not implemented
4. **Payment Status Check**: Returns mock status

## Next Steps

1. **Choose Payment Provider**: Paystack (recommended) or Flutterwave
2. **Get API Keys**: Sign up and get test/live keys
3. **Update `src/lib/payments.ts`**: Replace mock with real API calls
4. **Create Webhook Route**: Handle payment confirmations
5. **Test**: Use test mode to verify flow
6. **Deploy**: Switch to live keys for production

## Testing

Use Paystack test credentials:
- Test phone: 0244123456
- Test amount: Any amount
- Test will auto-approve in test mode




