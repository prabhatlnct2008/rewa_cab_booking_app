/**
 * Booking Details Screen - View booking info and status
 */
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface BookingDetails {
  id: string;
  bookingNumber: string;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  fromCity: string;
  toCity: string;
  pickupPoint: string;
  dropPoint: string;
  departureTime: string;
  departureDate: string;
  passengers: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending';
  agency: {
    name: string;
    phone: string;
  };
  driver?: {
    name: string;
    phone: string;
    vehicleNumber: string;
    vehicleModel: string;
  };
  timeline: {
    status: string;
    time: string;
    completed: boolean;
  }[];
}

const mockBooking: BookingDetails = {
  id: '1',
  bookingNumber: 'RWC-2024-00123',
  status: 'confirmed',
  fromCity: 'Rewa',
  toCity: 'Prayagraj',
  pickupPoint: 'Near Bus Stand, Rewa',
  dropPoint: 'Civil Lines, Prayagraj',
  departureTime: '06:00 AM',
  departureDate: 'Sunday, 15 Feb 2024',
  passengers: 2,
  totalAmount: 900,
  paymentStatus: 'paid',
  agency: {
    name: 'Rewa Travels',
    phone: '9876543210',
  },
  driver: {
    name: 'Ramesh Kumar',
    phone: '9876543211',
    vehicleNumber: 'MP 19 AB 1234',
    vehicleModel: 'Maruti Swift Dzire',
  },
  timeline: [
    { status: 'Booking Confirmed', time: '14 Feb, 3:45 PM', completed: true },
    { status: 'Driver Assigned', time: '14 Feb, 5:30 PM', completed: true },
    { status: 'Trip Started', time: 'Pending', completed: false },
    { status: 'Trip Completed', time: 'Pending', completed: false },
  ],
};

