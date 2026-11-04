# ParkBuddy SA - Complete Project Specification

## 📋 Project Overview

**ParkBuddy SA** is a peer-to-peer estate parking platform for South Africa. It allows residents to rent out their spare parking bays to visitors, with secure payments handled through Paystack.

**Tech Stack:**
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL (Supabase)
- Payments: Paystack
- File Storage: Cloudinary
- Email: Resend

---

## 🏗️ Project Structure

```
parkbuddy-sa/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── MapPicker.tsx   # Satellite map for marking parking bays
│   │   │   └── MapView.tsx     # Read-only map display
│   │   ├── context/
│   │   │   └── AppContext.tsx  # Global state management
│   │   ├── data/
│   │   │   └── mockData.ts   # Demo data for testing
│   │   ├── pages/
│   │   │   ├── Landing.tsx        # Homepage
│   │   │   ├── Login.tsx          # Login/Register page
│   │   │   ├── host/
│   │   │   │   ├── HostDashboard.tsx    # Host's main dashboard
│   │   │   │   └── CreateListing.tsx    # Create parking bay listing
│   │   │   └── renter/
│   │   │       ├── Search.tsx           # Search for parking
│   │   │       ├── Results.tsx          # View search results
│   │   │       ├── Checkout.tsx         # Booking checkout
│   │   │       ├── Success.tsx          # Booking confirmation
│   │   │       └── SavedGuests.tsx      # Manage frequent guests
│   │   ├── services/
│   │   │   └── api.ts          # API client for backend
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript type definitions
│   │   ├── App.tsx             # Main app component
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── public/
│   │   └── simple-download.html  # Download page
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   └── playwright.config.ts
│
├── backend/                     # Express backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts     # PostgreSQL connection
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT authentication
│   │   ├── controllers/        # Business logic (empty - logic in routes)
│   │   ├── routes/
│   │   │   ├── auth.ts         # Authentication endpoints
│   │   │   ├── listings.ts     # Parking bay CRUD
│   │   │   ├── bookings.ts     # Booking management
│   │   │   ├── payments.ts     # Paystack integration
│   │   │   └── uploads.ts      # File upload handling
│   │   ├── services/
│   │   │   ├── cloudinary.ts   # File storage service
│   │   │   └── email.ts        # Email service
│   │   └── server.ts           # Express server setup
│   ├── scripts/
│   │   └── migrate.ts          # Database migration script
│   ├── database/
│   │   └── schema.sql          # PostgreSQL schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                    # Environment variables
│
├── tests/                       # Test suites
│   ├── e2e/                    # Playwright E2E tests
│   │   ├── login.spec.ts
│   │   ├── booking.spec.ts
│   │   ├── host.spec.ts
│   │   ├── account.spec.ts
│   │   └── saved-guests.spec.ts
│   └── unit/                   # Vitest unit tests
│       ├── setup.ts
│       ├── Login.test.tsx
│       └── AppContext.test.tsx
│
├── setup.sh                     # Automated setup script
├── .env                         # Frontend environment variables
└── README.md                    # Project documentation
```

---

## 🎯 Core Features

### 1. User Authentication
- **Registration** with email verification
- **Login** with JWT tokens
- **Roles**: Host, Renter, or Both
- **Profile management**

### 2. Host Features
- **Create listings** for parking bays
- **Mark bay location** on satellite map
- **Set pricing** (per day in ZAR)
- **Choose booking type**: Instant or Request-based
- **Add directions** to help renters find the bay
- **View earnings** dashboard
- **Manage bookings**: Accept/Decline requests
- **Generate access codes** for gate entry
- **Mark bookings complete** to release payment

### 3. Renter Features
- **Search parking** by estate name or city
- **Filter results** by booking type
- **View listings** with satellite map
- **Save guest profiles** for frequent visitors
- **Book parking** with date selection
- **Pay securely** via Paystack
- **Receive booking confirmation** with details
- **Cancel bookings** with refund
- **Share details** via WhatsApp

### 4. Payment System
- **Paystack integration** for South African payments
- **Escrow system**: Funds held until booking complete
- **Platform fee**: 15% commission
- **Automatic payouts** to hosts
- **Refund processing** for cancellations

### 5. Communication
- **Email notifications** via Resend
- **WhatsApp handoff** for sharing parking details
- **Access codes** for secure gate entry

---

## 🗄️ Database Schema

