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
  useWindowDimensions,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Search, 
  Building2, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Plus, 
  Info,
  Layers,
  ChevronRight,
  Menu
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS } from '../theme/typography';
import { SPACING } from '../theme/spacing';
import { useCommonAreaStore } from '../store/useCommonAreaStore';

import CommonAreaCard from '../components/Inventory/CommonAreaCard';
import CommonAreaStatusBadge from '../components/Inventory/CommonAreaStatusBadge';
import AreaFormModal from '../components/Inventory/AreaFormModal';
import FilterDropdown from '../components/FilterDropdown';
import Haptics from '../utils/Haptics';



const BUILDINGS = [
  { label: 'All Buildings', value: null },
  { label: 'Sohna Road Gurugram', value: 'Sohna Road Gurugram' },
  { label: 'Test - Gurugram', value: 'Test - Gurugram' },
  { label: 'Ofis Test', value: 'Ofis Test' },
];

const TYPES = [
  { label: 'All Types', value: null },
  { label: 'CAFETERIA', value: 'CAFETERIA' },
  { label: 'CORRIDOR', value: 'CORRIDOR' },
  { label: 'LOBBY', value: 'LOBBY' },
  { label: 'PANTRY', value: 'PANTRY' },
  { label: 'LOUNGE', value: 'LOUNGE' },
];

const SORT_OPTS = [
  { label: 'Name ↑', value: 'name_asc' },
  { label: 'Name ↓', value: 'name_desc' },
  { label: 'Building ↑', value: 'build_asc' },
  { label: 'Building ↓', value: 'build_desc' },
  { label: 'Type ↑', value: 'type_asc' },
];

const CommonAreasScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width > 600;

  const { areas, loading, fetchAreas, addArea, updateArea, deleteArea, toggleStatus } = useCommonAreaStore();
  const insets = useSafeAreaInsets();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [selectedBuilding, setSelectedBuilding] = useState(BUILDINGS[0]);
  const [selectedType, setSelectedType] = useState(TYPES[0]);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTS[0]);

  const [activeFilter, setActiveFilter] = useState(null); // 'building', 'type', 'sort'
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArea, setEditingArea] = useState(null);

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactLight();
    fetchAreas().then(() => setRefreshing(false));
  }, []);

  const filteredAreas = useMemo(() => {
    let result = [...areas];

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(q) || 
        a.building.toLowerCase().includes(q)
      );
    }

    if (selectedBuilding.value) result = result.filter(a => a.building === selectedBuilding.value);
    if (selectedType.value) result = result.filter(a => a.type === selectedType.value);

    result.sort((a, b) => {
      switch (selectedSort.value) {
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'build_asc': return a.building.localeCompare(b.building);
        case 'type_asc': return a.type.localeCompare(b.type);
        default: return 0;
      }
    });

    return result;
  }, [debouncedQuery, selectedBuilding, selectedType, selectedSort, areas]);

  const handleClearAll = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedBuilding(BUILDINGS[0]);
    setSelectedType(TYPES[0]);
    setSearchQuery('');
  };

  const handleSave = async (data) => {
    if (editingArea) {
      await updateArea(editingArea.id, data);
    } else {
      await addArea(data);
    }
    setModalVisible(false);
    setEditingArea(null);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Area', 'Are you sure you want to remove this common area?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteArea(id) }
    ]);
  };

  const renderFilterItem = (label, value, icon, onPress) => (
    <TouchableOpacity style={[styles.filterChip, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={onPress}>
      {icon}
      <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>{value || label}</Text>
    </TouchableOpacity>
  );

  const TableHeader = () => (
    <View style={styles.tableRow}>
       <Text style={[styles.col, styles.colName]}>NAME</Text>
       <Text style={[styles.col, styles.colBuild]}>BUILDING</Text>
       <Text style={[styles.col, styles.colType]}>TYPE</Text>
       <Text style={[styles.col, styles.colDev]}>DEVICES</Text>
       <Text style={[styles.col, styles.colStatus]}>STATUS</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity 
              onPress={() => navigation.openDrawer()}
              style={[styles.menuBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
               <Menu size={24} color={colors.text} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Common Areas</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your common areas and device access</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.addBtn, 
            { 
              top: Platform.OS === 'ios' ? insets.top + 10 : 20,
              backgroundColor: '#F97316' 
            }
          ]}
          onPress={() => {
            setEditingArea(null);
            setModalVisible(true);
          }}
        >
           <Plus size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.searchRow}>
           <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Search size={18} color={colors.textMuted} />
              <TextInput 
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search by name, building..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
           </View>
        </View>

        <View style={styles.filtersContainer}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
              {renderFilterItem('Building', selectedBuilding.label, <Building2 size={14} color="#A0A4AE" />, () => setActiveFilter('building'))}
              {renderFilterItem('Type', selectedType.label, <Layers size={14} color="#A0A4AE" />, () => setActiveFilter('type'))}
              {renderFilterItem('Sort', selectedSort.label, <ArrowUpDown size={14} color="#A0A4AE" />, () => setActiveFilter('sort'))}
           </ScrollView>
        </View>
      </View>

      {/* Result Meta */}
      <View style={styles.metaRow}>
         <View style={styles.metaLeft}>
            <Text style={[styles.countText, { color: colors.textMuted }]}>Showing {filteredAreas.length} of {areas.length} zones</Text>
         </View>
         {(selectedBuilding.value || selectedType.value || searchQuery) && (
           <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearBtnText}>Clear All</Text>
           </TouchableOpacity>
         )}
      </View>

      {/* List / Table */}
      {isTablet ? (
        <ScrollView style={styles.tableContainer} contentContainerStyle={{ paddingBottom: 100 }}>
           <TableHeader />
           {filteredAreas.map((area, idx) => (
             <TouchableOpacity 
               key={area.id} 
               style={[styles.tableRow, styles.tableDataRow, { borderBottomColor: colors.border }]}
               onPress={() => { setEditingArea(area); setModalVisible(true); }}
             >
                <Text style={[styles.col, styles.colName, styles.tableDataText, { color: colors.text }]}>{area.name}</Text>
                <Text style={[styles.col, styles.colBuild, styles.tableDataText, { color: colors.text }]}>{area.building}</Text>
                <Text style={[styles.col, styles.colType, styles.tableDataText, { color: colors.text }]}>{area.type}</Text>
                <Text style={[styles.col, styles.colDev, styles.tableDataText, { color: colors.text }]}>{area.devices?.length || 0}</Text>
                <View style={[styles.col, styles.colStatus]}>
                   <CommonAreaStatusBadge status={area.status} />
                </View>
             </TouchableOpacity>
           ))}
        </ScrollView>
      ) : (
        <FlatList 
          data={loading ? [1,2,3] : filteredAreas}
          keyExtractor={(item, index) => loading ? `skeleton-${index}` : item.id}
          renderItem={({ item }) => (
            loading ? (
              <View style={[styles.skeletonCard, { backgroundColor: colors.surface }]} />
            ) : (
              <CommonAreaCard 
                area={item} 
                onEdit={(a) => { setEditingArea(a); setModalVisible(true); }} 
                onDelete={handleDelete}
                onToggleStatus={toggleStatus}
              />
            )
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Info size={48} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No areas found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Adjust your filters to see more results.</Text>
            </View>
          }
        />
      )}

      {/* Dropdowns */}
      <FilterDropdown 
        visible={!!activeFilter}
        title={`Select ${activeFilter}`}
        options={
          activeFilter === 'building' ? BUILDINGS : 
          activeFilter === 'type' ? TYPES : SORT_OPTS
        }
        selectedOption={
          activeFilter === 'building' ? selectedBuilding : 
          activeFilter === 'type' ? selectedType : selectedSort
        }
        onClose={() => setActiveFilter(null)}
        onSelect={(opt) => {
          if (activeFilter === 'building') setSelectedBuilding(opt);
          else if (activeFilter === 'type') setSelectedType(opt);
          else setSelectedSort(opt);
          setActiveFilter(null);
        }}
      />

      {/* Form Modal */}
      <AreaFormModal 
        visible={modalVisible}
        area={editingArea}
        onClose={() => { setModalVisible(false); setEditingArea(null); }}
        onSave={handleSave}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingVertical: SPACING.lg, paddingHorizontal: 24, gap: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontFamily: FONTS.bold, fontSize: 24 },
  subtitle: { fontFamily: FONTS.medium, fontSize: 13, marginTop: 4 },
  addBtn: { 
    position: 'absolute',
    right: 16,
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 100,
    elevation: 10,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  searchRow: { marginTop: 4 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 14, borderWidth: 1, paddingHorizontal: 12 },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: FONTS.medium, fontSize: 14 },
  filtersContainer: { marginTop: 4 },
  filtersScroll: { gap: 10, paddingRight: 20 },
  filterChip: { flexDirection: 'row', alignItems: 'center', height: 36, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, gap: 8 },
  filterChipText: { fontFamily: FONTS.bold, fontSize: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, marginBottom: 12 },
  countText: { fontFamily: FONTS.medium, fontSize: 12 },
  clearBtnText: { fontFamily: FONTS.bold, fontSize: 12, color: '#F97316' },
  listContent: { padding: SPACING.lg, paddingBottom: 100 },
  skeletonCard: { height: 160, borderRadius: 18, marginBottom: 16, opacity: 0.5 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 16 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 18 },
  emptySubtitle: { fontFamily: FONTS.medium, fontSize: 14 },
  
  // Tablet Table Styles
  tableContainer: { paddingHorizontal: SPACING.lg },
  tableRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
  tableDataRow: { paddingVertical: 16 },
  col: { fontFamily: FONTS.bold, fontSize: 11, letterSpacing: 1 },
  tableDataText: { fontSize: 13, fontFamily: FONTS.medium, letterSpacing: 0 },
  colName: { flex: 2 },
  colBuild: { flex: 1.5 },
  colType: { flex: 1 },
  colDev: { flex: 0.8, textAlign: 'center' },
  colStatus: { flex: 1, alignItems: 'center' },
});

export default CommonAreasScreen;
