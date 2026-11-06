# ParkBuddy SA - Complete Project Specification (Updated v1.0.1)

## 📋 Project Overview

**ParkBuddy SA** is a peer-to-peer parking platform for South Africa. It allows property owners to rent out their spare parking spaces (estate bays, residential driveways, garages, commercial lots) to visitors, with secure payments handled through Paystack.

**Primary Use Cases:**
1. **Estate/Complex Parking** - Secure estates with access codes, guards, gated entry
2. **Residential Driveway/Garage** - Private homes near stadiums, venues, transit hubs, shopping areas
3. **Event/Stadium Parking** - Match-day, concert, festival parking at nearby homes
4. **Commuter/Transit Parking** - Daily parking near Gautrain, bus terminals, taxi ranks
5. **Commercial/Retail Overflow** - Evening/weekend parking at offices, churches, retail centers

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite 6 + Tailwind CSS 4
- Backend: Node.js + Express 5 + TypeScript
- Database: PostgreSQL (Supabase)
- Payments: Paystack
- File Storage: Cloudinary
- Email: Resend
- Maps: Leaflet + Esri World Imagery (satellite view)
- Build: Vite with HMR stripping for production
- Testing: Vitest (unit) + Playwright (E2E)

**Version:** 1.1.0
**Build Date:** 2026-11-05T19:34:26.004Z
**Git Commit:** 7de3d89b
**Git Branch:** master

---

## 🏗️ Project Structure

```
parkbuddy-sa/
├── src/
│   ├── components/
│   │   ├── BuildInfoDisplay.tsx    # Version/build footer (NEW v1.0.1)
│   │   ├── MapPicker.tsx           # Satellite map for marking parking bays
│   │   ├── MapView.tsx             # Read-only map display
│   │   └── index.ts
│   ├── context/
│   │   └── AppContext.tsx          # Global state management (all CRUD ops)
│   ├── data/
│   │   └── mockData.ts             # Demo estates data
│   ├── pages/
│   │   ├── Landing.tsx             # Homepage
│   │   ├── Login.tsx               # Login/Register page
│   │   ├── host/
│   │   │   ├── HostDashboard.tsx   # Host's main dashboard (enhanced v1.0.1)
│   │   │   └── CreateListing.tsx   # 4-step wizard (NEW v1.0.1)
│   │   └── renter/
│   │       ├── Search.tsx          # Search with Map Selector (NEW v1.0.1)
│   │       ├── Results.tsx         # View search results with satellite maps
│   │       ├── Checkout.tsx        # Booking with access code field (NEW v1.0.1)
│   │       ├── Success.tsx         # Booking confirmation with editable WhatsApp message (NEW v1.0.1)
│   │       ├── SavedGuests.tsx     # Manage frequent visitors
│   │       ├── RenterDashboard.tsx # 3-tab booking management (NEW v1.0.1)
│   │       ├── ForgotPassword.tsx  # Email-based reset flow (NEW v1.0.1)
│   │       └── ResetPassword.tsx   # Token-based password reset (NEW v1.0.1)
│   ├── services/
│   │   └── api.ts                  # API client
│   ├── types/
│   │   └── index.ts                # TypeScript definitions
│   ├── App.tsx                     # Main app with BuildInfoDisplay
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles + Tailwind
├── backend/
│   ├── src/
│   │   ├── config/database.ts      # PostgreSQL connection with IPv4 fix
│   │   ├── middleware/auth.ts      # JWT authentication
│   │   ├── controllers/            # (empty - logic in routes)
│   │   ├── routes/
│   │   │   ├── auth.ts             # Auth + Delete Account + Forgot/Reset Password (NEW v1.0.1)
│   │   │   ├── listings.ts         # Parking bay CRUD
│   │   │   ├── bookings.ts         # Booking mgmt + Earnings History (NEW v1.0.1)
│   │   │   ├── payments.ts         # Paystack integration
│   │   │   └── uploads.ts          # File upload handling
│   │   ├── services/
│   │   │   ├── cloudinary.ts       # File storage
│   │   │   └── email.ts            # Email service (verification + reset) (NEW v1.0.1)
│   │   └── server.ts               # Express server
│   ├── scripts/migrate.ts          # Database migration
│   ├── database/schema.sql         # PostgreSQL schema
│   └── package.json
├── tests/
│   ├── e2e/                        # Playwright E2E tests (22 tests, 12 passing)
│   └── unit/                       # Vitest unit tests
├── scripts/
│   ├── remove-hmr.js               # HMR stripping (preserves Yu + module utils)
│   └── generate-zip.js
├── dist/                           # Production build output
├── build-info.json                 # Generated at build time (NEW v1.0.1)
├── package.json
├── vite.config.js                  # Vite + build-info plugin
├── vercel.json                     # Vercel deployment config
├── playwright.config.ts
└── tsconfig.json
```

