# Firebase Hosting: Custom Domain for Wisdom Warehouse

This guide walks through connecting **learn.wisdomwarehouseuae.com** to your Firebase Hosting so the Wisdom Warehouse tenant loads on its own domain.

**No custom domain?** You can still install the Wisdom Warehouse PWA from production with the tenant param:  
**https://www.smartclass24.com/?tenant=wisdomwarehouse**  
A static manifest (`/manifest-wisdomwarehouse.json`) is used so install works without API routes or DNS.

---

## Prerequisites

- Firebase project: **smartclass24-5e590**
- You must have **DNS access** for **wisdomwarehouseuae.com** (or get the records from whoever does — e.g. Wisdom Warehouse IT).

---

## Step 1: Add the custom domain in Firebase

1. Open [Firebase Console](https://console.firebase.google.com/) and select project **smartclass24-5e590**.
2. Go to **Build → Hosting**.
3. Click **Add custom domain**.
4. Enter: **learn.wisdomwarehouseuae.com**
5. Click **Continue**.

---

## Step 2: Verify domain ownership

Firebase will show a **TXT record** you must add for **wisdomwarehouseuae.com** (apex) or the subdomain, depending on the console.

1. In your DNS provider (where wisdomwarehouseuae.com is managed), add the **TXT** record Firebase shows:
   - **Host/Name**: Usually `learn` or `_acme-challenge.learn` (Firebase will show the exact value).
   - **Value**: The long string Firebase gives you.
2. Save, then in Firebase click **Verify**. Verification can take from a few minutes up to 24 hours.

---

## Step 3: Point the subdomain to Firebase (DNS)

After verification, Firebase will show the **required DNS records** (often A records or a CNAME).

### Option A: Firebase shows **A records** (common)

Add these in your DNS for **wisdomwarehouseuae.com** (Firebase will show the actual IPs):

| Type | Host / Name | Value / Points to |
|------|-------------|-------------------|
| A    | learn       | (IP 1 from Firebase) |
| A    | learn       | (IP 2 from Firebase) |
| A    | learn       | (IP 3 from Firebase) |
| A    | learn       | (IP 4 from Firebase) |

(Some DNS allow one A record with multiple IPs; use what your provider supports.)

### Option B: Firebase shows **CNAME**

| Type  | Host / Name | Value / Points to        |
|-------|-------------|--------------------------|
| CNAME | learn       | (target Firebase gives)  |

Use exactly the host name and target Firebase displays.

---

## Step 4: Wait for SSL and propagation

- Firebase will provision an **SSL certificate** for learn.wisdomwarehouseuae.com (can take up to 24 hours).
- DNS changes can take from a few minutes to 48 hours.
- In Hosting, the domain will show as **Connected** when everything is ready.

---

## Step 5: Confirm in the app

Your app already resolves tenant by hostname (middleware + manifest API). Once **learn.wisdomwarehouseuae.com** points to Firebase Hosting:

1. Open **https://learn.wisdomwarehouseuae.com**
2. You should see **Wisdom Warehouse** branding and PWA (no `?tenant=` needed).

---

## Quick checklist

- [ ] Firebase Console → Hosting → Add custom domain: **learn.wisdomwarehouseuae.com**
- [ ] Add TXT record for verification → Verify in Firebase
- [ ] Add A (or CNAME) records for **learn** as shown in Firebase
- [ ] Wait for SSL + DNS propagation
- [ ] Test https://learn.wisdomwarehouseuae.com

---

## If you don’t control wisdomwarehouseuae.com

Send the following to the domain owner (e.g. Wisdom Warehouse):

1. **Ask them** to add the custom domain **learn.wisdomwarehouseuae.com** in their DNS, using the **exact TXT and A/CNAME records** that Firebase shows when you add the domain in the Firebase Console.
2. Or ask them to give you (or a technical contact) **temporary DNS access** so you can add the records yourself.

Once the domain is connected in Firebase and DNS is correct, the app will serve the Wisdom Warehouse tenant on that URL automatically.
