/**
 * Transaction History System
 * Tracks all user purchases and subscriptions
 */

import { PaymentResponse } from './payments';
import { UserSubscription } from './monetization';

export type TransactionType = 'coin_purchase' | 'subscription' | 'refund';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: 'GHS';
  timestamp: string;
  description: string;
  metadata: {
    packageId?: string;
    coins?: number;
    subscriptionTier?: 'premium';
    subscriptionDuration?: 'monthly' | 'annual';
    phoneNumber?: string;
    originalTransactionId?: string; // For refunds
  };
  paymentMethod: 'mtn_mobile_money';
  transactionId: string; // External payment provider transaction ID
}

/**
 * Store transaction in localStorage
 */
export function storeTransaction(transaction: Transaction): void {
  if (typeof window === 'undefined') return;
  
  const transactions = getUserTransactions(transaction.userId);
  transactions.push(transaction);
  
  // Keep only last 100 transactions per user
  if (transactions.length > 100) {
    transactions.shift();
  }
  
  localStorage.setItem(`transactions_${transaction.userId}`, JSON.stringify(transactions));
}

/**
 * Get all transactions for a user
 */
export function getUserTransactions(userId: string): Transaction[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(`transactions_${userId}`);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get transaction by ID
 */
export function getTransaction(userId: string, transactionId: string): Transaction | null {
  const transactions = getUserTransactions(userId);
  return transactions.find(t => t.id === transactionId || t.transactionId === transactionId) || null;
}

/**
 * Create transaction from payment response
 */
export function createTransactionFromPayment(
  userId: string,
  paymentResponse: PaymentResponse,
  type: TransactionType,
  description: string,
  metadata: Transaction['metadata']
): Transaction {
  return {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    status: paymentResponse.status as TransactionStatus,
    amount: paymentResponse.amount,
    currency: 'GHS',
    timestamp: paymentResponse.timestamp,
    description,
    metadata,
    paymentMethod: 'mtn_mobile_money',
    transactionId: paymentResponse.transactionId,
  };
}

/**
 * Update transaction status
 */
export function updateTransactionStatus(
  userId: string,
  transactionId: string,
  status: TransactionStatus
): boolean {
  const transactions = getUserTransactions(userId);
  const transaction = transactions.find(t => t.id === transactionId || t.transactionId === transactionId);
  
  if (transaction) {
    transaction.status = status;
    localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
    return true;
  }
  
  return false;
}

/**
 * Get transaction statistics for a user
 */
export function getTransactionStats(userId: string): {
  totalSpent: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  lastTransactionDate: string | null;
  coinPurchases: number;
  subscriptions: number;
} {
  const transactions = getUserTransactions(userId);
  const completed = transactions.filter(t => t.status === 'completed');
  
  return {
    totalSpent: completed.reduce((sum, t) => sum + t.amount, 0),
    totalTransactions: transactions.length,
    successfulTransactions: completed.length,
    failedTransactions: transactions.filter(t => t.status === 'failed').length,
    lastTransactionDate: transactions.length > 0 
      ? transactions[transactions.length - 1].timestamp 
      : null,
    coinPurchases: transactions.filter(t => t.type === 'coin_purchase' && t.status === 'completed').length,
    subscriptions: transactions.filter(t => t.type === 'subscription' && t.status === 'completed').length,
  };
}

/**
 * Filter transactions by type
 */
export function filterTransactions(
  transactions: Transaction[],
  filters: {
    type?: TransactionType;
    status?: TransactionStatus;
    startDate?: string;
    endDate?: string;
  }
): Transaction[] {
  return transactions.filter(t => {
    if (filters.type && t.type !== filters.type) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (filters.startDate && t.timestamp < filters.startDate) return false;
    if (filters.endDate && t.timestamp > filters.endDate) return false;
    return true;
  });
}


