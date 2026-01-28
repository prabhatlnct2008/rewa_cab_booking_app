-- ============================================================================
-- REWA CAB BOOKING PLATFORM - PostgreSQL Schema
-- Version: 1.0.0
-- Database: PostgreSQL 15+ (Supabase)
-- Normalization: 3NF
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE user_role AS ENUM ('customer', 'driver', 'agency', 'admin');
CREATE TYPE vehicle_type AS ENUM ('hatchback', 'sedan', 'suv', 'tempo_traveller');
CREATE TYPE booking_type AS ENUM ('group', 'individual');
CREATE TYPE group_booking_status AS ENUM ('draft', 'pending_payment', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE individual_booking_status AS ENUM ('request_created', 'quotes_received', 'quote_selected', 'pending_advance', 'confirmed', 'driver_assigned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE quote_status AS ENUM ('pending', 'sent', 'accepted', 'rejected', 'expired');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE payment_type AS ENUM ('full', 'advance', 'remaining');
CREATE TYPE agency_status AS ENUM ('pending_approval', 'active', 'suspended', 'rejected');
CREATE TYPE driver_status AS ENUM ('available', 'on_trip', 'offline', 'suspended');
CREATE TYPE vehicle_status AS ENUM ('active', 'maintenance', 'retired');
CREATE TYPE lead_status AS ENUM ('new', 'accepted', 'quoted', 'expired', 'converted');

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- USERS
-- Primary user table with OTP-based authentication
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) NOT NULL UNIQUE,
    phone_verified BOOLEAN DEFAULT FALSE,
    role user_role NOT NULL DEFAULT 'customer',
    full_name VARCHAR(100),
    email VARCHAR(255),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_phone ON users(phone) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- OTP_TOKENS
-- Transient table for OTP verification (consider Redis in production)
-- ----------------------------------------------------------------------------
CREATE TABLE otp_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) NOT NULL,
    otp_hash VARCHAR(64) NOT NULL, -- bcrypt hash
    attempts INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_otp_phone_expires ON otp_tokens(phone, expires_at) WHERE verified_at IS NULL;

-- ----------------------------------------------------------------------------
-- PLACES
-- Normalized location storage (Google Place IDs)
-- ----------------------------------------------------------------------------
CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    google_place_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    formatted_address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_places_google_id ON places(google_place_id);
CREATE INDEX idx_places_city ON places(city);

-- ----------------------------------------------------------------------------
-- ROUTES
-- Pre-defined routes with calculated distances and ETAs
-- ----------------------------------------------------------------------------
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_place_id UUID NOT NULL REFERENCES places(id),
    to_place_id UUID NOT NULL REFERENCES places(id),
    slug VARCHAR(255) UNIQUE NOT NULL, -- SEO: rewa-to-prayagraj
    distance_km DECIMAL(8, 2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    polyline TEXT, -- Encoded polyline for map display
    allowed_vehicle_types vehicle_type[] DEFAULT ARRAY['hatchback', 'sedan', 'suv']::vehicle_type[],
    base_price_per_seat DECIMAL(10, 2),
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT routes_different_places CHECK (from_place_id != to_place_id)
);

CREATE INDEX idx_routes_from_to ON routes(from_place_id, to_place_id) WHERE is_active = TRUE;
CREATE INDEX idx_routes_slug ON routes(slug);
CREATE INDEX idx_routes_popular ON routes(is_popular) WHERE is_active = TRUE;

-- ----------------------------------------------------------------------------
-- AGENCIES
-- Cab agencies that manage drivers and vehicles
-- ----------------------------------------------------------------------------
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    gst_number VARCHAR(20),
    pan_number VARCHAR(10),
    status agency_status DEFAULT 'pending_approval',
    commission_percent DECIMAL(5, 2) DEFAULT 10.00,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    kyc_documents JSONB DEFAULT '[]'::JSONB, -- Array of {type, url, verified}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_agencies_user ON agencies(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_agencies_status ON agencies(status) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- VEHICLES
-- Vehicle inventory per agency
-- ----------------------------------------------------------------------------
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id),
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type vehicle_type NOT NULL,
    make VARCHAR(50), -- Maruti, Hyundai, etc.
    model VARCHAR(50), -- Swift, i20, etc.
    year INTEGER,
    seat_capacity INTEGER NOT NULL,
    color VARCHAR(30),
    status vehicle_status DEFAULT 'active',
    documents JSONB DEFAULT '[]'::JSONB, -- RC, insurance, permit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    CONSTRAINT vehicles_seat_capacity_check CHECK (seat_capacity > 0 AND seat_capacity <= 20)
);

