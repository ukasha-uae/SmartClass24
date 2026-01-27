# S24 Innovation Academy Module - Installation Guide

## Quick Start

### 1. Install Dependencies

```powershell
# Install Monaco Editor (VS Code's editor component)
npm install @monaco-editor/react

# Verify installation
npm list @monaco-editor/react
```

### 2. Verify Firebase Configuration

Ensure Firebase is configured in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Deploy Firestore Security Rules

```powershell
# Deploy the updated rules that include university collections
firebase deploy --only firestore:rules
```

### 4. Run Development Server

```powershell
npm run dev
```

### 5. Access S24 Innovation Academy

Navigate to: `http://localhost:9002/university`

## Testing the Code Editor

### Test Lesson Route
```
http://localhost:9002/university/programs/web-development-fundamentals/courses/html-css-basics/lessons/html-tags-elements
```

### Features to Test
- [ ] Monaco Editor loads properly
- [ ] Code can be edited
- [ ] Live preview updates
- [ ] Console captures output
- [ ] File tabs switch correctly
- [ ] Save button works
- [ ] Reset button restores code
- [ ] Download button exports files
- [ ] Fullscreen mode works
- [ ] Mobile responsive

## Troubleshooting

### Monaco Editor Not Loading

If you see "Loading editor..." indefinitely:

1. Check browser console for errors
2. Verify `@monaco-editor/react` is installed
3. Clear Next.js cache: `npm run dev:fresh`
4. Check that SSR is disabled in component

### Preview Not Updating

1. Check browser console for CSP errors
2. Verify iframe sandbox attributes
3. Check postMessage event listeners
4. Test in incognito mode (disable extensions)

### Code Not Saving

1. Verify user is authenticated
2. Check Firestore rules are deployed
3. Test localStorage fallback
4. Check browser console for Firebase errors

## Production Deployment

### Build for Production

```powershell
npm run build
```

### Environment Variables

Set all Firebase environment variables in your hosting platform (Vercel, Netlify, etc.)

### Deploy Firestore Rules

```powershell
firebase deploy --only firestore:rules
```

### Verify Deployment

1. Check `/university` loads
2. Test code editor functionality
3. Verify auto-save works
4. Test project submission
5. Check mobile responsiveness

## Next Steps

1. **Add More Programs**: Follow guide in `docs/UNIVERSITY_CAMPUS_GUIDE.md`
2. **Customize Code Editor**: Modify `UniversityCodeEditor.tsx`
3. **Add Validation Rules**: Update lesson configs in `university-data.ts`
4. **Enable Analytics**: Implement time tracking hooks
5. **Add Certificates**: Build certificate generation system

## Support

For issues or questions, refer to:
- Main Guide: `docs/UNIVERSITY_CAMPUS_GUIDE.md`
- Component: `src/components/university/UniversityCodeEditor.tsx`
- Data Structure: `src/types/university.ts`

---

**Status**: ✅ Ready to Run
**Version**: 1.0.0
**Date**: January 24, 2026
