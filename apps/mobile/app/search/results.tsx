/**
 * Search Results Screen - List of available rides
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
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Ride {
  id: string;
  agencyName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  seatsAvailable: number;
  price: number;
  vehicleType: string;
  pickupPoint: string;
  rating: number;
}

const mockRides: Ride[] = [
  {
    id: '1',
    agencyName: 'Rewa Travels',
    departureTime: '06:00 AM',
    arrivalTime: '10:00 AM',
    duration: '4h',
    seatsAvailable: 4,
    price: 450,
    vehicleType: 'Sedan',
    pickupPoint: 'Near Bus Stand, Rewa',
    rating: 4.8,
  },
  {
    id: '2',
    agencyName: 'Vindhya Cabs',
    departureTime: '08:30 AM',
    arrivalTime: '12:30 PM',
    duration: '4h',
    seatsAvailable: 2,
    price: 400,
    vehicleType: 'SUV',
    pickupPoint: 'Rewa Railway Station',
    rating: 4.5,
  },
  {
    id: '3',
    agencyName: 'MP Express',
    departureTime: '10:00 AM',
    arrivalTime: '02:00 PM',
    duration: '4h',
    seatsAvailable: 6,
    price: 380,
    vehicleType: 'Tempo Traveller',
    pickupPoint: 'White Tiger Lodge',
    rating: 4.2,
  },
  {
    id: '4',
    agencyName: 'Satna Wheels',
    departureTime: '02:00 PM',
    arrivalTime: '06:00 PM',
    duration: '4h',
    seatsAvailable: 3,
    price: 420,
    vehicleType: 'Sedan',
    pickupPoint: 'Civil Lines, Rewa',
    rating: 4.6,
  },
];

export default function SearchResultsScreen() {
  const params = useLocalSearchParams<{
    from: string;
    to: string;
    date?: string;
    passengers?: string;
  }>();
  const [rides] = useState<Ride[]>(mockRides);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'time' | 'seats'>('price');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const sortedRides = [...rides].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'seats':
        return b.seatsAvailable - a.seatsAvailable;
      case 'time':
      default:
        return a.departureTime.localeCompare(b.departureTime);
    }
  });

  const renderRideCard = ({ item }: { item: Ride }) => (
    <TouchableOpacity
      style={styles.rideCard}
      onPress={() => router.push(`/ride/${item.id}`)}
    >
      <View style={styles.rideHeader}>
        <View>
          <Text style={styles.agencyName}>{item.agencyName}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>per seat</Text>
          <Text style={styles.price}>₹{item.price}</Text>
        </View>
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeBlock}>
          <Text style={styles.time}>{item.departureTime}</Text>
          <Text style={styles.city}>{params.from || 'Rewa'}</Text>
        </View>
        <View style={styles.durationBlock}>
          <Text style={styles.duration}>{item.duration}</Text>
          <View style={styles.durationLine} />
        </View>
        <View style={[styles.timeBlock, styles.timeBlockRight]}>
          <Text style={styles.time}>{item.arrivalTime}</Text>
          <Text style={styles.city}>{params.to || 'Prayagraj'}</Text>
        </View>
      </View>

      <View style={styles.rideFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="car-outline" size={16} color="#6b7280" />
          <Text style={styles.footerText}>{item.vehicleType}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text style={styles.footerText} numberOfLines={1}>
            {item.pickupPoint}
          </Text>
        </View>
        <View style={styles.seatsTag}>
          <Text style={styles.seatsText}>{item.seatsAvailable} seats</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: `${params.from || 'Rewa'} → ${params.to || 'Prayagraj'}`,
          headerStyle: { backgroundColor: '#1e40af' },
          headerTintColor: '#fff',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {/* Sort Options */}
        <View style={styles.sortBar}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <View style={styles.sortOptions}>
            {[
              { key: 'price', label: 'Price' },
              { key: 'time', label: 'Time' },
              { key: 'seats', label: 'Seats' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortOption,
                  sortBy === option.key && styles.sortOptionActive,
                ]}
                onPress={() => setSortBy(option.key as typeof sortBy)}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === option.key && styles.sortOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results Count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {rides.length} rides available
          </Text>
          {params.date && (
            <Text style={styles.resultsDate}>{params.date}</Text>
          )}
        </View>

        {/* Rides List */}
        <FlatList
          data={sortedRides}
          keyExtractor={(item) => item.id}
          renderItem={renderRideCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="car-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No rides found</Text>
              <Text style={styles.emptyText}>
                Try a different date or route
              </Text>
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() => router.push('/request')}
              >
                <Text style={styles.requestButtonText}>
                  Request Private Cab
                </Text>
              </TouchableOpacity>
            </View>
          }
        />

        {/* Request CTA */}
        {rides.length > 0 && (
          <View style={styles.ctaContainer}>
            <Text style={styles.ctaText}>Need a private cab?</Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push('/request')}
            >
              <Text style={styles.ctaButtonText}>Request Quotes</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sortLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 12,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  sortOptionActive: {
    backgroundColor: '#1e40af',
  },
  sortOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  sortOptionTextActive: {
    color: '#fff',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  resultsDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  rideCard: {
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
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  agencyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeBlock: {
    flex: 1,
  },
  timeBlockRight: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  city: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  durationBlock: {
    alignItems: 'center',
    flex: 1,
  },
  duration: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  durationLine: {
    width: 60,
    height: 2,
    backgroundColor: '#e5e7eb',
  },
  rideFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    flex: 1,
  },
  footerText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 4,
  },
  seatsTag: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  seatsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  emptyState: {
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
    marginBottom: 24,
  },
  requestButton: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  ctaText: {
    fontSize: 14,
    color: '#6b7280',
  },
  ctaButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
});
