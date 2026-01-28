# API_INTERFACE.md — Rewa Cab Booking Platform

## Base Configuration

```
Base URL (Production): https://api.rewacab.com/api/v1
Base URL (Development): http://localhost:8000/api/v1

Content-Type: application/json
Authentication: Bearer <JWT_ACCESS_TOKEN>
```

## Authentication

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 1. Authentication Endpoints

### 1.1 Send OTP

```http
POST /auth/otp/send
```

**Request:**
```json
{
  "phone": "+919876543210"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expires_in_seconds": 300
}
```

**Errors:**
- `429` - Rate limit exceeded (3 attempts per 5 minutes)
- `400` - Invalid phone number format

---

### 1.2 Verify OTP

```http
POST /auth/otp/verify
```

**Request:**
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "phone": "+919876543210",
    "role": "customer",
    "full_name": null,
    "is_new_user": true
  },
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 900
  }
}
```

**Errors:**
- `400` - Invalid OTP
- `410` - OTP expired

---

### 1.3 Refresh Token

```http
POST /auth/refresh
```

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 900
}
```

---

### 1.4 Logout

```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true
}
```

---

## 2. User Endpoints

### 2.1 Get Current User

```http
GET /users/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "phone": "+919876543210",
  "full_name": "Raj Kumar",
  "email": "raj@example.com",
  "role": "customer",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 2.2 Update Profile

```http
PATCH /users/me
Authorization: Bearer <token>
```

**Request:**
```json
{
  "full_name": "Raj Kumar",
  "email": "raj@example.com"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "phone": "+919876543210",
  "full_name": "Raj Kumar",
  "email": "raj@example.com"
}
```

---

## 3. Routes Endpoints

### 3.1 List Popular Routes

```http
GET /routes?popular=true
```

**Response (200):**
```json
{
  "routes": [
    {
      "id": "uuid",
      "slug": "rewa-to-prayagraj",
      "from": {
        "id": "uuid",
        "name": "Rewa",
        "city": "Rewa"
      },
      "to": {
        "id": "uuid",
        "name": "Prayagraj (Allahabad)",
        "city": "Prayagraj"
      },
      "distance_km": 130.0,
      "duration_minutes": 180,
      "base_price_per_seat": 400.00
    }
  ]
}
```

---

### 3.2 Get Route by Slug (SEO)

```http
GET /routes/rewa-to-prayagraj
```

**Response (200):**
```json
{
  "id": "uuid",
  "slug": "rewa-to-prayagraj",
  "from": { "id": "uuid", "name": "Rewa", "city": "Rewa", "latitude": 24.5333, "longitude": 81.3000 },
  "to": { "id": "uuid", "name": "Prayagraj", "city": "Prayagraj", "latitude": 25.4358, "longitude": 81.8463 },
  "distance_km": 130.0,
  "duration_minutes": 180,
  "polyline": "encoded_polyline_string",
  "base_price_per_seat": 400.00,
  "seo": {
    "title": "Rewa to Prayagraj Cab Booking | RewaCab",
    "description": "Book affordable cab from Rewa to Prayagraj. 130 km, 3 hours. Starting at ₹400/seat.",
    "keywords": ["rewa to prayagraj cab", "rewa to allahabad taxi"]
  }
}
```

---

### 3.3 Search Places (Autocomplete)

```http
GET /places/autocomplete?query=Rewa
```

**Response (200):**
```json
{
  "predictions": [
    {
      "place_id": "ChIJxxxxxxRewa",
      "name": "Rewa",
      "formatted_address": "Rewa, Madhya Pradesh, India"
    }
  ]
}
```

---

## 4. Scheduled Rides (Group Booking) Endpoints

### 4.1 Search Scheduled Rides

```http
GET /scheduled-rides?from_place_id=uuid&to_place_id=uuid&date=2024-02-15&passengers=2
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| from_place_id | uuid | Yes | Departure place ID |
| to_place_id | uuid | Yes | Destination place ID |
| date | date | Yes | Travel date (YYYY-MM-DD) |
| passengers | int | No | Number of passengers (default: 1) |
| vehicle_type | string | No | Filter by vehicle type |
| sort | string | No | `cheapest`, `earliest`, `seats` |

