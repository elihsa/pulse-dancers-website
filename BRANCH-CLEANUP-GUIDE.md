# Git Branches - Cleanup Guide

## 📖 What are Git Branches?

Git branches are separate lines of development in your repository. Think of them like parallel universes of your code:

- **Main branch**: Your production/stable code that's live on the website
- **Feature branches**: Temporary branches where you develop new features or fixes
- **Merged branches**: Feature branches that have been successfully merged into main

## 🧹 Why Delete Merged Branches?

After a feature branch is merged into main:
- ✅ The code changes are now part of main
- ✅ The branch serves no further purpose
- ✅ Keeping old branches clutters your repository
- ✅ Makes it harder to see what's actively being worked on

## 📊 Current Branch Status

### Total Branches: 28
- **1 active branch**: `main` (production)
- **1 working branch**: `copilot/update-readme-versioning` (current PR)
- **26 merged branches**: Ready for deletion ⚠️

## 🗑️ Merged Branches Ready for Deletion (26 total)

All these branches have been successfully merged and their code is in production:

1. `copilot/add-netlify-functions-booking` (PR #5)
2. `copilot/center-google-forms-embed` (PR #22)
3. `copilot/cleanup-netlify-files` (PR #6)
4. `copilot/create-google-sheets-template` (PR #8)
5. `copilot/fix-booking-form-and-cms-data` (PR #3)
6. `copilot/fix-cms-functionality-issues` (PR #14)
7. `copilot/fix-cms-google-sheet-issue` (PR #15)
8. `copilot/fix-cms-integration-issues` (PR #13)
9. `copilot/fix-cms-issues` (PR #12)
10. `copilot/fix-google-sheets-integration` (PR #9)
11. `copilot/fix-hardcoded-text-issue` (PR #16)
12. `copilot/fix-instagram-facebook-embeds` (PR #26)
13. `copilot/fix-issues-on-website-pages` (PR #17)
14. `copilot/fix-join-and-review-forms` (PR #18)
15. `copilot/fix-meet-the-guys-page` (PR #27)
16. `copilot/fix-testimonials-and-forms` (PR #19)
17. `copilot/fix-testimonials-forms-errors` (PR #20)
18. `copilot/populate-google-sheets-cms` (PR #7)
19. `copilot/remove-form-background` (PR #23)
20. `copilot/remove-unnecessary-files` (PR #28)
21. `copilot/swap-navigation-pages-add-social-media` (PR #4)
22. `copilot/switch-back-to-jotform` (PR #10)
23. `copilot/switch-back-to-jotform-again` (PR #11)
24. `copilot/update-booking-form-ui` (PR #2)
25. `copilot/update-join-and-contact-html` (PR #21)
26. `copilot/update-website-with-cms` (PR #1)

## ✅ Recommendation: SAFE TO DELETE ALL 26 BRANCHES

These branches:
- ✅ Have been successfully merged into main
- ✅ Their code is already in production
- ✅ Are no longer needed for any development
- ✅ Can be safely deleted with no risk

## 🔧 How to Delete These Branches

### Option 1: GitHub Web Interface (Easiest - Recommended)

1. Go to: https://github.com/elihsa/pulse-dancers-website/branches
2. You'll see "Your branches" page with a list of all branches
3. For each merged branch, click the **🗑️ trash icon** next to it
4. Confirm deletion when prompted

**Tip**: GitHub shows "merged" tag next to branches that have been merged, making them easy to identify.

### Option 2: Command Line (Bulk Delete)

If you prefer using the command line, use the included `delete-merged-branches.sh` script:

```bash
chmod +x delete-merged-branches.sh
./delete-merged-branches.sh
```

The script will:
- Delete all 26 merged branches one by one
- Show progress for each branch
- Report success/failure count at the end
- Provide a final summary

**Alternative: Simple One-Command Approach**

If you prefer a simpler approach without a script, you can delete all branches in one command:

```bash
git push origin --delete \
  copilot/add-netlify-functions-booking \
  copilot/center-google-forms-embed \
  copilot/cleanup-netlify-files \
  copilot/create-google-sheets-template \
  copilot/fix-booking-form-and-cms-data \
  copilot/fix-cms-functionality-issues \
  copilot/fix-cms-google-sheet-issue \
  copilot/fix-cms-integration-issues \
  copilot/fix-cms-issues \
  copilot/fix-google-sheets-integration \
  copilot/fix-hardcoded-text-issue \
  copilot/fix-instagram-facebook-embeds \
  copilot/fix-issues-on-website-pages \
  copilot/fix-join-and-review-forms \
  copilot/fix-meet-the-guys-page \
  copilot/fix-testimonials-and-forms \
  copilot/fix-testimonials-forms-errors \
  copilot/populate-google-sheets-cms \
  copilot/remove-form-background \
  copilot/remove-unnecessary-files \
  copilot/swap-navigation-pages-add-social-media \
  copilot/switch-back-to-jotform \
  copilot/switch-back-to-jotform-again \
  copilot/update-booking-form-ui \
  copilot/update-join-and-contact-html \
  copilot/update-website-with-cms
```

### Option 3: Command Line (Individual)

Delete branches one at a time:
```bash
git push origin --delete copilot/branch-name
```

## 🔒 Safety & Impact

### What happens when you delete a branch?
- ✅ **Code is preserved**: All code is already in main
- ✅ **History is preserved**: Commit history remains intact
- ✅ **PRs remain visible**: Pull requests stay on GitHub for reference
- ✅ **Reversible**: You can recover deleted branches within 30 days on GitHub

### What DOESN'T happen?
- ❌ No code is lost
- ❌ No commits are deleted
- ❌ No history is erased
- ❌ No PRs are affected

## 📈 Benefits After Cleanup

1. **Cleaner repository** - Only active branches visible
2. **Better organization** - Easier to navigate
3. **Faster operations** - Fewer branches to sync
4. **Professional appearance** - Shows good repository hygiene
5. **Easier collaboration** - Team members see what's actually active

## 🎯 Summary

**Status**: 26 branches ready for cleanup  
**Risk Level**: 🟢 None (all merged)  
**Recommended Action**: Delete all 26 branches  
**Time Required**: 5-10 minutes via web interface, or 30 seconds via script

---

**Note**: After deletion, your repository will have just 2 branches:
- `main` (production)
- `copilot/update-readme-versioning` (current work)

This is the ideal state for a project - clean, organized, and easy to manage! 🎉
