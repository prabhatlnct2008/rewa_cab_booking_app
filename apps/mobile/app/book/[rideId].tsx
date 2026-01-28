/**
 * Book Screen - Enter passenger details
 */
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface PassengerInfo {
  name: string;
  phone: string;
}

export default function BookScreen() {
  const { rideId, seats } = useLocalSearchParams<{
    rideId: string;
    seats?: string;
  }>();
  const seatCount = parseInt(seats || '1', 10);

  const [primaryPassenger, setPrimaryPassenger] = useState<PassengerInfo>({
    name: '',
    phone: '',
  });
  const [additionalPassengers, setAdditionalPassengers] = useState<string[]>(
    Array(Math.max(0, seatCount - 1)).fill('')
  );
  const [luggageNotes, setLuggageNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid =
    primaryPassenger.name.trim().length > 0 &&
    /^[6-9]\d{9}$/.test(primaryPassenger.phone);

  const handleContinue = () => {
    if (!isValid) {
      Alert.alert('Invalid Details', 'Please enter valid name and phone number');
      return;
    }

    setLoading(true);
    // In real app: Create booking draft and navigate to OTP verification
    setTimeout(() => {
      setLoading(false);
      router.push('/verify');
    }, 500);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Passenger Details',
          headerStyle: { backgroundColor: '#1e40af' },
          headerTintColor: '#fff',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Progress Steps */}
            <View style={styles.progress}>
              {['Details', 'Verify', 'Pay', 'Confirm'].map((step, index) => (
                <View key={step} style={styles.progressStep}>
                  <View
                    style={[
                      styles.progressDot,
                      index === 0 && styles.progressDotActive,
                      index < 0 && styles.progressDotComplete,
                    ]}
                  >
                    {index < 0 ? (
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    ) : (
                      <Text
                        style={[
                          styles.progressDotText,
                          index === 0 && styles.progressDotTextActive,
                        ]}
                      >
                        {index + 1}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.progressLabel,
                      index === 0 && styles.progressLabelActive,
                    ]}
                  >
                    {step}
                  </Text>
                </View>
              ))}
            </View>

            {/* Primary Passenger */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="person" size={20} color="#1e40af" />
                <Text style={styles.cardTitle}>Primary Passenger</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter full name"
                  placeholderTextColor="#9ca3af"
                  value={primaryPassenger.name}
                  onChangeText={(text) =>
                    setPrimaryPassenger({ ...primaryPassenger, name: text })
                  }
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Number *</Text>
                <View style={styles.phoneInput}>
                  <Text style={styles.phonePrefix}>+91</Text>
                  <TextInput
                    style={styles.phoneTextInput}
                    placeholder="98765 43210"
                    placeholderTextColor="#9ca3af"
                    value={primaryPassenger.phone}
                    onChangeText={(text) =>
                      setPrimaryPassenger({
                        ...primaryPassenger,
                        phone: text.replace(/\D/g, '').slice(0, 10),
                      })
                    }
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
                <Text style={styles.inputHint}>
                  OTP will be sent to this number
                </Text>
              </View>
            </View>

            {/* Additional Passengers */}
            {seatCount > 1 && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="people" size={20} color="#1e40af" />
                  <Text style={styles.cardTitle}>
                    Additional Passengers ({seatCount - 1})
                  </Text>
                </View>

                {additionalPassengers.map((passenger, index) => (
                  <View key={index} style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Passenger {index + 2} Name (Optional)
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter name"
                      placeholderTextColor="#9ca3af"
                      value={passenger}
                      onChangeText={(text) => {
                        const updated = [...additionalPassengers];
                        updated[index] = text;
                        setAdditionalPassengers(updated);
                      }}
                      autoCapitalize="words"
                    />
                  </View>
                ))}
              </View>
            )}

            {/* Luggage Notes */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="briefcase" size={20} color="#1e40af" />
                <Text style={styles.cardTitle}>Luggage Notes</Text>
              </View>

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any special luggage requirements? (Optional)"
                placeholderTextColor="#9ca3af"
                value={luggageNotes}
                onChangeText={setLuggageNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Info Note */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color="#1e40af" />
              <Text style={styles.infoText}>
                Booking details and driver contact will be shared via SMS after
                payment confirmation.
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.continueButton, !isValid && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={!isValid || loading}
            >
              {loading ? (
                <Text style={styles.continueButtonText}>Please wait...</Text>
              ) : (
                <>
                  <Text style={styles.continueButtonText}>
                    Continue to Verify
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  progressDotActive: {
    backgroundColor: '#1e40af',
  },
  progressDotComplete: {
    backgroundColor: '#10b981',
  },
  progressDotText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  progressDotTextActive: {
    color: '#fff',
  },
  progressLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  progressLabelActive: {
    color: '#1e40af',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
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
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  phonePrefix: {
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#6b7280',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    paddingVertical: 14,
  },
  phoneTextInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  inputHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    marginLeft: 8,
    lineHeight: 18,
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
  continueButton: {
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
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
