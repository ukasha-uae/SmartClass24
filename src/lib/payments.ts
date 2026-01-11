/**
 * Payment Integration for MTN Mobile Money (Ghana)
 * Handles coin purchases and premium subscriptions
 */

export type PaymentMethod = 'mtn_mobile_money';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface PaymentRequest {
  userId: string;
  amount: number; // in GHS
  currency: 'GHS';
  method: PaymentMethod;
  phoneNumber: string; // MTN Mobile Money number
  description: string;
  metadata?: {
    type: 'coin_purchase' | 'subscription';
    packageId?: string;
    subscriptionTier?: 'premium';
  };
}

export interface PaymentResponse {
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  currency: 'GHS';
  phoneNumber: string;
  message?: string;
  timestamp: string;
}

// Coin packages in Ghana Cedis
export const COIN_PACKAGES_GHS = [
  {
    packageId: 'starter',
    name: 'Starter Pack',
    coins: 500,
    price: 5.00, // GHS
    currency: 'GHS',
    bonus: 0,
  },
  {
    packageId: 'power',
    name: 'Power Pack',
    coins: 1500,
    price: 12.00, // GHS
    currency: 'GHS',
    bonus: 100,
  },
  {
    packageId: 'champion',
    name: 'Champion Pack',
    coins: 3500,
    price: 25.00, // GHS
    currency: 'GHS',
    bonus: 500,
  },
  {
    packageId: 'elite',
    name: 'Elite Pack',
    coins: 8000,
    price: 50.00, // GHS
    currency: 'GHS',
    bonus: 1500,
  },
  {
    packageId: 'mega',
    name: 'Mega Pack',
    coins: 20000,
    price: 100.00, // GHS
    currency: 'GHS',
    bonus: 5000,
  },
];

// Subscription packages in Ghana Cedis
export const SUBSCRIPTION_PACKAGES_GHS = [
  {
    packageId: 'premium_monthly',
    name: 'Premium Monthly',
    tier: 'premium' as const,
    duration: 'monthly',
    price: 25.00, // GHS per month
    currency: 'GHS',
    savings: null,
  },
  {
    packageId: 'premium_annual',
    name: 'Premium Annual',
    tier: 'premium' as const,
    duration: 'annual',
    price: 200.00, // GHS per year (equivalent to ~16.67/month, 33% savings)
    currency: 'GHS',
    savings: 'Save 33%',
  },
];

/**
 * Initiate MTN Mobile Money payment
 * This would integrate with MTN Mobile Money API in production
 */
export async function initiateMTNPayment(
  request: PaymentRequest
): Promise<PaymentResponse> {
  // In production, this would call MTN Mobile Money API
  // For now, simulate the payment flow
  
  const transactionId = `MTN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Validate phone number (MTN Ghana format: 024, 054, 055, 059)
  const mtnPrefixes = ['024', '054', '055', '059'];
  const phonePrefix = request.phoneNumber.substring(0, 3);
  
  if (!mtnPrefixes.includes(phonePrefix) || request.phoneNumber.length !== 10) {
    throw new Error('Invalid MTN Mobile Money number. Must start with 024, 054, 055, or 059 and be 10 digits.');
  }
  
  // Simulate payment processing
  // In production, this would:
  // 1. Call MTN Mobile Money API
  // 2. Send USSD prompt to user's phone
  // 3. Wait for user confirmation
  // 4. Process payment
  
  return {
    transactionId,
    status: 'processing',
    amount: request.amount,
    currency: 'GHS',
    phoneNumber: request.phoneNumber,
    message: `Payment request sent to ${request.phoneNumber}. Please approve on your phone.`,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Check payment status
 */
export async function checkPaymentStatus(
  transactionId: string
): Promise<PaymentResponse> {
  // In production, this would query MTN Mobile Money API
  // For demo/testing, simulate completion after 5 seconds
  
  const storedPayment = getStoredPayment(transactionId);
  if (storedPayment) {
    return storedPayment;
  }
  
  // Simulate payment completion
  return {
    transactionId,
    status: 'completed',
    amount: 0,
    currency: 'GHS',
    phoneNumber: '',
    message: 'Payment completed successfully',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Store payment in localStorage (for demo/testing)
 */
function storePayment(payment: PaymentResponse): void {
  if (typeof window === 'undefined') return;
  
  const payments = getStoredPayments();
  payments[payment.transactionId] = payment;
  localStorage.setItem('mtnPayments', JSON.stringify(payments));
}

/**
 * Get stored payment
 */
function getStoredPayment(transactionId: string): PaymentResponse | null {
  if (typeof window === 'undefined') return null;
  
  const payments = getStoredPayments();
  return payments[transactionId] || null;
}

/**
 * Get all stored payments
 */
function getStoredPayments(): Record<string, PaymentResponse> {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem('mtnPayments');
  return stored ? JSON.parse(stored) : {};
}

/**
 * Process coin purchase
 */
export async function processCoinPurchase(
  userId: string,
  packageId: string,
  phoneNumber: string
): Promise<PaymentResponse> {
  const package_ = COIN_PACKAGES_GHS.find(p => p.packageId === packageId);
  if (!package_) {
    throw new Error('Invalid package ID');
  }
  
  const paymentRequest: PaymentRequest = {
    userId,
    amount: package_.price,
    currency: 'GHS',
    method: 'mtn_mobile_money',
    phoneNumber,
    description: `Purchase ${package_.coins} coins (${package_.name})`,
    metadata: {
      type: 'coin_purchase',
      packageId,
    },
  };
  
  const response = await initiateMTNPayment(paymentRequest);
  storePayment(response);
  
  // Store transaction history
  if (typeof window !== 'undefined') {
    const { createTransactionFromPayment, storeTransaction } = await import('./transaction-history');
    const transaction = createTransactionFromPayment(
      userId,
      response,
      'coin_purchase',
      paymentRequest.description,
      {
        packageId,
        coins: package_.coins + (package_.bonus || 0),
        phoneNumber,
      }
    );
    storeTransaction(transaction);
  }
  
  return response;
}

/**
 * Process premium subscription
 */
export async function processSubscription(
  userId: string,
  packageId: string,
  phoneNumber: string
): Promise<PaymentResponse> {
  const package_ = SUBSCRIPTION_PACKAGES_GHS.find(p => p.packageId === packageId);
  if (!package_) {
    throw new Error('Invalid subscription package ID');
  }
  
  const paymentRequest: PaymentRequest = {
    userId,
    amount: package_.price,
    currency: 'GHS',
    method: 'mtn_mobile_money',
    phoneNumber,
    description: `Premium Subscription - ${package_.duration}`,
    metadata: {
      type: 'subscription',
      subscriptionTier: 'premium',
    },
  };
  
  const response = await initiateMTNPayment(paymentRequest);
  storePayment(response);
  
  // Store transaction history
  if (typeof window !== 'undefined') {
    const { createTransactionFromPayment, storeTransaction } = await import('./transaction-history');
    const transaction = createTransactionFromPayment(
      userId,
      response,
      'subscription',
      paymentRequest.description,
      {
        packageId,
        subscriptionTier: 'premium',
        subscriptionDuration: package_.duration as 'monthly' | 'annual',
        phoneNumber,
      }
    );
    storeTransaction(transaction);
  }
  
  return response;
}

/**
 * Format Ghana Cedis
 */
export function formatGHS(amount: number): string {
  return `₵${amount.toFixed(2)}`;
}

