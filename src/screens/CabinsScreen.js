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
  LayoutAnimation,
  Modal,
  Dimensions
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Search, 
  Building2, 
  SlidersHorizontal, 
  X, 
  CloudSun, 
  LogOut, 
  Filter,
  ArrowUpDown,
  ChevronRight,
  Info,
  Menu
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS } from '../theme/typography';
import { SPACING } from '../theme/spacing';
import { useCabinStore } from '../store/useCabinStore';

import CabinCard from '../components/Inventory/CabinCard';
import FilterDropdown from '../components/FilterDropdown';
import Haptics from '../utils/Haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');



const BUILDINGS = [
  { label: 'All Buildings', value: null },
  { label: 'Sohna Road Gurugram', value: 'Sohna Road Gurugram' },
  { label: 'Ofis Test', value: 'Ofis Test' },
  { label: 'Test Building', value: 'Test Building' },
];

const TYPES = [
  { label: 'All Types', value: null },
  { label: 'Private', value: 'Private' },
  { label: 'Shared', value: 'Shared' },
  { label: 'Meeting Room', value: 'Meeting Room' },
  { label: 'Conference Room', value: 'Conference Room' },
];

const STATUSES = [
  { label: 'All Status', value: null },
  { label: 'Available', value: 'Available' },
  { label: 'Occupied', value: 'Occupied' },
  { label: 'Maintenance', value: 'Maintenance' },
];

const SORT_OPTS = [
  { label: 'Number ↑', value: 'num_asc' },
  { label: 'Number ↓', value: 'num_desc' },
  { label: 'Building Color', value: 'building' },
  { label: 'Capacity ↑', value: 'cap_asc' },
  { label: 'Capacity ↓', value: 'cap_desc' },
];

const CabinsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { cabins, refreshCabins } = useCabinStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedBuilding, setSelectedBuilding] = useState(BUILDINGS[0]);
  const [selectedType, setSelectedType] = useState(TYPES[0]);
  const [selectedStatus, setSelectedStatus] = useState(STATUSES[0]);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTS[0]);

  const [activeFilter, setActiveFilter] = useState(null); // 'building', 'type', 'status', 'sort'
  const [selectedCabin, setSelectedCabin] = useState(null);

  useEffect(() => {
    // Initial loading simulation
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactLight();
    setTimeout(() => {
        setRefreshing(false);
    }, 1500);
  }, []);

  const filteredCabins = useMemo(() => {
    let result = [...cabins];

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(c => 
        c.cabinNo.toLowerCase().includes(q) || 
        c.building.toLowerCase().includes(q)
      );
    }

    if (selectedBuilding.value) result = result.filter(c => c.building === selectedBuilding.value);
    if (selectedType.value) result = result.filter(c => c.type === selectedType.value);
    if (selectedStatus.value) result = result.filter(c => c.status === selectedStatus.value);

    result.sort((a, b) => {
      switch (selectedSort.value) {
        case 'num_asc': return a.cabinNo.localeCompare(b.cabinNo);
        case 'num_desc': return b.cabinNo.localeCompare(a.cabinNo);
        case 'cap_asc': return a.capacity - b.capacity;
        case 'cap_desc': return b.capacity - a.capacity;
        default: return 0;
      }
    });

    return result;
  }, [debouncedQuery, selectedBuilding, selectedType, selectedStatus, selectedSort, cabins]);

  const handleClearAll = () => {
    setSelectedBuilding(BUILDINGS[0]);
    setSelectedType(TYPES[0]);
    setSelectedStatus(STATUSES[0]);
    setSearchQuery('');
  };

  const renderFilterItem = (label, value, icon, onPress) => (
    <TouchableOpacity style={[styles.filterChip, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={onPress}>
      {icon}
      <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>{value || label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header */}
      <View style={[styles.header, { paddingRight: insets.right + 12 }]}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={[styles.menuBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
               <Menu size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>Cabins</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>Manage your office cabins and workspaces</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
             <View style={[styles.weatherBox, { backgroundColor: isDark ? '#1F2937' : '#FFF7ED' }]}>
                <CloudSun size={18} color="#F59E0B" />
                 <Text style={[styles.weatherText, { color: '#F59E0B' }]} numberOfLines={1} ellipsizeMode="tail">24°C</Text>
             </View>
             <TouchableOpacity style={styles.logoutBtn} onPress={() => Haptics.impactMedium()}>
                <LogOut size={20} color="#EF4444" />
             </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchRow}>
           <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Search size={18} color={colors.textMuted} />
              <TextInput 
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search by cabin number, building..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
           </View>
        </View>

        <View style={styles.filtersContainer}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
              {renderFilterItem('Building', selectedBuilding.label, <Building2 size={14} color="#A0A4AE" />, () => setActiveFilter('building'))}
              {renderFilterItem('Type', selectedType.label, <Filter size={14} color="#A0A4AE" />, () => setActiveFilter('type'))}
              {renderFilterItem('Status', selectedStatus.label, <SlidersHorizontal size={14} color="#A0A4AE" />, () => setActiveFilter('status'))}
              {renderFilterItem('Sort', selectedSort.label, <ArrowUpDown size={14} color="#A0A4AE" />, () => setActiveFilter('sort'))}
           </ScrollView>
        </View>
      </View>

      {/* Result Meta */}
      <View style={styles.metaRow}>
         <View style={styles.metaLeft}>
            <Text style={[styles.countText, { color: colors.textMuted }]}>Showing {filteredCabins.length} of {cabins.length} cabins</Text>
            {(selectedBuilding.value || selectedType.value || selectedStatus.value || searchQuery) && (
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
        data={loading ? [1,2,3,4] : filteredCabins}
        keyExtractor={(item, index) => loading ? `skeleton-${index}` : item.id}
        renderItem={({ item }) => (
          loading ? (
            <View style={[styles.skeletonCard, { backgroundColor: colors.surface }]} />
          ) : (
            <CabinCard cabin={item} onPress={setSelectedCabin} />
          )
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F59E0B" />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Info size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No cabins found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Adjust your filters to see more results.</Text>
          </View>
        }
      />

      {/* Dropdowns */}
      <FilterDropdown 
        visible={!!activeFilter}
        title={activeFilter === 'sort' ? 'Sort By' : `Select ${activeFilter}`}
        options={
          activeFilter === 'building' ? BUILDINGS : 
          activeFilter === 'type' ? TYPES : 
          activeFilter === 'status' ? STATUSES : SORT_OPTS
        }
        selectedOption={
          activeFilter === 'building' ? selectedBuilding : 
          activeFilter === 'type' ? selectedType : 
          activeFilter === 'status' ? selectedStatus : selectedSort
        }
        onClose={() => setActiveFilter(null)}
        onSelect={(opt) => {
          if (activeFilter === 'building') setSelectedBuilding(opt);
          else if (activeFilter === 'type') setSelectedType(opt);
          else if (activeFilter === 'status') setSelectedStatus(opt);
          else setSelectedSort(opt);
          setActiveFilter(null);
        }}
      />

      {/* Detailed Modal */}
      <Modal visible={!!selectedCabin} transparent animationType="fade">
        <View style={styles.modalOverlay}>
           <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={styles.modalHeader}>
                 <Text style={[styles.modalTitle, { color: colors.text }]}>Cabin Details</Text>
                 <TouchableOpacity onPress={() => setSelectedCabin(null)}>
                    <X size={24} color={colors.text} />
                 </TouchableOpacity>
              </View>
              {selectedCabin && (
                <View style={styles.modalBody}>
                   <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Number</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>{selectedCabin.cabinNo}</Text>
                   </View>
                   <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Building</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>{selectedCabin.building}</Text>
                   </View>
                   <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Floor</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>{selectedCabin.floor}</Text>
                   </View>
                   <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Capacity</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>{selectedCabin.capacity} Persons</Text>
                   </View>
                   <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Allocated To</Text>
                      <Text style={[styles.detailValue, { color: '#F59E0B' }]}>
                        {selectedCabin.allocatedTo || 'Unassigned'}
                      </Text>
                   </View>
                </View>
              )}
           </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingVertical: SPACING.lg, gap: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' },
  title: { fontFamily: FONTS.bold, fontSize: 24 },
  subtitle: { fontFamily: FONTS.medium, fontSize: 13, marginTop: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12, maxWidth: '45%', flexShrink: 1 },
  weatherBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 12, 
    gap: 10,
    maxWidth: '65%',
    flexShrink: 1
  },
  weatherText: { fontFamily: FONTS.bold, fontSize: 15 },
  menuBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  logoutBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(239, 68, 68, 0.1)', alignItems: 'center', justifyContent: 'center' },
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
  activeBadge: { backgroundColor: 'rgba(245, 158, 11, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  activeLabel: { fontFamily: FONTS.bold, fontSize: 9, color: '#F59E0B', textTransform: 'uppercase' },
  clearBtnText: { fontFamily: FONTS.bold, fontSize: 12, color: '#F59E0B' },
  listContent: { padding: SPACING.lg, paddingBottom: 100 },
  skeletonCard: { height: 160, borderRadius: 18, marginBottom: 12, opacity: 0.5 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 16 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 18 },
  emptySubtitle: { fontFamily: FONTS.medium, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', borderRadius: 24, borderWidth: 1, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontFamily: FONTS.bold, fontSize: 20 },
  modalBody: { gap: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 12 },
  detailLabel: { fontFamily: FONTS.medium, fontSize: 14 },
  detailValue: { fontFamily: FONTS.bold, fontSize: 14 },
});

export default CabinsScreen;
