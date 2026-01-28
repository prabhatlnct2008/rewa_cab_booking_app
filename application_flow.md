Rewa Cab Booking Platform — Application Flow + UX/UI Look & Feel

Products
	•	Consumer Mobile App: React Native (Android-first)
	•	Consumer Web Booking + Landing Pages: Next.js (React)
	•	Admin + Agency/Driver Portals: Next.js (React)

Key concepts
	•	Group Rides (Pre-defined / Scheduled): Admin creates rides like Rewa → Prayagraj (Allahabad) 03:00 PM; users book seats; full payment required before ride start.
	•	Individual Rides (On-demand / Quote-based): User requests; agencies/drivers accept lead; send quote + required advance; user pays advance to confirm.
	•	OTP Login: Defer OTP until the payment step (and also for viewing “My Bookings”, cancellation, and viewing driver contact).
	•	Payments: Instamojo APIs (create payment, webhook verification, reconciliation).

⸻

1) Product Goals & Principles

Business goals
	•	Make it extremely easy for Rewa + nearby routes users to find scheduled rides.
	•	Convert anonymous browsers into paying customers via OTP at payment time, not earlier.
	•	Help agencies/drivers win more bookings via a clean lead + quote workflow.
	•	Keep operations simple: routes, schedules, seats, payments, and reconciliation.

UX principles
	1.	Fast search, low friction: browsing without login.
	2.	Trust-first UI: clear pricing, timing, seat availability, and policies.
	3.	One clear CTA per screen: avoid decision overload.
	4.	Mobile-first design: large tap targets, minimal typing.
	5.	Consistency across app and web: same UI language, icons, and terminology.

⸻

2) Brand & Look-and-Feel (Design System)

Brand personality (how it should feel)
	•	Reliable, local, modern, and clean — like a premium but affordable travel utility for Rewa.
	•	Safety + trust: clear badges, verified drivers/agencies, payment confirmation, support access.
	•	Speed + clarity: crisp typography, high contrast, minimal clutter.

Visual direction
	•	Layout: card-based UI, rounded corners, ample spacing.
	•	Typography: modern sans-serif (e.g., Inter on web; system font on mobile).
	•	Imagery: real route visuals + subtle local cues (Rewa/MP), but keep it minimal.
	•	Motion: very light animations (fade/slide) only to confirm actions.

Color palette (recommended)

Keep the palette limited and consistent across RN + Next.

	•	Primary: Deep Blue (trust)
	•	Secondary/Accent: Teal or Emerald (actions, highlights)
	•	Success: Green
	•	Warning: Amber
	•	Error: Red
	•	Neutrals: White background + light gray surfaces + dark text

UI components (shared across all surfaces)
	•	Buttons: Primary / Secondary / Text
	•	Inputs: Floating label or top label; clear error states
	•	Cards: Ride cards, quote cards, booking summary cards
	•	Badges: “Seats left”, “Verified”, “Best price”, “Fastest”, “Popular”
	•	Status chips: Draft / Pending payment / Confirmed / Completed / Cancelled
	•	Stepper: Booking steps (Search → Details → Pay → Confirm)
	•	Toasts: Payment success/failure, quote sent, booking confirmed

Accessibility & usability
	•	Minimum tap target: 44px
	•	Contrast: WCAG-friendly
	•	Font sizes: base 16px (web), readable in sunlight
	•	Use icons with labels (don’t rely on icons alone)

⸻

3) Information Architecture (How pages are organized)

Consumer App Navigation (Bottom Tabs)
	•	Home (search + quick routes)
	•	Rides (scheduled rides + requests)
	•	My Bookings
	•	Support

Consumer Web Navigation
	•	Top nav: Home, Routes, How it works, Support
	•	Sticky CTA: “Book Now”

Admin/Agency Portal Navigation
	•	Left sidebar: Dashboard, Routes, Scheduled Rides, Leads, Quotes, Bookings, Payments, Vehicles, Drivers, Agencies, Settings

⸻

4) Roles
	•	Customer (Consumer): browse, book scheduled rides, request individual rides, pay online, view bookings.
	•	Agency: manage drivers/vehicles; view leads; send quotes; assign driver after payment.
	•	Driver: see assigned trips; update status.
	•	Admin: define routes + scheduled rides; manage pricing; approve agencies; monitor bookings/payments.

⸻

5) Booking Types & Rules

A) Group Ride (Scheduled / Pre-defined)
	•	Created by admin with route + departure time + seat capacity + seat price
	•	User books seats
	•	Full payment required before ride starts

B) Individual Ride (Request → Quote → Advance)
	•	User submits request (pickup/drop/time/passengers)
	•	Agencies/drivers accept lead and send quote
	•	User selects a quote and pays advance
	•	After advance payment, booking becomes confirmed and driver/vehicle can be assigned

⸻

6) OTP Deferral Policy

OTP is required at:
	•	Proceed to Pay (group full payment / individual advance payment)
	•	Viewing My Bookings (if not logged in)
	•	Cancelling/refund requests
	•	Viewing driver contact details

