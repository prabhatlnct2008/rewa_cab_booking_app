/**
 * Support Tab - Help and contact
 */
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SUPPORT_OPTIONS = [
  {
    id: 'call',
    icon: 'call-outline' as const,
    title: 'Call Support',
    subtitle: 'Speak to our team',
    action: () => Linking.openURL('tel:+919876543210'),
  },
  {
    id: 'whatsapp',
    icon: 'logo-whatsapp' as const,
    title: 'WhatsApp',
    subtitle: 'Chat with us',
    action: () => Linking.openURL('https://wa.me/919876543210'),
  },
  {
    id: 'email',
    icon: 'mail-outline' as const,
    title: 'Email',
    subtitle: 'support@rewacab.com',
    action: () => Linking.openURL('mailto:support@rewacab.com'),
  },
];

const FAQ_ITEMS = [
  {
    id: 'cancel',
    question: 'How do I cancel a booking?',
  },
  {
    id: 'refund',
    question: 'What is the refund policy?',
  },
  {
    id: 'payment',
    question: 'What payment methods are accepted?',
  },
  {
    id: 'track',
    question: 'How do I track my ride?',
  },
];

export default function SupportScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Contact Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        {SUPPORT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionCard}
            onPress={option.action}
          >
            <View style={styles.optionIcon}>
              <Ionicons name={option.icon} size={24} color="#1e40af" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {FAQ_ITEMS.map((item) => (
          <TouchableOpacity key={item.id} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>{item.question}</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>RewaCab v1.0.0</Text>
        <Text style={styles.footerText}>Made with ❤️ in Rewa</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
  },
});