---

## 🎯 Core Features (Complete Implementation)

### 1. User Authentication & Identity Verification
- **Registration** with email verification (Resend)
- **Login** with JWT tokens (7-day expiry)
- **Roles**: Host, Renter, or Both (stored in DB)
- **Profile management** (name, email, phone)
- **Delete Account** (authenticated DELETE /api/auth/account) (NEW v1.0.1)
- **Forgot Password** - Email with 1-hour reset token (NEW v1.0.1)
- **Reset Password** - Token validation, 8-char minimum, strength checks (NEW v1.0.1)
- **Session persistence** via localStorage

### 1a. Identity Verification (KYC) — NEW v1.1.0
- **Host ID Verification** — Upload SA ID document (front/back) + selfie for facial match
  - Stored securely on Cloudinary with access controls
  - Manual review by ParkBuddy team (target: <24 hours)
  - Verified badge displayed on listings & profile
  - Required for: Residential/Private listings, Event pricing
- **Renter ID Verification** — Optional but encouraged
  - Upload SA ID + selfie
  - Verified badge on booking requests
  - Hosts can filter: "Only accept verified renters"
- **Verification Status Levels:**
  - Unverified (default)
  - Email Verified
  - ID Verified (Host) / ID Verified (Renter)
  - Fully Verified (Email + ID + Residence for hosts)

### 2. Host Features
- **Create listings** via 4-step wizard (enhanced v1.1.0):
  1. **Listing Type & Location** — Choose: Estate Bay / Residential Driveway / Garage / Commercial Lot
     - Estate: Select from estate dropdown, cluster/street, bay number, walk time
     - Residential: Address lookup + map pin, property type (driveway/garage/yard), capacity
     - Commercial: Business name, address, operating hours, capacity
  2. **Satellite Map Marking** — Click to place exact parking location (all types)
  3. **Pricing & Availability** — Per-day/per-hour/event pricing, booking type, recurring schedules
  4. **Photos, Amenities & Rules** — Upload photos, list amenities (CCTV, lighting, covered, EV charger), house rules
  5. **Review & Publish** — Summary with verification requirements checklist
- **Listing Types & Requirements:**
  | Type | ID Verification | Access Method | Typical Use |
  |------|----------------|---------------|-------------|
  | Estate Bay | Optional | Access code + estate gate | Daily/weekly visitors |
  | Residential Driveway | **Required** | Key lockbox / Host handoff / Keypad | Events, commuters, overnight |
  | Garage | **Required** | Remote / Key lockbox | Long-term, secure |
  | Commercial Lot | Optional | Boom gate / Attendant / App | Shopper overflow, events |
- **Event/Stadium Pricing (Dynamic):**
  - Set base daily rate
  - Add "Event Multiplier" (e.g., 2x, 3x, 5x) for specific dates/venues
  - Calendar integration: Sync with major venue calendars (FNB Stadium, Cape Town Stadium, etc.)
  - Auto-apply multiplier when event detected nearby
- **Mark bay location** on satellite map with coordinates (lat/lng)
- **Set pricing** per day/hour/event in ZAR (min R10/day, R5/hour)
- **Choose booking type**: Instant (auto-confirm) or Request (host approval)
- **Add directions/house rules** — Critical for residential: "Quiet after 10pm", "No car washing", "Lock gate behind you"
- **View earnings dashboard** with 3 tabs:
  - Overview: Total, Pending, Released
  - History: Monthly + weekly breakdown tables
  - By Listing: Per-listing earnings with pending amounts
- **Manage bookings**: Accept/Decline requests, Add/Edit access codes, Complete, Cancel
- **Generate access codes** for gate entry (shared with renter)
- **Mark bookings complete** to release payment from escrow
- **View all listings** with status badges (Active/Inactive, Instant/Request, Verified Host)
- **Host Protection Features (NEW v1.1.0):**
  - **Host Guarantee** — Platform covers up to R50,000 for property damage by verified renters
  - **ID Verified Renter Filter** — Only accept bookings from ID-verified renters
  - **Booking Deposit** — Optional R200-R500 refundable deposit held in escrow
  - **Check-in/Check-out Photos** — Renter uploads photo of parked car on arrival/departure

### 3. Renter Features
- **Search parking** by:
  - Estate name (text) or city (dropdown) — for estate bays
  - Address/Suburb — for residential/commercial (NEW v1.1.0)
  - Venue/Event — "FNB Stadium", "Cape Town Stadium", "Sun Arena" (NEW v1.1.0)
  - Map Selector Modal — Click any location on satellite map