OTP is NOT required for:
	•	Browsing routes
	•	Viewing scheduled ride list
	•	Filling passenger details (until payment)

⸻

7) Consumer App + Web Screens (Detailed)

Below are screens with purpose, key UI elements, and CTA. This is the shared blueprint for RN + Next.

7.1 Home Screen (App) / Landing Header (Web)

Purpose: Quick search + trust + conversion.

UI blocks
	•	Search card: From, To, Date, Passengers
	•	Quick routes chips (examples): Rewa→Prayagraj, Rewa→Satna, Rewa→Varanasi (config)
	•	Trust row: Verified drivers/agencies, Secure payments, 24×7 support
	•	CTA: Search Rides

Look & feel notes
	•	Hero uses a clean background + subtle map pattern
	•	Big, bold headline; one primary CTA

⸻

7.2 Search Results (Scheduled Rides)

Purpose: Show available scheduled rides quickly.

UI elements
	•	Filter row: Date, Time window, Vehicle type
	•	Ride cards (each card shows):
	•	Departure time
	•	Expected arrival time / duration
	•	Seats left
	•	Price per seat
	•	Agency badge (optional)
	•	Sorting: “Cheapest”, “Earliest”, “Most seats”

CTA: Tap ride card → Ride Details

⸻

7.3 Ride Details (Group Ride)

Purpose: Confirm ride details and build trust.

UI elements
	•	Route summary: From → To
	•	Departure time + arrival estimate
	•	Seat availability
	•	Price breakdown: price/seat × passengers
	•	Policy snippet: cancellation/refund rules
	•	Mini map preview (optional)

CTA: Continue → Passenger Details

⸻

7.4 Passenger Details

Purpose: Collect passenger info with minimal friction.

Fields
	•	Number of passengers (stepper)
	•	Passenger names (optional for each passenger) or “Primary passenger name” only
	•	Phone number (required at OTP stage, can be captured here as placeholder)
	•	Luggage notes (optional)

CTA: Proceed to Pay

UX note: If user is not verified, show: “Verify mobile to continue” on next step.

⸻

7.5 OTP Screen (Deferred)

Purpose: Convert anonymous to verified user.

UI elements
	•	Phone input
	•	“Send OTP”
	•	OTP input boxes
	•	Timer + resend
	•	Privacy text: “We use your number only for trip updates.”

CTA: Verify & Continue

⸻

7.6 Payment Screen (Instamojo)

Purpose: Collect payment and confirm booking.

UI elements
	•	Booking summary (route, time, passengers, amount)
	•	Payment method label (Instamojo)
	•	Button: “Pay ₹X”

Flow
	•	Create payment request → redirect to Instamojo → return to success/failure

⸻

7.7 Booking Confirmation

Purpose: Celebrate + provide key info.

UI elements
	•	Big success check
	•	Booking ID
	•	Pickup instructions + departure time
	•	Support CTA
	•	“Add to Calendar” (optional)

CTA: View Booking / Back to Home

⸻

7.8 My Bookings

Purpose: Central hub for active bookings.

UI elements
	•	Tabs: Upcoming / Past / Cancelled
	•	Booking cards: route, date/time, status chip, payment status

CTA: Tap booking card → Booking Details

⸻

7.9 Booking Details

Purpose: Show full booking lifecycle and contact details.

UI elements
	•	Timeline: Pending payment → Confirmed → Started → Completed
	•	Payment details: amount, status, transaction ID
	•	Driver/vehicle details (only if assigned)
	•	Support + cancel button (with policy)

⸻

8) Individual Ride Request Screens (Consumer)

8.1 Request a Cab

Purpose: Submit a lead for agencies/drivers.

Fields
	•	Pickup location (map + autocomplete)
	•	Drop location
	•	Date/time picker
	•	Passengers
	•	Vehicle preference (Hatchback/Sedan/SUV)
	•	Notes (optional)

CTA: Request Quotes

⸻

8.2 Waiting for Quotes

Purpose: Keep user engaged after request.

UI elements
	•	Status: “Finding drivers near you…”
	•	Live updates
	•	Tip: “You’ll receive multiple quotes. Choose the best.”

CTA: none / back

⸻

8.3 Quotes List

Purpose: Compare offers quickly.

Quote card elements
	•	Agency/driver name + verification badge
	•	Total price
	•	Advance required
	•	ETA for pickup (optional)
	•	Validity countdown

CTA: Select Quote

⸻

8.4 Quote Details + Pay Advance

Purpose: Confirm quote and pay advance.

UI elements
	•	Full quote breakdown
	•	Advance amount highlighted
	•	Terms (what happens after advance)

CTA: Proceed to Pay → OTP (if not verified) → Instamojo

⸻

8.5 Confirmed Individual Ride Details

Purpose: Show confirmation + next steps.

UI elements
	•	Booking ID
	•	Advance paid status
	•	Agency contact
	•	“Driver will be assigned soon” or assigned driver details

⸻

9) Agency/Driver Portal Screens (Detailed)

9.1 Login (OTP)
	•	Phone input → OTP verify