**Response (200):**
```json
{
  "rides": [
    {
      "id": "uuid",
      "route": {
        "from": { "name": "Rewa" },
        "to": { "name": "Prayagraj" }
      },
      "departure_time": "2024-02-15T15:00:00+05:30",
      "arrival_estimate": "2024-02-15T18:00:00+05:30",
      "duration_minutes": 180,
      "seat_capacity": 6,
      "seats_available": 4,
      "price_per_seat": 400.00,
      "vehicle_type": "suv",
      "agency": {
        "name": "Rewa Travels",
        "is_verified": true
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 5
  }
}
```

---

### 4.2 Get Scheduled Ride Details

```http
GET /scheduled-rides/{ride_id}
```

**Response (200):**
```json
{
  "id": "uuid",
  "route": {
    "id": "uuid",
    "from": { "id": "uuid", "name": "Rewa", "city": "Rewa" },
    "to": { "id": "uuid", "name": "Prayagraj", "city": "Prayagraj" },
    "distance_km": 130.0
  },
  "departure_time": "2024-02-15T15:00:00+05:30",
  "arrival_estimate": "2024-02-15T18:00:00+05:30",
  "seat_capacity": 6,
  "seats_available": 4,
  "price_per_seat": 400.00,
  "vehicle_type": "suv",
  "agency": {
    "id": "uuid",
    "name": "Rewa Travels",
    "is_verified": true,
    "rating": 4.5
  },
  "policies": {
    "cancellation": "Full refund if cancelled 24+ hours before departure. 50% refund for 12-24 hours. No refund within 12 hours.",
    "payment": "Full payment required to confirm booking."
  }
}
```

---

### 4.3 Lock Seats (Before Payment)

```http
POST /scheduled-rides/{ride_id}/lock-seats
Authorization: Bearer <token>
```

**Request:**
```json
{
  "passengers_count": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "lock_id": "uuid",
  "expires_at": "2024-02-15T10:40:00Z",
  "seats_locked": 2
}
```

**Errors:**
- `409` - Insufficient seats available

---

## 5. Booking Endpoints

### 5.1 Create Group Booking (Draft)

```http
POST /bookings/group
Authorization: Bearer <token>
```

**Request:**
```json
{
  "scheduled_ride_id": "uuid",
  "passengers_count": 2,
  "passenger_details": [
    { "name": "Raj Kumar", "phone": "+919876543210" },
    { "name": "Priya Kumar" }
  ],
  "luggage_notes": "2 medium bags"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "booking_number": "RWC-2024-00123",
  "status": "draft",
  "scheduled_ride": {
    "id": "uuid",
    "departure_time": "2024-02-15T15:00:00+05:30",
    "route": { "from": "Rewa", "to": "Prayagraj" }
  },
  "passengers_count": 2,
  "total_amount": 800.00,
  "created_at": "2024-02-14T10:30:00Z"
}
```

---

### 5.2 Initiate Payment

```http
POST /bookings/{booking_id}/pay
Authorization: Bearer <token>
```

**Request:**
```json
{
  "payment_type": "full",
  "redirect_url": "https://web.rewacab.com/booking/success"
}
```

**Response (200):**
```json
{
  "payment_id": "uuid",
  "payment_url": "https://instamojo.com/pay/xxxxxx",
  "amount": 800.00,
  "expires_at": "2024-02-14T10:45:00Z"
}
```

---

### 5.3 Get Booking Details

