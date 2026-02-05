# 🎨 Wisdom Warehouse Logo Setup Guide

## Quick Overview
This guide shows you how to download and place the Wisdom Warehouse logo for your multi-tenant platform.

---

## 📥 Step 1: Get the Logo

### Option A: Request from Client
Contact Wisdom Warehouse and request their logo in one of these formats:
- **Preferred**: SVG file (scalable, best quality)
- **Alternative**: PNG with transparent background (minimum 500x500px)

### Option B: Download from Website
If they have a media kit or press page:
1. Visit their official website
2. Look for "Media Kit", "Press", or "Brand Assets" section
3. Download the logo in SVG or high-resolution PNG format

### Logo Requirements:
- ✅ Format: SVG (preferred) or PNG
- ✅ Background: Transparent (for PNG)
- ✅ Size: At least 500x500px (for PNG)
- ✅ Naming: Will be renamed to `wisdom-warehouse.svg`

---

## 📁 Step 2: Place the Logo

### Create Logos Folder (if not exists)
```powershell
# From your project root
cd c:\Users\asus\OneDrive\Desktop\smartjhs
mkdir public\logos -Force
```

### Copy Logo to Project
```powershell
# Replace the path with your actual download location
# Example if downloaded to Downloads folder:
cp "C:\Users\asus\Downloads\wisdom-logo.svg" "public\logos\wisdom-warehouse.svg"

# Or if it's a PNG:
cp "C:\Users\asus\Downloads\wisdom-logo.png" "public\logos\wisdom-warehouse.png"
```

### Update Registry (if using PNG instead of SVG)
If you're using PNG, update the logo path:

**File**: `src/tenancy/registry.ts`
```typescript
wisdomwarehouse: {
  // ...
  branding: {
    // ...
    logoUrl: '/logos/wisdom-warehouse.png',  // Change .svg to .png
  },
}
```

---

## ✅ Step 3: Verify Setup

### Check File Location
```powershell
# Verify logo exists
ls public\logos\wisdom-warehouse.svg
# Or for PNG:
ls public\logos\wisdom-warehouse.png
```

### Test in Browser
```powershell
# Start dev server
npm run dev

# Open browser and test with preview mode:
# http://localhost:9002?tenant=wisdomwarehouse
```

**What to Look For:**
- ✅ Logo should appear in the header
- ✅ Logo should replace the "S24" branding
- ✅ Colors should change to blue/orange theme

---

## 🔍 Troubleshooting

### Logo Not Showing?
1. **Check file path**: Must be exactly `public/logos/wisdom-warehouse.svg` (or `.png`)
2. **Check registry**: Verify `logoUrl` in `src/tenancy/registry.ts` matches filename
3. **Restart dev server**: Sometimes needed after adding new files
4. **Check browser console**: Look for 404 errors

### Logo Shows as Broken Image?
1. **Check file format**: Ensure it's actually SVG/PNG (not renamed from another format)
2. **Check file permissions**: Make sure file is readable
3. **Clear browser cache**: Ctrl+F5 to hard refresh

### Wrong Logo Showing?
1. **Verify preview mode**: Use `?tenant=wisdomwarehouse` in URL
2. **Check tenant config**: Ensure `wisdomwarehouse` tenant is configured in registry
3. **Check default fallback**: Without `?tenant=`, it shows S24 logo by default

---

## 📋 Current Configuration

### Tenant Registry (Already Configured)
**File**: `src/tenancy/registry.ts`
```typescript
wisdomwarehouse: {
  id: 'wisdomwarehouse',
  slug: 'wisdomwarehouse',
  name: 'Wisdom Warehouse',
  market: 'us',
  branding: {
    name: 'Wisdom Warehouse',
    domain: 'learning.wisdomwarehouse.com',
    primaryColor: '#2563eb',  // Blue
    accentColor: '#f59e0b',   // Orange
    logoUrl: '/logos/wisdom-warehouse.svg',  // ⬅️ Logo path
  },
  features: {
    enableJHSCampus: true,
    enableSHSCampus: true,
    enableUniversityCampus: false,
    enableVirtualLabs: true,
    enableArenaChallenge: true,
    enableLocalization: false,  // US market
  },
}
```

### File Structure
```
smartjhs/
├── public/
│   └── logos/
│       ├── wisdom-warehouse.svg  ⬅️ Place logo here
│       └── (other tenant logos...)
├── src/
│   └── tenancy/
│       └── registry.ts  ⬅️ Logo path configured here
```

---

## 🎯 Success Checklist

- [ ] Logo file downloaded from Wisdom Warehouse
- [ ] Logo placed in `public/logos/` folder
- [ ] Logo named `wisdom-warehouse.svg` (or `.png`)
- [ ] Registry path matches logo filename
- [ ] Dev server restarted
- [ ] Tested with `?tenant=wisdomwarehouse` in URL
- [ ] Logo appears in header
- [ ] Colors changed to blue/orange theme

---

## 🚀 Next Steps

After logo is set up:

1. **Update Header Component** - Replace hardcoded S24 logo with `<TenantLogo />`
   - File: `src/components/Header.tsx`
   - See: [WHITE_LABEL_EXECUTIVE_SUMMARY.md](docs/WHITE_LABEL_EXECUTIVE_SUMMARY.md)

2. **Test Preview Mode** - Verify all branding works
   - Test: `?tenant=wisdomwarehouse`
   - Test: `?tenant=demo`
   - Test: Default (no tenant param)

3. **Deploy to Production** - After testing
   - Deploy Firestore rules
   - Deploy Cloud Functions
   - Configure custom domain

---

## 📞 Need Help?

**Common Issues:**
- Logo not showing → Check file path and restart dev server
- Wrong colors showing → Verify preview mode `?tenant=wisdomwarehouse`
- Header still shows S24 → Need to update Header component to use `<TenantLogo />`

**Documentation:**
- [WHITE_LABEL_EXECUTIVE_SUMMARY.md](docs/WHITE_LABEL_EXECUTIVE_SUMMARY.md) - Full overview
- [MULTI_TENANT_IMPLEMENTATION_COMPLETE.md](MULTI_TENANT_IMPLEMENTATION_COMPLETE.md) - Technical details
- [MULTI_TENANT_QUICK_REF.md](MULTI_TENANT_QUICK_REF.md) - Quick reference

---

**Last Updated**: February 4, 2026  
**Status**: Ready for logo upload  
**Next Action**: Download Wisdom Warehouse logo and place in `public/logos/`
