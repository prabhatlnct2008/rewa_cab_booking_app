/**
 * Ride Details Screen - View ride info and book
 */
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface RideDetails {
  id: string;
  agencyName: string;
  agencyRating: number;
  agencyTrips: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fromCity: string;
  toCity: string;
  pickupPoint: string;
  dropPoint: string;
  seatsAvailable: number;
  pricePerSeat: number;
  vehicleType: string;
  vehicleModel: string;
  amenities: string[];
  cancellationPolicy: string;
}

const mockRide: RideDetails = {
  id: '1',
  agencyName: 'Rewa Travels',
  agencyRating: 4.8,
  agencyTrips: 1250,
  departureTime: '06:00 AM',
  arrivalTime: '10:00 AM',
  duration: '4 hours',
  fromCity: 'Rewa',
  toCity: 'Prayagraj',
  pickupPoint: 'Near Bus Stand, Rewa',
  dropPoint: 'Civil Lines, Prayagraj',
  seatsAvailable: 4,
  pricePerSeat: 450,
  vehicleType: 'Sedan',
  vehicleModel: 'Maruti Swift Dzire',
  amenities: ['AC', 'Music System', 'Phone Charger', 'First Aid'],
  cancellationPolicy:
    'Free cancellation up to 24 hours before departure. 50% refund for cancellation within 24-12 hours.',
};

export default function RideDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ride] = useState<RideDetails>(mockRide);
  const [seats, setSeats] = useState(1);

  const totalPrice = seats * ride.pricePerSeat;

  const handleBook = () => {
    router.push({
      pathname: `/book/${id}`,
      params: { seats: seats.toString() },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Ride Details',
          headerStyle: { backgroundColor: '#1e40af' },
          headerTintColor: '#fff',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Route Card */}
          <View style={styles.card}>
            <View style={styles.routeHeader}>
              <View style={styles.cityBlock}>
                <Text style={styles.time}>{ride.departureTime}</Text>
                <Text style={styles.city}>{ride.fromCity}</Text>
                <Text style={styles.point}>{ride.pickupPoint}</Text>
              </View>
              <View style={styles.durationBlock}>
                <Ionicons name="arrow-forward" size={20} color="#9ca3af" />
                <Text style={styles.duration}>{ride.duration}</Text>
              </View>
              <View style={[styles.cityBlock, styles.cityBlockRight]}>
                <Text style={styles.time}>{ride.arrivalTime}</Text>
                <Text style={styles.city}>{ride.toCity}</Text>
                <Text style={styles.point}>{ride.dropPoint}</Text>
              </View>
            </View>
          </View>

          {/* Agency Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Agency</Text>
            <View style={styles.agencyRow}>
              <View style={styles.agencyAvatar}>
                <Text style={styles.agencyInitial}>
                  {ride.agencyName.charAt(0)}
                </Text>
              </View>
              <View style={styles.agencyInfo}>
                <Text style={styles.agencyName}>{ride.agencyName}</Text>
                <View style={styles.agencyStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <Text style={styles.statText}>{ride.agencyRating}</Text>
                  </View>
                  <Text style={styles.statDivider}>•</Text>
                  <Text style={styles.statText}>{ride.agencyTrips} trips</Text>
                </View>
              </View>
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={16} color="#10b981" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
          </View>

          {/* Vehicle Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vehicle</Text>
            <View style={styles.vehicleRow}>
              <View style={styles.vehicleIcon}>
                <Ionicons name="car" size={24} color="#1e40af" />
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleType}>{ride.vehicleType}</Text>
                <Text style={styles.vehicleModel}>{ride.vehicleModel}</Text>
              </View>
            </View>
            <View style={styles.amenities}>
              {ride.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Cancellation Policy */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cancellation Policy</Text>
            <Text style={styles.policyText}>{ride.cancellationPolicy}</Text>
          </View>

          {/* Seat Selector */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Select Seats</Text>
            <View style={styles.seatSelector}>
              <TouchableOpacity
                style={styles.seatButton}
                onPress={() => setSeats(Math.max(1, seats - 1))}
                disabled={seats <= 1}
              >
                <Ionicons
                  name="remove"
                  size={24}
                  color={seats <= 1 ? '#d1d5db' : '#1e40af'}
                />
              </TouchableOpacity>
              <View style={styles.seatCount}>
                <Text style={styles.seatCountText}>{seats}</Text>
                <Text style={styles.seatLabel}>
                  {seats === 1 ? 'seat' : 'seats'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.seatButton}
                onPress={() => setSeats(Math.min(ride.seatsAvailable, seats + 1))}
                disabled={seats >= ride.seatsAvailable}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color={seats >= ride.seatsAvailable ? '#d1d5db' : '#1e40af'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.seatsAvailable}>
              {ride.seatsAvailable} seats available
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.totalPrice}>₹{totalPrice}</Text>
            <Text style={styles.priceBreakdown}>
              ₹{ride.pricePerSeat} × {seats}
            </Text>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
            <Text style={styles.bookButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cityBlock: {
    flex: 1,
  },
  cityBlockRight: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  city: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 4,
  },
  point: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  durationBlock: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  duration: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  agencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agencyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agencyInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  agencyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  agencyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  agencyStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 4,
  },
  statDivider: {
    marginHorizontal: 8,
    color: '#d1d5db',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
    marginLeft: 4,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleInfo: {
    marginLeft: 12,
  },
  vehicleType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  vehicleModel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  amenityText: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 4,
  },
  policyText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  seatSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  seatButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatCount: {
    alignItems: 'center',
    marginHorizontal: 32,
  },
  seatCountText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  seatLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  seatsAvailable: {
    textAlign: 'center',
    fontSize: 13,
    color: '#10b981',
    marginTop: 8,
  },
  bottomBar: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  priceSection: {},
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  priceBreakdown: {
    fontSize: 12,
    color: '#6b7280',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
