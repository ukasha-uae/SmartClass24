# WhatsApp Number Security Guide

## Overview
The WhatsApp business number is now stored in an environment variable to keep it secure and out of version control.

## Setup

### 1. Create `.env.local` file
Create a `.env.local` file in the root directory (same level as `package.json`):

```env
# WhatsApp Business Number (for payment support)
# Format: +233XXXXXXXXX (include country code with +)
NEXT_PUBLIC_WHATSAPP_NUMBER=+233244432795
```

### 2. Update Your Number
Replace `+233244432795` with your actual WhatsApp business number.

**Important:**
- Include the country code with `+` prefix
- Example: `+233244432795` for Ghana
- Example: `+2348012345678` for Nigeria

### 3. Restart Dev Server
After creating/updating `.env.local`, restart your development server:
```bash
npm run dev
```

## Security Notes

1. **`.env.local` is gitignored** - Your phone number will NOT be committed to git
2. **`.env.example`** - Contains example format (without real number)
3. **Production** - Set the environment variable in your hosting platform (Vercel, Netlify, etc.)

## Production Deployment

### Vercel
1. Go to Project Settings → Environment Variables
2. Add: `NEXT_PUBLIC_WHATSAPP_NUMBER` = `+233244432795`
3. Redeploy

### Other Platforms
Set the environment variable `NEXT_PUBLIC_WHATSAPP_NUMBER` in your hosting platform's environment settings.

## Fallback
If the environment variable is not set, the code will use a fallback number. However, you should always set it properly in production.


