# Tenant Logos Folder

This folder contains logos for all tenants in the multi-tenant platform.

## File Naming Convention

Logos should be named using the tenant slug from `src/tenancy/registry.ts`:
- **Wisdom Warehouse**: `wisdom-warehouse.svg` (or `.png`)
- **Demo Tenant**: `demo.svg`
- **SmartClass24** (default): Uses S24 branding (no file needed)

## Logo Requirements

### Format
- **Preferred**: SVG (scalable vector graphic)
- **Alternative**: PNG with transparent background

### Size (for PNG)
- Minimum: 500x500 pixels
- Recommended: 1000x1000 pixels or higher
- Aspect ratio: Square or wide landscape (max 3:1 ratio)

### File Size
- SVG: < 100KB preferred
- PNG: < 500KB preferred

## Current Tenants

### Wisdom Warehouse
- **File**: `wisdom-warehouse.svg`
- **Status**: ⚠️ Pending upload
- **Action**: Download from client and place here
- **Config**: See `src/tenancy/registry.ts` → wisdomwarehouse.branding.logoUrl

### Demo Tenant
- **File**: `demo.svg`
- **Status**: ⚠️ Optional (uses fallback S24 logo)
- **Action**: Can use any placeholder logo for testing

### SmartClass24 (Default)
- **File**: None needed
- **Status**: ✅ Uses built-in S24 branding
- **Location**: Rendered as emoji/text in components

## Testing

After adding a logo:

1. **Restart dev server**: `npm run dev`
2. **Test with preview mode**: 
   - http://localhost:9002?tenant=wisdomwarehouse
   - http://localhost:9002?tenant=demo
3. **Verify logo appears** in header and other branded components

## Troubleshooting

### Logo not showing?
- Check filename matches tenant slug exactly
- Check file extension in `registry.ts` matches actual file (.svg vs .png)
- Restart dev server
- Clear browser cache (Ctrl+F5)

### Logo shows as broken image?
- Verify file is actually SVG/PNG format (not renamed)
- Check file permissions (should be readable)
- Verify path in registry: `/logos/[filename]`

### Logo shows for wrong tenant?
- Check URL includes `?tenant=` parameter
- Verify tenant exists in `src/tenancy/registry.ts`
- Check browser console for errors

## Adding New Tenant Logo

1. **Get logo file** from client (SVG preferred)
2. **Name correctly**: Use tenant slug (e.g., `newtenant.svg`)
3. **Place here**: `public/logos/newtenant.svg`
4. **Update registry**: Set `logoUrl: '/logos/newtenant.svg'`
5. **Test**: `?tenant=newtenant`

## See Also

- [WISDOM_LOGO_SETUP.md](../WISDOM_LOGO_SETUP.md) - Detailed Wisdom Warehouse logo setup
- [MULTI_TENANT_IMPLEMENTATION_COMPLETE.md](../MULTI_TENANT_IMPLEMENTATION_COMPLETE.md) - Full multi-tenant docs
- [src/components/tenancy/TenantLogo.tsx](../src/components/tenancy/TenantLogo.tsx) - Logo component
- [src/tenancy/registry.ts](../src/tenancy/registry.ts) - Tenant configuration
