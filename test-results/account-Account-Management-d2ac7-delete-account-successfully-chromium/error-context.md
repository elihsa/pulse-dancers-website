# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: account.spec.ts >> Account Management >> should delete account successfully
- Location: workspace (1)/tests/e2e/account.spec.ts:49:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /delete account/i }).nth(1)

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: ParkBuddySA
      - generic [ref=e13]:
        - button "Saved Guests" [ref=e14]
        - button "Host Dashboard" [ref=e20]
        - button [ref=e27]
  - generic [ref=e31]:
    - generic [ref=e32]:
      - heading "Hi Kagiso 👋" [level=1] [ref=e33]
      - paragraph [ref=e34]: Find parking for your visitors in any estate
    - generic [ref=e35]:
      - heading "Search Parking" [level=2] [ref=e36]
      - generic [ref=e40]:
        - generic [ref=e41]:
          - generic [ref=e42]: Estate Name
          - textbox "e.g. Midrand Estate" [ref=e47]
        - generic [ref=e48]:
          - generic [ref=e49]: City
          - combobox [ref=e54]:
            - option "All Cities" [selected]
            - option "Johannesburg"
            - option "Pretoria"
            - option "Cape Town"
            - option "Durban"
            - option "Sandton"
            - option "Stellenbosch"
      - generic [ref=e55]:
        - generic [ref=e56]:
          - generic [ref=e57]: Check-in Date
          - textbox [ref=e61]
        - generic [ref=e62]:
          - generic [ref=e63]: Check-out Date
          - textbox [ref=e67]
        - generic [ref=e68]:
          - generic [ref=e69]: Booking Type
          - combobox [ref=e73]:
            - option "All Types" [selected]
            - option "⚡ Instant Book"
            - option "📋 Request"
      - button "Search Available Bays" [ref=e74]
    - generic [ref=e78]:
      - heading "Popular Estates" [level=2] [ref=e79]
      - generic [ref=e80]:
        - button [ref=e81]:
          - paragraph [ref=e82]: Midrand Estate
          - paragraph [ref=e83]: Johannesburg
        - button [ref=e84]:
          - paragraph [ref=e85]: Waterkloof Heights
          - paragraph [ref=e86]: Pretoria
        - button [ref=e87]:
          - paragraph [ref=e88]: Stellenbosch Village Estate
          - paragraph [ref=e89]: Stellenbosch
        - button [ref=e90]:
          - paragraph [ref=e91]: Umhlanga Rocks Estate
          - paragraph [ref=e92]: Durban
        - button [ref=e93]:
          - paragraph [ref=e94]: Lonehill Security Park
          - paragraph [ref=e95]: Sandton
        - button [ref=e96]:
          - paragraph [ref=e97]: Val de Vie Estate
          - paragraph [ref=e98]: Paarl
        - button [ref=e99]:
          - paragraph [ref=e100]: Zimbali Coastal Resort
          - paragraph [ref=e101]: Ballito
        - button [ref=e102]:
          - paragraph [ref=e103]: Dainfern Estate
          - paragraph [ref=e104]: Sandton
  - generic [ref=e106]:
    - generic [ref=e112]:
      - heading "Delete Account" [level=3] [ref=e113]
      - paragraph [ref=e114]: This action cannot be undone
    - paragraph [ref=e115]: Are you sure you want to delete your account? All your listings, bookings, and saved guests will be permanently removed.
    - generic [ref=e116]:
      - button "Cancel" [ref=e117]
      - button "Delete Account" [ref=e118]
```