```http
GET /bookings/{booking_id}
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "booking_number": "RWC-2024-00123",
  "booking_type": "group",
  "status": "confirmed",
  "scheduled_ride": {
    "id": "uuid",
    "departure_time": "2024-02-15T15:00:00+05:30",
    "arrival_estimate": "2024-02-15T18:00:00+05:30",
    "route": {
      "from": { "name": "Rewa" },
      "to": { "name": "Prayagraj" }
    },
    "vehicle_type": "suv"
  },
  "passengers_count": 2,
  "passenger_details": [
    { "name": "Raj Kumar", "phone": "+919876543210" }
  ],
  "total_amount": 800.00,
  "payment_status": "completed",
  "driver": {
    "name": "Amit Singh",
    "phone": "+919123456789",
    "rating": 4.7
  },
  "vehicle": {
    "registration": "MP20-AB-1234",
    "type": "suv",
    "model": "Toyota Innova"
  },
  "timeline": [
    { "status": "draft", "timestamp": "2024-02-14T10:30:00Z" },
    { "status": "pending_payment", "timestamp": "2024-02-14T10:31:00Z" },
    { "status": "confirmed", "timestamp": "2024-02-14T10:35:00Z" }
  ],
  "created_at": "2024-02-14T10:30:00Z"
}
```

---

### 5.4 List My Bookings

```http
GET /bookings?status=upcoming
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | `upcoming`, `past`, `cancelled` |
| page | int | Page number |
| per_page | int | Items per page (default: 20) |

**Response (200):**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "booking_number": "RWC-2024-00123",
      "booking_type": "group",
      "status": "confirmed",
      "pickup_time": "2024-02-15T15:00:00+05:30",
      "route": {
        "from": "Rewa",
        "to": "Prayagraj"
      },
      "passengers_count": 2,
      "total_amount": 800.00,
      "payment_status": "completed"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 5
  }
}
```

---

### 5.5 Cancel Booking

```http
POST /bookings/{booking_id}/cancel
Authorization: Bearer <token>
```

**Request:**
```json
{
  "reason": "Change of plans"
}
```

**Response (200):**
```json
{
  "success": true,
  "refund": {
    "eligible": true,
    "amount": 800.00,
    "percentage": 100,
    "status": "processing",
    "expected_by": "2024-02-17T00:00:00Z"
  }
}
```

---

## 6. Individual Ride Request Endpoints

### 6.1 Create Ride Request

```http
POST /ride-requests
Authorization: Bearer <token>
```

**Request:**
```json
{
  "pickup_place_id": "uuid",
  "drop_place_id": "uuid",
  "pickup_address": "Near City Mall, Rewa",
  "drop_address": "Allahabad Junction",
  "requested_datetime": "2024-02-15T08:00:00+05:30",
  "passengers_count": 3,
  "vehicle_preference": "suv",
  "notes": "Need child seat"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "status": "new",
  "pickup": { "name": "Rewa", "address": "Near City Mall, Rewa" },
  "drop": { "name": "Prayagraj", "address": "Allahabad Junction" },
  "requested_datetime": "2024-02-15T08:00:00+05:30",
  "passengers_count": 3,
  "expires_at": "2024-02-14T18:00:00Z",
  "created_at": "2024-02-14T12:00:00Z"
}
```

---

### 6.2 Get Ride Request with Quotes

```http
GET /ride-requests/{request_id}
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "status": "quotes_received",
  "pickup": { "name": "Rewa" },
  "drop": { "name": "Prayagraj" },
  "requested_datetime": "2024-02-15T08:00:00+05:30",
  "passengers_count": 3,
  "quotes": [
    {
      "id": "uuid",
      "agency": {
        "name": "Rewa Travels",
        "is_verified": true,
        "rating": 4.5
      },
      "total_price": 2500.00,
      "advance_amount": 500.00,
      "vehicle_type": "suv",
      "estimated_pickup_time": "2024-02-15T07:45:00+05:30",
      "message": "Comfortable Innova with AC",
      "valid_until": "2024-02-14T18:00:00Z"
    }
  ]
}
```

---

### 6.3 Select Quote & Create Booking

```http
POST /ride-requests/{request_id}/select-quote
Authorization: Bearer <token>
```

**Request:**
```json
{
  "quote_id": "uuid",
  "passenger_details": [
    { "name": "Raj Kumar", "phone": "+919876543210" }
  ]
}
```

