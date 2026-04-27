import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, ChevronDown, Download, FilePlus, UserPlus } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

import RFIDCardItem from '../../components/Cards/RFIDCardItem';
import AssignClientModal from '../../components/Cards/AssignClientModal';
import CardsFilterSheet from '../../components/Cards/CardsFilterSheet';
import { SkeletonList } from '../../components/Skeleton/SkeletonLayouts';

const MOCK_CARDS = [
  { id: '1', uid: '04:A2:7B:3F', tech: 'MIFARE Classic 1K', type: 'Key Fob', client: 'Acme Corp', companyUser: 'John Doe', status: 'active' },
  { id: '2', uid: '1C:42:A4:E9', tech: 'HID Prox', type: 'Card', client: null, companyUser: null, status: 'unassigned' },
  { id: '3', uid: '8A:2B:CC:11', tech: 'MIFARE DESFire', type: 'Card', client: 'Startup Inc', companyUser: 'Jane Smith', status: 'inactive' },
  { id: '4', uid: '04:99:88:77', tech: 'GENERIC A', type: 'Wristband', client: null, companyUser: null, status: 'unassigned' },
  { id: '5', uid: '8F:ED:CB:A9', tech: 'NFC NTAG213', type: 'Sticker', client: 'Stark Ind', companyUser: 'Tony S.', status: 'active' },
];

