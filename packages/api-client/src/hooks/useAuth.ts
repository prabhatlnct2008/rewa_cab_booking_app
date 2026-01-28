import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, tokenManager, handleApiError } from '../client';

interface User {
  id: string;
  phone: string;
  email: string | null;
  name: string | null;
  role: 'consumer' | 'driver' | 'agency_admin' | 'agency_staff' | 'super_admin';
  isVerified: boolean;
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface SendOTPRequest {
  phone: string;
}

interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

// Send OTP
export function useSendOTP() {
  return useMutation({
    mutationFn: async (data: SendOTPRequest) => {
      try {
        const response = await apiClient.post('/auth/otp/send', data);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
  });
}

// Verify OTP
export function useVerifyOTP() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VerifyOTPRequest): Promise<AuthTokens> => {
      try {
        const response = await apiClient.post<AuthTokens>('/auth/otp/verify', data);
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error; // TypeScript needs this
      }
    },
    onSuccess: (data) => {
      tokenManager.setTokens(data.access_token, data.refresh_token);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}

// Get current user
export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async (): Promise<User> => {
      try {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    enabled: !!tokenManager.getAccessToken(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Logout
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        // Ignore logout errors
      }
    },
    onSettled: () => {
      tokenManager.clearTokens();
      queryClient.clear();
    },
  });
}

// Update profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name?: string; email?: string }): Promise<User> => {
      try {
        const response = await apiClient.patch<User>('/auth/me', data);
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me(), data);
    },
  });
}
