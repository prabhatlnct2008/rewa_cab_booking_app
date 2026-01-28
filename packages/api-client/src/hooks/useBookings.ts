import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '../client';

interface Passenger {
  name: string;
  phone: string;
  age?: number;
}

interface Booking {
  id: string;
  bookingNumber: string;
  type: 'group' | 'individual';
  status:
    | 'pending_payment'
    | 'confirmed'
    | 'driver_assigned'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'refunded';
  scheduledRide?: {
    id: string;
    route: {
      source: { name: string };
      destination: { name: string };
    };
    departureTime: string;
    pricePerSeat: number;
  };
  individualRide?: {
    id: string;
    pickup: { name: string; address: string };
    drop: { name: string; address: string };
    requestedDatetime: string;
    quotedAmount: number;
  };
  passengers: Passenger[];
  seatsBooked: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'completed' | 'refunded';
  driver?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
  };
  vehicle?: {
    registrationNumber: string;
    model: string;
    color: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CreateBookingRequest {
  scheduledRideId: string;
  passengers: Passenger[];
  seatsCount: number;
}

interface CreateIndividualBookingRequest {
  pickupLocation: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  dropLocation: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  requestedDatetime: string;
  passengersCount: number;
  vehiclePreference?: string;
  notes?: string;
}

interface LockSeatsRequest {
  scheduledRideId: string;
  seatsCount: number;
}

interface LockSeatsResponse {
  lockId: string;
  expiresAt: string;
}

// Query keys
export const bookingKeys = {
  all: ['bookings'] as const,
  list: (filters?: { status?: string }) =>
    [...bookingKeys.all, 'list', filters] as const,
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
  upcoming: () => [...bookingKeys.all, 'upcoming'] as const,
  past: () => [...bookingKeys.all, 'past'] as const,
};

// Get user's bookings
export function useBookings(filters?: { status?: string }) {
  return useQuery({
    queryKey: bookingKeys.list(filters),
    queryFn: async (): Promise<Booking[]> => {
      try {
        const response = await apiClient.get<Booking[]>('/bookings', { params: filters });
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

// Get upcoming bookings
export function useUpcomingBookings() {
  return useQuery({
    queryKey: bookingKeys.upcoming(),
    queryFn: async (): Promise<Booking[]> => {
      try {
        const response = await apiClient.get<Booking[]>('/bookings/upcoming');
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

// Get past bookings
export function usePastBookings() {
  return useQuery({
    queryKey: bookingKeys.past(),
    queryFn: async (): Promise<Booking[]> => {
      try {
        const response = await apiClient.get<Booking[]>('/bookings/past');
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get booking by ID
export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: async (): Promise<Booking> => {
      try {
        const response = await apiClient.get<Booking>(`/bookings/${id}`);
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Lock seats (before payment)
export function useLockSeats() {
  return useMutation({
    mutationFn: async (data: LockSeatsRequest): Promise<LockSeatsResponse> => {
      try {
        const response = await apiClient.post<LockSeatsResponse>('/bookings/lock-seats', data);
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
  });
}

// Create booking (group ride)
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingRequest): Promise<Booking> => {
      try {
        const response = await apiClient.post<Booking>('/bookings', data);
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}

// Create individual ride request
export function useCreateIndividualBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIndividualBookingRequest): Promise<Booking> => {
      try {
        const response = await apiClient.post<Booking>('/individual-rides', data);
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}

// Cancel booking
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string): Promise<Booking> => {
      try {
        const response = await apiClient.post<Booking>(`/bookings/${bookingId}/cancel`);
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(bookingKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
