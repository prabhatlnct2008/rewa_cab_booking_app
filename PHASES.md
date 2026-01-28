# PHASES.md — Rewa Cab Booking Platform Implementation Roadmap

## Overview

This document outlines a strict implementation roadmap separating **Infrastructure Setup** from **Feature Implementation**. Tasks marked with `[PARALLEL]` can be executed simultaneously by different team members.

```
Total Timeline: 12-14 weeks (MVP to Production)

┌──────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 0   │ PHASE 1        │ PHASE 2           │ PHASE 3       │ PHASE 4        │
│ Setup     │ Core (Group)   │ Individual Rides  │ Polish        │ Launch         │
│ Week 1-2  │ Week 3-6       │ Week 7-9          │ Week 10-11    │ Week 12+       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## PHASE 0: Infrastructure Setup (Week 1-2)

**Goal:** Set up all development infrastructure before writing any feature code.

### 0.1 Repository & Monorepo Structure [PARALLEL: DevOps]

```bash
rewa-cab-platform/
├── apps/
│   ├── mobile/          # React Native (Expo)
│   ├── web/             # Next.js Consumer
│   └── portal/          # Next.js Admin/Agency
├── packages/
│   ├── api-client/      # Shared API client (TanStack Query hooks)
│   ├── ui/              # Shared component library
│   └── types/           # Shared TypeScript types
├── backend/             # FastAPI
├── infrastructure/      # Docker, Terraform, etc.
└── docs/
```

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Initialize Turborepo/Nx monorepo | DevOps | 1 day | - |
| Configure pnpm workspaces | DevOps | 0.5 day | Monorepo |
| Set up ESLint, Prettier, Husky | DevOps | 0.5 day | Monorepo |
| Configure TypeScript paths | DevOps | 0.5 day | Monorepo |
| Set up GitHub Actions CI pipeline | DevOps | 1 day | Monorepo |

---

### 0.2 Backend Infrastructure [PARALLEL: Backend]

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Initialize FastAPI project structure | Backend | 0.5 day | - |
| Set up SQLAlchemy + Alembic migrations | Backend | 1 day | FastAPI |
| Configure Supabase PostgreSQL connection | Backend | 0.5 day | SQLAlchemy |
| Run initial migration (SCHEMA.sql) | DBA | 0.5 day | Alembic |
| Configure Pydantic settings (env vars) | Backend | 0.5 day | FastAPI |
| Set up pytest + test database | Backend | 0.5 day | SQLAlchemy |
| Configure Redis (Upstash) for OTP/caching | Backend | 0.5 day | FastAPI |
| Implement JWT auth middleware | Backend | 1 day | Redis |
| Set up Sentry error tracking | Backend | 0.5 day | FastAPI |
| Create Dockerfile + docker-compose | DevOps | 0.5 day | All above |

---

### 0.3 Frontend Infrastructure [PARALLEL: Frontend]

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Initialize Expo project (managed) | Mobile | 0.5 day | Monorepo |
| Initialize Next.js 14 (web) | Web | 0.5 day | Monorepo |
| Initialize Next.js 14 (portal) | Web | 0.5 day | Monorepo |
| Set up Tailwind CSS (web/portal) | Web | 0.5 day | Next.js |
| Set up NativeWind (mobile) | Mobile | 0.5 day | Expo |
| Configure TanStack Query provider | Both | 0.5 day | All apps |
| Create shared `api-client` package | Both | 1 day | TanStack Query |
| Set up Axios instance + interceptors | Both | 0.5 day | api-client |
| Install Shadcn/UI (web/portal) | Web | 0.5 day | Tailwind |
| Configure Expo Router | Mobile | 0.5 day | Expo |

---

### 0.4 Design System Foundation [PARALLEL: Design/Frontend]

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Define design tokens (colors, spacing, radii) | Design | 1 day | - |
| Create Tailwind theme config | Web | 0.5 day | Design tokens |
| Create NativeWind theme config | Mobile | 0.5 day | Design tokens |
| Build Button component (web + mobile) | Frontend | 0.5 day | Themes |
| Build Input component (web + mobile) | Frontend | 0.5 day | Themes |
| Build Card component (web + mobile) | Frontend | 0.5 day | Themes |
| Build Badge/Chip component | Frontend | 0.5 day | Themes |
| Build StatusChip component | Frontend | 0.5 day | Themes |
| Build Toast/notification system | Frontend | 0.5 day | Themes |

---

### 0.5 External Service Integrations [PARALLEL: Backend/DevOps]

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Set up Instamojo sandbox account | DevOps | 0.5 day | - |
| Implement Instamojo service wrapper | Backend | 1 day | Sandbox account |
| Set up MSG91/2Factor SMS gateway | DevOps | 0.5 day | - |
| Implement OTP SMS service | Backend | 0.5 day | SMS gateway |
| Configure Google Maps API | DevOps | 0.5 day | - |
| Implement Places autocomplete wrapper | Backend | 0.5 day | Maps API |
| Set up Firebase project (FCM) | DevOps | 0.5 day | - |
| Configure expo-notifications | Mobile | 0.5 day | Firebase |

---

### Phase 0 Completion Checklist

- [ ] All repos initialized with proper structure
- [ ] Backend server running locally with database
- [ ] All three frontend apps booting without errors
- [ ] Shared UI components rendering in all apps
- [ ] API client connecting to backend
- [ ] CI pipeline passing on all PRs
- [ ] All external services configured with sandbox credentials

---

## PHASE 1: Core Functionality — Group Rides (Week 3-6)

**Goal:** Complete consumer booking flow for scheduled group rides.

### 1.1 Backend: Core APIs (Week 3)

```
[PARALLEL TRACKS]

