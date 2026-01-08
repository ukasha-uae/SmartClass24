# Repository Rename Instructions: Africlass24 → smartclass24

## Step 1: Rename the Repository on GitHub

1. Go to your repository on GitHub: https://github.com/ukasha-uae/Africlass24
2. Click on the **Settings** tab (top right of the repository)
3. Scroll down to the **Repository name** section
4. Change the name from `Africlass24` to `smartclass24`
5. Click **Rename** button

GitHub will automatically redirect the old URL to the new one, but it's best to update your local remotes.

## Step 2: Update Local Git Remote (Already Done)

The Git remote URL has been updated in your local repository to:
```
https://github.com/ukasha-uae/smartclass24.git
```

## Step 3: Verify the Changes

After renaming on GitHub, verify the remote is correct:
```bash
git remote -v
```

You should see:
```
origin  https://github.com/ukasha-uae/smartclass24.git (fetch)
origin  https://github.com/ukasha-uae/smartclass24.git (push)
```

## What Has Been Updated

✅ GitHub repository URLs in codebase:
- `src/app/settings/page.tsx` - Updated GitHub link
- `src/app/about/page.tsx` - Updated GitHub repository link

✅ Git remote URL updated (run after GitHub rename)

⚠️ Note: The localStorage key `africlass24_subject_mastery_v1` in `src/lib/challenge.ts` was **NOT** changed to preserve existing user data. This is an internal implementation detail and doesn't affect the public brand.

## Next Steps

1. Complete the GitHub repository rename (Step 1)
2. Test that `git pull` and `git push` work with the new remote
3. Update any CI/CD pipelines or deployment scripts that reference the old repository name
4. Update any documentation or external links pointing to the old repository

