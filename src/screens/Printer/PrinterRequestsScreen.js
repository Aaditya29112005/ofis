import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  RefreshControl,
  LayoutAnimation,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, Building2, FileX, Plus, Menu } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import { usePrinterStore } from '../../store/usePrinterStore';

import RequestCard from '../../components/Printer/RequestCard';
import PrinterStatusBadge from '../../components/Printer/PrinterStatusBadge';
import FilterDropdown from '../../components/FilterDropdown';
import FileViewerModal from '../../components/Printer/FileViewerModal';
import { SkeletonCard } from '../../components/Skeleton/SkeletonLayouts';
import Haptics from '../../utils/Haptics';

const STATUS_OPTS = [
  { label: 'All Status', value: null },
  { label: 'Pending', value: 'pending' },
  { label: 'Ready', value: 'ready' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const PrinterRequestsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { requests, buildings, loading, refreshRequests, updateStatus } = usePrinterStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState(buildings[0]);
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTS[0]);
  const [activeFilter, setActiveFilter] = useState(null); // 'building', 'status'
  const [refreshing, setRefreshing] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);

  useEffect(() => {
    handleRefresh();
  }, [debouncedQuery, selectedBuilding, selectedStatus]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleRefresh = async () => {
    const params = {};
    if (selectedBuilding.value) params.building = selectedBuilding.value;
    if (selectedStatus.value) params.status = selectedStatus.value;
    if (debouncedQuery.trim()) params.search = debouncedQuery;

    await refreshRequests(params);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await handleRefresh();
    setRefreshing(false);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
        await updateStatus(id, newStatus);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        Haptics.notificationSuccess();
    } catch (err) {
        Alert.alert('Error', err.message || 'Failed to update status');
    }
  };

  const renderFilterTrigger = (label, icon, onPress) => (
    <TouchableOpacity style={[styles.filterChip, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={onPress}>
      {icon}
      <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
  );

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
              <Text style={[styles.title, { color: colors.text }]}>Printer Requests</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage print jobs for clients</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => navigation.navigate('CreatePrinterRequest')}
          >
            <Plus size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Search size={18} color={colors.textMuted} />
            <TextInput 
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by file, client..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleRefresh}
            />
          </View>
        </View>

        <View style={styles.filtersRow}>
          {renderFilterTrigger(selectedBuilding.label, <Building2 size={14} color={colors.textSecondary} />, () => setActiveFilter('building'))}
          {renderFilterTrigger(selectedStatus.label, <SlidersHorizontal size={14} color={colors.textSecondary} />, () => setActiveFilter('status'))}
        </View>
      </View>

      {/* List */}
      {loading && requests.length === 0 ? (
        <View style={styles.listContent}>
           {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
        </View>
      ) : (
        <FlatList 
          data={requests}
          keyExtractor={item => item._id || item.id}
          renderItem={({ item }) => (
            <RequestCard 
              request={item} 
              onUpdateStatus={handleStatusUpdate} 
              onViewFile={setViewingFile}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF8A00" />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FileX size={48} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No printer requests found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Try adjusting your filters</Text>
            </View>
          }
        />
      )}

      <FileViewerModal 
        visible={!!viewingFile}
        file={viewingFile}
        onClose={() => setViewingFile(null)}
      />

      <FilterDropdown 
        visible={!!activeFilter}
        title={activeFilter === 'building' ? 'Select Building' : 'Select Status'}
        options={activeFilter === 'building' ? buildings : STATUS_OPTS}
        selectedOption={activeFilter === 'building' ? selectedBuilding : selectedStatus}
        onClose={() => setActiveFilter(null)}
        onSelect={(opt) => {
          if (activeFilter === 'building') setSelectedBuilding(opt);
          else setSelectedStatus(opt);
          setActiveFilter(null);
        }}
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
  addBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FF8A00', alignItems: 'center', justifyContent: 'center' },
  menuBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  searchSection: { marginTop: 4 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 14, borderWidth: 1, paddingHorizontal: 12 },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: FONTS.medium, fontSize: 14 },
  filtersRow: { flexDirection: 'row', gap: 10 },
  filterChip: { flexDirection: 'row', alignItems: 'center', height: 36, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, gap: 8 },
  filterChipText: { fontFamily: FONTS.bold, fontSize: 12 },
  listContent: { padding: SPACING.lg, paddingBottom: 100 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 16 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 18 },
  emptySubtitle: { fontFamily: FONTS.medium, fontSize: 14 },
});

export default PrinterRequestsScreen;