const statusConfig = {
  confirmed: { label: 'Confirmed', color: '#10b981', bg: '#dcfce7' },
  in_progress: { label: 'In Progress', color: '#f59e0b', bg: '#fef3c7' },
  completed: { label: 'Completed', color: '#6b7280', bg: '#f3f4f6' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fee2e2' },
};

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking] = useState<BookingDetails>(mockBooking);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone: string) => {
    Linking.openURL(`https://wa.me/91${phone}`);
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? Refund will be processed as per cancellation policy.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // In real app: Call API to cancel booking
            Alert.alert('Booking Cancelled', 'Your refund will be processed within 3-5 business days.');
          },
        },
      ]
    );
  };

  const statusStyle = statusConfig[booking.status];

  return (
    <>
      <Stack.Screen
        options={{
          title: booking.bookingNumber,
          headerStyle: { backgroundColor: '#1e40af' },
          headerTintColor: '#fff',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Status Badge */}
          <View style={[styles.statusBanner, { backgroundColor: statusStyle.bg }]}>
            <Ionicons
              name={booking.status === 'confirmed' ? 'checkmark-circle' : 'time'}
              size={24}
              color={statusStyle.color}
            />
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {statusStyle.label}
            </Text>
          </View>

          {/* Route Card */}
          <View style={styles.card}>
            <View style={styles.routeRow}>
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, { backgroundColor: '#1e40af' }]} />
                <View style={styles.routeInfo}>
                  <Text style={styles.city}>{booking.fromCity}</Text>
                  <Text style={styles.point}>{booking.pickupPoint}</Text>
                </View>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, { backgroundColor: '#10b981' }]} />
                <View style={styles.routeInfo}>
                  <Text style={styles.city}>{booking.toCity}</Text>
                  <Text style={styles.point}>{booking.dropPoint}</Text>
                </View>
              </View>
            </View>

            <View style={styles.tripDetails}>
              <View style={styles.tripDetail}>
                <Ionicons name="calendar-outline" size={18} color="#6b7280" />
                <Text style={styles.tripDetailText}>{booking.departureDate}</Text>
              </View>
              <View style={styles.tripDetail}>
                <Ionicons name="time-outline" size={18} color="#6b7280" />
                <Text style={styles.tripDetailText}>{booking.departureTime}</Text>
              </View>
              <View style={styles.tripDetail}>
                <Ionicons name="people-outline" size={18} color="#6b7280" />
                <Text style={styles.tripDetailText}>
                  {booking.passengers} passenger{booking.passengers > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* Driver Card */}
          {booking.driver && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Driver Details</Text>
              <View style={styles.contactRow}>
                <View style={styles.contactAvatar}>
                  <Ionicons name="person" size={24} color="#1e40af" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{booking.driver.name}</Text>
                  <Text style={styles.contactSub}>
                    {booking.driver.vehicleModel} • {booking.driver.vehicleNumber}
                  </Text>
                </View>
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleCall(booking.driver!.phone)}
                >
                  <Ionicons name="call" size={20} color="#1e40af" />
                  <Text style={styles.actionButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.whatsappButton]}
                  onPress={() => handleWhatsApp(booking.driver!.phone)}
                >
                  <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                  <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                    WhatsApp
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Agency Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Agency</Text>
            <View style={styles.contactRow}>
              <View style={[styles.contactAvatar, { backgroundColor: '#fef3c7' }]}>
                <Text style={styles.agencyInitial}>
                  {booking.agency.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{booking.agency.name}</Text>
                <Text style={styles.contactSub}>+91 {booking.agency.phone}</Text>
              </View>
              <TouchableOpacity
                style={styles.callIconButton}
                onPress={() => handleCall(booking.agency.phone)}
              >
                <Ionicons name="call" size={20} color="#1e40af" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Timeline */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Booking Timeline</Text>
            {booking.timeline.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      item.completed && styles.timelineDotComplete,
                    ]}
                  >
                    {item.completed && (
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    )}
                  </View>
                  {index < booking.timeline.length - 1 && (
                    <View
                      style={[
                        styles.timelineConnector,
                        item.completed && styles.timelineConnectorComplete,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineStatus,
                      !item.completed && styles.timelineStatusPending,
                    ]}
                  >
                    {item.status}
                  </Text>
                  <Text style={styles.timelineTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Payment Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Payment</Text>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Total Amount</Text>
              <Text style={styles.paymentAmount}>
                ₹{booking.totalAmount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.paymentStatus}>
              <Ionicons
                name={booking.paymentStatus === 'paid' ? 'checkmark-circle' : 'time'}
                size={16}
                color={booking.paymentStatus === 'paid' ? '#10b981' : '#f59e0b'}
              />
              <Text
                style={[
                  styles.paymentStatusText,
                  { color: booking.paymentStatus === 'paid' ? '#10b981' : '#f59e0b' },
                ]}
              >
                {booking.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
              </Text>
            </View>
          </View>

          {/* Cancel Button */}
          {booking.status === 'confirmed' && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          )}

          {/* Support */}
          <View style={styles.supportCard}>
            <Text style={styles.supportTitle}>Need Help?</Text>
            <TouchableOpacity
              style={styles.supportButton}
              onPress={() => Linking.openURL('tel:+919876543210')}
            >
              <Ionicons name="headset-outline" size={20} color="#1e40af" />
              <Text style={styles.supportButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
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
  routeRow: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  routeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  city: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  point: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: '#e5e7eb',
    marginLeft: 5,
    marginVertical: 4,
  },
  tripDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tripDetailText: {
    fontSize: 14,
    color: '#374151',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactAvatar: {
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
    color: '#f59e0b',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  contactSub: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  callIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#dbeafe',
    gap: 8,
  },
  whatsappButton: {
    backgroundColor: '#22c55e',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 48,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotComplete: {
    backgroundColor: '#10b981',
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  timelineConnectorComplete: {
    backgroundColor: '#10b981',
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 16,
  },
  timelineStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  timelineStatusPending: {
    color: '#9ca3af',
  },
  timelineTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  paymentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  supportCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  supportTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
});
