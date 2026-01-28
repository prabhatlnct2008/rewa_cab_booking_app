/**
 * My Bookings Tab - View booking history
 */
import { useState, useCallback } from 'react';
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

type BookingStatus = 'upcoming' | 'past' | 'cancelled';

interface Booking {
  id: string;
  bookingNumber: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  route: { from: string; to: string };
  pickupTime: string;
  pickupDate: string;
  passengers: number;
  amount: number;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    bookingNumber: 'RWC-2024-00123',
    status: 'confirmed',
    route: { from: 'Rewa', to: 'Prayagraj' },
    pickupTime: '06:00 AM',
    pickupDate: 'Sun, 15 Feb',
    passengers: 2,
    amount: 900,
  },
  {
    id: '2',
    bookingNumber: 'RWC-2024-00118',
    status: 'confirmed',
    route: { from: 'Rewa', to: 'Satna' },
    pickupTime: '10:00 AM',
    pickupDate: 'Wed, 18 Feb',
    passengers: 1,
    amount: 200,
  },
  {
    id: '3',
    bookingNumber: 'RWC-2024-00095',
    status: 'completed',
    route: { from: 'Rewa', to: 'Varanasi' },
    pickupTime: '08:00 AM',
    pickupDate: 'Mon, 8 Feb',
    passengers: 3,
    amount: 1800,
  },
  {
    id: '4',
    bookingNumber: 'RWC-2024-00082',
    status: 'completed',
    route: { from: 'Rewa', to: 'Jabalpur' },
    pickupTime: '07:00 AM',
    pickupDate: 'Sat, 1 Feb',
    passengers: 4,
    amount: 3500,
  },
  {
    id: '5',
    bookingNumber: 'RWC-2024-00070',
    status: 'cancelled',
    route: { from: 'Rewa', to: 'Prayagraj' },
    pickupTime: '09:00 AM',
    pickupDate: 'Thu, 25 Jan',
    passengers: 1,
    amount: 450,
  },
];

const statusConfig = {
  confirmed: { label: 'Confirmed', color: '#10b981', bg: '#dcfce7' },
  completed: { label: 'Completed', color: '#6b7280', bg: '#f3f4f6' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fee2e2' },
};

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<BookingStatus>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const filteredBookings = mockBookings.filter((booking) => {
    switch (activeTab) {
      case 'upcoming':
        return booking.status === 'confirmed';
      case 'past':
        return booking.status === 'completed';
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderBookingCard = ({ item }: { item: Booking }) => {
    const status = statusConfig[item.status];
    return (
      <TouchableOpacity
        style={styles.bookingCard}
        onPress={() => router.push(`/booking/${item.id}`)}
      >
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingNumber}>{item.bookingNumber}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.routeRow}>
          <Ionicons name="location" size={18} color="#1e40af" />
          <Text style={styles.routeText}>
            {item.route.from} → {item.route.to}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={14} color="#6b7280" />
            <Text style={styles.detailText}>{item.pickupDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color="#6b7280" />
            <Text style={styles.detailText}>{item.pickupTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={14} color="#6b7280" />
            <Text style={styles.detailText}>{item.passengers}</Text>
          </View>
        </View>

        <View style={styles.bookingFooter}>
          <Text style={styles.amountText}>₹{item.amount.toLocaleString()}</Text>
          <View style={styles.viewDetails}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#1e40af" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="ticket-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No {activeTab} bookings</Text>
      <Text style={styles.emptyText}>
        {activeTab === 'upcoming'
          ? 'Book a ride from the home screen'
          : 'Your booking history will appear here'}
      </Text>
      {activeTab === 'upcoming' && (
        <TouchableOpacity
          style={styles.bookRideButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.bookRideButtonText}>Book a Ride</Text>
        </TouchableOpacity>
      )}
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
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingCard}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#6b7280',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
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
    marginBottom: 24,
  },
  bookRideButton: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bookRideButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
