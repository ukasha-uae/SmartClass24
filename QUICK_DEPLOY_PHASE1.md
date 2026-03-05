# 🚀 Quick Deployment Guide - Phase 1

## Deploy Firestore Rules

```powershell
# Deploy only firestore rules (fast)
firebase deploy --only firestore:rules

# Verify deployment
firebase firestore:rules get
```

## Verify Implementation

### Test 1: Equation Builder Diagnostics

```powershell
# 1. Start dev server
npm run dev

# 2. Open browser to:
# http://localhost:9002/virtual-labs/maths-equation-builder

# 3. Sign in (must be authenticated)

# 4. In equation builder:
#    - Make 3 intentional mistakes on the same step
#    - Check console for: "[Diagnostic Saved to Firestore]"

# 5. Check Firestore Console:
#    - Collection: diagnostics/{your-uid}/misconceptions
#    - Should see 3 documents with severity: "recurring"
```

### Test 2: Arena Challenge Diagnostics

```powershell
# 1. Navigate to:
# http://localhost:9002/challenge-arena/practice

# 2. Start practice match (any subject/level)

# 3. Answer 3-5 questions WRONG intentionally

# 4. Complete battle

# 5. Check console for:
#    "[Arena Diagnostics] Logged X misconceptions"

# 6. Check Firestore Console:
#    - Collection: diagnostics/{your-uid}/misconceptions
#    - Should see documents with source: "arena-challenge"
```

## Quick Verification Script

```powershell
# Check TypeScript errors
npm run typecheck

# Start dev server
npm run dev

# In another terminal, check Firestore connection
firebase firestore:indexes
```

## Firestore Console Links

Production: https://console.firebase.google.com/project/smartclass24-5e590/firestore

Local Emulator: http://localhost:4000/firestore

## Success Criteria

✅ No TypeScript compilation errors  
✅ Firestore rules deployed successfully  
✅ Equation Builder logs diagnostics  
✅ Arena Challenge logs diagnostics  
✅ No "permission denied" errors  
✅ Data visible in Firestore console  

## Rollback Plan

If issues occur:

```powershell
# 1. Revert firestore.rules
git checkout HEAD -- firestore.rules

# 2. Revert code changes
git checkout HEAD -- src/lib/math-lab/metrics.ts
git checkout HEAD -- src/lib/challenge.ts
git checkout HEAD -- src/app/challenge-arena/play/[challengeId]/page.tsx

# 3. Redeploy old rules
firebase deploy --only firestore:rules
```

## Monitoring

After deployment, monitor:

1. **Firestore Console** - Watch for diagnostic documents appearing
2. **Browser Console** - Check for error messages
3. **Firebase Usage** - Monitor reads/writes (should not spike)

Expected metrics:
- ~1-5 writes per equation builder session
- ~3-10 writes per arena battle
- No failed writes (check Firebase console)

## Next Action

Once verified working:
1. Let run for 24 hours with test users
2. Check data quality in Firestore
3. Proceed to Phase 1.3 (Quiz diagnostics)