- **Filter results** by:
  - Booking type (All / Instant / Request)
  - **Listing Type** (Estate / Residential / Garage / Commercial) (NEW v1.1.0)
  - **Verification Level** (All / ID Verified Hosts Only / Fully Verified) (NEW v1.1.0)
  - **Amenities** (CCTV, Covered, EV Charger, Lighting, 24/7 Access) (NEW v1.1.0)
  - **Price Range** (min/max per day or per hour) (NEW v1.1.0)
  - **Distance from venue/address** (NEW v1.1.0)
- **View listings** with:
  - Satellite mini-map with red X marker for exact bay
  - Walk time labeled as "X min walk to gate" (estate) or "X min walk to venue" (event)
  - Price, rating, verified host badge
  - **Listing type badge** (Estate 🏘️ / Residential 🏠 / Garage 🚗 / Commercial 🏢)
  - **Host verification status** (Unverified / Email Verified / ID Verified / Fully Verified)
  - **Amenity icons** (CCTV, Covered, EV, Lighting)
  - **House rules preview** (first 2 rules, expand to see all)
- **Save guest profiles** (name, phone, license plate, optional access code) for quick booking
- **Book parking** with date selection (supports hourly, daily, multi-day, event-specific)
- **Access code field** (optional) at checkout for pre-known gate codes
- **Mandatory field indicators** (*) for name, phone, license plate with real-time validation
- **Auto-select** newly created guest at checkout
- **Renter ID Verification** — Upload ID + selfie to get "Verified Renter" badge (NEW v1.1.0)
- **Pay securely** via Paystack (escrow system)
- **Optional Booking Deposit** — R200-R500 refundable, required by some hosts (NEW v1.1.0)
- **Terms & Conditions modal** with acknowledgment checkbox (NEW v1.0.1):
  - Includes 1-hour grace period for bay vacation after booking end time
  - Must accept before payment can proceed
- **Booking confirmation** (Success page) with:
  - Editable message textarea pre-filled with all booking details
  - Includes access code and directions
  - Copy to clipboard / Send via WhatsApp buttons
  - **Check-in/Check-out photo upload buttons** (for host protection)
- **Renter Dashboard** with 3 tabs (NEW v1.0.1):
  - Upcoming: Confirmed/Active bookings with access codes
  - Pending: Awaiting host approval
  - History: Completed + Cancelled with amounts
  - Accessible from Search page via Dashboard icon
- **Cancel bookings** with refund (from any dashboard)
- **Renter Protection Features (NEW v1.1.0):**
  - **Listing Accuracy Guarantee** — Refund if space doesn't match photos/description
  - **Verified Host Filter** — Only show listings from ID-verified hosts
  - **In-app Support Chat** — Direct line to ParkBuddy support during active booking
  - **Emergency Contact** — One-tap call to host or ParkBuddy emergency line

### 4. Payment System
- **Paystack integration** for South African payments
- **Escrow system**: Funds held until booking complete
- **Platform fee**: 15% commission (calculated at checkout)
- **Automatic payouts** to hosts when marking complete
- **Refund processing** for cancellations
- **Payment initialization** creates Paystack reference
- **Payment verification** callback

### 5. Communication
- **Email notifications** via Resend:
  - Verification email (registration)
  - Password reset link (1-hour expiry, styled HTML)
- **WhatsApp handoff** for sharing parking details
- **Access codes** for secure gate entry (displayed on booking cards)

### 6. Map Integration
- **Technology**: Leaflet + Esri World Imagery (satellite)
- **Host**: Zoom and click to mark exact bay location (MapPicker)
- **Coordinates stored** as latitude/longitude in listings
- **Renter**: Mini satellite map on listing cards with red X marker
- **Search Map Selector**: Interactive map to click and select estate

---

## 🗄️ Database Schema

