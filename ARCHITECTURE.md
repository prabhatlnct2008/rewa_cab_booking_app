# ARCHITECTURE.md — Rewa Cab Booking Platform

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                        │
├─────────────────────┬─────────────────────┬─────────────────────────────────────┤
│   Consumer Mobile   │   Consumer Web      │   Admin/Agency/Driver Portals       │
│   (React Native)    │   (Next.js)         │   (Next.js)                         │
│   Expo Managed      │   App Router        │   App Router                        │
│   Android-first     │   SSR + SSG         │   Client-side heavy                 │
└─────────┬───────────┴─────────┬───────────┴─────────────────┬───────────────────┘
          │                     │                             │
          │  TanStack Query     │  TanStack Query             │  TanStack Query
          │  + Axios            │  + Axios                    │  + Axios
          │                     │                             │
┌─────────▼─────────────────────▼─────────────────────────────▼───────────────────┐
│                           API GATEWAY / LOAD BALANCER                            │
│                        (Railway/Render with auto-scaling)                        │
└─────────────────────────────────────┬───────────────────────────────────────────┘
                                      │
┌─────────────────────────────────────▼───────────────────────────────────────────┐
│                              BACKEND LAYER                                       │
│                           Python FastAPI Server                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   Auth       │  │   Booking    │  │   Payment    │  │   Notification       │ │
│  │   Service    │  │   Service    │  │   Service    │  │   Service            │ │
│  │   (OTP)      │  │              │  │  (Instamojo) │  │   (FCM/Email)        │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   Route      │  │   Quote      │  │   Admin      │  │   Webhook            │ │
│  │   Service    │  │   Service    │  │   Service    │  │   Handler            │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────┬───────────────────────────────────────────┘
                                      │
┌─────────────────────────────────────▼───────────────────────────────────────────┐
│                              DATA LAYER                                          │
│                         PostgreSQL (Supabase)                                    │
├──────────────────────────────────────────────────────────────────────────────────┤
│  • Row Level Security (RLS) enabled                                              │
│  • Connection pooling via PgBouncer                                              │
│  • Realtime subscriptions for live updates                                       │
└──────────────────────────────────────────────────────────────────────────────────┘
                                      │
┌─────────────────────────────────────▼───────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                      │
├──────────────┬──────────────┬──────────────┬────────────────────────────────────┤
│  Instamojo   │  Google Maps │  Firebase    │  SMS Gateway                       │
│  (Payments)  │  (Places +   │  (FCM Push)  │  (MSG91/2Factor)                   │
│              │   Directions)│              │                                    │
└──────────────┴──────────────┴──────────────┴────────────────────────────────────┘
```

---

## 1. Frontend Architecture

### 1.1 Consumer Mobile App (React Native + Expo)

```
mobile/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/                   # Bottom tab navigator
│   │   ├── index.tsx             # Home (search)
│   │   ├── rides.tsx             # Rides list
│   │   ├── bookings.tsx          # My Bookings
│   │   └── support.tsx           # Support
│   ├── search/
│   │   └── [routeId].tsx         # Search results
│   ├── ride/
│   │   └── [rideId].tsx          # Ride details
│   ├── booking/
│   │   ├── passenger-details.tsx
│   │   ├── otp.tsx
│   │   ├── payment.tsx
│   │   └── confirmation.tsx
│   ├── request/                  # Individual ride flow
│   │   ├── create.tsx
│   │   ├── quotes.tsx
│   │   └── [quoteId].tsx
│   └── _layout.tsx
├── components/
│   ├── ui/                       # Design system (NativeWind)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── StatusChip.tsx
│   ├── rides/
│   │   ├── RideCard.tsx
│   │   ├── SearchForm.tsx
│   │   └── QuickRoutes.tsx
│   └── booking/
│       ├── BookingCard.tsx
│       └── PassengerForm.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useBooking.ts
│   └── useOfflineSync.ts
├── services/
│   ├── api.ts                    # Axios instance + interceptors
│   ├── storage.ts                # MMKV for offline
│   └── notifications.ts          # FCM setup
├── stores/
│   └── authStore.ts              # Zustand for local state
└── utils/
    └── queryClient.ts            # TanStack Query config
