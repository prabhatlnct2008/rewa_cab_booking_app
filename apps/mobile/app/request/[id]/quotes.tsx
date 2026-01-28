/**
 * Quotes Screen - View and select quotes from agencies
 */
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Quote {
  id: string;
  agencyName: string;
  agencyRating: number;
  totalPrice: number;
  advanceAmount: number;
  vehicleType: string;
  vehicleModel: string;
  inclusions: string[];
  validUntil: Date;
  isBestPrice: boolean;
}

const mockQuotes: Quote[] = [
  {
    id: '1',
    agencyName: 'Rewa Travels',
    agencyRating: 4.8,
    totalPrice: 3200,
    advanceAmount: 800,
    vehicleType: 'Sedan',
    vehicleModel: 'Maruti Swift Dzire',
    inclusions: ['AC', 'Fuel', 'Toll', 'Permit'],
    validUntil: new Date(Date.now() + 30 * 60 * 1000),
    isBestPrice: true,
  },
  {
    id: '2',
    agencyName: 'Vindhya Cabs',
    agencyRating: 4.5,
    totalPrice: 3400,
    advanceAmount: 1000,
    vehicleType: 'Sedan',
    vehicleModel: 'Honda Amaze',
    inclusions: ['AC', 'Fuel', 'Toll'],
    validUntil: new Date(Date.now() + 45 * 60 * 1000),
    isBestPrice: false,
  },
  {
    id: '3',
    agencyName: 'MP Express',
    agencyRating: 4.2,
    totalPrice: 3500,
    advanceAmount: 750,
    vehicleType: 'SUV',
    vehicleModel: 'Toyota Innova',
    inclusions: ['AC', 'Fuel', 'Toll', 'Driver Allowance'],
    validUntil: new Date(Date.now() + 60 * 60 * 1000),
    isBestPrice: false,
  },
];

export default function QuotesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price');

  useEffect(() => {
    // Simulate loading quotes
    const timer = setTimeout(() => {
      setQuotes(mockQuotes);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    if (sortBy === 'price') {
      return a.totalPrice - b.totalPrice;
    }
    return b.agencyRating - a.agencyRating;
  });

  const getTimeRemaining = (validUntil: Date) => {
    const diff = validUntil.getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const mins = Math.floor(diff / 60000);
    return `${mins} min left`;
  };

  const handleSelectQuote = (quote: Quote) => {
    // In real app: Navigate to quote details / payment
    router.push(`/request/${id}/confirm?quoteId=${quote.id}`);
  };

  const renderQuoteCard = ({ item }: { item: Quote }) => (
    <View style={styles.quoteCard}>
      {item.isBestPrice && (
        <View style={styles.bestPriceBadge}>
          <Ionicons name="trophy" size={12} color="#fff" />
          <Text style={styles.bestPriceText}>Best Price</Text>
        </View>
      )}

      <View style={styles.quoteHeader}>
        <View style={styles.agencyInfo}>
          <View style={styles.agencyAvatar}>
            <Text style={styles.agencyInitial}>{item.agencyName.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.agencyName}>{item.agencyName}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text style={styles.ratingText}>{item.agencyRating}</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceSection}>
          <Text style={styles.totalPrice}>₹{item.totalPrice.toLocaleString()}</Text>
          <Text style={styles.advanceText}>
            Advance: ₹{item.advanceAmount.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.vehicleRow}>
        <Ionicons name="car-outline" size={18} color="#6b7280" />
        <Text style={styles.vehicleText}>
          {item.vehicleType} • {item.vehicleModel}
        </Text>
      </View>

      <View style={styles.inclusionsRow}>
        {item.inclusions.map((inclusion, index) => (
          <View key={index} style={styles.inclusionChip}>
            <Ionicons name="checkmark" size={12} color="#10b981" />
            <Text style={styles.inclusionText}>{inclusion}</Text>
          </View>
        ))}
      </View>

      <View style={styles.quoteFooter}>
        <View style={styles.validityRow}>
          <Ionicons name="time-outline" size={16} color="#f59e0b" />
          <Text style={styles.validityText}>
            {getTimeRemaining(item.validUntil)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => handleSelectQuote(item)}
        >
          <Text style={styles.selectButtonText}>Select</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Getting Quotes',
            headerStyle: { backgroundColor: '#1e40af' },
            headerTintColor: '#fff',
          }}
        />
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingAnimation}>
              <Ionicons name="car" size={48} color="#1e40af" />
            </View>
            <Text style={styles.loadingTitle}>Finding best quotes...</Text>
            <Text style={styles.loadingText}>
              Contacting agencies in your area
            </Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `${quotes.length} Quotes`,
          headerStyle: { backgroundColor: '#1e40af' },
          headerTintColor: '#fff',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {/* Sort Bar */}
        <View style={styles.sortBar}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <View style={styles.sortOptions}>
            <TouchableOpacity
              style={[styles.sortOption, sortBy === 'price' && styles.sortOptionActive]}
              onPress={() => setSortBy('price')}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === 'price' && styles.sortOptionTextActive,
                ]}
              >
                Lowest Price
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortOption, sortBy === 'rating' && styles.sortOptionActive]}
              onPress={() => setSortBy('rating')}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === 'rating' && styles.sortOptionTextActive,
                ]}
              >
                Highest Rated
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={sortedQuotes}
          keyExtractor={(item) => item.id}
          renderItem={renderQuoteCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No quotes yet</Text>
              <Text style={styles.emptyText}>
                Agencies are reviewing your request. Please wait.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingAnimation: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
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
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  quoteCard: {
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
  bestPriceBadge: {
    position: 'absolute',
    top: 0,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    gap: 4,
  },
  bestPriceText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  agencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agencyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  agencyInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  agencyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 4,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  advanceText: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 2,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  vehicleText: {
    fontSize: 14,
    color: '#374151',
  },
  inclusionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  inclusionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  inclusionText: {
    fontSize: 12,
    color: '#166534',
  },
  quoteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  validityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  validityText: {
    fontSize: 13,
    color: '#f59e0b',
    fontWeight: '600',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
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
    textAlign: 'center',
  },
});
