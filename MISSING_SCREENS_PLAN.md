# Missing Screens Implementation Plan

## Overview

This document outlines the plan to complete all missing screens identified in `application_flow.md`. The implementation is divided into 4 phases, prioritizing the core consumer booking flow first.

---

## Phase 1: Consumer Web - Landing Page & Booking Flow (Priority: Critical)

### 1.1 Landing Page Redesign
**File:** `apps/web/app/page.tsx`

Complete landing page with all sections:
- Hero with headline, subheadline, CTAs
- Quick search block
- Two Ways to Travel section
- Popular Routes cards
- Why People Choose Us (trust)
- How It Works (3 steps)
- App Download section
- Testimonials
- FAQ accordion
- Footer with final CTA

### 1.2 Search Results Page
**File:** `apps/web/app/search/page.tsx`

- Filter row: Date, Time window, Vehicle type
- Ride cards with departure time, arrival, seats left, price
- Sorting: Cheapest, Earliest, Most seats
- Empty state when no rides found

### 1.3 Ride Details Page
**File:** `apps/web/app/rides/[id]/page.tsx`

- Route summary (From → To)
- Departure + arrival estimate
- Seat availability visualization
- Price breakdown
- Cancellation policy snippet
- Continue CTA → Passenger Details

### 1.4 Passenger Details Page
**File:** `apps/web/app/book/[rideId]/page.tsx`

- Passenger count stepper
- Passenger name fields
- Phone number input
- Luggage notes (optional)
- Proceed to Pay CTA

### 1.5 OTP Verification Page
**File:** `apps/web/app/verify/page.tsx`

- Phone input (pre-filled from previous step)
- Send OTP button
- OTP input boxes (4-6 digits)
- Timer + resend
- Privacy text
- Verify & Continue CTA

### 1.6 Payment Page
**File:** `apps/web/app/payment/[bookingId]/page.tsx`

- Booking summary card
- Payment method (Instamojo)
- Pay ₹X button
- Redirect handling

### 1.7 Booking Confirmation Page
**File:** `apps/web/app/confirmation/[bookingId]/page.tsx`

- Success checkmark animation
- Booking ID display
- Pickup instructions
- Departure time
- Add to Calendar button
- Support CTA
- View Booking / Back to Home

### 1.8 My Bookings Page
**File:** `apps/web/app/bookings/page.tsx`

- Tabs: Upcoming / Past / Cancelled
- Booking cards with route, date, status chip
- Empty states per tab

### 1.9 Booking Details Page
**File:** `apps/web/app/bookings/[id]/page.tsx`

- Timeline: Pending → Confirmed → Started → Completed
- Payment details
- Driver/vehicle info (when assigned)
- Cancel button with policy modal
- Support CTA

---

## Phase 2: Individual Ride Request Flow (Priority: High)

### 2.1 Request a Cab Page
**File:** `apps/web/app/request/page.tsx`

- Pickup location (autocomplete)
- Drop location (autocomplete)
- Date/time picker
- Passengers stepper
- Vehicle preference (Hatchback/Sedan/SUV)
- Notes textarea
- Request Quotes CTA

### 2.2 Waiting for Quotes Page
**File:** `apps/web/app/request/[id]/waiting/page.tsx`

- Animated status indicator
- "Finding drivers near you..."
- Tips carousel
- Back button

### 2.3 Quotes List Page
**File:** `apps/web/app/request/[id]/quotes/page.tsx`

- Quote cards with:
  - Agency name + badge
  - Total price
  - Advance required
  - ETA (optional)
  - Validity countdown
- Select Quote CTA per card

### 2.4 Quote Details + Pay Advance Page
**File:** `apps/web/app/request/[id]/quotes/[quoteId]/page.tsx`

- Full quote breakdown
- Advance amount highlighted
- Terms & conditions
- Proceed to Pay → OTP → Instamojo

### 2.5 Confirmed Individual Ride Page
**File:** `apps/web/app/request/[id]/confirmed/page.tsx`

- Booking ID
- Advance paid status
- Agency contact
- Driver assignment status
- Support CTA

---

## Phase 3: Admin Portal Additions (Priority: Medium)

### 3.1 Pricing Rules Page
**File:** `apps/portal/app/(dashboard)/pricing/page.tsx`

- Pricing templates table
- Create/Edit pricing rule modal
- Route-based pricing
- Holiday/peak pricing toggles
- Vehicle type multipliers

### 3.2 Support & Disputes Page
**File:** `apps/portal/app/(dashboard)/support/page.tsx`