```

**Key Mobile Considerations:**
- **Offline-First**: MMKV for caching; TanStack Query's `persistQueryClient`
- **Native Feel**: Reanimated 3 for 60fps animations; `expo-haptics` on CTAs
- **Safe Areas**: All screens wrapped in `SafeAreaProvider`
- **Keyboard**: `KeyboardAvoidingView` on all form screens

---

### 1.2 Consumer Web (Next.js 14+ App Router)

```
web/
├── app/
│   ├── page.tsx                  # Landing (SSG)
│   ├── search/
│   │   └── page.tsx              # Search results (SSR)
│   ├── ride/
│   │   └── [rideId]/
│   │       └── page.tsx          # Ride details (SSR for SEO)
│   ├── booking/
│   │   ├── details/page.tsx
│   │   ├── verify/page.tsx       # OTP
│   │   ├── payment/page.tsx
│   │   └── success/page.tsx
│   ├── my-bookings/
│   │   └── page.tsx
│   ├── request/                  # Individual ride
│   │   └── page.tsx
│   ├── routes/
│   │   └── [slug]/page.tsx       # SEO: /routes/rewa-to-prayagraj
│   ├── how-it-works/page.tsx
│   ├── support/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/                       # Shadcn/UI + Tailwind
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── TrustSection.tsx
│   │   └── RouteHighlights.tsx
│   └── booking/
├── lib/
│   ├── api.ts
│   └── seo.ts                    # generateMetadata helpers
└── providers/
    └── QueryProvider.tsx
```

**SEO Strategy:**
- Landing page: Full SSG with structured data (LocalBusiness, FAQ)
- Route pages (`/routes/rewa-to-prayagraj`): SSG with dynamic OG images
- Search results: SSR with `generateMetadata` from query params
- Booking flow: Client-side (no SEO needed)

---

### 1.3 Admin/Agency/Driver Portals (Next.js)

```
portal/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Sidebar layout
│   │   ├── page.tsx              # Dashboard
│   │   ├── routes/
│   │   ├── scheduled-rides/
│   │   ├── bookings/
│   │   ├── leads/                # Agency only
│   │   ├── quotes/               # Agency only
│   │   ├── drivers/
│   │   ├── vehicles/
│   │   ├── agencies/             # Admin only
│   │   ├── payments/
│   │   └── settings/
│   └── layout.tsx
├── components/
│   ├── ui/                       # Shadcn/UI
│   ├── tables/                   # TanStack Table
│   └── forms/
└── middleware.ts                 # Role-based route protection
```

---

## 2. Backend Architecture (FastAPI)

```
backend/
├── app/
│   ├── main.py                   # FastAPI app entry
│   ├── config.py                 # Settings (Pydantic BaseSettings)
│   ├── database.py               # Supabase/SQLAlchemy connection
│   ├── dependencies.py           # Auth, DB session deps
│   │
│   ├── api/
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py           # OTP send/verify
│   │   │   ├── users.py
│   │   │   ├── routes.py
│   │   │   ├── scheduled_rides.py
│   │   │   ├── bookings.py
│   │   │   ├── ride_requests.py  # Individual rides
│   │   │   ├── quotes.py
│   │   │   ├── payments.py
│   │   │   ├── vehicles.py
│   │   │   ├── drivers.py
│   │   │   ├── agencies.py
│   │   │   └── admin.py
│   │   └── webhooks/
│   │       └── instamojo.py      # Payment webhooks
│   │
│   ├── models/                   # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── route.py
│   │   ├── scheduled_ride.py
│   │   ├── booking.py
│   │   ├── ride_request.py
│   │   ├── quote.py
│   │   ├── payment.py
│   │   ├── vehicle.py
│   │   ├── driver.py
│   │   └── agency.py
│   │
│   ├── schemas/                  # Pydantic schemas
│   │   ├── auth.py
│   │   ├── booking.py
│   │   └── ...
│   │
│   ├── services/                 # Business logic
│   │   ├── auth_service.py
│   │   ├── booking_service.py
│   │   ├── payment_service.py    # Instamojo integration
│   │   ├── notification_service.py
│   │   └── seat_lock_service.py  # Prevent race conditions
│   │
│   ├── tasks/                    # Background jobs (Celery/ARQ)
│   │   ├── booking_timeout.py
│   │   ├── quote_expiry.py
│   │   └── payment_reconciliation.py
│   │
│   └── utils/
│       ├── otp.py
│       ├── sms.py
│       └── maps.py               # Google Maps API wrapper
│
├── migrations/                   # Alembic
├── tests/
├── requirements.txt
└── Dockerfile
```

---

## 3. Data Flow Diagrams

### 3.1 Group Ride Booking Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Search  │────▶│  Select  │────▶│ Passenger│────▶│   OTP    │────▶│  Payment │
│  Rides   │     │   Ride   │     │  Details │     │  Verify  │     │(Instamojo│
└──────────┘     └──────────┘     └──────────┘     └──────────┘     └────┬─────┘
                                                                         │
                      ┌──────────────────────────────────────────────────┘
                      ▼
              ┌──────────────┐     ┌──────────────┐
              │   Webhook    │────▶│  Booking     │
              │   Received   │     │  Confirmed   │
              └──────────────┘     └──────────────┘

STATE MACHINE:
draft ──▶ pending_payment ──▶ confirmed ──▶ completed
  │              │
  └──────────────┴──▶ cancelled (timeout/user)
```