const FILTER_DROPDOWNS = {
  tech: [
    { label: 'All Tech', value: null },
    { label: 'MIFARE Classic 1K', value: 'MIFARE Classic 1K' },
    { label: 'MIFARE DESFire', value: 'MIFARE DESFire' },
    { label: 'HID Prox', value: 'HID Prox' },
  ],
  status: [
    { label: 'All Statuses', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Unassigned', value: 'unassigned' }
  ],
  sort: [
    { label: 'Newest First', value: 'newest' },
    { label: 'UID (A-Z)', value: 'uid_asc' },
    { label: 'Status', value: 'status' }
  ]
};

const FilterPill = ({ label, value, isActive, onPress }) => {
  const { colors, isDark } = useTheme();
  return (
    <TouchableOpacity 
      style={[
        styles.filterPill, 
        { 
          backgroundColor: isActive ? `${colors.primary}15` : (isDark ? colors.surfaceElevated : colors.surface),
          borderColor: isActive ? colors.primary : colors.border
        }
      ]}
      onPress={onPress}
    >
      <Text style={[styles.filterPillText, { color: isActive ? colors.primary : colors.textSecondary }]}>
        {label}{value ? `: ${value}` : ''}
      </Text>
      <ChevronDown size={14} color={isActive ? colors.primary : colors.textSecondary} style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );
};

const RFIDCardsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [cards, setCards] = useState(MOCK_CARDS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Filters
  const [activeSheet, setActiveSheet] = useState(null); // 'tech', 'status', 'sort'
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);

  // Modals
  const [isAssignModalVisible, setAssignModalVisible] = useState(false);
  const [assigningCards, setAssigningCards] = useState([]); // array of card IDs to assign

  const handleToggleSelect = (card) => {
    setSelectedIds(prev => 
      prev.includes(card.id) ? prev.filter(id => id !== card.id) : [...prev, card.id]
    );
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleAssignSingle = (card) => {
    setAssigningCards([card.id]);
    setAssignModalVisible(true);
  };

  const handleAssignBulk = () => {
    setAssigningCards(selectedIds);
    setAssignModalVisible(true);
  };

  const executeAssign = (client) => {
    setCards(prev => prev.map(c => 
      assigningCards.includes(c.id) ? { ...c, client: client.name, status: 'active' } : c
    ));
    setAssignModalVisible(false);
    setSelectedIds([]);
  };

  const filteredCards = useMemo(() => {
    let result = cards;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.uid.toLowerCase().includes(q) || 
        (c.client && c.client.toLowerCase().includes(q))
      );
    }

    if (selectedTech?.value) {
      result = result.filter(c => c.tech === selectedTech.value);
    }

    if (selectedStatus?.value) {
      result = result.filter(c => c.status === selectedStatus.value);
    }

    if (selectedSort?.value === 'uid_asc') {
      result.sort((a, b) => a.uid.localeCompare(b.uid));
    } else if (selectedSort?.value === 'status') {
      result.sort((a, b) => a.status.localeCompare(b.status));
    }

    return result;
  }, [cards, searchQuery, selectedTech, selectedStatus, selectedSort]);

  const getSheetData = () => {
    switch(activeSheet) {
      case 'tech': return { title: 'Filter by Tech', options: FILTER_DROPDOWNS.tech, sel: selectedTech?.value, set: setSelectedTech };
      case 'status': return { title: 'Filter by Status', options: FILTER_DROPDOWNS.status, sel: selectedStatus?.value, set: setSelectedStatus };
      case 'sort': return { title: 'Sort Cards', options: FILTER_DROPDOWNS.sort, sel: selectedSort?.value, set: setSelectedSort };
      default: return { title: '', options: [], sel: null, set: () => {} };
    }
  };

  const sheetData = getSheetData();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Sticky Top Action Bar for Bulk Select */}
      {selectedIds.length > 0 && (
        <View style={[
          styles.bulkActionBar, 
          { 
            backgroundColor: colors.surfaceElevated, 
            borderBottomColor: colors.border,
            paddingTop: insets.top,
            height: 60 + insets.top
          }
        ]}>
          <View style={styles.bulkActionLeft}>
            <TouchableOpacity onPress={handleClearSelection} style={styles.clearBtn} hitSlop={10}>
              <Text style={[styles.clearBtnText, { color: colors.textMuted }]}>Clear</Text>
            </TouchableOpacity>
            <Text style={[styles.bulkSelectCount, { color: colors.text }]}>{selectedIds.length} selected</Text>
          </View>
          <TouchableOpacity style={[styles.bulkAssignBtn, { backgroundColor: colors.primary }]} onPress={handleAssignBulk}>
            <UserPlus size={16} color="#FFF" />
            <Text style={[styles.bulkAssignText, { color: '#FFF' }]}>Assign</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.pageTitle, { color: colors.text }]}>RFID Cards</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>Manage access cards and mapping</Text>
          </View>
          <View style={styles.headerActionsGroup}>
            <TouchableOpacity 
              style={[styles.iconPrimary, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('ImportRFID')}
            >
              <FilePlus size={18} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.iconSecondary, { backgroundColor: isDark ? '#2A2A2A' : '#E0E0E0' }]}
              onPress={() => navigation.navigate('ImportAssignments')}
            >
              <Download size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.searchWrap, { backgroundColor: isDark ? colors.surfaceElevated : colors.surface, borderColor: colors.border }]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput 
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by UID, facility, client"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterRow}>
           <FilterPill label="Tech" value={selectedTech?.label !== 'All Tech' ? selectedTech?.label : ''} isActive={!!selectedTech?.value} onPress={() => setActiveSheet('tech')} />
           <FilterPill label="Status" value={selectedStatus?.label !== 'All Statuses' ? selectedStatus?.label : ''} isActive={!!selectedStatus?.value} onPress={() => setActiveSheet('status')} />
           <FilterPill label="Sort" value={selectedSort?.label !== 'Newest First' ? selectedSort?.label : ''} isActive={!!selectedSort?.value} onPress={() => setActiveSheet('sort')} />
        </View>
      </View>

      {loading ? (
        <View style={styles.listContent}>
           <SkeletonList horizontal items={5} />
        </View>
      ) : (
        <FlatList
          data={filteredCards}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <RFIDCardItem 
              card={item}
              isSelected={selectedIds.includes(item.id)}
              onToggleSelect={handleToggleSelect}
              onAssignPress={handleAssignSingle}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Search size={48} color={colors.textMuted} style={{marginBottom: SPACING.md}} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No cards found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Try adjusting your filters or search query.</Text>
            </View>
          }
        />
      )}

      <AssignClientModal 
        visible={isAssignModalVisible}
        onClose={() => setAssignModalVisible(false)}
        selectedCardsCount={assigningCards.length}
        onAssign={executeAssign}
      />

      <CardsFilterSheet
        visible={!!activeSheet}
        title={sheetData.title}
        options={sheetData.options}
        selectedValue={sheetData.sel}
        onSelect={sheetData.set}
        onClose={() => setActiveSheet(null)}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  pageTitle: { fontFamily: FONTS.bold, fontSize: 24, marginBottom: 2 },
  subtitle: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.xs },
  headerActionsGroup: { flexDirection: 'row', gap: SPACING.sm },
  iconPrimary: { width: 36, height: 36, borderRadius: BORDER_RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  iconSecondary: { width: 36, height: 36, borderRadius: BORDER_RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', height: 44, borderWidth: 1, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  searchInput: { flex: 1, marginLeft: SPACING.sm, fontFamily: FONTS.regular, fontSize: FONT_SIZE.md, height: '100%' },
  filterRow: { flexDirection: 'row', gap: SPACING.sm },
  filterPill: { flexDirection: 'row', alignItems: 'center', height: 34, paddingHorizontal: SPACING.md, borderRadius: BORDER_RADIUS.full, borderWidth: 1 },
  filterPillText: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.xs },
  
  listContent: { paddingHorizontal: SPACING.md, paddingBottom: 100, paddingTop: SPACING.sm },
  
  bulkActionBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 60, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, borderBottomWidth: 1, elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4 },
  bulkActionLeft: { flexDirection: 'row', alignItems: 'center' },
  clearBtn: { marginRight: SPACING.md },
  clearBtnText: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm },
  bulkSelectCount: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md },
  bulkAssignBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, height: 36, borderRadius: BORDER_RADIUS.md },
  bulkAssignText: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.sm, marginLeft: 6 },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.lg, marginBottom: 4 },
  emptySubtitle: { fontFamily: FONTS.regular, fontSize: FONT_SIZE.sm }
});

export default RFIDCardsScreen;
