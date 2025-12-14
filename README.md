# Smartclass24 (SClass24)

A scalable, multi-campus smart learning platform for JHS & SHS students across Ghana.

## Overview

Smartclass24 is a Next.js 16 App Router application that provides personalized learning experiences for Junior High School (JHS) and Senior High School (SHS) students. The platform features a campus-based architecture that allows easy expansion to additional educational levels.

To get started, take a look at src/app/page.tsx.

## 📚 For Contributors & AI Agents

**IMPORTANT**: Before making changes to carousel lessons, read these documents:

- **[Carousel Implementation Guide](docs/CAROUSEL_LESSONS_GUIDE.md)** - Official patterns and antipatterns
- **[Migration Tracker](docs/CAROUSEL_MIGRATION_TRACKER.md)** - Progress tracking and next steps
- **[Migration Strategy](docs/CAROUSEL_MIGRATION_STRATEGY.md)** - Overall migration plan

These documents define the established patterns to ensure consistency across all carousel lessons.

## End-of-Lesson Quiz Persistence

Completed lesson quizzes will now be saved to Firestore for authenticated users under `users/{uid}/quizAttempts`.

Schema: { lessonId, subjectSlug, topicSlug, lessonSlug, createdAt, scorePercent, rawScore, total, report }

Notes:
- If a user is not signed in, quiz attempts are saved to localStorage as a fallback.
 - If a user is not signed in, quiz attempts are saved to localStorage as a fallback.
 - When a user signs in or links an anonymous session to an email, any local quiz attempts (saved via localStorage) are automatically migrated into Firestore under `users/{uid}/quizAttempts`.

Troubleshooting Firestore profile save (permission denied)
 - If you see a "Missing or insufficient permissions" error when saving the profile, try the following:
	1. Confirm you are signed in by checking the header Account button. If you are signed in anonymously, link to an email or sign in with a proper account.
	2. If you are testing locally, start the Firebase emulator to enable secure, local testing:
		- Ensure firebase CLI is installed and configured with your project: `firebase login` and `firebase use --add`.
		- Run: `firebase emulators:start --only auth,firestore` and then reload the app.
	3. If using your Firebase project, verify Firestore rules are deployed and allow authenticated users to create/update their profile doc at `students/{uid}`:
		- Deploy rules: `firebase deploy --only firestore:rules`.
		- The repo's `firestore.rules` file already contains an example rule allowing the owner of `students/{uid}` to create and update their profile; ensure it is the active rule in the Firebase console or your deployed project.
	4. Verify that the user `uid` seen in the app matches the `students/{uid}` gap (the app's `user.uid` is used as the document id).
	5. Check browser DevTools console for detailed errors (permission denined will be `permission-denied`). The app will display a helpful toast with troubleshooting steps when permission is denied.
- Firestore security rules restrict creating quiz attempts to the authenticated owner and restrict reads to the owner as well.

## Quiz Styles

- Lessons and individual quiz items can specify `defaultQuizStyle` or an individual `style` respectively. Supported styles: `classic`, `card`, `compact`, `timed`, `image-first`, `visual`, `rapid`.
- `visual` is a preset for image-centered style, `rapid` is a fast-timed preset.
- You can set `defaultQuizStyle` on a lesson in `src/lib/jhs-data.ts` (used by the seeder) or in Firestore lesson documents.

## Student Account & Profiles

We use Firebase Authentication to allow students to create personal accounts. The app still signs users in anonymously by default for a fast entry, but students can optionally create an email account to personalize their profile and save progress to their account.

- Anonymous Sign-in: The app signs users in anonymously on first load to allow immediate access and local progress storage.
- Create Account (Email/Password): Students can click "Sign in" in the header to open the auth dialog, choose "Sign up", and create an account using email and password. If they were using an anonymous session, we try to link their anonymous session to the new permanent account to keep progress.
- Profile Setup: After signing up, or for anonymous users who have never completed a profile, the app shows a lightweight profile setup dialog with fields: `studentName`, `studentClass`, `schoolName`, `schoolAddress`, `parentPhoneNumber`.
- Where profile is stored: Profiles are saved to Firestore at `students/{uid}` (a document in the `students` collection) with the following fields:
	- studentName
	- studentClass
	- schoolName
	- schoolAddress
	- parentPhoneNumber
	- updatedAt (timestamp)

Security & Rules:
- Firestore rules restrict create/update/read access so only the authenticated owner of the document can read/write their own profile (see `firestore.rules`).


Examples:

- Set the lesson default:

```ts
lesson.defaultQuizStyle = 'card';
```

- Set per-question style:

```ts
quiz.style = 'image-first';
```


To make local testing straightforward, the repo provides a `firebaseConfig` under `src/firebase/config.ts` for development (not for production). Use the Firebase Emulator Suite for offline testing if desired.

