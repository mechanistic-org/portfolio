---
description: Build, Commit, and Push to Main (Triggering Cloudflare).
---

# Deploy to Production

Trigger this workflow by running `/deploy_production` or asking to "Push to Main".

1.  **Safety Check**:
    - Run `git status` to show pending changes.
    - Run `npm run build` to ensure the site compiles locally. **If this fails, STOP.**

2.  **Commit**:
    - Stage all changes: `git add .`
    - Ask user for a specific Commit Message (or use a sensible default like "chore: content update").
    - Commit: `git commit -m "{message}"`

3.  **Push**:
    - Push to remote: `git push origin main`

4.  **Verification**:
    - Notify user: _"Pushed to main. Cloudflare Pages build triggered."_
    - Remind user to check `https://eriknorris.com` in 2 minutes.
