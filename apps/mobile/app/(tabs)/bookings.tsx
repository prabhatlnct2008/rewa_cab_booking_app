/**
 * My Bookings Tab - View booking history
 */
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';

type BookingStatus = 'upcoming' | 'past' | 'cancelled';

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<BookingStatus>('upcoming');

  // TODO: Replace with actual API call
  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ['bookings', activeTab],
    queryFn: async () => {
      // Placeholder - return empty array
      return [];
    },
  });

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="ticket-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No {activeTab} bookings</Text>
      <Text style={styles.emptyText}>
        {activeTab === 'upcoming'
          ? 'Book a ride from the home screen'
          : 'Your booking history will appear here'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Status Tabs */}
      <View style={styles.tabs}>
        {(['upcoming', 'past', 'cancelled'] as BookingStatus[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookings List */}
      <FlatList
        data={bookings}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bookingCard}
            onPress={() => router.push(`/booking/${item.id}`)}
          >
            <View style={styles.bookingHeader}>
              <Text style={styles.bookingNumber}>{item.bookingNumber}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.routeText}>
              {item.route?.from} → {item.route?.to}
            </Text>
            <Text style={styles.dateText}>{item.pickupTime}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 4,
    margin: 16,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#1e40af',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#fff',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  statusBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
