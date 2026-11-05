# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: saved-guests.spec.ts >> Saved Guests >> should delete saved guest
- Location: workspace (1)/tests/e2e/saved-guests.spec.ts:45:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Saved Guests')
Expected: visible
Error: strict mode violation: getByText('Saved Guests') resolved to 2 elements:
    1) <h1 class="font-bold text-gray-900">Saved Guests</h1> aka getByRole('heading', { name: 'Saved Guests' })
    2) <p class="text-gray-500 mb-4">No saved guests yet</p> aka getByText('No saved guests yet')

Call log:
  - Expect "toBeVisible" getByText('Saved Guests') with timeout 5000ms
  - waiting for getByText('Saved Guests')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - button [ref=e6]
      - heading "Saved Guests" [level=1] [ref=e9]
  - generic [ref=e10]:
    - paragraph [ref=e11]: Manage your frequent visitors for quick booking
    - paragraph [ref=e16]: No saved guests yet
    - button "Add New Guest" [ref=e17]
```