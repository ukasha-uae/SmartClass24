# Tenant PWA Setup — Install with Your Own Logo

Each tenant can have their own installable PWA: **name**, **theme color**, and **icons** (logo) come from the tenant’s branding. Users visiting `?tenant=yourtenant` see the install prompt and, when they install, get an app that looks like your brand.

## How it works

- **Manifest**: For non-default tenants, the app uses `/api/manifest?tenant=yourtenant`, which returns a manifest with your tenant name, theme color, and icons. (Wisdom and all tenants use this API manifest so icons work in production.)
- **Install prompt**: Shown when the browser supports the native one-click install prompt. Title is “Install {Your Tenant Name}”.
- **Icons**: Home screen and splash use your tenant’s PWA icons. If icons are under `/logos/` (e.g. Wisdom), they are served via `/api/tenant-logo?tenant=...` so they load in production even when static `public/` is not deployed.

## Adding your tenant’s PWA icons

### Option 1: Convention (easiest)

Add two PNG files under `public/icons/`:

- `public/icons/{tenantId}-192.png` (192×192 px)
- `public/icons/{tenantId}-512.png` (512×512 px)

Use your tenant’s **id** from the registry (e.g. `wisdomwarehouse`, `demo`). No code changes needed; the app will pick these up automatically.

Example for a tenant with `id: 'demo'`:

- `public/icons/demo-192.png`
- `public/icons/demo-512.png`

### Option 2: Explicit paths in registry

If you want different filenames or paths, set `pwaIcons` in the tenant’s `branding` in `src/tenancy/registry.ts`:

```ts
branding: {
  name: 'Your School Name',
  // ...
  pwaIcons: {
    icon192: '/icons/your-logo-192.png',
    icon512: '/icons/your-logo-512.png',
  },
},
```

Use **PNG** for best support across browsers and “Add to home screen” behavior.

## Testing

1. Open the app with your tenant: `https://yoursite.com?tenant=yourtenant`
2. Open DevTools → Application → Manifest and confirm name, icons, and theme color.
3. Use “Install” (or “Add to home screen”) and confirm the installed app shows your name and icon.

## Summary of changes (implementation)

- **Layout**: PWA install prompt is shown for every tenant (removed SmartClass24-only condition).
- **Manifest API** (`/api/manifest`): Uses shared tenant PWA logic; icons from `pwaIcons` or convention `{tenantId}-192.png` / `-512.png`.
- **DynamicManifest**: Sets `theme-color` from the current tenant’s `primaryColor`.
- **DynamicAppleIcon**: Sets Apple Touch Icon from the same tenant icon (192) used in the manifest.
- **Layout head**: Server-rendered `apple-touch-icon` and manifest link use the initial tenant so the first paint is correct.
