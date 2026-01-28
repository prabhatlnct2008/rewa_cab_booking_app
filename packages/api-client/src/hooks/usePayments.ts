import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient, handleApiError } from '../client';

interface PaymentOrder {
  orderId: string;
  paymentUrl: string;
  amount: number;
  currency: string;
  expiresAt: string;
}

interface PaymentStatus {
  paymentId: string;
  orderId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  paidAt?: string;
  transactionId?: string;
}

interface CreatePaymentRequest {
  bookingId: string;
  amount: number;
  lockId?: string; // For seat lock validation
}

interface VerifyPaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
}

// Query keys
export const paymentKeys = {
  all: ['payments'] as const,
  status: (orderId: string) => [...paymentKeys.all, 'status', orderId] as const,
};

// Create payment order (Instamojo)
export function useCreatePayment() {
  return useMutation({
    mutationFn: async (data: CreatePaymentRequest): Promise<PaymentOrder> => {
      try {
        const response = await apiClient.post<PaymentOrder>('/payments/create', data);
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
  });
}

// Verify payment after redirect
export function useVerifyPayment() {
  return useMutation({
    mutationFn: async (data: VerifyPaymentRequest): Promise<PaymentStatus> => {
      try {
        const response = await apiClient.post<PaymentStatus>('/payments/verify', data);
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
  });
}

// Get payment status
export function usePaymentStatus(orderId: string) {
  return useQuery({
    queryKey: paymentKeys.status(orderId),
    queryFn: async (): Promise<PaymentStatus> => {
      try {
        const response = await apiClient.get<PaymentStatus>(`/payments/${orderId}/status`);
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    enabled: !!orderId,
    refetchInterval: (query) => {
      // Poll every 2 seconds while pending
      return query.state.data?.status === 'pending' ? 2000 : false;
    },
  });
}

// Request refund
export function useRequestRefund() {
  return useMutation({
    mutationFn: async (bookingId: string): Promise<{ refundId: string; status: string }> => {
      try {
        const response = await apiClient.post(`/bookings/${bookingId}/refund`);
        return response.data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
  });
}
