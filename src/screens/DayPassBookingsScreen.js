import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, Plus } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

import BookingCard from '../components/DayPass/BookingCard';
import BookingDetailsModal from '../components/DayPass/BookingDetailsModal';
import SearchBar from '../components/DayPass/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import BookingSkeleton from '../components/MeetingRoom/BookingSkeleton';
import { useDayPassStore } from '../store/useDayPassStore';

const STATUS_OPTS = [
  { label: 'All Status', value: null },
  { label: 'Payment Pending', value: 'payment_pending' },
  { label: 'Issued', value: 'issued' },
  { label: 'Invited', value: 'invited' },
  { label: 'Checked In', value: 'checked_in' },
  { label: 'Checked Out', value: 'checked_out' },
  { label: 'Cancelled', value: 'cancelled' },
];

const DayPassBookingsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { bookings, loading, refreshBookings, pagination } = useDayPassStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTS[0]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  useEffect(() => {
    handleRefresh();
  }, [debouncedQuery, selectedStatus]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleRefresh = async (page = 1) => {
    const params = { page, limit: 20 };
    if (selectedStatus.value) params.status = selectedStatus.value;
    if (debouncedQuery.trim()) params.search = debouncedQuery;

    await refreshBookings(params);
  };

  const PaginationUI = () => (
    <View style={[styles.pagination, { borderTopColor: isDark ? '#1E2430' : colors.border }]}>
      <Text style={[styles.pageInfo, { color: colors.textSecondary }]}>
        Page {pagination.page} of {pagination.totalPages || 1}
      </Text>
      <View style={styles.pageActions}>
        <TouchableOpacity 
            style={[styles.pageBtn, pagination.page === 1 ? styles.disabledBtn : { borderColor: colors.border }]}
            disabled={pagination.page === 1}
            onPress={() => handleRefresh(pagination.page - 1)}
        >
          <Text style={pagination.page === 1 ? styles.disabledBtnText : { color: colors.text, fontFamily: FONTS.bold, fontSize: 12 }}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.pageBtn, pagination.page === pagination.totalPages ? styles.disabledBtn : { borderColor: colors.border }]}
            disabled={pagination.page === pagination.totalPages}
            onPress={() => handleRefresh(pagination.page + 1)}
        >
          <Text style={pagination.page === pagination.totalPages ? styles.disabledBtnText : { color: colors.text, fontFamily: FONTS.bold, fontSize: 12 }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Day Pass Bookings</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>View day pass reservations</Text>
          </View>
          <TouchableOpacity 
            style={[styles.newBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('BookDayPass')}
          >
             <Plus size={16} color="#FFF" />
             <Text style={styles.newBtnText}>New Booking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search by customer, visitor..." 
          />
          <TouchableOpacity 
            style={[styles.statusToggle, { backgroundColor: isDark ? '#151922' : colors.card, borderColor: isDark ? '#1E2430' : colors.border }]}
            onPress={() => setShowStatusFilter(true)}
          >
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
               {selectedStatus.value ? selectedStatus.label : 'All Status'}
            </Text>
            <ChevronDown size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1 }}>
        {loading && bookings.length === 0 ? (
          <BookingSkeleton />
        ) : (
          <FlatList 
            data={bookings}
            keyExtractor={item => item._id || item.id}
            renderItem={({ item }) => (
              <BookingCard item={item} onView={setActiveBooking} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No bookings found</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Try adjusting your filters or search.</Text>
              </View>
            }
          />
        )}
        
        <PaginationUI />
      </KeyboardAvoidingView>

      {/* Modals & Sheets */}
      <FilterDropdown 
        visible={showStatusFilter}
        title="Filter by Status"
        options={STATUS_OPTS}
        selectedOption={selectedStatus}
        onClose={() => setShowStatusFilter(false)}
        onSelect={(opt) => {
            setSelectedStatus(opt);
            setShowStatusFilter(false);
        }}
      />

      <BookingDetailsModal 
        visible={!!activeBooking}
        booking={activeBooking}
        onClose={() => setActiveBooking(null)}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { padding: SPACING.md, gap: SPACING.md },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontFamily: FONTS.bold, fontSize: 26 },
  subtitle: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.xs },
  newBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: BORDER_RADIUS.full, gap: 6 },
  newBtnText: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.sm, color: '#FFF' },
  filterRow: { flexDirection: 'row', gap: SPACING.sm },
  statusToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minWidth: 140, paddingHorizontal: SPACING.md, height: 48, borderRadius: BORDER_RADIUS.md, borderWidth: 1 },
  statusLabel: { fontFamily: FONTS.bold, fontSize: 12 },
  listContent: { paddingHorizontal: SPACING.md, paddingBottom: 20 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.lg },
  emptySubtitle: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm, marginTop: 4 },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.lg, paddingBottom: 40, borderTopWidth: 1 },
  pageInfo: { fontFamily: FONTS.medium, fontSize: 12 },
  pageActions: { flexDirection: 'row', gap: SPACING.sm },
  pageBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: 'transparent' },
  disabledBtn: { backgroundColor: 'rgba(156, 163, 175, 0.1)' },
  disabledBtnText: { fontFamily: FONTS.bold, fontSize: 12, color: '#9CA3AF' },
});
export default DayPassBookingsScreen;

