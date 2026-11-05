# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: host.spec.ts >> Host Features >> should create new listing with all steps
- Location: workspace (1)/tests/e2e/host.spec.ts:20:3

# Error details

```
Error: locator.selectOption: options[0].label: expected string, got object
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - button [ref=e6]
      - heading "Create Listing" [level=1] [ref=e9]
  - generic [ref=e10]:
    - generic [ref=e11]:
      - generic [ref=e12]: "1"
      - generic [ref=e14]: "2"
      - generic [ref=e16]: "3"
      - generic [ref=e18]: "4"
    - generic [ref=e20]:
      - heading "Location Details" [level=2] [ref=e21]
      - generic [ref=e22]:
        - generic [ref=e23]: Estate *
        - combobox [ref=e28]:
          - option "Select your estate" [selected]
          - option "Midrand Estate - Johannesburg"
          - option "Waterkloof Heights - Pretoria"
          - option "Stellenbosch Village Estate - Stellenbosch"
          - option "Umhlanga Rocks Estate - Durban"
          - option "Lonehill Security Park - Sandton"
          - option "Val de Vie Estate - Paarl"
          - option "Zimbali Coastal Resort - Ballito"
          - option "Dainfern Estate - Sandton"
      - generic [ref=e29]:
        - generic [ref=e30]: Cluster or Street Name *
        - textbox "e.g. Cluster A, Block 3, Oak Street" [ref=e31]
      - generic [ref=e32]:
        - generic [ref=e33]: Bay Number *
        - textbox "e.g. Bay 14" [ref=e38]
      - generic [ref=e39]:
        - generic [ref=e40]: Walk Time to Gate (minutes)
        - spinbutton [ref=e41]: "3"
      - button "Continue to Map" [disabled] [ref=e42]
```