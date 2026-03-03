# Security & Quality Checklist - SmartClass24
Quick reference for developers - Keep this handy!

## 🚫 NEVER DO THIS

❌ **NEVER** commit `.env.local` or `serviceAccountKey.json`  
❌ **NEVER** hardcode API keys or secrets  
❌ **NEVER** use `dangerouslySetInnerHTML` without sanitization  
❌ **NEVER** trust user input - always validate  
❌ **NEVER** ignore TypeScript errors  
❌ **NEVER** deploy with `console.log` in production code  
❌ **NEVER** allow anonymous users to write to Firestore without rules  

## ✅ ALWAYS DO THIS

✅ **ALWAYS** sanitize HTML: `sanitizeHtml(content)`  
✅ **ALWAYS** validate API inputs with Zod schemas  
✅ **ALWAYS** use `logger.debug()` instead of `console.log()`  
✅ **ALWAYS** test Firestore security rules  
✅ **ALWAYS** handle errors gracefully (try/catch)  
✅ **ALWAYS** check user permissions before data access  
✅ **ALWAYS** run `npm audit` before deploying  

## 📝 Before Every Commit

- [ ] No `.env` files staged
- [ ] No `console.log` in new code (use `logger`)
- [ ] TypeScript errors fixed (`npm run typecheck`)
- [ ] No hardcoded credentials
- [ ] Linted (`npm run lint`)

## 🔒 Security Patterns to Use

### 1. Rendering User Content
```tsx
// ❌ WRONG
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ CORRECT
import { sanitizeHtml } from '@/lib/security/sanitize-html';
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userContent) }} />
```

### 2. Validating API Inputs
```typescript
// ❌ WRONG
const userId = request.query.userId; // No validation!

// ✅ CORRECT
import { UserIdSchema } from '@/lib/security/validation-schemas';
const validation = UserIdSchema.safeParse(request.query.userId);
if (!validation.success) {
  return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
}
const userId = validation.data;
```

### 3. Firestore Security Rules Pattern
```javascript
// ✅ CORRECT - Always check authentication and authorization
match /collection/{docId} {
  allow read: if request.auth != null && 
    (request.auth.uid == docId || isSuperAdmin());
  allow write: if request.auth != null && 
    request.auth.uid == docId;
}
```

### 4. Environment Variables
```typescript
// ❌ WRONG
const apiKey = 'AIzaSyC...'; // Hardcoded!

// ✅ CORRECT
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
if (!apiKey) {
  throw new Error('Firebase API key not configured');
}
```

### 5. Error Handling
```typescript
// ❌ WRONG
try {
  await saveToDatabase(data);
} catch (e) {
  console.log(e); // Swallowed error!
}

// ✅ CORRECT
import { logger } from '@/lib/logger';
try {
  await saveToDatabase(data);
} catch (error) {
  logger.error('[SaveData] Failed to save', error as Error);
  throw error; // Re-throw for caller to handle
}
```

### 6. Logging (Production Safe)
```typescript
// ❌ WRONG
console.log('User logged in:', userId, userEmail, userPassword); // PII + password!

// ✅ CORRECT
logger.debug('[Auth] User logged in', { userId }); // Only in dev, no PII
logger.info('[Auth] Login successful'); // Production-safe message
```

## 🧪 Before Deploying

- [ ] All tests passing (`npm test`)
- [ ] TypeScript passes (`npm run typecheck`)
- [ ] No npm audit vulnerabilities (high/critical)
- [ ] Firestore rules deployed (`firebase deploy --only firestore:rules`)
- [ ] Environment variables configured in hosting platform
- [ ] Database backups enabled
- [ ] Monitoring/alerts set up (Sentry)

## 🚨 If You Discover a Security Issue

1. **DO NOT** commit it to git
2. **DO NOT** discuss in public channels
3. **Immediately notify:** Security Lead / Project Owner
4. Document the issue privately
5. Apply fix ASAP
6. Test thoroughly before deploying
7. Document in SECURITY.md

## 📊 Performance Checklist

- [ ] Images optimized (WebP, lazy loading)
- [ ] Bundle size < 2MB
- [ ] No unnecessary re-renders
- [ ] Database queries optimized (indexes)
- [ ] Proper error boundaries in React
- [ ] Service worker caching configured

## 🔍 Code Review Checklist

When reviewing PRs, check for:

- [ ] No security vulnerabilities
- [ ] Input validation present
- [ ] Error handling implemented
- [ ] No sensitive data in logs
- [ ] Tests included (for critical features)
- [ ] TypeScript types correct
- [ ] No console.log statements
- [ ] Firestore rules updated if needed
- [ ] Documentation updated
- [ ] Performance impact considered

## 🛠️ Quick Commands

```bash
# Check for security issues
npm audit

# Fix auto-fixable vulnerabilities
npm audit fix

# Check TypeScript
npm run typecheck

# Run tests
npm test

# Check bundle size
npm run build

# Deploy Firestore rules
firebase deploy --only firestore:rules

# View production logs
firebase functions:log

# Check git for sensitive files
git log --all --full-history -- "*.env*"
```

## 📖 Quick Reference Links

- [SECURITY_AUDIT_REPORT.md](./SECURITY_AUDIT_REPORT.md) - Full audit report
- [FIREBASE_AUTH_FIX.md](./FIREBASE_AUTH_FIX.md) - Auth best practices
- [firestore.rules](./firestore.rules) - Security rules
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## 🎯 Priority Levels

🔴 **CRITICAL** - Fix immediately, block deployment  
🟠 **HIGH** - Fix within 1 week  
🟡 **MEDIUM** - Fix within 1 month  
🟢 **LOW** - Fix when convenient  

## 💬 Questions?

- Security concerns → Contact Security Lead
- Architecture questions → Contact Tech Lead  
- Unsure about implementation → Ask before coding!

---

**Remember:** Security is everyone's responsibility!  
**When in doubt, ask!** Better to ask than introduce a vulnerability.
