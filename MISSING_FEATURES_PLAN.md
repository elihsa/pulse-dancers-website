# Missing Features Analysis & Implementation Plan

## Current State Summary
- **Backend**: Fully implemented reviews, ID verification, bookings, listings APIs
- **Frontend**: Core booking flow works, but missing key features requested

---

## 1. DIFFERENTIATED SECURITY/VETTING BY LISTING TYPE

### Already Implemented:
- `requires_id_verified_renter` field on listings (CreateListing step 5)
- Backend verification routes (submit ID docs, check status, admin review)
- Booking API checks renter verification for listings that require it
- Listing API requires host verification for residential/garage listings

### MISSING - Frontend:
| Feature | Description | Priority |
|---------|-------------|----------|
| **Verification Page** | User submits ID front, ID back, selfie; shows status (pending/verified/rejected) | HIGH |
| **Verification Status Badge** | Show on listing cards, host profiles, renter profiles | HIGH |
| **Verification Gate on Booking** | If listing requires ID verification and user not verified → redirect to verification page | HIGH |
| **Host Verification Requirement** | Hosts creating residential/garage/event listings must be verified first | HIGH |
| **Estate vs Non-Estate Logic** | Estate bays: no ID required (estate security); Non-estate: ID required | MEDIUM |

---

## 2. RATING/REVIEW SYSTEM

### Already Implemented (Backend):
- POST /api/reviews - submit review after completed booking
- GET /api/reviews/host/:id - host reviews with aggregate
- GET /api/reviews/renter/:id - renter reviews
- GET /api/reviews/listing/:id - listing reviews
- Auto-updates user rating/review_count on review submission

### MISSING - Frontend:
| Feature | Description | Priority |
|---------|-------------|----------|
| **Post-Booking Review Prompt** | After booking completed, prompt both parties to review | HIGH |
| **Review Submission Form** | 5-star + categories (communication, cleanliness, safety, accuracy) + comment | HIGH |
| **Review Display on Listings** | Show reviews on Results page listing cards and Checkout | HIGH |
| **Host Profile Reviews** | Host dashboard shows their reviews | MEDIUM |
| **Renter Profile Reviews** | Renter dashboard shows their reviews | MEDIUM |
| **Review Aggregate Badges** | "4.8 ⭐ (24 reviews)" on listing cards | HIGH |

---

## 3. MAP VIEW OF AVAILABLE PARKING BAYS WITHIN ESTATE

### Current State:
- Search page has "Map View" button → shows estate-level map (MapView component)
- Results page shows individual listing cards with mini satellite map per bay
- MapSelector modal lets user pick estate from map

### MISSING - Estate Bay Map View:
| Feature | Description | Priority |
|---------|-------------|----------|
| **Estate-Level Bay Map** | When searching an estate, show ALL bays in that estate on one map | HIGH |
| **Clickable Bay Markers** | Click bay marker → popup with: Block/Cluster, Bay #, Price, Walk time, Host rating | HIGH |
| **Filter on Map** | Filter by price, instant/request, amenities directly on map | MEDIUM |
| **My Location Integration** | Show user's cluster/block on map to judge convenience | MEDIUM |
| **Visual Cluster/Block Labels** | Estate map should show "Cluster A", "Block B" areas | HIGH |

---

## 4. ADDITIONAL MISSING FROM SPEC/ROADMAP

| Feature | Description | Priority |
|---------|-------------|----------|
| **ID Verification Status in User Menu** | Show verification badge in header user dropdown | MEDIUM |
| **Host Guarantee Info Display** | Show R50k coverage badge on verified listings | LOW |
| **Booking Deposit Display** | Show deposit amount on checkout if applicable | MEDIUM |
| **Emergency Contact Button** | During active booking, one-tap emergency | LOW |

---

## IMPLEMENTATION ORDER (Recommended)

### Phase 1: Verification System (Foundation)
1. Create `VerificationPage.tsx` - submit ID docs, view status
2. Add verification status to user context (fetch on login)
3. Add verification check in Checkout for listings requiring it
4. Add verification requirement check in CreateListing for hosts
5. Show verification badges on listings, profiles, header

### Phase 2: Review System
1. Create `ReviewPrompt` component - shows after booking completed
2. Create `ReviewForm` component - 5 stars + categories + comment
3. Add review display to Results page listing cards
4. Add reviews section to Checkout page
5. Add reviews to Host/Renter dashboards

### Phase 3: Estate Bay Map View
1. Create `EstateBayMap` component - shows all bays in estate
2. Integrate into Results page (toggle list/map view)
3. Add clickable markers with popup details
4. Add cluster/block visual indicators

### Phase 4: Polish & Integration
1. Wire up all verification gates
2. Add review prompts to success flow
3. Test complete flows
4. Update tests

---

## FILES TO CREATE/MODIFY

### New Files:
- `src/pages/renter/Verification.tsx` - ID verification page
- `src/components/ReviewPrompt.tsx` - Post-booking review prompt
- `src/components/ReviewForm.tsx` - Review submission form
- `src/components/ReviewDisplay.tsx` - Display reviews
- `src/components/EstateBayMap.tsx` - Estate-level bay map view
- `src/services/verificationAPI.ts` - Verification API calls
- `src/services/reviewsAPI.ts` - Reviews API calls

### Modified Files:
- `src/context/AppContext.tsx` - Add verification state, review functions
- `src/pages/renter/Checkout.tsx` - Verification gate, review display
- `src/pages/renter/Results.tsx` - Add map view toggle, review badges
- `src/pages/host/CreateListing.tsx` - Host verification check
- `src/pages/renter/Search.tsx` - Verification status in user menu
- `src/pages/renter/RenterDashboard.tsx` - Reviews section
- `src/pages/host/HostDashboard.tsx` - Reviews section
- `src/services/api.ts` - Add verification & reviews API

---

## VERIFICATION LOGIC SUMMARY

```
ESTATE BAY LISTINGS:
- Host: No ID verification required to list
- Renter: No ID verification required to book
- Security: Managed by estate

RESIDENTIAL DRIVEWAY / GARAGE / COMMERCIAL LOT / EVENT PARKING:
- Host: MUST be ID verified to list
- Renter: MUST be ID verified to book (if host sets requires_id_verified_renter)
- Security: Platform-managed via ID verification + reviews
```

---

## TESTING CHECKLIST

- [ ] Unverified renter tries to book residential listing → redirected to verification
- [ ] Verified renter books residential listing → works
- [ ] Unverified host tries to create residential listing → blocked
- [ ] Verified host creates residential listing → works
- [ ] Estate bay booking works without verification for anyone
- [ ] After completed booking, both parties see review prompt
- [ ] Reviews submit and display correctly
- [ ] Estate bay map shows all bays, clickable with popups
- [ ] User's cluster shown on map for convenience