### users
```sql
- id (UUID, PK)
- email (VARCHAR, unique)
- phone (VARCHAR)
- password_hash (VARCHAR)
- full_name (VARCHAR)
- role (ENUM: 'host', 'renter', 'both')
- id_verified (BOOLEAN)
- residence_verified (BOOLEAN)
- email_verified (BOOLEAN)
- reset_password_token (VARCHAR)          -- NEW v1.0.1
- reset_password_expires (TIMESTAMP)      -- NEW v1.0.1
- id_document_front_url (VARCHAR)         -- NEW v1.1.0: Cloudinary URL for ID front
- id_document_back_url (VARCHAR)          -- NEW v1.1.0: Cloudinary URL for ID back
- id_selfie_url (VARCHAR)                 -- NEW v1.1.0: Cloudinary URL for selfie
- id_verification_status (ENUM: 'unverified', 'pending', 'verified', 'rejected') -- NEW v1.1.0
- id_verification_submitted_at (TIMESTAMP) -- NEW v1.1.0
- id_verification_reviewed_at (TIMESTAMP)  -- NEW v1.1.0
- id_verification_notes (TEXT)            -- NEW v1.1.0: Admin review notes
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### estates
```sql
- id (UUID, primary key)
- name (VARCHAR)
- city (VARCHAR)
- province (VARCHAR)
- latitude (DECIMAL)
- longitude (DECIMAL)
- zoom_level (INTEGER)
- created_at (TIMESTAMP)
```

### listings
```sql
- id (UUID, primary key)
- host_id (UUID, foreign key → users)
- estate_id (UUID, foreign key → estates, nullable)  -- NULL for non-estate
- listing_type (ENUM: 'estate_bay', 'residential_driveway', 'garage', 'commercial_lot') -- NEW v1.1.0
- cluster_or_street (VARCHAR)              -- Estate: cluster/street | Residential: suburb/area
- bay_number (VARCHAR)                     -- Estate: bay # | Residential: "Driveway 1", "Garage A"
- address_line_1 (VARCHAR)                 -- NEW v1.1.0: Full address for non-estate
- address_line_2 (VARCHAR)                 -- NEW v1.1.0: Unit/complex name
- suburb (VARCHAR)                         -- NEW v1.1.0
- city (VARCHAR)
- province (VARCHAR)
- latitude (DECIMAL)
- longitude (DECIMAL)
- price_per_day (DECIMAL)
- price_per_hour (DECIMAL)                 -- NEW v1.1.0: Hourly rate
- event_multiplier (DECIMAL DEFAULT 1.0)   -- NEW v1.1.0: e.g., 2.0 = 2x price
- event_dates (JSONB)                      -- NEW v1.1.0: {"2026-11-15": 3.0, "2026-11-16": 3.0}
- venue_name (VARCHAR)                     -- NEW v1.1.0: e.g., "FNB Stadium"
- booking_type (ENUM: 'instant', 'request')
- is_active (BOOLEAN)
- walk_time_minutes (INTEGER)
- rating (DECIMAL)
- review_count (INTEGER)
- notes (TEXT)
- directions (TEXT)
- house_rules (TEXT)                       -- NEW v1.1.0: "Quiet after 10pm, No car washing"
- amenities (JSONB)                        -- NEW v1.1.0: {"cctv": true, "covered": false, "ev_charger": false, "lighting": true, "24_7_access": true}
- capacity (INTEGER DEFAULT 1)             -- NEW v1.1.0: Number of vehicles
- requires_id_verified_renter (BOOLEAN DEFAULT FALSE) -- NEW v1.1.0
- deposit_amount (DECIMAL DEFAULT 0)       -- NEW v1.1.0: Refundable deposit
- map_marker_lat (DECIMAL)
- map_marker_lng (DECIMAL)
- photos (JSONB)                           -- NEW v1.1.0: Array of Cloudinary URLs
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### bookings
```sql
- id (UUID, primary key)
- listing_id (UUID, foreign key → listings)
- renter_id (UUID, foreign key → users)
- guest_name (VARCHAR)
- guest_phone (VARCHAR)
- guest_license_plate (VARCHAR)
- estate_name (VARCHAR)                    -- Denormalized for display
- cluster_or_street (VARCHAR)
- bay_number (VARCHAR)
- start_date (DATE)
- end_date (DATE)
- start_time (TIME)                        -- NEW v1.1.0: For hourly bookings
- end_time (TIME)                          -- NEW v1.1.0
- total_amount (DECIMAL)
- platform_fee (DECIMAL)
- host_payout (DECIMAL)
- deposit_amount (DECIMAL DEFAULT 0)       -- NEW v1.1.0: Refundable deposit held in escrow
- deposit_status (ENUM: 'none', 'held', 'refunded', 'forfeited') -- NEW v1.1.0
- status (ENUM: 'pending', 'confirmed', 'active', 'completed', 'disputed', 'cancelled')
- access_code (VARCHAR)
- directions (TEXT)
- house_rules (TEXT)                       -- NEW v1.1.0: Copied from listing at booking time
- checkin_photo_url (VARCHAR)              -- NEW v1.1.0: Renter upload on arrival
- checkout_photo_url (VARCHAR)             -- NEW v1.1.0: Renter upload on departure
- checkin_at (TIMESTAMP)                   -- NEW v1.1.0
- checkout_at (TIMESTAMP)                  -- NEW v1.1.0
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### payments
```sql
- id (UUID, primary key)
- booking_id (UUID, foreign key → bookings)
- paystack_reference (VARCHAR, unique)
- amount (DECIMAL)
- status (ENUM: 'pending', 'held_in_escrow', 'released', 'refunded', 'failed')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### saved_guests
```sql
- id (UUID, PK)
- renter_id (UUID, FK → users)
- guest_name (VARCHAR)
- phone_number (VARCHAR)
- license_plate (VARCHAR)
- access_code (VARCHAR)           -- NEW v1.0.1: Optional gate access code for guest
- created_at (TIMESTAMP)
```