CREATE INDEX idx_vehicles_agency ON vehicles(agency_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_vehicles_type_status ON vehicles(vehicle_type, status) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- DRIVERS
-- Drivers linked to agencies
-- ----------------------------------------------------------------------------
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    agency_id UUID NOT NULL REFERENCES agencies(id),
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    license_number VARCHAR(20) NOT NULL,
    license_expiry DATE,
    status driver_status DEFAULT 'available',
    rating DECIMAL(3, 2) DEFAULT 5.00,
    total_trips INTEGER DEFAULT 0,
    documents JSONB DEFAULT '[]'::JSONB, -- license, aadhaar, photo
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    CONSTRAINT drivers_rating_check CHECK (rating >= 0 AND rating <= 5)
);

CREATE INDEX idx_drivers_agency ON drivers(agency_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_drivers_user ON drivers(user_id) WHERE user_id IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_drivers_status ON drivers(status) WHERE deleted_at IS NULL;

-- ============================================================================
-- SCHEDULED RIDES (GROUP BOOKING)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- SCHEDULED_RIDES
-- Admin-created group rides with fixed schedules
-- ----------------------------------------------------------------------------
CREATE TABLE scheduled_rides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id),
    agency_id UUID REFERENCES agencies(id), -- Optional; admin can assign
    departure_time TIMESTAMPTZ NOT NULL,
    arrival_estimate TIMESTAMPTZ NOT NULL,
    seat_capacity INTEGER NOT NULL,
    seats_booked INTEGER DEFAULT 0,
    price_per_seat DECIMAL(10, 2) NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id),
    driver_id UUID REFERENCES drivers(id),
    is_published BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    CONSTRAINT scheduled_rides_capacity_check CHECK (seat_capacity > 0),
    CONSTRAINT scheduled_rides_seats_check CHECK (seats_booked >= 0 AND seats_booked <= seat_capacity),
    CONSTRAINT scheduled_rides_time_check CHECK (arrival_estimate > departure_time)
);

CREATE INDEX idx_scheduled_rides_route_departure ON scheduled_rides(route_id, departure_time)
    WHERE is_published = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_scheduled_rides_agency ON scheduled_rides(agency_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_scheduled_rides_available ON scheduled_rides(departure_time)
    WHERE is_published = TRUE AND seats_booked < seat_capacity AND deleted_at IS NULL;

-- ============================================================================
-- BOOKINGS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- BOOKINGS
-- Central booking table for both group and individual rides
-- ----------------------------------------------------------------------------
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(20) UNIQUE NOT NULL, -- Human-readable: RWC-2024-XXXXX
    user_id UUID NOT NULL REFERENCES users(id),
    booking_type booking_type NOT NULL,

    -- For group bookings
    scheduled_ride_id UUID REFERENCES scheduled_rides(id),
    group_status group_booking_status,

    -- For individual bookings (linked to ride_requests)
    ride_request_id UUID, -- FK added after ride_requests table
    individual_status individual_booking_status,

    -- Common fields
    passengers_count INTEGER NOT NULL DEFAULT 1,
    passenger_details JSONB DEFAULT '[]'::JSONB, -- [{name, phone, age}]
    luggage_notes TEXT,

    -- Pricing
    total_amount DECIMAL(10, 2) NOT NULL,
    advance_amount DECIMAL(10, 2) DEFAULT 0,
    advance_paid BOOLEAN DEFAULT FALSE,
    balance_amount DECIMAL(10, 2) DEFAULT 0,

    -- Assignment (for individual rides)
    agency_id UUID REFERENCES agencies(id),
    driver_id UUID REFERENCES drivers(id),
    vehicle_id UUID REFERENCES vehicles(id),

    -- Timestamps
    pickup_time TIMESTAMPTZ,
    actual_pickup_time TIMESTAMPTZ,
    drop_time TIMESTAMPTZ,
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES users(id),
    cancelled_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    CONSTRAINT bookings_passengers_check CHECK (passengers_count > 0),
    CONSTRAINT bookings_type_status_check CHECK (
        (booking_type = 'group' AND group_status IS NOT NULL AND individual_status IS NULL) OR
        (booking_type = 'individual' AND individual_status IS NOT NULL AND group_status IS NULL)
    )
);

