# ParkBuddy SA - Complete Function List & User Guide (v1.1.0)

**Version:** 1.1.0  
**Build Date:** 2026-11-05T19:49:55.307Z  
**Production URL:** https://parkbuddy-sa.vercel.app  
**Build Info:** https://parkbuddy-sa.vercel.app/build-info.json  

---

## 📋 Table of Contents

1. [Landing Page](#1-landing-page)
2. [Authentication (Login/Register)](#2-authentication-loginregister)
3. [Forgot Password Flow](#3-forgot-password-flow)
4. [Reset Password Flow](#4-reset-password-flow)
5. [Search Page (Renter)](#5-search-page-renter)
6. [Results Page (Renter)](#6-results-page-renter)
7. [Checkout Page (Renter)](#7-checkout-page-renter)
8. [Success Page (Renter)](#8-success-page-renter)
9. [Renter Dashboard](#9-renter-dashboard)
10. [Saved Guests Page](#10-saved-guests-page)
11. [Host Dashboard](#11-host-dashboard)
12. [Create Listing Wizard](#12-create-listing-wizard)
13. [Global Components](#13-global-components)
14. [Backend API Reference](#14-backend-api-reference)

---

## 1. Landing Page

**URL:** `/` (or `/landing`)

### Visual Elements
| Element | Type | Description |
|---------|------|-------------|
| Hero Section | Static | ParkBuddy SA logo, tagline "Find Parking. List Your Bay." |
| "Find Parking" Button | Button (CTA) | Navigates to Login page with renter role pre-selected |
| "List Your Bay" Button | Button (CTA) | Navigates to Login page with host role pre-selected |
| Feature Cards | Static | 3 cards: Secure Payments, Verified Hosts, Easy Booking |
| Footer | Static | Links, copyright, version info |

### User Flow
1. User arrives at landing page
2. Chooses "Find Parking" (renter) or "List Your Bay" (host)
3. Redirected to Login/Register page with role pre-filled

---

## 2. Authentication (Login/Register)

**URL:** `/login`

### Register Form Fields
| Field | Type | Validation | Required | Purpose |
|-------|------|------------|----------|---------|
| Role Selector | Radio Group | Must select one: Renter / Host / Both | Yes | Determines dashboard access and permissions |
| Full Name | Text Input | Min 2 characters | Yes | Display name on bookings, communications |
| Phone Number | Tel Input | SA format: 10 digits (e.g., 0825550000 or +27825550000) | Yes | Contact for bookings, WhatsApp sharing |
| Email | Email Input | Valid email format | Yes | Login credential, notifications, password reset |
| Password | Password Input | Min 8 characters | Yes | Account security |

### Login Form Fields
| Field | Type | Validation | Required | Purpose |
|-------|------|------------|----------|---------|
| Email | Email Input | Valid email format | Yes | Account identifier |
| Password | Password Input | Min 1 character | Yes | Account authentication |

### Buttons & Actions
| Button | Action | Navigation |
|--------|--------|------------|
| Create Account / Log In | Submit form | On success: role-based dashboard |
| Toggle Show Password | Toggle input type | In-place |
| Forgot Password? | Link | `/forgot-password` |
| Switch to Login/Register | Toggle mode | In-place |
| Demo Account Buttons | Pre-fill credentials | In-place |

### Validation Messages (Real-time)
- **Email:** "Email is required" / "Enter a valid email address"
- **Password:** "Password is required" / "Password must be at least 8 characters"
- **Full Name:** "Full name is required" / "Name must be at least 2 characters"
- **Phone:** "Phone number is required" / "Enter a valid SA phone number (10 digits)" / "Phone number too long"

### Error Handling
- API errors displayed in red banner at top of form
- Field-level errors shown inline below each input (red text + alert icon)
- Errors clear on user input

---

## 3. Forgot Password Flow

**URL:** `/forgot-password`

### Fields
| Field | Type | Validation | Required | Purpose |
|-------|------|------------|----------|---------|
| Email | Email Input | Valid email format | Yes | Identifies account for reset |

### Buttons
| Button | Action |
|--------|--------|
| Send Reset Link | Calls `/api/auth/forgot-password` |
| Back to Login | Navigate to `/login` |

### Behavior
- Always returns success message (prevents email enumeration)
- If account exists, sends reset email via Resend with 1-hour token
- Email contains styled HTML with reset link: `https://parkbuddy-sa.vercel.app/reset-password?token=<token>`

---

## 4. Reset Password Flow

**URL:** `/reset-password?token=<token>`

### Fields
| Field | Type | Validation | Required | Purpose |
|-------|------|------------|----------|---------|
| New Password | Password Input | Min 8 characters | Yes | New account password |
| Confirm Password | Password Input | Must match New Password | Yes | Confirmation |

### Buttons
| Button | Action |
|--------|--------|
| Reset Password | Validates token, hashes password, clears reset token |
| Back to Login | Navigate to `/login` |

### Behavior
- Token validated against `password_reset_token` (SHA-256 hash) and `password_reset_expires` in database
- Token expires after 1 hour
- On success: password updated, reset token cleared, user redirected to login
- On failure: "Invalid or expired reset token" error

---

## 5. Search Page (Renter)

**URL:** `/search` (requires renter role)

### Header Actions
| Element | Type | Action |
|---------|------|--------|
| Logo + "ParkBuddySA" | Brand | Static |
| Dashboard Icon | Button | Navigate to `/renter-dashboard` |
| Saved Guests Icon | Button | Navigate to `/saved-guests` |
| Host Dashboard Icon | Button | Navigate to `/host-dashboard` |
| User Avatar Menu | Dropdown | Log Out / Delete Account |

### Search Form Fields
| Field | Type | Validation | Required | Purpose |
|-------|------|------------|----------|---------|
| Estate Name | Text Input | Free text, autocomplete from mockEstates | No | Filter by specific estate |
| City | Select Dropdown | Predefined: Johannesburg, Pretoria, Cape Town, Durban, Sandton, Stellenbosch | No | Filter by city |
| Check-in Date | Date Input | Must be today or future | No | Booking start date |
| Check-out Date | Date Input | Must be after check-in | No | Booking end date |
| Booking Type | Select Dropdown | All Types / Instant Book / Request | No | Filter by booking type |

### Buttons
| Button | Action |
|--------|--------|
| Search Available Bays | Calls `performSearch()` → navigates to `/results` |
| Map View | Opens Map Selector Modal |
| Popular Estate Quick-picks | 8 buttons, click sets estate filter + searches |

### Map Selector Modal
| Element | Type | Action |
|---------|------|--------|
| Full-screen Satellite Map | Leaflet + Esri | Pan/zoom to explore estates |
| Estate Quick-buttons | Buttons | Click selects estate, closes modal, searches |
| Close (X) | Button | Closes modal |

### Active Bookings Carousel
- Shows horizontally scrollable cards for confirmed/active bookings
- Each card: Guest name, estate, dates, license plate, Cancel button

---

## 6. Results Page (Renter)

**URL:** `/results` (after search)

### Header
- Back button → `/search`
- Title: "Available Bays"

### Listing Cards (One per Result)
| Element | Type | Description |
|---------|------|-------------|
| Satellite Mini-map | MapView (Leaflet) | 200px height, red X marker at bay coordinates |
| Estate Name | Text | Bold, primary identifier |
| Location | Text | Cluster/Street + Bay Number |
| Walk Time | Badge | "X min walk to gate" (from `walk_time_minutes`) |
| Price | Text | "R{price}/day" (green, bold) |
| Booking Type Badge | Badge | "⚡ Instant Book" (green) or "📋 Request" (yellow) |
| Verified Host Badge | Badge | Green check if host verified |
| Rating | Stars + Count | If review_count > 0 |
| Book Now Button | Button | Navigates to `/checkout` with listing selected |

### Empty State
- "No bays found" message with "Adjust Filters" button → back to search

---

## 7. Checkout Page (Renter)

**URL:** `/checkout` (requires selectedListing in context)

### Left Panel: Booking Details

#### Listing Summary Card
| Element | Description |
|---------|-------------|
| Estate Name + Location | Bold + cluster/street + bay number |
| Dates | Check-in → Check-out + day count |
| Booking Type Badge | Instant Book / Request |

#### Select Visitor Section
| Element | Type | Behavior |
|---------|------|----------|
| Saved Guest Radio Cards | Radio Group | Click selects guest, highlights blue |
| Guest Name | Display | From saved_guests |
| Guest Phone | Display | From saved_guests |
| License Plate | Display | From saved_guests |
| "Add New Guest" Button | Button | Expands form below |

#### Add New Guest Form (Expanded)
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Guest Name * | Text | Min 2 chars | Yes |
| Phone Number * | Tel | SA format 10 digits | Yes |
| License Plate * | Text | Min 3 chars | Yes |
| Access Code | Text | Optional | No |

| Button | Action |
|--------|--------|
| Cancel | Collapses form, clears inputs |
| Save Guest | Calls `addSavedGuest()`, auto-selects new guest, collapses form |

#### Payment Card
- Paystack shield badge
- "Funds held in escrow until booking is completed"

### Right Panel: Price Breakdown (Sticky)
| Line Item | Calculation |
|-----------|-------------|
| Daily Rate × Days | `price_per_day × days` |
| Platform Fee (15%) | `totalAmount × 0.15` |
| **Total** | `totalAmount` |

#### Pay Button
| State | Behavior |
|-------|----------|
| No guest selected | Disabled |
| Processing | Spinner + "Processing..." |
| Ready | "Pay R{totalAmount}" |
| Click | → `handlePayment()` |

#### Terms & Conditions Link
- "By paying, you agree to our Terms & Conditions including the 1-hour grace period for bay vacation."
- Click → Opens Terms Modal

### Terms & Conditions Modal
| Section | Key Points |
|---------|------------|
| 1. Booking & Payment | Escrow, 15% fee, instant vs request, refunds before check-in |
| 2. Grace Period & Bay Vacation | **1-hour grace period after end time**, security assistance if exceeded, violations = restrictions |
| 3. Vehicle & Guest Responsibility | Renter liable, registered vehicle only, secure access codes, damage responsibility |
| 4. Cancellation & Refunds | Before check-in: full minus fee; After: no refund; Host cancels: full refund |
| 5. General | Platform only, estate rules apply, SA law governs |

| Element | Behavior |
|---------|----------|
| Checkbox | "I have read and accept the Terms & Conditions" (required) |
| Close Button | Dismisses modal, keeps `acceptedTerms` state |
| Accept & Continue Button | Sets `acceptedTerms=true`, closes modal, enables Pay button |

---

## 8. Success Page (Renter)

**URL:** `/success` (after booking created)

### Header
- Green checkmark circle
- Title: "Booking Confirmed!" (instant) or "Booking Requested!" (request)
- Subtitle with next steps

### Booking Details Card
| Field | Display |
|-------|---------|
| Estate Name + Location | Bold + cluster/street + bay number |
| Dates | Start → End |
| Visitor Name | Guest name |
| Vehicle | License plate + phone |
| Access Code | **Large mono font** in yellow box (if provided) |
| Directions | Blue box with navigation icon (if provided) |
| Total Paid | R{amount} |
| Booking ID | Mono font |

### Send to Visitor Section
| Element | Type | Behavior |
|---------|------|----------|
| Message Textarea | Editable | Pre-filled with all booking details including access code & directions |
| Send via WhatsApp | Link Button | Opens `wa.me/{phone}?text={encoded_message}` |
| Copy Details | Button | Copies message to clipboard, shows "Copied!" for 2s |

### Actions
| Button | Action |
|--------|--------|
| Go to My Dashboard | → `/renter-dashboard` |
| Search for More Parking | → `/search` |
| Cancel Booking | Opens confirmation modal → cancels + refund |

### Cancel Booking Modal
- Warning: "This will cancel the booking... refund processed"
- Keep Booking / Cancel Booking buttons

---

## 9. Renter Dashboard

**URL:** `/renter-dashboard` (requires renter role)

### Header
| Element | Action |
|---------|--------|
| "My Dashboard" Title | Static |
| User Menu (Avatar) | Dropdown: Log Out / Delete Account |
| "Book Parking" Button | → `/search` |

### Tab Navigation (3 Tabs)

#### Tab 1: Upcoming ({count})
| Booking Status | Filter |
|----------------|--------|
| Confirmed, Active | `status === 'confirmed' || status === 'active'` |

**Card Elements:**
- Guest name + status badge (Active=green, Confirmed=blue)
- Estate • Cluster/Street • Bay Number
- Dates + License plate
- Access Code (if exists): Key icon + mono font
- Cancel Button → Confirmation modal

#### Tab 2: Pending ({count})
| Booking Status | Filter |
|----------------|--------|
| Pending | `status === 'pending'` |

**Card Elements:**
- Guest name + "Pending Host Approval" badge (yellow)
- Estate • Cluster/Street • Bay Number
- Dates + License plate
- Info text: "Host will respond shortly. You'll be notified once approved."
- Cancel Button

#### Tab 3: History ({count})
**Sub-sections:**
1. **Completed** (green border)
   - Guest name, estate, dates, amount paid
   - "Completed" badge (green)
2. **Cancelled** (red border)
   - Guest name, estate, dates, amount
   - "Cancelled" badge (red)

### Delete Account Modal (from user menu)
- Red warning icon
- "This action cannot be undone"
- Lists consequences: all bookings, saved guests, history removed
- Cancel / Delete Account buttons

---

## 10. Saved Guests Page

**URL:** `/saved-guests`

### Header
- "Saved Visitors" title
- Back button → `/search` or dashboard

### Empty State
- "No saved visitors yet"
- "Add Your First Visitor" button → expands form

### Guest List (Each Card)
| Field | Display |
|-------|---------|
| Name | Bold |
| Phone | Text |
| License Plate | With car icon |
| Access Code | If exists, with key icon |

### Actions per Guest
| Button | Action |
|--------|--------|
| Edit | Expands inline form (pre-filled) |
| Delete | Confirmation → removes from localStorage |

### Add/Edit Guest Form
| Field | Type | Validation |
|-------|------|------------|
| Guest Name * | Text | Required |
| Phone Number * | Tel | SA format |
| License Plate * | Text | Required |
| Access Code | Text | Optional |

| Button | Action |
|--------|--------|
| Save | Adds to localStorage, refreshes list |
| Cancel | Collapses form |

---

## 11. Host Dashboard

**URL:** `/host-dashboard` (requires host role)

### Header
- "Host Dashboard" title
- User menu: Log Out / Delete Account

### Earnings Overview (3 Cards)
| Card | Calculation |
|------|-------------|
| Total Earnings | Sum of all `host_payout` |
| Pending | Sum where status=pending/confirmed |
| Released | Sum where status=completed |

### Earnings Tabs (3 Tabs)

#### Tab 1: Overview
- Same 3 cards as header but larger

#### Tab 2: History
| Table | Columns |
|-------|---------|
| Monthly Breakdown | Month, Bookings, Total, Pending, Released |
| Weekly Breakdown | Week, Bookings, Total, Pending, Released |

#### Tab 3: By Listing
| Table | Columns |
|-------|---------|
| Per Listing | Listing (Estate + Bay), Bookings, Total, Pending, Released |

### Pending Requests Section
| Booking Status | Filter |
|----------------|--------|
| Pending | `status === 'pending'` |

**Card Actions:**
- Accept Button → Sets status=confirmed, prompts for access code
- Decline Button → Sets status=cancelled
- Each shows: Guest, Estate, Dates, License Plate, Amount

### Active Bookings Section
| Booking Status | Filter |
|----------------|--------|
| Confirmed, Active | `status === 'confirmed' || status === 'active'` |

**Card Actions:**
- Edit Access Code Button → Inline edit
- Complete Button → Sets status=completed, releases payment
- Cancel Button → Sets status=cancelled

### Completed Bookings Section
| Booking Status | Filter |
|----------------|--------|
| Completed | `status === 'completed'` |

- Read-only display with "Completed" badge

### My Listings Section
| Listing Fields | Display |
|----------------|---------|
| Estate + Cluster/Street + Bay | Bold |
| Price | R{price}/day |
| Booking Type | Instant/Request badge |
| Status | Active/Inactive badge |
| Walk Time | "X min walk" |

**Actions:**
- Toggle Active/Inactive
- Delete Listing (confirmation modal)

### Add New Listing Button
- Floating action button → `/create-listing`

---

## 12. Create Listing Wizard (4 Steps)

**URL:** `/create-listing`

### Step 1: Location Details
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Estate | Select | From mockEstates | Yes |
| Cluster/Street | Text | Min 2 chars | Yes |
| Bay Number | Text | Min 1 char | Yes |
| Walk Time (minutes) | Number | Min 1, Max 60 | Yes (default 5) |

**Navigation:** Next → Step 2

### Step 2: Mark Location on Map
| Element | Type | Behavior |
|---------|------|----------|
| Satellite Map | Leaflet MapPicker | Click to place red marker |
| Coordinates Display | Text | Shows lat/lng of marker |
| Zoom Controls | Map built-in | +/- buttons |
| Instructions | Text | "Click on the map to mark the exact parking bay location" |

**Validation:** Must place marker before Next
**Navigation:** Back / Next → Step 3

### Step 3: Pricing & Details
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Price per Day (ZAR) | Number | Min 10 | Yes |
| Booking Type | Radio | Instant Book / Request | Yes (default Instant) |
| Notes | Textarea | Optional | No |
| Directions to Bay | Textarea | Optional | No |

**Navigation:** Back / Next → Step 4

### Step 4: Review & Publish
| Section | Display |
|---------|---------|
| Location Summary | Estate, Cluster, Bay, Walk Time |
| Map Preview | Mini satellite map with marker |
| Pricing | R{price}/day + booking type |
| Notes & Directions | If provided |

| Button | Action |
|--------|--------|
| Back | → Step 3 |
| Publish Listing | Calls `addListing()` → redirects to `/host-dashboard` |

---

## 13. Global Components

### BuildInfoDisplay (Footer on ALL pages)
| Element | Source |
|---------|--------|
| App Name | `build-info.json` → `name` |
| Version | `build-info.json` → `version` |
| Build Date | `build-info.json` → `buildDate` (formatted SAST) |
| Git Commit | `build-info.json` → `gitCommit` (short) |
| Git Branch | `build-info.json` → `gitBranch` |

**Position:** Fixed bottom, backdrop blur, responsive text

### MapView / MapPicker (Leaflet + Esri World Imagery)
- Satellite tile layer: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
- Attribution: Esri, Maxar, Earthstar Geographics
- Markers: Red X for bay location

### Navigation Guards
- Unauthenticated → Landing
- Wrong role for page → Redirect to appropriate dashboard
- No selected listing on checkout → Redirect to results

---

## 14. Backend API Reference

### Base URL: `https://parkbuddy-backend-docker.onrender.com/api`

### Authentication
| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/auth/register` | No | `{email, phone, password, full_name, role}` | `{user, token}` |
| POST | `/auth/login` | No | `{email, password}` | `{user, token}` |
| GET | `/auth/profile` | Yes (JWT) | - | `{user}` |
| DELETE | `/auth/account` | Yes (JWT) | - | `{message}` |
| POST | `/auth/forgot-password` | No | `{email}` | `{message}` |
| POST | `/auth/reset-password` | No | `{token, password}` | `{message}` |

### Listings
| Method | Endpoint | Auth | Body/Params | Response |
|--------|----------|------|-------------|----------|
| GET | `/listings` | No | `?estate&city&booking_type` | `Listing[]` |
| POST | `/listings` | Yes (Host) | Listing data | `Listing` |
| GET | `/listings/:id` | No | - | `Listing` |
| GET | `/listings/host/my-listings` | Yes (Host) | - | `Listing[]` |
| PUT | `/listings/:id` | Yes (Host) | Listing data | `Listing` |
| DELETE | `/listings/:id` | Yes (Host) | - | `{message}` |

### Bookings
| Method | Endpoint | Auth | Body/Params | Response |
|--------|----------|------|-------------|----------|
| POST | `/bookings` | Yes (Renter) | Booking data | `Booking` |
| GET | `/bookings/renter/my-bookings` | Yes (Renter) | - | `Booking[]` |
| GET | `/bookings/host/my-bookings` | Yes (Host) | - | `Booking[]` |
| GET | `/bookings/host/earnings` | Yes (Host) | - | `{total, pending, released}` |
| GET | `/bookings/host/earnings/history` | Yes (Host) | - | `{monthly[], weekly[], byListing[]}` |
| PATCH | `/bookings/:id/status` | Yes (Host) | `{status, access_code?}` | `Booking` |
| POST | `/bookings/:id/cancel` | Yes | - | `Booking` |

### Payments
| Method | Endpoint | Auth | Body/Params | Response |
|--------|----------|------|-------------|----------|
| POST | `/payments/initialize` | Yes | `{booking_id, email}` | `{reference, authorization_url}` |
| GET | `/payments/verify/:ref` | No | - | Payment data |
| POST | `/payments/release/:id` | Yes (Host) | - | Payment |
| POST | `/payments/refund/:id` | Yes | - | Payment |
| GET | `/payments/booking/:id` | Yes | - | Payment |

### Uploads
| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/uploads/id-document` | Yes | FormData: file | `{url}` |
| POST | `/uploads/listing/:id` | Yes (Host) | FormData: file | `{url}` |

---

## 🎯 Quick Reference: User Training Checklist

### For Renters:
- [ ] Register/Login with Renter role
- [ ] Search for parking by estate or city
- [ ] Use Map View to select estate visually
- [ ] Filter by Instant Book vs Request
- [ ] Save frequent guests (name, phone, license plate, access code)
- [ ] Add new guest at checkout → auto-selected
- [ ] Read & accept Terms & Conditions (1-hour grace period!)
- [ ] Pay via Paystack (escrow)
- [ ] Share booking via WhatsApp (editable message)
- [ ] Access dashboard: Upcoming / Pending / History tabs
- [ ] Cancel bookings with refund

### For Hosts:
- [ ] Register/Login with Host role
- [ ] Create listing: 4-step wizard (Location → Map → Price → Review)
- [ ] Mark exact bay on satellite map
- [ ] Set walk time from gate
- [ ] Choose Instant Book or Request
- [ ] Add directions for visitors
- [ ] View earnings: Overview / History / By Listing tabs
- [ ] Accept/Decline requests with access codes
- [ ] Edit access codes on active bookings
- [ ] Mark complete to release payment
- [ ] Toggle listings active/inactive

### For Both Roles:
- [ ] Forgot/Reset password via email
- [ ] Delete account (irreversible)
- [ ] Check footer for version/build info
- [ ] Switch between renter/host dashboards

---

## 📞 Support Contacts

| Issue | Channel |
|-------|---------|
| Payment issues | Paystack dashboard + backend logs |
| Email not received | Check spam, verify Resend logs |
| Map not loading | Check Leaflet/Esri tile availability |
| Build version mismatch | Check `/build-info.json` vs footer |
| Database errors | Supabase dashboard → Logs |

---

**Document Version:** 1.0.1  
**Last Updated:** 2026-11-05  
**For Training Use:** This document covers every button, field, modal, and user flow in ParkBuddy SA v1.0.1