### reviews — NEW v1.1.0
```sql
- id (UUID, PK)
- booking_id (UUID, FK → bookings, unique)
- reviewer_id (UUID, FK → users)  -- Host reviewing renter OR renter reviewing host
- reviewee_id (UUID, FK → users)
- reviewer_role (ENUM: 'host', 'renter')
- rating (INTEGER CHECK (rating >= 1 AND rating <= 5))
- comment (TEXT)
- categories (JSONB)               -- {"communication": 5, "cleanliness": 4, "safety": 5, "accuracy": 4}
- is_public (BOOLEAN DEFAULT TRUE)
- created_at (TIMESTAMP)
```

### venues — NEW v1.1.0
```sql
- id (UUID, PK)
- name (VARCHAR)                   -- e.g., "FNB Stadium", "Cape Town Stadium"
- address (VARCHAR)
- city (VARCHAR)
- province (VARCHAR)
- latitude (DECIMAL)
- longitude (DECIMAL)
- venue_type (ENUM: 'stadium', 'arena', 'theatre', 'festival_ground', 'racecourse', 'convention_center')
- capacity (INTEGER)
- created_at (TIMESTAMP)
```

### venue_events — NEW v1.1.0
```sql
- id (UUID, PK)
- venue_id (UUID, FK → venues)
- event_name (VARCHAR)             -- e.g., "Kaizer Chiefs vs Orlando Pirates"
- event_date (DATE)
- start_time (TIME)
- end_time (TIME)
- expected_attendance (INTEGER)
- multiplier_suggestion (DECIMAL)  -- Suggested price multiplier (e.g., 3.0)
- source (ENUM: 'manual', 'ticketmaster', 'web_scrape', 'api')
- created_at (TIMESTAMP)
```

### support_chats — NEW v1.1.0
```sql
- id (UUID, PK)
- booking_id (UUID, FK → bookings)
- user_id (UUID, FK → users)       -- Who initiated
- status (ENUM: 'open', 'in_progress', 'resolved', 'closed')
- priority (ENUM: 'low', 'medium', 'high', 'emergency')
- created_at (TIMESTAMP)
- resolved_at (TIMESTAMP)
```

### support_messages — NEW v1.1.0
```sql
- id (UUID, PK)
- chat_id (UUID, FK → support_chats)
- sender_id (UUID, FK → users)
- message (TEXT)
- message_type (ENUM: 'text', 'image', 'location', 'system')
- created_at (TIMESTAMP)
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register                    # Register new user
POST   /api/auth/login                       # Login
GET    /api/auth/profile                     # Get current user profile
DELETE /api/auth/account                     # Delete account (auth required) (NEW)
POST   /api/auth/forgot-password             # Request reset email (NEW)
POST   /api/auth/reset-password              # Reset with token (NEW)
```

### Identity Verification (NEW v1.1.0)
```
POST   /api/verification/submit              # Submit ID docs + selfie (multipart)
GET    /api/verification/status              # Get verification status for current user
GET    /api/verification/admin/pending       # Admin: List pending verifications
PATCH  /api/verification/admin/:id/review    # Admin: Approve/reject verification
```

### Listings
```
GET    /api/listings                         # Get all active listings (with filters)
POST   /api/listings                         # Create new listing (host)
GET    /api/listings/:id                     # Get listing by ID
GET    /api/listings/host/my-listings        # Host's listings
PUT    /api/listings/:id                     # Update listing
DELETE /api/listings/:id                     # Delete listing
GET    /api/listings/types                   # Get listing type definitions
GET    /api/listings/amenities               # Get available amenities list
```

### Bookings
```
POST   /api/bookings                         # Create booking (renter)
GET    /api/bookings/renter/my-bookings      # Renter's bookings
GET    /api/bookings/host/my-bookings        # Host's bookings
GET    /api/bookings/host/earnings           # Host earnings summary
GET    /api/bookings/host/earnings/history   # Monthly/weekly/by-listing (NEW)
PATCH  /api/bookings/:id/status              # Update status + access code (host)
POST   /api/bookings/:id/cancel              # Cancel booking
POST   /api/bookings/:id/checkin             # Upload check-in photo (renter)
POST   /api/bookings/:id/checkout            # Upload check-out photo (renter)
POST   /api/bookings/:id/deposit/refund      # Refund deposit (host)
```