CREATE INDEX idx_bookings_user ON bookings(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_bookings_scheduled_ride ON bookings(scheduled_ride_id) WHERE scheduled_ride_id IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_bookings_status_group ON bookings(group_status) WHERE booking_type = 'group' AND deleted_at IS NULL;
CREATE INDEX idx_bookings_status_individual ON bookings(individual_status) WHERE booking_type = 'individual' AND deleted_at IS NULL;
CREATE INDEX idx_bookings_agency ON bookings(agency_id) WHERE agency_id IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_bookings_number ON bookings(booking_number);

-- ============================================================================
-- INDIVIDUAL RIDE REQUESTS & QUOTES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- RIDE_REQUESTS
-- Customer requests for individual rides (leads for agencies)
-- ----------------------------------------------------------------------------
CREATE TABLE ride_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    pickup_place_id UUID NOT NULL REFERENCES places(id),
    drop_place_id UUID NOT NULL REFERENCES places(id),
    pickup_address TEXT, -- Additional details
    drop_address TEXT,
    requested_datetime TIMESTAMPTZ NOT NULL,
    passengers_count INTEGER NOT NULL DEFAULT 1,
    vehicle_preference vehicle_type,
    notes TEXT,
    status lead_status DEFAULT 'new',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT ride_requests_passengers_check CHECK (passengers_count > 0),
    CONSTRAINT ride_requests_places_check CHECK (pickup_place_id != drop_place_id)
);

CREATE INDEX idx_ride_requests_user ON ride_requests(user_id);
CREATE INDEX idx_ride_requests_status ON ride_requests(status) WHERE status IN ('new', 'accepted', 'quoted');
CREATE INDEX idx_ride_requests_expires ON ride_requests(expires_at) WHERE status = 'new';

-- Add FK to bookings now that ride_requests exists
ALTER TABLE bookings ADD CONSTRAINT bookings_ride_request_fk
    FOREIGN KEY (ride_request_id) REFERENCES ride_requests(id);

-- ----------------------------------------------------------------------------
-- LEAD_ACCEPTANCES
-- Agencies accepting to quote on a lead
-- ----------------------------------------------------------------------------
CREATE TABLE lead_acceptances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_request_id UUID NOT NULL REFERENCES ride_requests(id),
    agency_id UUID NOT NULL REFERENCES agencies(id),
    accepted_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT lead_acceptances_unique UNIQUE (ride_request_id, agency_id)
);

CREATE INDEX idx_lead_acceptances_request ON lead_acceptances(ride_request_id);
CREATE INDEX idx_lead_acceptances_agency ON lead_acceptances(agency_id);

-- ----------------------------------------------------------------------------
-- QUOTES
-- Agency quotes for ride requests
-- ----------------------------------------------------------------------------
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_request_id UUID NOT NULL REFERENCES ride_requests(id),
    agency_id UUID NOT NULL REFERENCES agencies(id),
    total_price DECIMAL(10, 2) NOT NULL,
    advance_amount DECIMAL(10, 2) NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    estimated_pickup_time TIMESTAMPTZ,
    message TEXT, -- Custom message to customer
    status quote_status DEFAULT 'pending',
    valid_until TIMESTAMPTZ NOT NULL,
    selected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT quotes_price_check CHECK (total_price > 0),
    CONSTRAINT quotes_advance_check CHECK (advance_amount >= 0 AND advance_amount <= total_price)
);

