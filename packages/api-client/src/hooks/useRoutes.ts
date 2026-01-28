import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '../client';

interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

interface Route {
  id: string;
  source: Location;
  destination: Location;
  distanceKm: number;
  estimatedDurationMinutes: number;
  basePrice: number;
  isActive: boolean;
  popularityScore: number;
}

interface ScheduledRide {
  id: string;
  route: Route;
  departureTime: string;
  vehicleType: 'sedan' | 'suv' | 'hatchback' | 'tempo_traveller';
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  status: 'scheduled' | 'boarding' | 'in_progress' | 'completed' | 'cancelled';
  driver: {
    id: string;
    name: string;
    phone: string;
    rating: number;
  } | null;
  vehicle: {
    id: string;
    registrationNumber: string;
    model: string;
  } | null;
}

interface SearchScheduledRidesParams {
  sourceId: string;
  destinationId: string;
  date: string;
  passengers?: number;
}

// Query keys
export const routeKeys = {
  all: ['routes'] as const,
  popular: () => [...routeKeys.all, 'popular'] as const,
  search: (params: SearchScheduledRidesParams) =>
    [...routeKeys.all, 'search', params] as const,
  scheduledRides: (routeId: string, date: string) =>
    [...routeKeys.all, 'scheduled', routeId, date] as const,
  locations: () => [...routeKeys.all, 'locations'] as const,
};

// Get popular routes
export function usePopularRoutes() {
  return useQuery({
    queryKey: routeKeys.popular(),
    queryFn: async (): Promise<Route[]> => {
      try {
        const response = await apiClient.get<Route[]>('/routes/popular');
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Get locations for search
export function useLocations() {
  return useQuery({
    queryKey: routeKeys.locations(),
    queryFn: async (): Promise<Location[]> => {
      try {
        const response = await apiClient.get<Location[]>('/locations');
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Search scheduled rides
export function useSearchScheduledRides(params: SearchScheduledRidesParams) {
  return useQuery({
    queryKey: routeKeys.search(params),
    queryFn: async (): Promise<ScheduledRide[]> => {
      try {
        const response = await apiClient.get<ScheduledRide[]>('/scheduled-rides/search', {
          params,
        });
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    enabled: !!params.sourceId && !!params.destinationId && !!params.date,
    staleTime: 1000 * 60, // 1 minute
  });
}

// Get scheduled rides for a route on a specific date
export function useScheduledRides(routeId: string, date: string) {
  return useQuery({
    queryKey: routeKeys.scheduledRides(routeId, date),
    queryFn: async (): Promise<ScheduledRide[]> => {
      try {
        const response = await apiClient.get<ScheduledRide[]>(
          `/routes/${routeId}/scheduled-rides`,
          { params: { date } }
        );
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    enabled: !!routeId && !!date,
    staleTime: 1000 * 60, // 1 minute
  });
}