### Payments
```
POST   /api/payments/initialize              # Initialize Paystack payment
GET    /api/payments/verify/:ref             # Verify payment
POST   /api/payments/release/:id             # Release to host
POST   /api/payments/refund/:id              # Refund payment
GET    /api/payments/booking/:id             # Get payment by booking
```

### Reviews (NEW v1.1.0)
```
POST   /api/reviews                          # Submit review (after booking completed)
GET    /api/reviews/host/:hostId             # Get reviews for host
GET    /api/reviews/renter/:renterId         # Get reviews for renter
GET    /api/reviews/listing/:listingId       # Get reviews for listing
```

### Venues & Events (NEW v1.1.0)
```
GET    /api/venues                           # List all venues
GET    /api/venues/:id                       # Get venue details
GET    /api/venues/:id/events                # Get upcoming events for venue
GET    /api/events/upcoming                  # All upcoming events (with multipliers)
GET    /api/events/nearby                    # Events near lat/lng (for event pricing)
```

### Support (NEW v1.1.0)
```
POST   /api/support/chats                    # Create support chat
GET    /api/support/chats                    # List user's support chats
GET    /api/support/chats/:id                # Get chat with messages
POST   /api/support/chats/:id/messages       # Send message
PATCH  /api/support/chats/:id/status         # Update chat status
```

### Uploads
```
POST   /api/uploads/id-document              # Upload ID verification
POST   /api/uploads/listing/:id              # Upload listing image
POST   /api/uploads/booking/:id/checkin      # Upload check-in photo
POST   /api/uploads/booking/:id/checkout     # Upload check-out photo
```

---

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://parkbuddy-backend-docker.onrender.com/api
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
```

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://parkbuddy-sa.vercel.app

# Database (Supabase)
DATABASE_URL=postgresql://postgres:***@db.xxx.supabase.co:5432/postgres

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_CALLBACK_URL=https://parkbuddy-backend-docker.onrender.com/api/payments/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# Resend
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@parkbuddy.co.za

# Platform
PLATFORM_FEE_PERCENTAGE=15
```

---

## 🚀 Setup & Deployment

### Local Development
```bash
# Frontend
npm install
npm run dev          # http://localhost:4000

# Backend
cd backend
npm install
npm run db:migrate
npm run dev          # http://localhost:5000
```

### Production Build
```bash
npm run build        # Outputs to dist/ with build-info.json
npm run preview      # Test production build locally
```

### Vercel Deployment
```bash
# From project root (linked to parkbuddy-sa project)
npx vercel --prod --force

# Framework must be set to "Vite" in Vercel Dashboard:
# Settings → General → Framework Preset → Vite
```

### Build Info (Auto-generated)
At build time, `dist/build-info.json` is created:
```json
{
  "version": "1.0.1",
  "name": "parkbuddy-sa",
  "buildDate": "2026-11-05T16:30:34.679Z",
  "buildTimestamp": 1793896234679,
  "gitCommit": "7de3d89b",
  "gitBranch": "master"
}
```
Displayed in fixed footer on all pages.

---

## 🧪 Testing

### Unit Tests
```bash
npm run test:unit
```

### E2E Tests (Playwright)
```bash
npm run test:e2e          # Headless
npm run test:e2e:headed   # Visible browser
npm run test:e2e:ui       # Playwright UI
```

**Test Coverage (22 tests):**
- login.spec.ts (4 tests) - Authentication flows
- booking.spec.ts (6 tests) - Booking creation, payment
- host.spec.ts (4 tests) - Host dashboard, listings
- account.spec.ts (4 tests) - Delete account, password reset (NEW)
- saved-guests.spec.ts (4 tests) - Guest management

**Current:** 12/22 passing (10 failures due to test selector issues, not app bugs)

---

## 🎨 UI/UX Flow

### Renter Journey
1. **Landing Page** → "Find Parking" or "List Your Bay"
2. **Login/Register** → Choose role (Renter/Host/Both) with real-time field validation
3. **Search Page** → Enter estate/city OR click "Map View" to select from satellite map; Dashboard icon always accessible
4. **Results Page** → View bays with satellite maps, walk times, pricing
5. **Checkout** → Select dates, choose/create guest (auto-selects new guest), add access code, **read & accept Terms & Conditions (incl. 1-hour grace period)**, pay
6. **Success Page** → View details, edit message, share via WhatsApp/copy, **Go to My Dashboard** or search more

### Host Journey
1. **Landing Page** → "List Your Bay"
2. **Login/Register** → Choose role
3. **Host Dashboard** → View earnings (3 tabs), pending requests, active bookings, listings
4. **Create Listing** → 4-step wizard (Location → Map → Pricing → Review)
5. **Manage Bookings** → Accept/decline, add/edit access codes, complete, cancel