CREATE INDEX idx_quotes_request ON quotes(ride_request_id);
CREATE INDEX idx_quotes_agency ON quotes(agency_id);
CREATE INDEX idx_quotes_status ON quotes(status) WHERE status IN ('sent', 'pending');
CREATE INDEX idx_quotes_valid ON quotes(valid_until) WHERE status = 'sent';

-- ============================================================================
-- PAYMENTS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PAYMENTS
-- All payment transactions (Instamojo)
-- ----------------------------------------------------------------------------
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    user_id UUID NOT NULL REFERENCES users(id),
    payment_type payment_type NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status payment_status DEFAULT 'pending',

    -- Instamojo specific
    provider VARCHAR(20) DEFAULT 'instamojo',
    provider_payment_request_id VARCHAR(100), -- Instamojo payment request ID
    provider_payment_id VARCHAR(100), -- Instamojo payment ID (after completion)
    provider_order_id VARCHAR(100),
    payment_url TEXT,

    -- Verification
    webhook_received_at TIMESTAMPTZ,
    webhook_payload JSONB,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,

    -- Refund tracking
    refund_amount DECIMAL(10, 2) DEFAULT 0,
    refund_reason TEXT,
    refunded_at TIMESTAMPTZ,
    refund_id VARCHAR(100),

    -- Metadata
    metadata JSONB DEFAULT '{}'::JSONB,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT payments_amount_check CHECK (amount > 0)
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_provider_request ON payments(provider_payment_request_id) WHERE provider_payment_request_id IS NOT NULL;
CREATE INDEX idx_payments_provider_payment ON payments(provider_payment_id) WHERE provider_payment_id IS NOT NULL;
CREATE INDEX idx_payments_pending ON payments(created_at) WHERE status = 'pending';

-- ============================================================================
-- SEAT LOCKS (PREVENT RACE CONDITIONS)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- SEAT_LOCKS
-- Temporary seat holds during payment process
-- ----------------------------------------------------------------------------
CREATE TABLE seat_locks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheduled_ride_id UUID NOT NULL REFERENCES scheduled_rides(id),
    user_id UUID NOT NULL REFERENCES users(id),
    seats_locked INTEGER NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    released BOOLEAN DEFAULT FALSE,
    released_at TIMESTAMPTZ,
    booking_id UUID REFERENCES bookings(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT seat_locks_count_check CHECK (seats_locked > 0)
);

CREATE INDEX idx_seat_locks_ride ON seat_locks(scheduled_ride_id) WHERE released = FALSE;
CREATE INDEX idx_seat_locks_expires ON seat_locks(expires_at) WHERE released = FALSE;

-- ============================================================================
-- AUDIT & NOTIFICATIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- AUDIT_LOGS
-- Track all state changes for bookings and payments
-- ----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL, -- booking, payment, quote, etc.
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- created, status_changed, cancelled, etc.
    old_value JSONB,
    new_value JSONB,
    actor_id UUID REFERENCES users(id),
    actor_type VARCHAR(20) DEFAULT 'user', -- user, system, webhook
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id) WHERE actor_id IS NOT NULL;
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- ----------------------------------------------------------------------------
-- NOTIFICATIONS
-- Notification queue for push/SMS
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL, -- booking_confirmed, driver_assigned, etc.
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}'::JSONB,
    channels VARCHAR(20)[] DEFAULT ARRAY['push']::VARCHAR[], -- push, sms, email
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id) WHERE read = FALSE;
CREATE INDEX idx_notifications_pending ON notifications(created_at) WHERE sent = FALSE;

-- ----------------------------------------------------------------------------
-- PUSH_TOKENS
-- FCM tokens for push notifications
-- ----------------------------------------------------------------------------
CREATE TABLE push_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    token TEXT NOT NULL,
    platform VARCHAR(10) NOT NULL, -- android, ios, web
    device_id VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT push_tokens_unique UNIQUE (user_id, token)
);

CREATE INDEX idx_push_tokens_user ON push_tokens(user_id) WHERE is_active = TRUE;