### users
```sql
- id (UUID, primary key)
- email (VARCHAR, unique)
- phone (VARCHAR)
- password_hash (VARCHAR)
- full_name (VARCHAR)
- role (ENUM: 'host', 'renter', 'both')
- id_verified (BOOLEAN)
- residence_verified (BOOLEAN)
- email_verified (BOOLEAN)
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
- estate_id (UUID, foreign key → estates)
- cluster_or_street (VARCHAR)
- bay_number (VARCHAR)
- price_per_day (DECIMAL)
- booking_type (ENUM: 'instant', 'request')
- is_active (BOOLEAN)
- walk_time_minutes (INTEGER)
- rating (DECIMAL)
- review_count (INTEGER)
- notes (TEXT)
- directions (TEXT)
- map_marker_lat (DECIMAL)
- map_marker_lng (DECIMAL)
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
- estate_name (VARCHAR)
- cluster_or_street (VARCHAR)
- bay_number (VARCHAR)
- start_date (DATE)
- end_date (DATE)
- total_amount (DECIMAL)
- platform_fee (DECIMAL)
- host_payout (DECIMAL)
- status (ENUM: 'pending', 'confirmed', 'active', 'completed', 'disputed', 'cancelled')
- access_code (VARCHAR)
- directions (TEXT)
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
- id (UUID, primary key)
- renter_id (UUID, foreign key → users)
- guest_name (VARCHAR)
- phone_number (VARCHAR)
- license_plate (VARCHAR)
- created_at (TIMESTAMP)
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login
GET    /api/auth/profile           # Get current user profile
```

### Listings
```
GET    /api/listings               # Get all active listings
POST   /api/listings               # Create new listing (host only)
GET    /api/listings/:id           # Get listing by ID
```

### Bookings
```
POST   /api/bookings               # Create booking (renter only)
GET    /api/bookings/renter/my-bookings   # Get renter's bookings
GET    /api/bookings/host/my-bookings     # Get host's bookings
PATCH  /api/bookings/:id/status    # Update booking status (host)
POST   /api/bookings/:id/cancel    # Cancel booking
```

### Payments
```
POST   /api/payments/initialize    # Initialize Paystack payment
GET    /api/payments/verify/:ref   # Verify payment
POST   /api/payments/release/:id   # Release payment to host
POST   /api/payments/refund/:id    # Refund payment
```

### Uploads
```
POST   /api/uploads/id-document    # Upload ID verification
POST   /api/uploads/listing/:id    # Upload listing image
```

---

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
```

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:4000

# Database
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_CALLBACK_URL=http://localhost:5000/api/payments/callback

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

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm 9+ installed
- Supabase account with PostgreSQL database
- Paystack account with API keys
- Cloudinary account
- Resend account

### Quick Start

1. **Extract the project folder**

2. **Run setup script:**
```bash
chmod +x setup.sh
./setup.sh
```

The script will:
- Install frontend dependencies
- Install backend dependencies
- Run database migration
- Start both servers

3. **Access the app:**
- Frontend: http://localhost:4000
- Backend: http://localhost:5000

### Manual Setup

**Frontend:**
```bash
npm install
npm run dev
```

**Backend:**
```bash
cd backend
npm install
npm run db:migrate
npm run dev
```

---

## 🧪 Testing

### Unit Tests
```bash
npm run test:unit
```

### E2E Tests
```bash
npm run test:e2e
```

### All Tests
```bash
npm test
```

---

## 🎨 UI/UX Flow

### Renter Journey
1. **Landing Page** → Click "Find Parking"
2. **Login/Register** → Choose role
3. **Search Page** → Enter estate name or city
4. **Results Page** → View available bays with satellite maps
5. **Checkout** → Select dates, choose guest, pay
6. **Success Page** → View booking details, share via WhatsApp

### Host Journey
1. **Landing Page** → Click "List Your Bay"
2. **Login/Register** → Choose role
3. **Host Dashboard** → View earnings and listings
4. **Create Listing** → 4-step wizard:
   - Step 1: Location details
   - Step 2: Mark bay on satellite map
   - Step 3: Pricing and booking type
   - Step 4: Review and publish
5. **Manage Bookings** → Accept/decline requests, add access codes

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

## 📧 Email Templates

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

- **Password hashing** with bcrypt
- **JWT tokens** for authentication
- **Rate limiting** on API endpoints
- **CORS protection**
- **Helmet security headers**
- **Input validation** with Zod
- **SQL injection protection** (parameterized queries)

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

### Issue: Database Connection (ENETUNREACH)
**Solution:** Code uses regex to extract hostname and forces IPv4 resolution

### Issue: Password with @ symbol
**Solution:** Regex pattern matches valid domain names (with dots) to skip @ in password

### Issue: Port conflicts
**Solution:** Frontend uses port 4000, Backend uses port 5000

---

## 📈 Future Enhancements

- [ ] Real-time notifications
- [ ] Rating and review system
- [ ] Host verification process
- [ ] Mobile app (React Native)
- [ ] Advanced search with filters
- [ ] Recurring bookings
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] WhatsApp Business API integration

---

## 📞 Support

For issues or questions:
1. Check this specification document
2. Review the code comments
3. Check backend/frontend logs
4. Verify environment variables

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
- [ ] Frontend accessible at http://localhost:4000
- [ ] Backend API accessible at http://localhost:5000

---

**Last Updated:** 2026
**Version:** 1.0.0
**Status:** MVP Complete