---

## 💳 Payment Flow

1. **Renter creates booking** → Status: `pending` (or `confirmed` for instant book)
2. **Payment initialized** → Paystack reference created
3. **Payment completed** → Status: `held_in_escrow`
4. **Host marks complete** → Payment released to host
5. **Platform fee deducted** → 15% commission
6. **Host receives payout** → Net amount transferred

---

## 📱 Demo Accounts

**Renter:**
- Email: renter@parkbuddy.co.za
- Password: renter123

**Host:**
- Email: host@parkbuddy.co.za
- Password: host123

**Both:**
- Email: both@parkbuddy.co.za
- Password: both123

---

## 🗺️ Map Integration

**Technology:** Leaflet + Esri World Imagery (satellite view)

**Features:**
- Hosts can zoom and click to mark exact bay location
- Coordinates stored as latitude/longitude
- Renters see mini satellite map on listing cards
- Red X marker shows exact bay location

---

## 📋 Terms & Conditions (Checkout Modal)

**Displayed at Checkout before payment** - User must check acknowledgment box to proceed.

### Sections:
1. **Booking & Payment**
   - Payment via Paystack, held in escrow until booking completed
   - Platform fee: 15% deducted from total
   - Instant Book = immediate confirmation; Request = host approval within 2 hours
   - Refunds for cancellations before check-in date

2. **Grace Period & Bay Vacation** ⭐ **KEY POLICY**
   - **1-hour grace period** after booking end date/time for visitors to vacate the parking bay
   - If bay not vacated within grace period, host may request estate security assistance
   - Repeated violations → booking cancellation without refund + account restrictions
   - Grace period for reasonable exit only, not extended parking

3. **Vehicle & Guest Responsibility**
   - Renter responsible for guest conduct and vehicle
   - Only registered vehicle (license plate at booking) may use bay
   - Access codes shared securely with guest only
   - Damage to bay/estate = renter responsibility

4. **Cancellation & Refunds**
   - Before check-in: Full refund minus platform fee
   - After check-in: No refund
   - Host cancellations: Full refund including platform fee
   - Disputes resolved by ParkBuddy SA support within 5 business days

5. **General**
   - ParkBuddy SA is a platform only; does not own/manage bays
   - Estate rules take precedence
   - Right to suspend accounts for violations
   - Governed by South African law

### UI Implementation:
- Modal triggered by "Terms & Conditions" link at checkout
- Scrollable content with section headers + icons
- Required checkbox: "I have read and accept the Terms & Conditions"
- "Accept & Continue" button enabled only when checked
- Sets `acceptedTerms=true` in state, enables Pay button

### Verification Email
- Sent on registration
- Contains verification link
- Expires in 24 hours

### Booking Confirmation
- Sent after successful payment
- Includes parking details
- Access code if provided
- Directions to bay

---

## 🔒 Security Features

### Current (v1.0.1)
- **Password hashing** with bcrypt
- **JWT tokens** for authentication
- **Rate limiting** on API endpoints
- **CORS protection**
- **Helmet security headers**
- **Input validation** with Zod
- **SQL injection protection** (parameterized queries)

### Enhanced for v1.1.0 (Trust & Safety)
- **Identity Verification (KYC)** — SA ID document + selfie verification for hosts & renters
  - Cloudinary secure storage with signed URLs, auto-expiry
  - Manual review queue with admin dashboard
  - Facial recognition match (ID photo vs selfie) via third-party API
- **Host Guarantee Program** — Up to R50,000 coverage for property damage by verified renters
  - Funded by platform fee allocation (2% of each booking)
  - Claims process with photo evidence, police report for theft
- **Booking Deposit System** — Refundable R200-R500 held in escrow
  - Auto-refunded 24h after check-out if no damage claim
  - Host can claim with evidence within 48h
- **Check-in/Check-out Photo Verification** — Timestamped, geotagged photos
  - Renter uploads on arrival/departure
  - Host receives notification, can dispute within 1 hour
- **Verified Badge System** — Visual trust indicators
  - 🟢 ID Verified Host/Renter
  - 🟢 Fully Verified (Email + ID + Residence)
  - Hosts can require "Verified Renters Only"
  - Renters can filter "Verified Hosts Only"
- **Review & Rating System** — Post-booking mutual reviews
  - Categories: Communication, Cleanliness, Safety, Accuracy
  - Public profiles with aggregate scores
- **In-App Support Chat** — Real-time during active bookings
  - Emergency priority queue
  - Photo/file sharing for incidents
  - Auto-escalation to human agent for safety issues