**Response (200):**
```json
{
  "booking": {
    "id": "uuid",
    "booking_number": "RWC-2024-00124",
    "status": "pending_advance",
    "quote": {
      "total_price": 2500.00,
      "advance_amount": 500.00
    }
  }
}
```

---

## 7. Agency/Driver Portal Endpoints

### 7.1 Get Agency Dashboard

```http
GET /agency/dashboard
Authorization: Bearer <token>
Role: agency
```

**Response (200):**
```json
{
  "stats": {
    "new_leads": 5,
    "quotes_sent_today": 12,
    "confirmed_today": 3,
    "revenue_this_month": 45000.00
  },
  "recent_leads": [...],
  "upcoming_trips": [...]
}
```

---

### 7.2 List Leads

```http
GET /agency/leads?status=new
Authorization: Bearer <token>
Role: agency
```

**Response (200):**
```json
{
  "leads": [
    {
      "id": "uuid",
      "status": "new",
      "pickup": { "name": "Rewa" },
      "drop": { "name": "Prayagraj" },
      "requested_datetime": "2024-02-15T08:00:00+05:30",
      "passengers_count": 3,
      "vehicle_preference": "suv",
      "notes": "Need child seat",
      "created_at": "2024-02-14T12:00:00Z"
    }
  ]
}
```

---

### 7.3 Accept Lead

```http
POST /agency/leads/{request_id}/accept
Authorization: Bearer <token>
Role: agency
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lead accepted. You can now send a quote."
}
```

---

### 7.4 Send Quote

```http
POST /agency/leads/{request_id}/quote
Authorization: Bearer <token>
Role: agency
```

**Request:**
```json
{
  "total_price": 2500.00,
  "advance_amount": 500.00,
  "vehicle_type": "suv",
  "estimated_pickup_time": "2024-02-15T07:45:00+05:30",
  "message": "Comfortable Innova with AC",
  "valid_for_hours": 6
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "status": "sent",
  "valid_until": "2024-02-14T18:00:00Z"
}
```

---

### 7.5 Assign Driver & Vehicle

```http
POST /agency/bookings/{booking_id}/assign
Authorization: Bearer <token>
Role: agency
```

**Request:**
```json
{
  "driver_id": "uuid",
  "vehicle_id": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "booking": {
    "id": "uuid",
    "status": "driver_assigned",
    "driver": { "name": "Amit Singh", "phone": "+919123456789" },
    "vehicle": { "registration": "MP20-AB-1234" }
  }
}
```

---

### 7.6 List Agency Vehicles

```http
GET /agency/vehicles
Authorization: Bearer <token>
Role: agency
```

---

### 7.7 Add Vehicle

```http
POST /agency/vehicles
Authorization: Bearer <token>
Role: agency
```

**Request:**
```json
{
  "registration_number": "MP20-AB-1234",
  "vehicle_type": "suv",
  "make": "Toyota",
  "model": "Innova Crysta",
  "year": 2022,
  "seat_capacity": 7,
  "color": "White"
}
```

---

### 7.8 List Agency Drivers

```http
GET /agency/drivers
Authorization: Bearer <token>
Role: agency
```

---

### 7.9 Add Driver

```http
POST /agency/drivers
Authorization: Bearer <token>
Role: agency
```

**Request:**
```json
{
  "full_name": "Amit Singh",
  "phone": "+919123456789",
  "license_number": "MP2020210012345",
  "license_expiry": "2028-05-15"
}
```

---

## 8. Admin Endpoints

### 8.1 Admin Dashboard

```http
GET /admin/dashboard
Authorization: Bearer <token>
Role: admin
```

**Response (200):**
```json
{
  "stats": {
    "total_bookings_today": 45,
    "group_bookings": 32,
    "individual_bookings": 13,
    "payment_success_rate": 94.5,
    "active_scheduled_rides": 28,
    "pending_agencies": 3
  }
}
```

---

### 8.2 Create Route

```http
POST /admin/routes
Authorization: Bearer <token>
Role: admin
```

