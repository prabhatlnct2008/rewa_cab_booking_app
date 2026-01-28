/**
 * Root layout for Expo Router
 */
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after resources are loaded
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1e40af',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="search/[routeId]"
            options={{ title: 'Search Results' }}
          />
          <Stack.Screen
            name="ride/[rideId]"
            options={{ title: 'Ride Details' }}
          />
          <Stack.Screen
            name="booking/passenger-details"
            options={{ title: 'Passenger Details' }}
          />
          <Stack.Screen
            name="booking/otp"
            options={{ title: 'Verify Mobile' }}
          />
          <Stack.Screen
            name="booking/payment"
            options={{ title: 'Payment' }}
          />
          <Stack.Screen
            name="booking/confirmation"
            options={{ title: 'Booking Confirmed', headerBackVisible: false }}
          />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