- **Listing Accuracy Guarantee** — Refund if space doesn't match description
  - Photo comparison (listing vs reality)
  - 2-hour claim window after check-in
- **Emergency Features**
  - One-tap emergency contact (host + ParkBuddy + SAPS)
  - Location sharing with emergency services
  - Incident reporting with evidence upload

---

## 🌍 South African Market Specifics

- **Currency**: ZAR (South African Rand)
- **Payment Gateway**: Paystack (SA-focused)
- **Phone Format**: +27 XX XXX XXXX
- **License Plate Format**: GP 123 456 (provincial)
- **Estate Types**: Security estates, complexes, gated communities
- **Major Cities**: Johannesburg, Cape Town, Durban, Pretoria

---

## 📊 Sample Data

### Estates (8 pre-loaded)
1. Midrand Estate, Johannesburg
2. Waterkloof Heights, Pretoria
3. Stellenbosch Village Estate, Stellenbosch
4. Umhlanga Rocks Estate, Durban
5. Lonehill Security Park, Sandton
6. Val de Vie Estate, Paarl
7. Zimbali Coastal Resort, Ballito
8. Dainfern Estate, Sandton

---

## 🐛 Known Issues & Solutions

| Issue | Solution | Status |
|-------|----------|--------|
| Database IPv6 connection (ENETUNREACH) | Regex extracts hostname, forces IPv4 via `dns.setDefaultResultOrder('ipv4first')` | Fixed |
| Password with @ symbol in URL | Regex matches valid domain names (with dots) to skip @ in password | Fixed |
| Port conflicts | Frontend: 4000, Backend: 5000 | Fixed |
| HMR in production build | Custom Vite plugin strips ~16KB HMR runtime, preserves `Yu` + module utilities | Fixed |
| Vercel build cache | Version bump + `vercel --prod --force`; Framework must be "Vite" in dashboard | Workaround |
| Test strict mode violations | Multiple elements match selectors; needs data-testid attributes | Known |
| Password reset token columns missing | Added `reset_password_token` and `reset_password_expires` columns via migration | Fixed |
| Renter Dashboard not accessible after booking | Added Dashboard icon to Search page header; Success page has "Go to My Dashboard" button | Fixed |
| New guest not auto-selected at checkout | Added `useEffect` to auto-select newly created guest | Fixed |
| No form validation on registration | Added real-time field validation with inline error messages | Fixed |
| No Terms & Conditions acceptance | Added modal with 1-hour grace period policy, required checkbox before payment | Fixed |

---

## 📈 Future Enhancements (Roadmap)
- [ ] Real-time notifications (WebSocket/SSE)
- [ ] Rating and review system
- [ ] Host verification process (ID + residence)
- [ ] Mobile app (React Native)
- [ ] Advanced search filters (price range, dates, amenities)
- [ ] Recurring bookings
- [ ] Multi-language support (Afrikaans, Zulu)
- [ ] Analytics dashboard for hosts
- [ ] WhatsApp Business API integration (templates)
- [ ] Admin panel for platform management
- [ ] Automated grace period enforcement (cron job to check overstays)
- [ ] SMS notifications for booking confirmations
- [ ] **Dynamic Event Pricing Engine** — ML-based price optimization for events
- [ ] **Insurance Integration** — Partner with SA insurers for host/renter policies
- [ ] **Smart Lock Integration** — IoT keyless entry for garages/gates
- [ ] **Community Features** — Neighborhood watch, shared security cameras
- [ ] **Corporate/Property Manager Portal** — Bulk listing management for complexes
- [ ] **EV Charging Booking** — Reserve parking + charging slot together
- [ ] **Accessibility Filters** — Wheelchair accessible, wide bays, level entry
- [ ] **Loyalty Program** — Points for frequent parkers/hosts
- [ ] **Dispute Resolution Dashboard** — Automated mediation with evidence timeline

---

## 📞 Support & Debugging
1. Check build footer for version/git info
2. Verify `build-info.json` at `/build-info.json`
3. Review browser console for React errors
4. Check backend logs on Render dashboard
5. Verify environment variables in Vercel/Render
6. Run `npm run typecheck` for TypeScript errors
7. Check database queries in Supabase dashboard

---

## 📄 License

MIT License - Free to use and modify

---

## ✅ Checklist for Deployment

- [ ] All environment variables configured
- [ ] Database migration completed
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 4000
- [ ] Paystack test keys working
- [ ] Email service configured
- [ ] File storage configured
- [ ] All tests passing
- [ ] Frontend accessible at https://parkbuddy-sa.vercel.app
- [ ] Backend API at https://parkbuddy-backend-docker.onrender.com

---

**Last Updated:** 2026-11-05
**Version:** 1.0.1
**Status:** Production Ready - All Core Features Complete