Track A: Auth + Users              Track B: Routes + Rides
─────────────────────              ──────────────────────
POST /auth/otp/send                GET /routes
POST /auth/otp/verify              GET /routes/:slug
POST /auth/refresh                 GET /scheduled-rides
GET /users/me                      GET /scheduled-rides/:id
PATCH /users/me                    POST /scheduled-rides/:id/lock-seats
```

**Tasks:**
| Task | Owner | Duration | Track |
|------|-------|----------|-------|
| Implement OTP send/verify endpoints | Backend | 1 day | A |
| Implement JWT token generation/refresh | Backend | 0.5 day | A |
| Implement user CRUD | Backend | 0.5 day | A |
| Implement rate limiting middleware | Backend | 0.5 day | A |
| Seed popular places data | DBA | 0.5 day | B |
| Implement routes endpoints | Backend | 0.5 day | B |
| Implement scheduled rides search | Backend | 1 day | B |
| Implement seat locking procedure | Backend | 1 day | B |
| Write API tests for auth | Backend | 0.5 day | A |
| Write API tests for rides | Backend | 0.5 day | B |

---

### 1.2 Backend: Booking + Payments (Week 4)

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Implement booking creation (draft) | Backend | 0.5 day | Rides API |
| Implement booking state machine | Backend | 1 day | Booking CRUD |
| Integrate Instamojo payment creation | Backend | 1 day | Instamojo service |
| Implement Instamojo webhook handler | Backend | 1 day | Payment creation |
| Implement payment verification | Backend | 0.5 day | Webhook |
| Implement booking confirmation flow | Backend | 0.5 day | Payment verify |
| Implement booking cancellation | Backend | 0.5 day | Confirmation |
| Implement refund logic | Backend | 1 day | Cancellation |
| Background job: expire pending bookings | Backend | 0.5 day | State machine |
| Background job: release seat locks | Backend | 0.5 day | Seat locks |
| Write integration tests | Backend | 1 day | All above |

---

### 1.3 Consumer Mobile App (Week 4-5) [PARALLEL]

```
[PARALLEL TRACKS]

Track A: Search Flow               Track B: Booking Flow
─────────────────────              ──────────────────────
Home Screen                        Passenger Details Screen
Search Form Component              OTP Screen
Search Results Screen              Payment Screen
Ride Details Screen                Confirmation Screen
                                   My Bookings Screen
                                   Booking Details Screen