-- ============================================================================
-- SUPPORT & SETTINGS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- SUPPORT_TICKETS
-- Customer support tickets
-- ----------------------------------------------------------------------------
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    booking_id UUID REFERENCES bookings(id),
    category VARCHAR(50) NOT NULL, -- refund, complaint, query, etc.
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open', -- open, in_progress, resolved, closed
    priority VARCHAR(10) DEFAULT 'medium', -- low, medium, high, urgent
    assigned_to UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status) WHERE status IN ('open', 'in_progress');
CREATE INDEX idx_support_tickets_booking ON support_tickets(booking_id) WHERE booking_id IS NOT NULL;

-- ----------------------------------------------------------------------------
-- PRICING_RULES
-- Dynamic pricing configuration
-- ----------------------------------------------------------------------------
CREATE TABLE pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    rule_type VARCHAR(30) NOT NULL, -- peak_hour, holiday, weekend, surge
    route_id UUID REFERENCES routes(id), -- NULL = applies to all
    multiplier DECIMAL(4, 2) NOT NULL DEFAULT 1.00,
    start_date DATE,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    days_of_week INTEGER[], -- 0=Sunday, 6=Saturday
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT pricing_rules_multiplier_check CHECK (multiplier >= 0.5 AND multiplier <= 5.0)
);

