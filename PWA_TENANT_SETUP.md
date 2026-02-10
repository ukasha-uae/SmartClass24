# PWA Tenant Customization Guide

## Overview
SmartClass24 now supports tenant-specific PWA (Progressive Web App) installation with custom branding. Each tenant can have their own app name, logo, theme colors, and description when users install the PWA on their devices.

## Features

### ✅ Implemented Features
- **Dynamic Manifest Generation**: Each tenant gets a custom `manifest.json` with their branding
- **Custom App Name**: Installation prompt shows tenant's app name (e.g., "Wisdom Warehouse" instead of "S24")
- **Custom App Icon**: Uses tenant's logo as the home screen icon
- **Custom Theme Color**: PWA theme matches tenant's primary branding color
- **iOS Support**: Apple Touch Icon dynamically set for iOS devices
- **Automatic Tenant Detection**: Works with URL parameter `?tenant=wisdomwarehouse` or cookie persistence

## How It Works

### 1. Dynamic Manifest API Route
Located at: `src/app/api/manifest/route.ts`

Generates tenant-specific manifest on-the-fly:
- Reads tenant from query param or cookie
- Looks up tenant config from registry
- Generates custom manifest with tenant branding

**Access URLs:**
- Default: `https://smartclass24.app/api/manifest`
- Wisdom Warehouse: `https://smartclass24.app/api/manifest?tenant=wisdomwarehouse`

### 2. DynamicManifest Component
Located at: `src/components/tenancy/DynamicManifest.tsx`

Client-side component that:
- Detects current tenant from context
- Updates manifest link in document head
- Updates theme color meta tag

### 3. DynamicAppleIcon Component
Located at: `src/components/tenancy/DynamicAppleIcon.tsx`

iOS-specific component that:
- Sets Apple Touch Icon for iOS home screen
- Uses tenant logo for the icon

### 4. PWA Install Prompt
Located at: `src/components/PWAPrompts.tsx`

Shows tenant-branded installation prompt:
- "Install [Tenant Name]" instead of generic text
- Uses tenant branding colors
- Respects user dismissal preferences

## Tenant Configuration

### Required Setup in Registry
```typescript
// src/tenancy/registry.ts
{
  id: 'wisdomwarehouse',
  branding: {
    name: 'Wisdom Warehouse',           // Used in PWA name
    logoUrl: '/logos/wisdom-warehouse.png',  // Used as app icon
    primaryColor: '#1e40af',             // Used as theme color
    // ... other branding
  }
}
```

### Logo Requirements
- **Format**: PNG recommended (SVG also supported)
- **Size**: At least 512x512px for best quality
- **Location**: `public/logos/[tenant-slug].png`
- **Aspect Ratio**: Square (1:1) recommended

### Example: Wisdom Warehouse
- Logo: `/logos/wisdom-warehouse.png` ✅
- Primary Color: `#1e40af` (deep blue)
- App Name: "Wisdom Warehouse - Smart Learning Platform"
- Short Name: "Wisdom Warehouse"

## Testing PWA Installation

### Desktop (Chrome/Edge)
1. Visit `http://localhost:9002?tenant=wisdomwarehouse`
2. Click install icon in address bar (or wait for prompt)
3. Verify app name shows "Wisdom Warehouse" in install dialog
4. Install and check desktop shortcut uses correct logo

### Mobile (Chrome Android)
1. Visit `https://smartclass24.app?tenant=wisdomwarehouse`
2. Wait for "Add to Home Screen" prompt
3. Verify prompt shows "Wisdom Warehouse" name
4. Install and check home screen icon

### iOS (Safari)
1. Visit `https://smartclass24.app?tenant=wisdomwarehouse`
2. Tap Share button → "Add to Home Screen"
3. Verify name and icon
4. Install and test

## Manifest Content

### Generated Manifest Structure
```json
{
  "name": "Wisdom Warehouse - Smart Learning Platform",
  "short_name": "Wisdom Warehouse",
  "description": "Empowering curious, creative, and developing young minds...",
  "start_url": "/?tenant=wisdomwarehouse",
  "scope": "/?tenant=wisdomwarehouse",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/logos/wisdom-warehouse.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/logos/wisdom-warehouse.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

## Caching Strategy
- Manifest cached for **1 hour** (`Cache-Control: public, max-age=3600`)
- DynamicManifest component updates immediately on tenant change
- Force refresh recommended after tenant logo updates

## Adding New Tenant PWA

### Step 1: Prepare Logo
```powershell
# Place logo in public/logos/
cp "path/to/logo.png" "public/logos/your-tenant.png"

# Verify file exists
ls public/logos/your-tenant.png
```

### Step 2: Update Tenant Registry
```typescript
// src/tenancy/registry.ts
{
  id: 'yourtenant',
  branding: {
    name: 'Your Tenant Name',
    logoUrl: '/logos/your-tenant.png',
    primaryColor: '#your-color',
    // ...
  }
}
```

### Step 3: Test PWA Installation
```
http://localhost:9002?tenant=yourtenant
```

### Step 4: Deploy
```bash
git add public/logos/your-tenant.png src/tenancy/registry.ts
git commit -m "feat: Add PWA support for Your Tenant"
git push
```

## Troubleshooting

### Issue: Old logo still showing after installation
**Solution**: 
1. Uninstall existing PWA
2. Clear browser cache
3. Hard refresh page (Ctrl+Shift+R)
4. Reinstall PWA

### Issue: Manifest not updating
**Solution**:
1. Check browser console for errors
2. Visit `/api/manifest?tenant=your-tenant` directly
3. Verify tenant ID is correct
4. Force refresh with Ctrl+Shift+R

### Issue: iOS icon not updating
**Solution**:
1. Delete existing home screen icon
2. Clear Safari cache
3. Add to home screen again

### Issue: Theme color not applying
**Solution**:
1. Check tenant `primaryColor` in registry
2. Verify color format is hex (e.g., `#1e40af`)
3. Restart browser

## Browser Support
- ✅ Chrome/Edge (Desktop & Android)
- ✅ Safari (iOS 11.3+)
- ✅ Firefox (Desktop & Android)
- ✅ Samsung Internet
- ❌ IE11 (not supported)

## Best Practices
1. **Logo Size**: Use at least 512x512px for crisp display
2. **Logo Format**: PNG with transparency preferred
3. **Testing**: Always test on both mobile and desktop
4. **Cache**: Clear cache when updating logos
5. **Colors**: Use brand colors for consistency
6. **Description**: Keep under 150 characters

## Files Modified/Created
- ✅ `src/app/api/manifest/route.ts` - Dynamic manifest generator
- ✅ `src/components/tenancy/DynamicManifest.tsx` - Manifest link updater
- ✅ `src/components/tenancy/DynamicAppleIcon.tsx` - iOS icon updater
- ✅ `src/components/PWAPrompts.tsx` - Tenant-branded prompts
- ✅ `src/app/layout.tsx` - Added dynamic components
- ✅ `public/manifest.json` - Fallback (still used for default tenant)

## Future Enhancements
- [ ] Custom splash screens per tenant
- [ ] Tenant-specific shortcuts in manifest
- [ ] Custom share targets
- [ ] Offline fallback pages with tenant branding
- [ ] PWA analytics per tenant

## Related Documentation
- [Tenant Setup Guide](./WISDOM_LOGO_SETUP.md)
- [Footer Customization](./FOOTER_CUSTOMIZATION_GUIDE.md)
- [Campus Architecture](./CAMPUS_ARCHITECTURE.md)