```

**Tasks:**
| Task | Owner | Duration | Track |
|------|-------|----------|-------|
| Home screen with search form | Mobile | 1 day | A |
| Places autocomplete integration | Mobile | 0.5 day | A |
| Quick routes chips | Mobile | 0.5 day | A |
| Search results screen | Mobile | 1 day | A |
| Ride card component | Mobile | 0.5 day | A |
| Ride details screen | Mobile | 1 day | A |
| Passenger details form | Mobile | 1 day | B |
| OTP verification screen | Mobile | 1 day | B |
| Auto-read OTP (Android) | Mobile | 0.5 day | B |
| Payment WebView integration | Mobile | 1 day | B |
| Booking confirmation screen | Mobile | 0.5 day | B |
| My Bookings list | Mobile | 1 day | B |
| Booking details screen | Mobile | 1 day | B |
| Pull-to-refresh, loading states | Mobile | 0.5 day | Both |
| Offline caching setup | Mobile | 1 day | Both |

---

### 1.4 Consumer Web (Week 4-5) [PARALLEL]

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Landing page with hero | Web | 1 day | - |
| Trust section, how-it-works | Web | 0.5 day | Landing |
| Search form component | Web | 0.5 day | Landing |
| SEO metadata + OG images | Web | 0.5 day | Landing |
| Route pages (/routes/[slug]) | Web | 1 day | Routes API |
| Search results page | Web | 1 day | Search API |
| Ride details page | Web | 1 day | Rides API |
| Passenger details form | Web | 0.5 day | - |
| OTP modal | Web | 0.5 day | Auth API |
| Payment redirect handler | Web | 0.5 day | Payments API |
| Success/failure pages | Web | 0.5 day | Payment handler |
| My Bookings page | Web | 1 day | Bookings API |
| Booking details page | Web | 0.5 day | My Bookings |
| Mobile responsiveness pass | Web | 0.5 day | All pages |

---

### 1.5 Admin Portal (Week 5-6) [PARALLEL]

```
[Focus: Core admin functionality for managing routes and rides]
```

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Admin login (OTP) | Web | 0.5 day | Auth API |
| Dashboard layout (sidebar) | Web | 0.5 day | Login |
| Dashboard KPIs | Web | 0.5 day | Dashboard API |
| Routes list (table) | Web | 0.5 day | Routes API |
| Create/edit route form | Web | 1 day | Routes list |
| Scheduled rides list | Web | 0.5 day | Rides API |
| Create scheduled ride form | Web | 1 day | Rides list |
| Publish/unpublish rides | Web | 0.5 day | Rides form |
| Bookings list (all) | Web | 1 day | Bookings API |
| Booking detail view | Web | 0.5 day | Bookings list |
| Payments reconciliation view | Web | 1 day | Payments API |

---

### Phase 1 Completion Checklist

- [ ] Customer can search and book group ride (mobile)
- [ ] Customer can search and book group ride (web)
- [ ] Payment via Instamojo working end-to-end
- [ ] Booking confirmation SMS sent
- [ ] Customer can view and cancel bookings
- [ ] Refunds processing correctly
- [ ] Admin can create routes and scheduled rides
- [ ] Admin can view all bookings and payments
- [ ] Landing page live with SEO

---

## PHASE 2: Individual Rides + Agency Portal (Week 7-9)

**Goal:** Enable on-demand ride requests with quote workflow.

### 2.1 Backend: Individual Ride APIs (Week 7)

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Implement ride request creation | Backend | 0.5 day | - |
| Implement lead listing for agencies | Backend | 0.5 day | Requests |
| Implement lead acceptance | Backend | 0.5 day | Leads |
| Implement quote creation | Backend | 0.5 day | Acceptance |
| Implement quote listing for customers | Backend | 0.5 day | Quotes |
| Implement quote selection | Backend | 0.5 day | Quote listing |
| Implement advance payment flow | Backend | 0.5 day | Selection |
| Implement driver/vehicle assignment | Backend | 0.5 day | Payment |
| Background job: expire quotes | Backend | 0.5 day | Quotes |
| Background job: expire leads | Backend | 0.5 day | Leads |
| Real-time quote notifications (Supabase) | Backend | 1 day | Quote creation |

---

### 2.2 Consumer Individual Ride Flow (Week 7-8) [PARALLEL]

**Tasks (Mobile + Web in parallel):**
| Task | Owner | Duration | Platform |
|------|-------|----------|----------|
| Request a Cab screen/page | Both | 1 day | Both |
| Location picker with map | Both | 1 day | Both |
| Waiting for quotes screen | Both | 0.5 day | Both |
| Real-time quote notifications | Both | 1 day | Both |
| Quotes list screen | Both | 1 day | Both |
| Quote details + pay advance | Both | 1 day | Both |
| Confirmed individual booking view | Both | 0.5 day | Both |

---

### 2.3 Agency Portal (Week 8-9)

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Agency registration flow | Web | 1 day | - |
| Agency dashboard | Web | 0.5 day | Registration |
| Leads inbox with filters | Web | 1 day | Leads API |
| Lead detail view | Web | 0.5 day | Leads inbox |
| Accept lead flow | Web | 0.5 day | Lead detail |
| Send quote form | Web | 1 day | Accept lead |
| Quote preview (customer view) | Web | 0.5 day | Send quote |
| Bookings list (agency) | Web | 0.5 day | Bookings API |
| Assign driver/vehicle modal | Web | 1 day | Bookings list |
| Drivers management CRUD | Web | 1 day | - |
| Vehicles management CRUD | Web | 1 day | - |
| Payments & settlement view | Web | 1 day | Payments API |

---

### 2.4 Admin: Agency Management (Week 9)

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Agencies list with status filter | Web | 0.5 day | Agencies API |
| Agency detail view (KYC docs) | Web | 0.5 day | Agency list |
| Approve/reject agency flow | Web | 0.5 day | Agency detail |
| Commission settings | Web | 0.5 day | Approval |
| All individual bookings view | Web | 0.5 day | Bookings API |

---

### Phase 2 Completion Checklist

- [ ] Customer can request individual ride
- [ ] Agency receives lead notification
- [ ] Agency can accept and send quote
- [ ] Customer sees quotes in real-time
- [ ] Customer can select quote and pay advance
- [ ] Agency can assign driver after payment
- [ ] Customer sees assigned driver details
- [ ] Admin can approve/reject agencies
- [ ] Agency can manage drivers and vehicles

---

## PHASE 3: Polish & Production Prep (Week 10-11)

### 3.1 Push Notifications [PARALLEL]

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Backend notification service | Backend | 1 day | FCM setup |
| Booking confirmed notification | Backend | 0.5 day | Service |
| Driver assigned notification | Backend | 0.5 day | Service |
| Quote received notification | Backend | 0.5 day | Service |
| Ride reminder (1hr before) | Backend | 0.5 day | Service |
| Mobile push handling | Mobile | 1 day | FCM |
| Deep linking from notifications | Mobile | 1 day | Push handling |

---

### 3.2 Real-time Updates

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Supabase Realtime subscription setup | Backend | 0.5 day | - |
| Live seat count updates | Frontend | 0.5 day | Realtime |
| Live booking status updates | Frontend | 0.5 day | Realtime |
| Live quote arrival | Frontend | 0.5 day | Realtime |

---

### 3.3 Support & Edge Cases

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Support ticket creation | Both | 0.5 day | - |
| Admin support dashboard | Web | 1 day | Tickets API |
| Driver cancellation flow | Backend | 0.5 day | - |
| Auto-refund on driver cancel | Backend | 0.5 day | Cancellation |
| Change phone number flow | Backend | 0.5 day | - |
| Ride status updates (driver app basic) | Mobile | 1 day | - |

---

### 3.4 Performance & Security

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| API response caching (Redis) | Backend | 0.5 day | - |
| Image optimization (landing) | Web | 0.5 day | - |
| Lighthouse audit + fixes | Web | 1 day | - |
| Mobile performance profiling | Mobile | 1 day | - |
| Security audit (OWASP top 10) | Backend | 1 day | - |
| Rate limit tuning | Backend | 0.5 day | - |
| SQL query optimization | DBA | 1 day | - |
| Add database indexes as needed | DBA | 0.5 day | Query audit |

---

### 3.5 Testing

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| E2E tests: group booking flow | QA | 1 day | - |
| E2E tests: individual booking flow | QA | 1 day | - |
| E2E tests: agency flow | QA | 1 day | - |
| E2E tests: admin flow | QA | 1 day | - |
| Load testing (k6/Artillery) | DevOps | 1 day | - |
| Payment failure scenarios | QA | 0.5 day | - |
| Edge case testing | QA | 1 day | - |

---

### Phase 3 Completion Checklist

- [ ] Push notifications working on Android
- [ ] Real-time updates showing correctly
- [ ] Support ticket flow complete
- [ ] All E2E tests passing
- [ ] Lighthouse score > 90 (web)
- [ ] No critical security vulnerabilities
- [ ] Load tested for 100 concurrent users

---

## PHASE 4: Deployment & Launch (Week 12+)

### 4.1 Production Infrastructure

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Railway/Render production setup | DevOps | 0.5 day | - |
| Supabase production project | DBA | 0.5 day | - |
| Run production migrations | DBA | 0.5 day | Supabase |
| Configure production env vars | DevOps | 0.5 day | All services |
| Set up custom domain (api.rewacab.com) | DevOps | 0.5 day | - |
| SSL certificate setup | DevOps | 0.5 day | Domain |
| Vercel production deploy (web) | DevOps | 0.5 day | - |
| Vercel production deploy (portal) | DevOps | 0.5 day | - |
| EAS production build (Android) | DevOps | 1 day | - |

---

### 4.2 Monitoring & Observability

**Tasks:**
| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Sentry production DSN | DevOps | 0.5 day | - |
| Set up uptime monitoring | DevOps | 0.5 day | Production |
| Configure log aggregation | DevOps | 0.5 day | Production |
| Set up alerts (PagerDuty/Slack) | DevOps | 0.5 day | Monitoring |
| Analytics setup (PostHog) | Frontend | 0.5 day | Production |

---

### 4.3 Go-Live Checklist

- [ ] All environment variables set in production
- [ ] Database migrations applied
- [ ] Instamojo switched to production mode
- [ ] SMS gateway switched to production
- [ ] Google Maps using production API key
- [ ] FCM using production credentials
- [ ] Custom domains configured with SSL
- [ ] Monitoring dashboards active
- [ ] Error alerting configured
- [ ] Backup strategy in place
- [ ] Rollback plan documented

---

### 4.4 Post-Launch (Week 13+)

**Immediate:**
- Monitor error rates and performance
- Fix critical bugs within 24 hours
- Gather user feedback

**Week 13-14:**
- Analytics review
- Performance optimization based on real data
- Bug fixes and UX improvements

---

## Parallel Work Matrix

This matrix shows which tracks can run simultaneously:

```
Week    Backend          Mobile           Web              DevOps
────    ───────          ──────           ───              ──────
1-2     Infrastructure   Infrastructure   Infrastructure   CI/CD Setup
3       Auth APIs        UI Components    UI Components    -
4       Booking APIs     Search Flow      Landing Page     -
5       Payments         Booking Flow     Booking Flow     -
6       Testing          My Bookings      Admin Portal     -
7       Individual APIs  Request Flow     Request Flow     -
8       Quotes APIs      Quotes Flow      Agency Portal    -
9       Notifications    -                Admin (Agency)   -
10      Polish           Push Notifs      Performance      -
11      Security         Testing          Testing          Load Testing
12      -                -                -                Deployment
```

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Instamojo integration delays | High | Start integration Week 1; have backup (Razorpay) |
| Google Maps API quota limits | Medium | Implement caching; request quota increase early |
| SMS delivery issues | High | Configure backup SMS provider |
| Seat double-booking race condition | High | Implemented via `lock_seats` stored procedure |
| Payment webhook failures | High | Implement retry queue + reconciliation job |
| Mobile app store rejection | Medium | Follow guidelines strictly; plan 2-week buffer |

---

## Definition of Done (DoD)

Each task is complete when:
1. Code reviewed and merged to main
2. Unit/integration tests passing
3. No TypeScript/Python type errors
4. No ESLint/Pylint warnings
5. Tested on target devices (mobile) or browsers (web)
6. API documentation updated (if applicable)
7. No regression in existing functionality

---

## Team Composition (Recommended)

| Role | Count | Responsibilities |
|------|-------|------------------|
| Backend Engineer | 2 | FastAPI, PostgreSQL, integrations |
| Mobile Engineer | 1-2 | React Native, Expo |
| Web Engineer | 2 | Next.js (web + portal) |
| DevOps Engineer | 1 | CI/CD, deployment, monitoring |
| UI/UX Designer | 1 | Design system, screens, user testing |
| QA Engineer | 1 | Testing, automation |
| DBA (Part-time) | 1 | Schema optimization, queries |

---

## Next Steps After This Document

**Before Implementation (STOP for approval):**

1. Review this roadmap with stakeholders
2. Confirm team allocation
3. Set up project management (Linear/Jira)
4. Create sprint boards based on phases
5. Schedule kickoff meeting

**Proceed to Phase 0 only after approval.**
