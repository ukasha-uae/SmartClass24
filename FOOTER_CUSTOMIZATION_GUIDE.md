# 🎨 Footer Customization Guide

## Overview
The footer component is fully tenant-aware and customizable through the tenant registry. This guide shows you how to customize the footer for any tenant in a scalable and maintainable way.

---

## 🏗️ Architecture

### Tenant-Specific Footer Properties
Footer customization is configured in the tenant registry (`src/tenancy/registry.ts`) using the `footer` property within `branding`:

```typescript
branding: {
  // ... other branding properties
  footer?: {
    tagline?: string;          // Short description/mission statement
    emoji?: string;            // Brand emoji (defaults to 🎓)
    showSocialMedia?: boolean; // Show social media links (defaults to true)
    socialLinks?: {            // Optional custom social links
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
      linkedin?: string;
    };
  };
}
```

### How It Works
1. **Footer Component** (`src/components/Footer.tsx`) reads tenant config via `useTenant()` hook
2. **Dynamic Content**: Tagline, emoji, and social links are pulled from tenant config
3. **Smart Defaults**: If no custom config exists, fallback to default SmartClass24 branding
4. **Conditional Rendering**: Social media section only shows if `showSocialMedia !== false`

---

## 📋 Customization Examples

### Example 1: Wisdom Warehouse (Full Customization)
```typescript
wisdomwarehouse: {
  id: 'wisdomwarehouse',
  slug: 'wisdomwarehouse',
  name: 'Wisdom Warehouse',
  branding: {
    name: 'Wisdom Warehouse',
    logoUrl: '/logos/wisdom-warehouse.png',
    primaryColor: '#1e40af',
    accentColor: '#f59e0b',
    domain: 'learn.wisdomwarehousedubai.com',
    supportEmail: 'admin@wisdomwarehousedubai.com',
    footer: {
      tagline: 'Empowering curious, creative, and developing young minds through alternative, holistic education rooted in real-world learning, emotional resilience, and individual potential.',
      emoji: '🧠',  // Brain emoji - representing wisdom
      showSocialMedia: true,
      socialLinks: {
        instagram: 'https://www.instagram.com/wisdomwarehousedubai/',
        // Only Instagram - verified from their website
      },
    },
  },
  // ... rest of config
}
```

**Result**: Footer shows "🧠 Wisdom Warehouse" with their authentic mission statement from wisdomwarehouseuae.com and only Instagram icon.

### Example 2: Minimal Customization (Custom Tagline Only)
```typescript
myschool: {
  branding: {
    // ... other branding
    footer: {
      tagline: 'Learning made simple for every student.',
    },
  },
}
```

**Result**: Default emoji (🎓), custom tagline, all default social links visible.

### Example 3: Hide Social Media
```typescript
privateschool: {
  branding: {
    // ... other branding
    footer: {
      showSocialMedia: false,
    },
  },
}
```

**Result**: No social media section displayed in footer.

### Example 4: No Footer Customization (Default)
```typescript
newschool: {
  branding: {
    name: 'New School',
    // No footer property defined
  },
}
```

**Result**: Default SmartClass24 footer with standard tagline and all social icons.

---

## 🎯 Quick Reference

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `footer.tagline` | `string` | Auto-generated based on market | Mission statement or description |
| `footer.emoji` | `string` | `🎓` | Brand emoji (single emoji character) |
| `footer.showSocialMedia` | `boolean` | `true` | Show/hide entire social media section |
| `footer.socialLinks.facebook` | `string` | `#` | Facebook profile URL |
| `footer.socialLinks.twitter` | `string` | `#` | Twitter profile URL |
| `footer.socialLinks.instagram` | `string` | `#` | Instagram profile URL |
| `footer.socialLinks.youtube` | `string` | `#` | YouTube channel URL |
| `footer.socialLinks.linkedin` | `string` | `#` | LinkedIn company page URL |

---

## 🚀 How to Customize Footer for a New Tenant

### Step 1: Open Tenant Registry
```powershell
code src/tenancy/registry.ts
```

### Step 2: Add Footer Config to Your Tenant
```typescript
mytenant: {
  id: 'mytenant',
  slug: 'mytenant',
  name: 'My Educational Institution',
  branding: {
    name: 'My Educational Institution',
    logoUrl: '/logos/mytenant.svg',
    primaryColor: '#3b82f6',
    accentColor: '#10b981',
    domain: 'learn.myinstitution.com',
    supportEmail: 'support@myinstitution.com',
    
    // ✨ Add your footer customization here
    footer: {
      tagline: 'Your custom tagline goes here - keep it under 200 characters.',
      emoji: '📚',  // Pick an emoji that represents your brand
      showSocialMedia: true,
      socialLinks: {
        facebook: 'https://facebook.com/yourinstitution',
        instagram: 'https://instagram.com/yourinstitution',
        linkedin: 'https://linkedin.com/company/yourinstitution',
        // Omit twitter/youtube if you don't use them
      },
    },
  },
  // ... rest of tenant config
}
```