**Request:**
```json
{
  "from_place_id": "uuid",
  "to_place_id": "uuid",
  "slug": "rewa-to-jabalpur",
  "distance_km": 200.0,
  "duration_minutes": 240,
  "base_price_per_seat": 550.00,
  "is_popular": false
}
```

---

### 8.3 Create Scheduled Ride

```http
POST /admin/scheduled-rides
Authorization: Bearer <token>
Role: admin
```

**Request:**
```json
{
  "route_id": "uuid",
  "departure_time": "2024-02-15T15:00:00+05:30",
  "seat_capacity": 6,
  "price_per_seat": 400.00,
  "vehicle_type": "suv",
  "agency_id": "uuid",
  "is_published": true
}
```

---

### 8.4 List Agencies (with approval)

```http
GET /admin/agencies?status=pending_approval
Authorization: Bearer <token>
Role: admin
```

---

### 8.5 Approve/Reject Agency

```http
POST /admin/agencies/{agency_id}/review
Authorization: Bearer <token>
Role: admin
```

**Request:**
```json
{
  "action": "approve",
  "commission_percent": 10.0,
  "notes": "Documents verified"
}
```

---

### 8.6 All Bookings (Admin View)

```http
GET /admin/bookings?date=2024-02-15&status=confirmed
Authorization: Bearer <token>
Role: admin
```

---

### 8.7 Payment Reconciliation

```http
GET /admin/payments?status=completed&date_from=2024-02-01&date_to=2024-02-15
Authorization: Bearer <token>
Role: admin
```

---

## 9. Payment Webhook

### 9.1 Instamojo Webhook

```http
POST /webhooks/instamojo
X-Instamojo-Signature: <signature>
```

**Payload (from Instamojo):**
```json
{
  "payment_id": "MOJO1234567890",
  "payment_request_id": "xxxxxxxx",
  "status": "Credit",
  "amount": "800.00",
  "buyer_name": "Raj Kumar",
  "buyer_phone": "+919876543210"
}
```

**Response (200):**
```json
{
  "success": true
}
```

---

## 10. Notifications

### 10.1 Register Push Token

```http
POST /notifications/token
Authorization: Bearer <token>
```

**Request:**
```json
{
  "token": "fcm_token_here",
  "platform": "android",
  "device_id": "device_uuid"
}
```

---

### 10.2 List Notifications

```http
GET /notifications?unread=true
Authorization: Bearer <token>
```

---

### 10.3 Mark as Read

```http
POST /notifications/{notification_id}/read
Authorization: Bearer <token>
```

---

## 11. Support

### 11.1 Create Support Ticket

```http
POST /support/tickets
Authorization: Bearer <token>
```

**Request:**
```json
{
  "booking_id": "uuid",
  "category": "refund",
  "subject": "Refund not received",
  "description": "I cancelled my booking 2 days ago but haven't received refund yet."
}
```

---

## Error Response Format

All errors follow this structure:

```json
{
  "error": {
    "code": "INSUFFICIENT_SEATS",
    "message": "Only 2 seats available, but 4 requested",
    "details": {
      "available": 2,
      "requested": 4
    }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid request body |
| `RATE_LIMITED` | 429 | Too many requests |
| `INSUFFICIENT_SEATS` | 409 | Not enough seats available |
| `BOOKING_EXPIRED` | 410 | Booking/payment window expired |
| `PAYMENT_FAILED` | 402 | Payment processing failed |
| `QUOTE_EXPIRED` | 410 | Quote is no longer valid |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `POST /auth/otp/send` | 3 per phone per 5 min |
| `POST /auth/otp/verify` | 5 per phone per 5 min |
| General authenticated | 100 per min |
| General unauthenticated | 30 per min |
| Webhooks | Unlimited |

---

## Pagination

All list endpoints support pagination:

```
GET /bookings?page=1&per_page=20
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 156,
    "total_pages": 8
  }
}
```

---

## Versioning

API version is included in the URL path: `/api/v1/`

Breaking changes will result in a new version (`/api/v2/`). Non-breaking additions (new fields, new endpoints) will be added to the current version.
