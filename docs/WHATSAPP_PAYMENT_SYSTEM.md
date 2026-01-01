# WhatsApp Payment System for V1

## Overview
For V1, we're using a manual WhatsApp-based payment system where users contact us via WhatsApp, make payments via MTN Mobile Money, and we manually upgrade their accounts through an admin dashboard.

## Components

### 1. WhatsApp Float Button
**Location:** `src/components/WhatsAppFloatButton.tsx`

**Features:**
- Floating button at bottom-right of all pages
- Opens WhatsApp chat with pre-filled message
- Quick actions for "Buy Coins/Premium" and "General Support"
- Responsive and accessible

**Configuration:**
Update the phone number in `src/app/layout.tsx`:
```tsx
<WhatsAppFloatButton 
  phoneNumber="233241234567" // Your WhatsApp business number
  message="Hello! I would like to purchase coins or subscribe to premium."
/>
```

**Phone Number Format:**
- Remove leading + or 0
- Include country code (233 for Ghana)
- Example: `233241234567` (for 0241234567)

### 2. Admin Dashboard
**Location:** `src/app/admin/dashboard/page.tsx`

**Access:** Navigate to `/admin/dashboard`

**Features:**

#### Search User
- Search by User ID, email, or name
- Real-time user lookup
- Displays user information

#### Manage User
- **Add Coins:**
  - Custom amount input
  - Or select from predefined packages
  - Instant coin addition
  
- **Manage Premium:**
  - Activate premium subscription (Monthly/Annual)
  - Cancel premium subscription
  - View subscription details

#### Statistics
- Total users count
- Premium users count
- Total coins distributed

## Workflow

### For Users:
1. User clicks WhatsApp button (floating icon)
2. Opens WhatsApp with pre-filled message
3. User sends their request (coins/premium)
4. Admin responds with MTN Mobile Money number
5. User makes payment
6. User sends payment confirmation (screenshot/reference)
7. Admin processes payment in dashboard
8. User receives coins/premium access

### For Admin:
1. Receive WhatsApp message from user
2. Ask for user ID/email/name
3. Provide MTN Mobile Money number
4. Wait for payment confirmation
5. Open Admin Dashboard (`/admin/dashboard`)
6. Search for user
7. Add coins or activate premium
8. Confirm with user via WhatsApp

## Admin Dashboard Usage

### Adding Coins:
1. Search for user
2. Go to "Manage User" tab
3. Enter custom amount OR select package
4. Click "Add Coins" or "Add Package"
5. Done! User receives coins instantly

### Activating Premium:
1. Search for user
2. Go to "Manage User" tab
3. Select subscription plan (Monthly/Annual)
4. Click "Activate Premium"
5. Done! User gets premium access instantly

### Canceling Premium:
1. Search for user
2. Go to "Manage User" tab
3. Click "Cancel Premium"
4. Confirm cancellation
5. User loses premium at end of billing period

## Security Considerations

**Current Implementation:**
- Admin dashboard is accessible to anyone with the URL
- No authentication required

**Recommended for Production:**
1. Add authentication (Firebase Auth)
2. Restrict access to admin users only
3. Add role-based access control
4. Log all admin actions
5. Add audit trail

## WhatsApp Business Number Setup

1. Get a WhatsApp Business number
2. Set up WhatsApp Business API (optional, for automation)
3. Or use regular WhatsApp with manual responses
4. Update phone number in `src/app/layout.tsx`

## Payment Confirmation Process

**Recommended Flow:**
1. User sends payment screenshot
2. Admin verifies payment in MTN Mobile Money account
3. Admin processes upgrade in dashboard
4. Admin confirms with user via WhatsApp

**Tips:**
- Keep a log of all payments
- Verify payment before upgrading
- Use transaction references for tracking
- Set up payment confirmation templates

## Future Enhancements

1. **Automated Verification:**
   - Integrate MTN Mobile Money API
   - Auto-verify payments
   - Auto-upgrade users

2. **WhatsApp Bot:**
   - Automated responses
   - Payment status checks
   - Self-service upgrades

3. **Payment Tracking:**
   - Link WhatsApp messages to payments
   - Track payment status
   - Automated reminders

4. **Admin Notifications:**
   - Alert when new payment request
   - Payment confirmation notifications
   - User upgrade confirmations

## Testing

1. Test WhatsApp button on all pages
2. Test admin dashboard search
3. Test coin addition
4. Test premium activation
5. Test premium cancellation
6. Verify user sees changes immediately

## Support

For issues or questions:
- Check admin dashboard statistics
- Verify user exists in system
- Check transaction history
- Contact developer if needed