- Tickets table with filters
- Ticket status: Open, In Progress, Resolved
- Ticket detail slide-over
- Refund action buttons
- Resolution notes

### 3.3 Assign Driver/Vehicle Modal
**File:** `apps/portal/components/AssignDriverModal.tsx`

- Driver dropdown (available drivers)
- Vehicle dropdown (available vehicles)
- Confirmation button
- Used in Bookings page

---

## Phase 4: Mobile App Screens (Priority: Medium)

### 4.1 Search Results Screen
**File:** `apps/mobile/app/(tabs)/search.tsx`

- FlatList of ride cards
- Pull-to-refresh
- Filter bottom sheet

### 4.2 Ride Details Screen
**File:** `apps/mobile/app/ride/[id].tsx`

- Route summary
- Seat selector
- Price breakdown
- Book Now CTA

### 4.3 Passenger Details Screen
**File:** `apps/mobile/app/book/[rideId].tsx`

- Form inputs
- Keyboard avoiding view
- Continue CTA

### 4.4 My Bookings Tab
**File:** `apps/mobile/app/(tabs)/bookings.tsx`

- Segment control: Upcoming/Past
- Booking cards
- Pull-to-refresh

### 4.5 Booking Details Screen
**File:** `apps/mobile/app/booking/[id].tsx`

- Timeline view
- Driver contact card
- Cancel/Support actions

### 4.6 Request Cab Screen
**File:** `apps/mobile/app/request/index.tsx`

- Location inputs
- Date/time picker
- Submit request

### 4.7 Quotes Screen
**File:** `apps/mobile/app/request/[id]/quotes.tsx`

- Quote cards
- Select & pay flow

### 4.8 Support Tab
**File:** `apps/mobile/app/(tabs)/support.tsx`

- FAQ accordion
- Contact options (Call, WhatsApp)
- Create ticket form

---

## Phase 5: Driver Portal (Priority: Low)

### 5.1 Driver Login
**File:** `apps/portal/app/(driver)/login/page.tsx`

- OTP login for drivers

### 5.2 Driver Trips List
**File:** `apps/portal/app/(driver)/trips/page.tsx`

- Assigned trips
- Status filters
- Trip cards

### 5.3 Driver Trip Details
**File:** `apps/portal/app/(driver)/trips/[id]/page.tsx`

- Passenger info
- Route details
- Status update buttons (Started, Completed)

---

## Implementation Order

| Order | Screen/Feature | Est. Files | Priority |
|-------|---------------|------------|----------|
| 1 | Landing Page (full copy) | 1 | Critical |
| 2 | Search Results | 1 | Critical |
| 3 | Ride Details | 1 | Critical |
| 4 | Passenger Details | 1 | Critical |
| 5 | OTP Verification | 1 | Critical |
| 6 | Payment Page | 1 | Critical |
| 7 | Booking Confirmation | 1 | Critical |
| 8 | My Bookings + Details | 2 | Critical |
| 9 | Request a Cab Flow | 5 | High |
| 10 | Admin Pricing Rules | 1 | Medium |
| 11 | Admin Support/Disputes | 1 | Medium |
| 12 | Assign Driver Modal | 1 | Medium |
| 13 | Mobile Screens | 8 | Medium |
| 14 | Driver Portal | 3 | Low |

---

## Shared Components to Create

### Web (`apps/web/components/`)
- `SearchBox.tsx` - Reusable search form
- `RideCard.tsx` - Ride listing card
- `BookingSummary.tsx` - Summary sidebar/card
- `OTPInput.tsx` - 6-digit OTP input
- `Timeline.tsx` - Booking status timeline
- `QuoteCard.tsx` - Agency quote card
- `FAQ.tsx` - Accordion FAQ component

### Mobile (`apps/mobile/components/`)
- `RideCard.tsx` - Mobile ride card
- `BookingCard.tsx` - Booking list item
- `QuoteCard.tsx` - Quote comparison card
- `OTPInput.tsx` - OTP boxes

---

## Dependencies

All screens will use:
- `@rewa/ui` - Shared UI components
- `@rewa/api-client` - API hooks
- `@rewa/types` - TypeScript types
- `date-fns` - Date formatting
- `lucide-react` - Icons

---

## Notes

1. **OTP Deferral**: OTP is only required at payment, not for browsing
2. **Seat Locking**: 10-minute lock when user starts booking
3. **Payment Flow**: Create booking → Lock seats → OTP verify → Instamojo redirect → Webhook confirms
4. **Mobile-First**: All web screens must be responsive
5. **Accessibility**: 44px tap targets, WCAG contrast, labels with icons
