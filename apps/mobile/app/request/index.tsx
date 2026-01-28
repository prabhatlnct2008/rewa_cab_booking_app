/**
 * Request Cab Screen - Request private cab quotes
 */
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type VehicleType = 'hatchback' | 'sedan' | 'suv' | 'tempo_traveller';

const VEHICLE_TYPES: { key: VehicleType; label: string; capacity: string }[] = [
  { key: 'hatchback', label: 'Hatchback', capacity: '4 seats' },
  { key: 'sedan', label: 'Sedan', capacity: '4 seats' },
  { key: 'suv', label: 'SUV', capacity: '6-7 seats' },
  { key: 'tempo_traveller', label: 'Tempo Traveller', capacity: '12+ seats' },
];

export default function RequestCabScreen() {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('sedan');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = pickup.trim() && drop.trim() && date && time;

  const handleSubmit = () => {
    if (!isValid) {
      Alert.alert('Missing Details', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    // In real app: Submit request to backend
    setTimeout(() => {
      setLoading(false);
      router.push('/request/REQ-123/quotes');
    }, 1000);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Request a Cab',
          headerStyle: { backgroundColor: '#1e40af' },
          headerTintColor: '#fff',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={24} color="#1e40af" />
            <Text style={styles.infoText}>
              Tell us your trip details and get quotes from multiple agencies
              within minutes.
            </Text>
          </View>

          {/* Location Inputs */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Trip Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pickup Location *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location" size={20} color="#1e40af" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter pickup address"
                  placeholderTextColor="#9ca3af"
                  value={pickup}
                  onChangeText={setPickup}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Drop Location *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="navigate" size={20} color="#10b981" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter drop address"
                  placeholderTextColor="#9ca3af"
                  value={drop}
                  onChangeText={setDrop}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Date *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="calendar" size={20} color="#6b7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#9ca3af"
                    value={date}
                    onChangeText={setDate}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Time *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="time" size={20} color="#6b7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="HH:MM"
                    placeholderTextColor="#9ca3af"
                    value={time}
                    onChangeText={setTime}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Passengers</Text>
              <View style={styles.passengerSelector}>
                <TouchableOpacity
                  style={styles.passengerButton}
                  onPress={() => setPassengers(Math.max(1, passengers - 1))}
                  disabled={passengers <= 1}
                >
                  <Ionicons
                    name="remove"
                    size={24}
                    color={passengers <= 1 ? '#d1d5db' : '#1e40af'}
                  />
                </TouchableOpacity>
                <View style={styles.passengerCount}>
                  <Text style={styles.passengerCountText}>{passengers}</Text>
                  <Text style={styles.passengerLabel}>
                    {passengers === 1 ? 'passenger' : 'passengers'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.passengerButton}
                  onPress={() => setPassengers(Math.min(20, passengers + 1))}
                >
                  <Ionicons name="add" size={24} color="#1e40af" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Vehicle Type */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vehicle Preference</Text>
            <View style={styles.vehicleGrid}>
              {VEHICLE_TYPES.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.key}
                  style={[
                    styles.vehicleOption,
                    selectedVehicle === vehicle.key && styles.vehicleOptionActive,
                  ]}
                  onPress={() => setSelectedVehicle(vehicle.key)}
                >
                  <Ionicons
                    name="car"
                    size={24}
                    color={selectedVehicle === vehicle.key ? '#1e40af' : '#6b7280'}
                  />
                  <Text
                    style={[
                      styles.vehicleLabel,
                      selectedVehicle === vehicle.key && styles.vehicleLabelActive,
                    ]}
                  >
                    {vehicle.label}
                  </Text>
                  <Text style={styles.vehicleCapacity}>{vehicle.capacity}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Additional Notes</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Any special requirements? (Optional)"
              placeholderTextColor="#9ca3af"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* How it works */}
          <View style={styles.howItWorks}>
            <Text style={styles.howItWorksTitle}>How it works</Text>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Submit your trip request</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Receive quotes from multiple agencies
              </Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Choose the best quote and pay advance
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.submitButton, !isValid && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || loading}
          >
            {loading ? (
              <Text style={styles.submitButtonText}>Submitting...</Text>
            ) : (
              <>
                <Text style={styles.submitButtonText}>Get Quotes</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
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
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
    marginLeft: 8,
    lineHeight: 20,
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  passengerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  passengerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerCount: {
    alignItems: 'center',
    marginHorizontal: 32,
  },
  passengerCountText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  passengerLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vehicleOption: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  vehicleOptionActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#1e40af',
  },
  vehicleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
  },
  vehicleLabelActive: {
    color: '#1e40af',
  },
  vehicleCapacity: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  textArea: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    height: 100,
  },
  howItWorks: {
    marginTop: 8,
    marginBottom: 24,
  },
  howItWorksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e40af',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
