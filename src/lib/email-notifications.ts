// Email notification utilities
// Uses EmailJS for free email sending (200 emails/month free tier)
// Alternative: Can be replaced with backend API/Cloud Function

import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface EmailNotificationData {
  to: string;
  subject: string;
  message: string;
  challengeId?: string;
  challengeUrl?: string;
  creatorName?: string;
  creatorSchool?: string;
  subjectName?: string;
}

/**
 * Get user's email from Firestore student profile
 */
export async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) return null;
    
    const studentRef = doc(firestore, 'students', userId);
    const studentSnap = await getDoc(studentRef);
    
    if (studentSnap.exists()) {
      const data = studentSnap.data();
      return data.email || null;
    }
    
    return null;
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn('[Email] Permission denied - cannot read user email');
      return null;
    }
    console.error('[Email] Failed to get user email:', error);
    return null;
  }
}

/**
 * Get user's WhatsApp number from Firestore student profile
 */
export async function getUserWhatsApp(userId: string): Promise<string | null> {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) return null;
    
    const studentRef = doc(firestore, 'students', userId);
    const studentSnap = await getDoc(studentRef);
    
    if (studentSnap.exists()) {
      const data = studentSnap.data();
      return data.whatsappNumber || data.whatsapp || data.phone || null;
    }
    
    return null;
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn('[WhatsApp] Permission denied - cannot read user WhatsApp');
      return null;
    }
    console.error('[WhatsApp] Failed to get user WhatsApp:', error);
    return null;
  }
}

/**
 * Generate WhatsApp share link (free, no API needed)
 * Opens WhatsApp with pre-filled message that user can send
 */
export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  // Remove any non-numeric characters except +
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
  // Ensure phone number starts with country code (assume Ghana +233 if no country code)
  const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+233${cleanPhone.replace(/^0/, '')}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone.replace(/^\+/, '')}?text=${encodedMessage}`;
}

/**
 * Generate email link (mailto:) - free, opens user's email client
 * This is the simplest free solution that works immediately
 * 
 * For automated email sending, you can:
 * - Use EmailJS (free tier: 200 emails/month) - requires setup
 * - Use a backend API/Cloud Function with SendGrid, Resend, etc.
 */
export function generateEmailLink(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Send email notification using mailto: link (free, opens email client)
 * For automated sending, implement a backend service or use EmailJS
 */
export async function sendEmailNotification(data: EmailNotificationData): Promise<boolean> {
  try {
    // For now, use mailto: link (free, opens email client)
    // User clicks send in their email client
    const emailLink = generateEmailLink(data.to, data.subject, data.message);
    window.location.href = emailLink;
    
    console.log('[Email] ✅ Email client opened for:', data.to);
    return true;
  } catch (error) {
    console.error('[Email] ❌ Failed to open email client:', error);
    return false;
  }
}

/**
 * Send challenge invitation email
 */
export async function sendChallengeInviteEmail(
  recipientUserId: string,
  challengeId: string,
  creatorName: string,
  creatorSchool: string,
  subject: string,
  challengeUrl?: string
): Promise<boolean> {
  const email = await getUserEmail(recipientUserId);
  if (!email) {
    console.log('[Email] User has no email configured, skipping email notification');
    return false;
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://smartc24.com';
  const url = challengeUrl || `${baseUrl}/challenge-arena/play/${challengeId}`;

  const subjectLine = `${creatorName} has challenged you on S24!`;
  const message = `
🎯 You've been challenged!

${creatorName} from ${creatorSchool} has invited you to a ${subject} challenge on SmartClass24 (S24).

Click the link below to accept and start playing:
${url}

Practice • Compete • Excel in WASSCE & BECE
S24 - The Learning Revolution

---
This is an automated notification. If you didn't expect this challenge, you can ignore this email.
  `.trim();

  return await sendEmailNotification({
    to: email,
    subject: subjectLine,
    message: message,
    challengeId: challengeId,
    challengeUrl: url,
    creatorName: creatorName,
    creatorSchool: creatorSchool,
    subjectName: subject,
  });
}

