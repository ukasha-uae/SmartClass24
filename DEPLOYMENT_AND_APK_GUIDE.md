# SmartClass24 Android & Web Scalable Architecture Guide

This document outlines how the **SmartClass24 Android App** connects to the **SmartClass24 Web Ecosystem** (`smartclass24-5e590`), how the repository is structured for scalability, and how to download your APK from GitHub Actions.

---

## 1. Why "Generate APK" Was Not in the Bottom-Right Menu

- The **3-dots menu (`...`)** at the bottom-right corner of the screen is the **Streaming Emulator frame control menu** (containing *Remix*, *Reload App*, *Sharing*, *Settings*).
- Its *Settings* dialog only manages emulator screen rendering and device frames—it does not compile native binaries.
- The most robust, industry-standard way to get your APK is via **GitHub Actions CI/CD**, which compiles the native APK in a clean cloud runner and attaches the `.apk` file for direct download.

---

## 2. Professional Scalability Architecture

Your web repository at `https://github.com/ukasha-uae/SmartClass24` uses:
- **Next.js 16 + React + Tailwind CSS**
- **Firebase Auth + Cloud Firestore (`smartclass24-5e590`)**
- **Unified collections**: `/students`, `/challenges`, `/schools`, `/tournaments`

The Android app (`SmartClass Arena`) has been built to match this exact architecture:
- **Room Database (SQLite)**: Provides instant offline capability with 80+ pre-seeded WASSCE/SHS questions and local state caching.
- **SmartClassSyncService**: Real-time two-way synchronization with Firestore (`smartclass24-5e590`) for live battles, 6-digit room codes (`SC-XXXX`), school leaderboards, and user profiles.
- **GitHub Actions Workflow (`.github/workflows/build-apk.yml`)**: Multi-branch and monorepo aware. Automatically builds `app-debug.apk` whenever code is pushed.

---

## 3. How to Push the Android App to Your GitHub Repository

The origin remote has already been configured to `https://github.com/ukasha-uae/SmartClass24.git`.

Because GitHub requires your write authentication (Personal Access Token or SSH key) to push, follow either **Option A** or **Option B**:

### Option A: Push as a Dedicated `android` Branch (Recommended First Step)

This keeps your web `master` branch untouched while hosting the Android app in the same repository:

1. Generate a GitHub Personal Access Token (classic) with `repo` scope:
   - Go to [GitHub Settings -> Developer Settings -> Personal access tokens](https://github.com/settings/tokens).
   - Generate a token with `repo` permission.
2. In your terminal or command prompt:
   ```bash
   git push https://<YOUR_GITHUB_TOKEN>@github.com/ukasha-uae/SmartClass24.git android
   ```
   *(Or push from your local machine after cloning)*.

### Option B: Unified Monorepo (`android/` Folder in `master`)

If you want the web app and Android app in the same branch:
1. Place the Android files inside an `android/` subfolder at the root of `SmartClass24`.
2. Commit and push to `master`.
3. Our `.github/workflows/build-apk.yml` automatically detects `android/` and runs the build!

---

## 4. How to Download the APK from GitHub Actions

Once pushed:
1. Open [https://github.com/ukasha-uae/SmartClass24](https://github.com/ukasha-uae/SmartClass24).
2. Click on the **Actions** tab at the top.
3. You will see the workflow **"Build and Release Android APK"** running.
4. When it completes (green checkmark, ~2-3 minutes), click on the workflow run.
5. Under the **Artifacts** section at the bottom, click **SmartClass-Arena-APK** to download your APK!
6. Transfer the `.apk` file to any Android device or emulator to install and play.