### Step 3: Test Your Changes
```powershell
# Start dev server
npm run dev

# Test with preview mode
# http://localhost:9002?tenant=mytenant
```

---

## 🎨 Best Practices

### Tagline Guidelines
- ✅ **DO**: Keep it concise (under 200 characters)
- ✅ **DO**: Focus on your unique value proposition
- ✅ **DO**: Use language that resonates with your target audience
- ❌ **DON'T**: Use generic corporate jargon
- ❌ **DON'T**: Include pricing or promotional content

### Emoji Selection
- ✅ **DO**: Choose emojis that represent education/learning
- ✅ **DO**: Test emoji rendering across devices
- ✅ **DO**: Consider your brand personality
- ❌ **DON'T**: Use multiple emojis (keep it to one)
- ❌ **DON'T**: Use overly casual or unprofessional emojis

### Social Links
- ✅ **DO**: Use full URLs (e.g., `https://facebook.com/...`)
- ✅ **DO**: Test all links before deploying
- ✅ **DO**: Only include platforms you actively use
- ❌ **DON'T**: Include placeholder links (`#`) in production
- ❌ **DON'T**: Include all platforms if you don't maintain them

---

## 🔧 Advanced Customization

### Conditional Taglines Based on Market
You can still use market-aware taglines by omitting the `footer.tagline` property. The component will automatically generate taglines based on:
- `market: 'us'` → US-specific messaging
- `market: 'ghana'` (with localization) → Ghana-specific messaging
- Default → Global messaging

### Programmatic Social Link Filtering
Social links are automatically filtered based on which ones you define:
- Define only `instagram` and `facebook` → Only those icons show
- Define all 5 platforms → All 5 icons show
- Define none (empty `socialLinks` object) → All default icons show

---

## 📊 Examples by Tenant Type

### B2B Enterprise (School/District)
```typescript
footer: {
  tagline: 'Transforming education through innovative technology and personalized learning experiences.',
  emoji: '🏫',
  showSocialMedia: true,
  socialLinks: {
    linkedin: 'https://linkedin.com/company/yourschool',
    facebook: 'https://facebook.com/yourschool',
  },
}
```

### B2C Individual Students
```typescript
footer: {
  tagline: 'Master every subject with AI-powered tools and gamified learning. Join 10,000+ students today!',
  emoji: '🚀',
  showSocialMedia: true,
  socialLinks: {
    instagram: 'https://instagram.com/yourplatform',
    youtube: 'https://youtube.com/@yourplatform',
    twitter: 'https://twitter.com/yourplatform',
  },
}
```

### Alternative/Specialized Education
```typescript
footer: {
  tagline: 'Empowering curious, creative, and developing young minds through alternative, holistic education rooted in real-world learning, emotional resilience, and individual potential.',
  emoji: '🧠',
  showSocialMedia: true,
  socialLinks: {
    instagram: 'https://www.instagram.com/yourschool',
  },
}
```

---

## 🐛 Troubleshooting

### Footer Not Showing Custom Content
1. **Check tenant resolution**: Open browser console, look for `[useTenant] Resolved:` log
2. **Verify preview mode**: Use `?tenant=yourtenantid` in URL
3. **Clear Next.js cache**: Run `npm run dev:fresh`
4. **Check for typos**: Ensure property names match exactly

### Social Icons Not Showing
1. **Check `showSocialMedia`**: Ensure it's not set to `false`
2. **Verify socialLinks object**: Must be defined (even if empty)
3. **Check link filtering**: Only platforms with URLs show

### Emoji Not Displaying
1. **Browser support**: Test in modern browsers (Chrome, Firefox, Safari, Edge)
2. **Single emoji only**: Use one emoji character, not multiple
3. **Check encoding**: Ensure file is saved as UTF-8

---

## 📝 Migration Checklist

When adding footer customization to an existing tenant:

- [ ] Identify tenant in `src/tenancy/registry.ts`
- [ ] Gather brand assets (tagline, emoji, social URLs)
- [ ] Add `footer` property to tenant's `branding` object
- [ ] Test with `?tenant=yourtenantid` preview mode
- [ ] Verify all social links work
- [ ] Test on mobile and desktop
- [ ] Check dark mode appearance
- [ ] Confirm with client/stakeholder

---

## 🎓 Related Documentation

- **Tenant System**: `TENANT_ONBOARDING_SYSTEM.md`
- **Logo Setup**: `WISDOM_LOGO_SETUP.md`
- **Branding Guide**: See tenant registry types in `src/tenancy/types.ts`
- **Component Source**: `src/components/Footer.tsx`

---

## 💡 Pro Tips

1. **Test Both Modes**: Always test with and without `?tenant=` parameter
2. **Mobile First**: Footer is hidden on mobile (uses BottomNav instead)
3. **Brand Consistency**: Match footer emoji to your logo's visual identity
4. **Social Proof**: If you have strong social media presence, showcase it!
5. **Keep It Updated**: Update social links when accounts change

---

**Last Updated**: February 8, 2026
**Version**: 1.0.0