9.2 Agency Dashboard
	•	KPIs: New leads, Quotes sent, Confirmed today, Revenue (gross)
	•	Quick actions: View Leads, Add Vehicle, Add Driver

9.3 Leads Inbox
	•	Filters: New / Accepted / Quoted / Expired
	•	Lead cards: route/pickup/drop, time, passengers, notes

9.4 Lead Detail
	•	Map preview
	•	Customer request details
	•	Buttons: Accept Lead, Send Quote

9.5 Send Quote
	•	Fields: Total price, Advance amount, Valid till, Message
	•	Preview card shown to customer
	•	CTA: Send

9.6 Bookings
	•	Upcoming / Completed
	•	Each booking shows payment status

9.7 Assign Driver & Vehicle
	•	Select driver
	•	Select vehicle
	•	Confirm assignment

9.8 Drivers Management
	•	Add/edit driver, documents, active status

9.9 Vehicles Management
	•	Add/edit vehicle, capacity, status

9.10 Payments & Settlement
	•	Paid advances list
	•	Payout rules (admin-controlled)

Driver View (minimal)
	•	Trips list → Trip details → status updates

⸻

10) Admin Portal Screens (Detailed)

10.1 Admin Dashboard
	•	Total bookings (group/individual)
	•	Payment success rate
	•	Active scheduled rides

10.2 Routes

Create route with Google Maps
	•	Input: Location A, Location B (Places Autocomplete)
	•	Auto-calc: distance, ETA
	•	Set defaults: vehicle types allowed, base pricing

10.3 Scheduled Group Rides
	•	Create ride instance: route, departure time, seat capacity, price per seat
	•	Assign agency (optional)
	•	Publish/unpublish

10.4 Agencies
	•	Approve/reject
	•	Commission settings
	•	KYC docs

10.5 Bookings
	•	All bookings with filters

10.6 Payments
	•	Instamojo reconciliation
	•	Refund triggers (policy)

10.7 Pricing Rules
	•	Seat pricing templates
	•	Optional: holiday pricing, peak time pricing

10.8 Support & Disputes
	•	Tickets, cancellations, refunds

⸻

11) UI Guidelines Per Surface

Landing pages (Next.js)

Must feel premium and local
	•	Hero headline: clear value + location relevance
	•	Social proof: “Trusted by Rewa travellers” (real testimonials later)
	•	Route highlights: top destinations
	•	How it works: 3 steps
	•	Sticky CTA: Book Now

Consumer booking web (Next.js)
	•	Same search + ride list as app
	•	Keep it distraction-free: no heavy sections during checkout

App (React Native)
	•	Large CTAs
	•	Minimal typing using Places autocomplete
	•	Clear “Seats left” and “Full payment required” message on group ride screens

Admin/Agency portals
	•	Dense but clean: tables + filters + export
	•	Consistent status chips
	•	Actions are always on right side (Send Quote / Assign / Approve)

⸻

12) Key Data Objects (Minimum)
	•	User: id, phone, role
	•	Route: from_place_id, to_place_id, distance_km, eta_minutes
	•	ScheduledRide: route_id, departure_time, arrival_estimate, seat_capacity, seat_price
	•	Booking: type (group/individual), status, passengers_count
	•	RideRequest (lead): pickup/drop, datetime, passengers, notes
	•	Quote: total_price, advance_amount, valid_till, status
	•	Vehicle, Driver
	•	Payment: provider=Instamojo, amount, status, provider ids, booking_id

⸻

13) Booking State Machine (Simple)

Group booking
	•	draft → pending_payment → confirmed → completed
	•	draft/pending_payment → cancelled (timeout)

Individual booking
	•	request_created → quotes_received → quote_selected → pending_advance_payment → confirmed → completed

⸻

14) Copy Guidelines (Microcopy that improves conversion)
	•	Replace generic labels:
	•	“Search rides” → Find Rides
	•	“Proceed” → Continue to Payment
	•	“OTP” → Verify Mobile
	•	Trust microcopy near payment:
	•	“Secure payment powered by Instamojo.”
	•	Policy microcopy for group rides:
	•	“Group rides require full payment to confirm your seat.”

⸻

15) MVP-first Screen Priority (What to build first)

Phase 1 (Core)
	•	Consumer: Home → Search → Ride list → Ride details → Passenger details → OTP → Payment → Confirmation → My bookings
	•	Admin: Routes → Scheduled rides → Bookings → Payments

Phase 2 (Individual request)
	•	Consumer: Request → Quotes → Pay advance → Confirmed
	•	Agency: Leads → Quote → Assign

Phase 3 (Polish)
	•	Push notifications, analytics, refunds automation, surge/holiday pricing

⸻

16) Deliverables Checklist (Design & Engineering)
	•	Design tokens: colors, radius, spacing, typography
	•	Component library: buttons, cards, badges, inputs, stepper
	•	Screen designs: all screens listed above (app + web + portals)
	•	API contracts: booking, route, ride, quote, payment
	•	Payment webhooks: Instamojo success/failure mapping

⸻
