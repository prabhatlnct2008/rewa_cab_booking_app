/**
 * Home Screen - Search for rides
 */
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Quick route chips for popular destinations
const QUICK_ROUTES = [
  { id: '1', from: 'Rewa', to: 'Prayagraj', slug: 'rewa-to-prayagraj' },
  { id: '2', from: 'Rewa', to: 'Satna', slug: 'rewa-to-satna' },
  { id: '3', from: 'Rewa', to: 'Varanasi', slug: 'rewa-to-varanasi' },
];

export default function HomeScreen() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const handleSearch = () => {
    // Navigate to search results
    router.push({
      pathname: '/search/results',
      params: { from, to, date, passengers },
    });
  };

  const handleQuickRoute = (route: (typeof QUICK_ROUTES)[0]) => {
    router.push({
      pathname: '/search/results',
      params: {
        from: route.from,
        to: route.to,
        slug: route.slug,
        passengers: 1,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Card */}
        <View style={styles.searchCard}>
          <Text style={styles.searchTitle}>Find Your Ride</Text>

          {/* From Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color="#1e40af" />
            <TextInput
              style={styles.input}
              placeholder="From (e.g., Rewa)"
              placeholderTextColor="#9ca3af"
              value={from}
              onChangeText={setFrom}
            />
          </View>

          {/* To Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="navigate" size={20} color="#10b981" />
            <TextInput
              style={styles.input}
              placeholder="To (e.g., Prayagraj)"
              placeholderTextColor="#9ca3af"
              value={to}
              onChangeText={setTo}
            />
          </View>

          {/* Date & Passengers Row */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Ionicons name="calendar" size={20} color="#6b7280" />
              <TextInput
                style={styles.input}
                placeholder="Date"
                placeholderTextColor="#9ca3af"
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Ionicons name="people" size={20} color="#6b7280" />
              <TouchableOpacity
                style={styles.stepper}
                onPress={() => setPassengers(Math.max(1, passengers - 1))}
              >
                <Text style={styles.stepperText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.passengerCount}>{passengers}</Text>
              <TouchableOpacity
                style={styles.stepper}
                onPress={() => setPassengers(Math.min(10, passengers + 1))}
              >
                <Text style={styles.stepperText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Find Rides</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Routes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Routes</Text>
          <View style={styles.quickRoutes}>
            {QUICK_ROUTES.map((route) => (
              <TouchableOpacity
                key={route.id}
                style={styles.routeChip}
                onPress={() => handleQuickRoute(route)}
              >
                <Text style={styles.routeChipText}>
                  {route.from} → {route.to}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trust Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why RewaCab?</Text>
          <View style={styles.trustItems}>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark" size={24} color="#10b981" />
              <Text style={styles.trustItemText}>Verified Drivers</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="card" size={24} color="#1e40af" />
              <Text style={styles.trustItemText}>Secure Payments</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="headset" size={24} color="#f59e0b" />
              <Text style={styles.trustItemText}>24/7 Support</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    marginLeft: 10,
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
  stepper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  passengerCount: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  quickRoutes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  routeChip: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  routeChipText: {
    color: '#1e40af',
    fontWeight: '600',
  },
  trustItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustItemText: {
    marginTop: 8,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});