### 3.2 Individual Ride Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Create  │────▶│  Agency  │────▶│  Select  │────▶│   OTP    │────▶│   Pay    │
│ Request  │     │  Sends   │     │  Quote   │     │  Verify  │     │ Advance  │
│          │     │  Quotes  │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘     └────┬─────┘
                                                                         │
                      ┌──────────────────────────────────────────────────┘
                      ▼
              ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
              │   Booking    │────▶│   Driver     │────▶│   Ride       │
              │  Confirmed   │     │  Assigned    │     │  Completed   │
              └──────────────┘     └──────────────┘     └──────────────┘

STATE MACHINE:
request_created ──▶ quotes_received ──▶ quote_selected ──▶ pending_advance ──▶ confirmed ──▶ driver_assigned ──▶ completed
       │                                      │                   │
       └──────────────────────────────────────┴───────────────────┴──▶ cancelled
```

---

## 4. Authentication Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        OTP-Based Auth Flow                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. User enters phone ──▶ POST /api/v1/auth/otp/send               │
│                              │                                      │
│                              ▼                                      │
│                    ┌─────────────────┐                             │
│                    │  Generate OTP   │                             │
│                    │  Store in Redis │                             │
│                    │  TTL: 5 minutes │                             │
│                    └────────┬────────┘                             │
│                              │                                      │
│                              ▼                                      │
│                    ┌─────────────────┐                             │
│                    │  Send via SMS   │                             │
│                    │  (MSG91/2Factor)│                             │
│                    └─────────────────┘                             │
│                                                                     │
│  2. User enters OTP ──▶ POST /api/v1/auth/otp/verify               │
│                              │                                      │
│                              ▼                                      │
│                    ┌─────────────────┐                             │
│                    │  Validate OTP   │                             │
│                    │  Create/Get User│                             │
│                    └────────┬────────┘                             │
│                              │                                      │
│                              ▼                                      │
│                    ┌─────────────────┐                             │
│                    │  Generate JWT   │                             │
│                    │  Access: 15min  │                             │
│                    │  Refresh: 7days │                             │
│                    └─────────────────┘                             │
│                                                                     │
│  Token Storage:                                                     │
│  • Web: HttpOnly cookies (CSRF protected)                          │
│  • Mobile: expo-secure-store                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Payment Architecture (Instamojo)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Instamojo Payment Flow                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Client                    Backend                    Instamojo     │
│    │                          │                           │         │
│    │  1. Initiate Payment     │                           │         │
│    │─────────────────────────▶│                           │         │
│    │                          │  2. Create Payment Request│         │
│    │                          │──────────────────────────▶│         │
│    │                          │                           │         │
│    │                          │  3. Return payment_url    │         │
│    │                          │◀──────────────────────────│         │
│    │  4. Redirect to Instamojo│                           │         │
│    │◀─────────────────────────│                           │         │
│    │                          │                           │         │
│    │══════════════════════════│═══════════════════════════│         │
│    │     User completes payment on Instamojo              │         │
│    │══════════════════════════│═══════════════════════════│         │
│    │                          │                           │         │
│    │  5. Redirect to success  │                           │         │
│    │◀═════════════════════════│═══════════════════════════│         │
│    │                          │  6. Webhook: payment_id   │         │
│    │                          │◀──────────────────────────│         │
│    │                          │                           │         │
│    │                          │  7. Verify signature      │         │
│    │                          │  8. Update booking status │         │
│    │                          │  9. Send confirmation     │         │
│    │                          │                           │         │
└─────────────────────────────────────────────────────────────────────┘

IMPORTANT: Never trust redirect params alone; always wait for webhook
```

