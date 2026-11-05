# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> Booking Flow >> should copy booking details
- Location: workspace (1)/tests/e2e/booking.spec.ts:39:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[type="radio"]').first()

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - button [ref=e6]
      - heading "Checkout" [level=1] [ref=e9]
  - generic [ref=e11]:
    - generic [ref=e12]:
      - generic [ref=e13]:
        - heading "Booking Summary" [level=2] [ref=e14]
        - generic [ref=e20]:
          - paragraph [ref=e21]: Midrand Estate
          - paragraph [ref=e22]: Cluster A • B-12
        - generic [ref=e23]:
          - generic [ref=e24]: 2026-02-01 → 2026-02-03
          - generic [ref=e27]: 2 days
          - generic [ref=e28]: Instant Book
      - generic [ref=e31]:
        - heading "Select Visitor" [level=2] [ref=e32]
        - button "Add New Guest" [ref=e33]
      - generic [ref=e35]:
        - heading "Payment" [level=2] [ref=e36]
        - generic [ref=e43]:
          - paragraph [ref=e44]: Secured by Paystack
          - paragraph [ref=e45]: Funds held in escrow until booking is completed
    - generic [ref=e47]:
      - heading "Price Breakdown" [level=2] [ref=e48]
      - generic [ref=e49]:
        - generic [ref=e50]:
          - generic [ref=e51]: R150 × 2 days
          - generic [ref=e52]: R300
        - generic [ref=e53]:
          - generic [ref=e54]: Platform fee (15%)
          - generic [ref=e55]: R45
        - generic [ref=e57]:
          - generic [ref=e58]: Total
          - generic [ref=e59]: R300
      - button "Pay R300" [disabled] [ref=e60]
      - paragraph [ref=e63]: ⚡ Instant confirmation
```