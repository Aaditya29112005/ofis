import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  RefreshControl,
  LayoutAnimation
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  Building2, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Info,
  Calendar,
  Menu
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import { useMeetingRoomStore } from '../../store/useMeetingRoomStore';

import RoomCard from '../../components/MeetingRoom/RoomCard';
import FilterDropdown from '../../components/FilterDropdown';
import Haptics from '../../utils/Haptics';



const BUILDINGS = [
  { label: 'All Buildings', value: null },
  { label: 'Sohna Road Gurugram', value: 'Sohna Road Gurugram' },
  { label: 'Sector 44 Tower', value: 'Sector 44 Tower' },
  { label: 'Cyber City Hub', value: 'Cyber City Hub' },
];

const STATUS_OPTS = [
  { label: 'All Status', value: null },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

const SORT_OPTS = [
  { label: 'Name ↑', value: 'name_asc' },
  { label: 'Name ↓', value: 'name_desc' },
  { label: 'Building Color', value: 'building' },
  { label: 'Capacity ↑', value: 'cap_asc' },
  { label: 'Capacity ↓', value: 'cap_desc' },
];

const MeetingRoomsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { rooms } = useMeetingRoomStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedBuilding, setSelectedBuilding] = useState(BUILDINGS[0]);
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTS[0]);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTS[0]);

  const [activeFilter, setActiveFilter] = useState(null); // 'building', 'status', 'sort'

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactLight();
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.building.toLowerCase().includes(q)
      );
    }

    if (selectedBuilding.value) result = result.filter(r => r.building === selectedBuilding.value);
    if (selectedStatus.value) result = result.filter(r => r.status === selectedStatus.value);

    result.sort((a, b) => {
      switch (selectedSort.value) {
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'cap_asc': return a.capacity - b.capacity;
        case 'cap_desc': return b.capacity - a.capacity;
        default: return 0;
      }
    });

    return result;
  }, [debouncedQuery, selectedBuilding, selectedStatus, selectedSort, rooms]);

  const handleClearAll = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedBuilding(BUILDINGS[0]);
    setSelectedStatus(STATUS_OPTS[0]);
    setSearchQuery('');
  };

  const renderFilterItem = (label, value, icon, onPress) => (
    <TouchableOpacity style={[styles.filterChip, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={onPress}>
      {icon}
      <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>{value || label}</Text>
    </TouchableOpacity>
  );

  const handleSelect = useCallback((opt) => {
    // Note: We remove LayoutAnimation here to avoid potential UI freeze with Modal on iOS
    if (activeFilter === 'building') setSelectedBuilding(opt);
    else if (activeFilter === 'status') setSelectedStatus(opt);
    else setSelectedSort(opt);
    setActiveFilter(null);
  }, [activeFilter, setSelectedBuilding, setSelectedStatus, setSelectedSort, setActiveFilter]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={[styles.menuBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
               <Menu size={24} color={colors.text} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Meeting Rooms</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your meeting rooms and availability</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.bookingsBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('MeetingRoomBookings')}
          >
             <Calendar size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
           <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Search size={18} color={colors.textMuted} />
              <TextInput 
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search by room name or building..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
           </View>
        </View>

        <View style={styles.filtersContainer}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
              {renderFilterItem('Building', selectedBuilding.label, <Building2 size={14} color="#A0A4AE" />, () => setActiveFilter('building'))}
              {renderFilterItem('Status', selectedStatus.label, <SlidersHorizontal size={14} color="#A0A4AE" />, () => setActiveFilter('status'))}
              {renderFilterItem('Sort', selectedSort.label, <ArrowUpDown size={14} color="#A0A4AE" />, () => setActiveFilter('sort'))}
           </ScrollView>
        </View>
      </View>

      {/* Result Meta */}
      <View style={styles.metaRow}>
         <View style={styles.metaLeft}>
            <Text style={[styles.countText, { color: colors.textMuted }]}>Showing {filteredRooms.length} of {rooms.length} rooms</Text>
            {(selectedBuilding.value || selectedStatus.value || searchQuery) && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeLabel}>Filters Active</Text>
              </View>
            )}
         </View>
         <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearBtnText}>Clear All</Text>
         </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList 
        data={loading ? [1,2,3,4] : filteredRooms}
        keyExtractor={(item, index) => loading ? `skeleton-${index}` : item.id}
        renderItem={({ item }) => (
          loading ? (
            <View style={[styles.skeletonCard, { backgroundColor: colors.surface }]} />
          ) : (
            <RoomCard 
              room={item} 
              onBook={() => navigation.navigate('CreateMeetingBooking', { room: item })} 
            />
          )
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Info size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No rooms found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Adjust your search or filters.</Text>
          </View>
        }
      />

      {/* Dropdowns */}
      <FilterDropdown 
        visible={!!activeFilter}
        title={activeFilter === 'sort' ? 'Sort By' : `Select ${activeFilter}`}
        options={
          activeFilter === 'building' ? BUILDINGS : 
          activeFilter === 'status' ? STATUS_OPTS : SORT_OPTS
        }
        selectedOption={
          activeFilter === 'building' ? selectedBuilding : 
          activeFilter === 'status' ? selectedStatus : selectedSort
        }
        onClose={() => setActiveFilter(null)}
        onSelect={handleSelect}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: SPACING.lg, gap: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: FONTS.bold, fontSize: 24 },
  subtitle: { fontFamily: FONTS.medium, fontSize: 13, marginTop: 4 },
  bookingsBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  menuBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  searchRow: { marginTop: 4 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 14, borderWidth: 1, paddingHorizontal: 12 },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: FONTS.medium, fontSize: 14 },
  filtersContainer: { marginTop: 4 },
  filtersScroll: { gap: 10, paddingRight: 20 },
  filterChip: { flexDirection: 'row', alignItems: 'center', height: 36, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, gap: 8 },
  filterChipText: { fontFamily: FONTS.bold, fontSize: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, marginBottom: 12 },
  metaLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  countText: { fontFamily: FONTS.medium, fontSize: 12 },
  activeBadge: { backgroundColor: 'rgba(249, 115, 22, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  activeLabel: { fontFamily: FONTS.bold, fontSize: 9, color: '#F97316', textTransform: 'uppercase' },
  clearBtnText: { fontFamily: FONTS.bold, fontSize: 12, color: '#F97316' },
  listContent: { padding: SPACING.lg, paddingBottom: 100 },
  skeletonCard: { height: 160, borderRadius: 18, marginBottom: 16, opacity: 0.5 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 16 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 18 },
  emptySubtitle: { fontFamily: FONTS.medium, fontSize: 14 },
});

export default MeetingRoomsScreen;