---

## 6. Caching Strategy

| Layer | Technology | TTL | Use Case |
|-------|------------|-----|----------|
| API Response | TanStack Query | 5 min | Routes, scheduled rides |
| Server Cache | Redis | 1 min | Active seat counts |
| Mobile Offline | MMKV | Until sync | User bookings, search history |
| CDN | Vercel Edge | 1 hour | Static assets, landing pages |

---

## 7. Real-time Updates

For ride status and quote notifications:

```
Option A: Supabase Realtime (Recommended for MVP)
─────────────────────────────────────────────────
• Postgres LISTEN/NOTIFY via WebSocket
• Subscribe to booking status changes
• Subscribe to new quotes for ride requests

Option B: Custom WebSocket (Scale phase)
─────────────────────────────────────────────────
• FastAPI WebSocket endpoints
• Redis Pub/Sub for horizontal scaling
```

---

## 8. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐ │
│  │  Vercel     │  │  Vercel     │  │  Railway / Render           │ │
│  │  (Web)      │  │  (Portal)   │  │  (FastAPI + Workers)        │ │
│  │  CDN + SSR  │  │  CDN + SSR  │  │  Auto-scaling               │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐ │
│  │  EAS (Mobile)               │  │  Supabase                   │ │
│  │  • OTA Updates              │  │  • Postgres                 │ │
│  │  • Android APK/AAB          │  │  • Auth (backup)            │ │
│  │  • iOS (future)             │  │  • Realtime                 │ │
│  └─────────────────────────────┘  │  • Storage (future)         │ │
│                                    └─────────────────────────────┘ │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐ │
│  │  Upstash    │  │  Firebase   │  │  Instamojo                  │ │
│  │  (Redis)    │  │  (FCM)      │  │  (Payments)                 │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. Security Considerations

| Concern | Implementation |
|---------|----------------|
| **API Auth** | JWT with short-lived access tokens (15 min) + refresh tokens |
| **RLS** | Supabase Row Level Security on all tables |
| **Rate Limiting** | 3 OTP attempts per phone per 5 min |
| **Input Validation** | Pydantic models for all endpoints |
| **SQL Injection** | SQLAlchemy ORM (parameterized queries) |
| **XSS** | React's built-in escaping; CSP headers |
| **CSRF** | SameSite cookies for web; not applicable for mobile |
| **Secrets** | Environment variables; never in code |
| **Webhook Verification** | Instamojo signature validation |
| **Audit Logging** | All booking/payment state changes logged |

---

## 10. Monitoring & Observability

- **APM**: Sentry (errors + performance)
- **Logs**: Railway/Render built-in + structured JSON logs
- **Metrics**: Supabase dashboard for DB; custom for business KPIs
- **Uptime**: BetterUptime or similar
- **Analytics**: PostHog (privacy-friendly) or Mixpanel
