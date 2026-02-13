# PWA Installation Fix for Wisdom Warehouse

## ✅ Changes Made

### 1. Created Tenant-Specific PWA Icons
- **Generated proper PWA icons** for Wisdom Warehouse:
  - `/public/icons/wisdom-warehouse-192.png` (192x192)
  - `/public/icons/wisdom-warehouse-512.png` (512x512)
- **Source**: Converted from `/public/logos/wisdom-warehouse.png`
- **Format**: PNG (required for PWA manifests - SVG doesn't work on all devices)

### 2. Updated Dynamic Manifest API
- **File**: `src/app/api/manifest/route.ts`
- **Function**: `generateIcons()` now uses tenant-specific icons
- **Result**: Wisdom Warehouse PWA now uses proper branded icons in manifest

### 3. Updated Apple Touch Icon (iOS Support)
- **File**: `src/components/tenancy/DynamicAppleIcon.tsx`
- **Change**: Uses tenant-specific 192x192 PNG icon for iOS home screen
- **Result**: iOS devices show Wisdom Warehouse logo when added to home screen

### 4. Created PWA Debug Tool
- **New Page**: `/pwa-debug` (http://localhost:9002/pwa-debug?tenant=wisdomwarehouse)
- **Features**:
  - View installation status
  - Check manifest configuration
  - Reset install prompt dismissal
  - Clear all PWA data for testing
  - View tenant-specific settings
  - Display icon previews

## 🧪 How to Test

### Option 1: Incognito/Private Mode (Recommended)
1. Open browser in **Incognito/Private browsing** mode
2. Navigate to: `http://localhost:9002/?tenant=wisdomwarehouse`
3. Wait 10 seconds for install prompt to appear
4. Click "Install Now" to test PWA installation

### Option 2: Reset Prompt in Normal Browser
1. Go to: `http://localhost:9002/pwa-debug?tenant=wisdomwarehouse`
2. Click "**Reset Install Prompt Dismissal**"
3. Navigate to home page: `/?tenant=wisdomwarehouse`
4. Wait 10 seconds for prompt to appear

### Option 3: Browser DevTools
1. Open Chrome DevTools (F12)
2. Go to **Application** tab → **Manifest**
3. Verify:
   - Name: "Wisdom Warehouse - Smart Learning Platform"
   - Icons: Should show wisdom-warehouse-192.png and wisdom-warehouse-512.png
   - Theme color: #1e40af (Wisdom Warehouse blue)
4. Click "**Update**" if manifest needs refresh
5. Check "**Install app**" section to trigger manual install

### Option 4: Clear All PWA Data
If prompt still doesn't appear:
1. Go to `/pwa-debug?tenant=wisdomwarehouse`
2. Click "**Clear All PWA Data & Reload**"
3. This will:
   - Unregister service workers
   - Clear all caches
   - Remove localStorage dismissal flag
   - Reload the page

## 📱 PWA Install Prompt Behavior

### When Prompt Appears:
- **Delay**: 10 seconds after page load
- **Condition 1**: Not already installed as PWA
- **Condition 2**: `beforeinstallprompt` event fired (browser-dependent)
- **Condition 3**: User hasn't dismissed it previously

### Why Prompt May Not Appear:
1. ❌ **Already installed** - Check if URL bar shows app icon
2. ❌ **Dismissed before** - localStorage has `pwa-prompt-dismissed: true`
3. ❌ **Not served over HTTPS** - (localhost is exception)
4. ❌ **Browser doesn't support** - Try Chrome/Edge for best support
5. ❌ **Manifest issues** - Use DevTools to check for errors

## 🔧 Debug Checklist

### Manifest Verification
```bash
# Check manifest URL
curl http://localhost:9002/api/manifest?tenant=wisdomwarehouse | jq

# Expected output includes:
# - name: "Wisdom Warehouse - Smart Learning Platform"
# - icons: Array with wisdom-warehouse-192.png and wisdom-warehouse-512.png
# - theme_color: "#1e40af"
```

### Browser Console Checks
```javascript
// Check if PWA is installed
window.matchMedia('(display-mode: standalone)').matches

// Check manifest link
document.querySelector('link[rel="manifest"]')?.href

// Check if prompt was dismissed
localStorage.getItem('pwa-prompt-dismissed')

// Check service worker
navigator.serviceWorker.getRegistrations()
```

### DevTools Checks
1. **Application → Manifest**
   - ✅ Manifest URL should include `?tenant=wisdomwarehouse`
   - ✅ Icons should be PNG files (not SVG)
   - ✅ Theme color should be #1e40af

2. **Application → Service Workers**
   - ✅ Service worker should be registered
   - ✅ Skip waiting should be enabled

3. **Console**
   - ✅ No manifest errors
   - ✅ No service worker errors

## 🚀 Testing on Production

### For Wisdom Warehouse Domain:
Once deployed to `learn.wisdomwarehouseuae.com`:
1. Visit site on mobile device
2. Wait for install banner
3. Or use browser menu → "Install Wisdom Warehouse"
4. App should install with Wisdom Warehouse branding

### Production Requirements:
- ✅ HTTPS enabled
- ✅ Valid SSL certificate
- ✅ Manifest accessible at `/api/manifest?tenant=wisdomwarehouse`
- ✅ Icons accessible at `/icons/wisdom-warehouse-*.png`
- ✅ Service worker registered

## 📝 Files Modified

1. ✅ `src/app/api/manifest/route.ts` - Updated icon generation
2. ✅ `src/components/tenancy/DynamicAppleIcon.tsx` - iOS icon support
3. ✅ `create-pwa-icons.ps1` - Icon generation script
4. ✅ `src/app/pwa-debug/page.tsx` - Debug utility (new)
5. ✅ `public/icons/wisdom-warehouse-192.png` - PWA icon (new)
6. ✅ `public/icons/wisdom-warehouse-512.png` - PWA icon (new)

## 🎯 Expected Result

**Before Fix:**
- ❌ No install prompt appears
- ❌ Wrong icons in manifest
- ❌ Generic SmartClass24 branding

**After Fix:**
- ✅ Install prompt appears after 10 seconds
- ✅ Wisdom Warehouse branded icons (192x192, 512x512)
- ✅ Wisdom Warehouse theme color (#1e40af)
- ✅ App name: "Wisdom Warehouse - Smart Learning Platform"
- ✅ Works on both Android and iOS devices

## 🔄 Quick Test Command

```powershell
# Start dev server (if not running)
npm run dev

# In a new terminal, open browser
start http://localhost:9002/pwa-debug?tenant=wisdomwarehouse

# Or test directly
start "chrome" --incognito http://localhost:9002/?tenant=wisdomwarehouse
```

## 📞 Troubleshooting

### Issue: Prompt still doesn't appear
**Solution**: 
1. Clear browser cache (Ctrl + Shift + Delete)
2. Use `/pwa-debug` to reset dismissal
3. Try incognito mode
4. Check console for errors

### Issue: Wrong icons showing
**Solution**:
1. Hard refresh (Ctrl + Shift + R)
2. Clear service worker cache
3. Verify manifest URL includes tenant parameter

### Issue: Install button grayed out in DevTools
**Solution**:
1. PWA is already installed - uninstall first
2. Or manifest doesn't meet PWA criteria
3. Check Application → Manifest for errors

## 📚 Additional Resources

- [PWA Best Practices](https://web.dev/pwa/)
- [Manifest File Format](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [beforeinstallprompt Event](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)

---

**Last Updated**: February 13, 2026  
**Dev Server**: http://localhost:9002  
**Debug Tool**: http://localhost:9002/pwa-debug?tenant=wisdomwarehouse
