/**
 * Shared TypeScript types for Rewa Cab Booking Platform
 * Used across mobile, web, and portal apps
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum UserRole {
  CUSTOMER = 'customer',
  DRIVER = 'driver',
  AGENCY = 'agency',
  ADMIN = 'admin',
}

export enum VehicleType {
  HATCHBACK = 'hatchback',
  SEDAN = 'sedan',
  SUV = 'suv',
  TEMPO_TRAVELLER = 'tempo_traveller',
}

export enum BookingType {
  GROUP = 'group',
  INDIVIDUAL = 'individual',
}

export enum GroupBookingStatus {
  DRAFT = 'draft',
  PENDING_PAYMENT = 'pending_payment',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum IndividualBookingStatus {
  REQUEST_CREATED = 'request_created',
  QUOTES_RECEIVED = 'quotes_received',
  QUOTE_SELECTED = 'quote_selected',
  PENDING_ADVANCE = 'pending_advance',
  CONFIRMED = 'confirmed',
  DRIVER_ASSIGNED = 'driver_assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum QuoteStatus {
  PENDING = 'pending',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  fullName: string | null;
  email: string | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ============================================================================
// LOCATION TYPES
// ============================================================================

export interface Place {
  id: string;
  name: string;
  city: string | null;
  latitude: number;
  longitude: number;
}

export interface Route {
  id: string;
  slug: string;
  fromPlace: Place;
  toPlace: Place;
  distanceKm: number;
  durationMinutes: number;
  basePricePerSeat: number | null;
  isPopular: boolean;
}

// ============================================================================
// RIDE TYPES
// ============================================================================

export interface ScheduledRide {
  id: string;
  route: {
    from: { name: string };
    to: { name: string };
  };
  departureTime: string;
  arrivalEstimate: string;
  durationMinutes: number;
  seatCapacity: number;
  seatsAvailable: number;
  pricePerSeat: number;
  vehicleType: VehicleType;
  agency: {
    name: string;
    isVerified: boolean;
  } | null;
}

export interface ScheduledRideDetail extends ScheduledRide {
  policies: {
    cancellation: string;
    payment: string;
  };
}

// ============================================================================
// BOOKING TYPES
// ============================================================================

export interface PassengerDetail {
  name: string;
  phone?: string;
  age?: number;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  bookingType: BookingType;
  status: string;
  passengersCount: number;
  totalAmount: number;
  createdAt: string;
}

export interface BookingDetail extends Booking {
  scheduledRide: {
    id: string;
    departureTime: string;
  } | null;
  passengerDetails: PassengerDetail[];
  paymentStatus: string | null;
  driver: {
    name: string;
    phone: string;
    rating: number;
  } | null;
  vehicle: {
    registration: string;
    type: VehicleType;
    model: string;
  } | null;
  timeline: Array<{
    status: string;
    timestamp: string;
  }>;
}

// ============================================================================
// INDIVIDUAL RIDE TYPES
// ============================================================================

export interface RideRequest {
  id: string;
  status: string;
  pickup: { name: string; address?: string };
  drop: { name: string; address?: string };
  requestedDatetime: string;
  passengersCount: number;
  expiresAt: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  agency: {
    name: string;
    isVerified: boolean;
    rating?: number;
  };
  totalPrice: number;
  advanceAmount: number;
  vehicleType: VehicleType;
  estimatedPickupTime?: string;
  message?: string;
  validUntil: string;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: PaymentStatus;
  paymentType: 'full' | 'advance' | 'remaining';
  createdAt: string;
}

export interface PaymentInitiation {
  paymentId: string;
  paymentUrl: string;
  amount: number;
  expiresAt: string;
}

// ============================================================================
// AGENCY/DRIVER TYPES
// ============================================================================

export interface Agency {
  id: string;
  name: string;
  phone: string;
  status: string;
  isVerified: boolean;
}

export interface Driver {
  id: string;
  fullName: string;
  phone: string;
  licenseNumber: string;
  status: string;
  rating: number;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  vehicleType: VehicleType;
  make: string | null;
  model: string | null;
  seatCapacity: number;
  status: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages?: number;
  };
}

// ============================================================================
// FORM INPUT TYPES
// ============================================================================

export interface SearchRidesInput {
  fromPlaceId: string;
  toPlaceId: string;
  date: string;
  passengers: number;
  vehicleType?: VehicleType;
  sort?: 'cheapest' | 'earliest' | 'seats';
}

export interface CreateBookingInput {
  scheduledRideId: string;
  passengersCount: number;
  passengerDetails: PassengerDetail[];
  luggageNotes?: string;
}

export interface CreateRideRequestInput {
  pickupPlaceId: string;
  dropPlaceId: string;
  pickupAddress?: string;
  dropAddress?: string;
  requestedDatetime: string;
  passengersCount: number;
  vehiclePreference?: VehicleType;
  notes?: string;
}