CREATE INDEX idx_pricing_rules_active ON pricing_rules(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_pricing_rules_route ON pricing_rules(route_id) WHERE route_id IS NOT NULL;

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Function: Generate booking number
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
DECLARE
    year_suffix VARCHAR(4);
    sequence_num INTEGER;
BEGIN
    year_suffix := TO_CHAR(NOW(), 'YYYY');

    SELECT COALESCE(MAX(CAST(SUBSTRING(booking_number FROM 10) AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM bookings
    WHERE booking_number LIKE 'RWC-' || year_suffix || '-%';

    NEW.booking_number := 'RWC-' || year_suffix || '-' || LPAD(sequence_num::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_booking_number
    BEFORE INSERT ON bookings
    FOR EACH ROW
    WHEN (NEW.booking_number IS NULL)
    EXECUTE FUNCTION generate_booking_number();

-- ----------------------------------------------------------------------------
-- Function: Update seats_booked on booking confirmation
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_seats_booked()
RETURNS TRIGGER AS $$
BEGIN
    -- When a group booking is confirmed
    IF NEW.booking_type = 'group' AND NEW.group_status = 'confirmed'
       AND (OLD.group_status IS NULL OR OLD.group_status != 'confirmed') THEN
        UPDATE scheduled_rides
        SET seats_booked = seats_booked + NEW.passengers_count,
            updated_at = NOW()
        WHERE id = NEW.scheduled_ride_id;
    END IF;

    -- When a group booking is cancelled after confirmation
    IF NEW.booking_type = 'group' AND NEW.group_status = 'cancelled'
       AND OLD.group_status = 'confirmed' THEN
        UPDATE scheduled_rides
        SET seats_booked = GREATEST(0, seats_booked - OLD.passengers_count),
            updated_at = NOW()
        WHERE id = NEW.scheduled_ride_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_seats_booked
    AFTER UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_seats_booked();

-- ----------------------------------------------------------------------------
-- Function: Updated_at timestamp
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_agencies_updated_at BEFORE UPDATE ON agencies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_routes_updated_at BEFORE UPDATE ON routes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_scheduled_rides_updated_at BEFORE UPDATE ON scheduled_rides FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_ride_requests_updated_at BEFORE UPDATE ON ride_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ----------------------------------------------------------------------------
-- Function: Audit log trigger
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION audit_log_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (entity_type, entity_id, action, new_value, actor_type)
        VALUES (TG_TABLE_NAME, NEW.id, 'created', to_jsonb(NEW), 'system');
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (entity_type, entity_id, action, old_value, new_value, actor_type)
        VALUES (TG_TABLE_NAME, NEW.id, 'updated', to_jsonb(OLD), to_jsonb(NEW), 'system');
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (entity_type, entity_id, action, old_value, actor_type)
        VALUES (TG_TABLE_NAME, OLD.id, 'deleted', to_jsonb(OLD), 'system');
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit logging to critical tables
CREATE TRIGGER trg_audit_bookings AFTER INSERT OR UPDATE OR DELETE ON bookings FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();
CREATE TRIGGER trg_audit_payments AFTER INSERT OR UPDATE OR DELETE ON payments FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();
CREATE TRIGGER trg_audit_quotes AFTER INSERT OR UPDATE OR DELETE ON quotes FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

-- ============================================================================
-- STORED PROCEDURES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Procedure: Lock seats for payment
-- Returns TRUE if lock successful, FALSE if insufficient seats
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION lock_seats(
    p_scheduled_ride_id UUID,
    p_user_id UUID,
    p_seats INTEGER,
    p_lock_duration_minutes INTEGER DEFAULT 10
) RETURNS TABLE (success BOOLEAN, lock_id UUID, message TEXT) AS $$
DECLARE
    v_available_seats INTEGER;
    v_locked_seats INTEGER;
    v_lock_id UUID;
BEGIN
    -- Acquire row lock on scheduled_ride
    SELECT seat_capacity - seats_booked
    INTO v_available_seats
    FROM scheduled_rides
    WHERE id = p_scheduled_ride_id
    FOR UPDATE;

    -- Count existing unexpired locks
    SELECT COALESCE(SUM(seats_locked), 0)
    INTO v_locked_seats
    FROM seat_locks
    WHERE scheduled_ride_id = p_scheduled_ride_id
      AND released = FALSE
      AND expires_at > NOW();

    -- Check availability
    IF v_available_seats - v_locked_seats < p_seats THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 'Insufficient seats available'::TEXT;
        RETURN;
    END IF;

    -- Release any existing locks by this user for this ride
    UPDATE seat_locks
    SET released = TRUE, released_at = NOW()
    WHERE scheduled_ride_id = p_scheduled_ride_id
      AND user_id = p_user_id
      AND released = FALSE;

    -- Create new lock
    INSERT INTO seat_locks (scheduled_ride_id, user_id, seats_locked, expires_at)
    VALUES (p_scheduled_ride_id, p_user_id, p_seats, NOW() + (p_lock_duration_minutes || ' minutes')::INTERVAL)
    RETURNING id INTO v_lock_id;

    RETURN QUERY SELECT TRUE, v_lock_id, 'Seats locked successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Procedure: Release expired seat locks (run via cron/pg_cron)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION release_expired_locks()
RETURNS INTEGER AS $$
DECLARE
    released_count INTEGER;
BEGIN
    UPDATE seat_locks
    SET released = TRUE, released_at = NOW()
    WHERE released = FALSE
      AND expires_at < NOW()
      AND booking_id IS NULL;

    GET DIAGNOSTICS released_count = ROW_COUNT;
    RETURN released_count;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Procedure: Cancel expired pending bookings
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION cancel_expired_bookings(
    p_timeout_minutes INTEGER DEFAULT 15
) RETURNS INTEGER AS $$
DECLARE
    cancelled_count INTEGER;
BEGIN
    -- Cancel expired group bookings in pending_payment
    UPDATE bookings
    SET group_status = 'cancelled',
        cancellation_reason = 'Payment timeout',
        cancelled_at = NOW()
    WHERE booking_type = 'group'
      AND group_status = 'pending_payment'
      AND created_at < NOW() - (p_timeout_minutes || ' minutes')::INTERVAL;

    GET DIAGNOSTICS cancelled_count = ROW_COUNT;
    RETURN cancelled_count;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Procedure: Expire old quotes
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION expire_old_quotes()
RETURNS INTEGER AS $$
DECLARE
    expired_count INTEGER;
BEGIN
    UPDATE quotes
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'sent'
      AND valid_until < NOW();

    GET DIAGNOSTICS expired_count = ROW_COUNT;
    RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_own_data ON users
    FOR ALL USING (auth.uid() = id);

-- Customers see only their bookings; agencies see bookings assigned to them
CREATE POLICY bookings_customer ON bookings
    FOR SELECT USING (
        user_id = auth.uid()
        OR agency_id IN (SELECT id FROM agencies WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Customers see their own ride requests
CREATE POLICY ride_requests_customer ON ride_requests
    FOR SELECT USING (user_id = auth.uid());

-- Agencies see quotes they sent; customers see quotes for their requests
CREATE POLICY quotes_access ON quotes
    FOR SELECT USING (
        agency_id IN (SELECT id FROM agencies WHERE user_id = auth.uid())
        OR ride_request_id IN (SELECT id FROM ride_requests WHERE user_id = auth.uid())
    );

-- Users see their own payments
CREATE POLICY payments_own ON payments
    FOR SELECT USING (user_id = auth.uid());

-- Users see their own notifications
CREATE POLICY notifications_own ON notifications
    FOR ALL USING (user_id = auth.uid());

-- Agency members see their vehicles
CREATE POLICY vehicles_agency ON vehicles
    FOR ALL USING (
        agency_id IN (SELECT id FROM agencies WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Agency members see their drivers
CREATE POLICY drivers_agency ON drivers
    FOR ALL USING (
        agency_id IN (SELECT id FROM agencies WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- INITIAL SEED DATA (Popular Routes)
-- ============================================================================

-- Insert common places for Rewa region
INSERT INTO places (id, google_place_id, name, city, state, latitude, longitude) VALUES
    ('11111111-1111-1111-1111-111111111111', 'ChIJxxxxxxRewa', 'Rewa', 'Rewa', 'Madhya Pradesh', 24.5333, 81.3000),
    ('22222222-2222-2222-2222-222222222222', 'ChIJxxxxxxPrayagraj', 'Prayagraj (Allahabad)', 'Prayagraj', 'Uttar Pradesh', 25.4358, 81.8463),
    ('33333333-3333-3333-3333-333333333333', 'ChIJxxxxxxSatna', 'Satna', 'Satna', 'Madhya Pradesh', 24.5667, 80.8333),
    ('44444444-4444-4444-4444-444444444444', 'ChIJxxxxxxVaranasi', 'Varanasi', 'Varanasi', 'Uttar Pradesh', 25.3176, 82.9739),
    ('55555555-5555-5555-5555-555555555555', 'ChIJxxxxxxJabalpur', 'Jabalpur', 'Jabalpur', 'Madhya Pradesh', 23.1815, 79.9864);

-- Insert popular routes
INSERT INTO routes (from_place_id, to_place_id, slug, distance_km, duration_minutes, is_popular, base_price_per_seat) VALUES
    ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'rewa-to-prayagraj', 130.00, 180, TRUE, 400.00),
    ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'rewa-to-satna', 60.00, 90, TRUE, 200.00),
    ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'rewa-to-varanasi', 200.00, 270, TRUE, 600.00),
    ('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'rewa-to-jabalpur', 200.00, 240, FALSE, 550.00),
    ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'prayagraj-to-rewa', 130.00, 180, TRUE, 400.00),
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'satna-to-rewa', 60.00, 90, TRUE, 200.00);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE users IS 'Primary user table with OTP-based authentication';
COMMENT ON TABLE bookings IS 'Central booking table for both group and individual rides';
COMMENT ON TABLE scheduled_rides IS 'Admin-created group rides with fixed schedules';
COMMENT ON TABLE ride_requests IS 'Customer requests for individual rides (leads for agencies)';
COMMENT ON TABLE quotes IS 'Agency quotes for ride requests';
COMMENT ON TABLE payments IS 'All payment transactions via Instamojo';
COMMENT ON TABLE seat_locks IS 'Temporary seat holds during payment process to prevent race conditions';
COMMENT ON TABLE audit_logs IS 'Immutable audit trail for all critical entity changes';

COMMENT ON FUNCTION lock_seats IS 'Atomically lock seats for a scheduled ride during payment flow';
COMMENT ON FUNCTION release_expired_locks IS 'Cleanup job for expired seat locks (run via cron)';
COMMENT ON FUNCTION cancel_expired_bookings IS 'Auto-cancel pending bookings after timeout';
