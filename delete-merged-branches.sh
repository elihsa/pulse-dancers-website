#!/bin/bash
# Script to delete all 26 merged branches from GitHub
# These branches have all been successfully merged into main

echo "🗑️  Deleting 26 merged branches from GitHub..."
echo ""

# Array of branches to delete
branches=(
  "copilot/add-netlify-functions-booking"
  "copilot/center-google-forms-embed"
  "copilot/cleanup-netlify-files"
  "copilot/create-google-sheets-template"
  "copilot/fix-booking-form-and-cms-data"
  "copilot/fix-cms-functionality-issues"
  "copilot/fix-cms-google-sheet-issue"
  "copilot/fix-cms-integration-issues"
  "copilot/fix-cms-issues"
  "copilot/fix-google-sheets-integration"
  "copilot/fix-hardcoded-text-issue"
  "copilot/fix-instagram-facebook-embeds"
  "copilot/fix-issues-on-website-pages"
  "copilot/fix-join-and-review-forms"
  "copilot/fix-meet-the-guys-page"
  "copilot/fix-testimonials-and-forms"
  "copilot/fix-testimonials-forms-errors"
  "copilot/populate-google-sheets-cms"
  "copilot/remove-form-background"
  "copilot/remove-unnecessary-files"
  "copilot/swap-navigation-pages-add-social-media"
  "copilot/switch-back-to-jotform"
  "copilot/switch-back-to-jotform-again"
  "copilot/update-booking-form-ui"
  "copilot/update-join-and-contact-html"
  "copilot/update-website-with-cms"
)

# Delete each branch
success_count=0
fail_count=0

for branch in "${branches[@]}"; do
  echo "Deleting: $branch"
  if git push origin --delete "$branch" 2>&1; then
    ((success_count++))
    echo "✅ Deleted: $branch"
  else
    ((fail_count++))
    echo "❌ Failed: $branch"
  fi
  echo ""
done

echo "================================"
echo "Branch Cleanup Summary:"
echo "✅ Successfully deleted: $success_count branches"
echo "❌ Failed to delete: $fail_count branches"
echo "================================"

if [ $fail_count -eq 0 ]; then
  echo "🎉 All branches cleaned up successfully!"
else
  echo "⚠️  Some branches failed to delete. Check the output above."
fi
