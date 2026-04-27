import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, Alert, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';
import DashboardLayout from '../components/DashboardLayout';
import TicketCard from '../components/TicketCard';
import FilterDropdown from '../components/FilterDropdown';
import { SkeletonList } from '../components/Skeleton/SkeletonLayouts';
import { useTicketStore } from '../store/useTicketStore';

const { width } = Dimensions.get('window');

const FilterButton = ({ label, value, onPress, isActive }) => {
  const { colors, isDark } = useTheme();
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity 
        style={[
          styles.filterBtn, 
          { 
            backgroundColor: isActive ? `${COLORS.primary}15` : (isDark ? colors.surfaceElevated : colors.surface),
            borderColor: isActive ? COLORS.primary : colors.border,
          }
        ]}
        onPress={onPress}
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={[
          styles.filterBtnLabel, 
          { 
            color: isActive ? COLORS.primary : colors.textSecondary,
            fontFamily: isActive ? FONTS.bold : FONTS.medium
          }
        ]}>
          {label}{value ? `: ${value}` : ''} <Icon name="chevron-down-outline" size={14} />
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const TicketsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { 
    tickets, 
    loading, 
    refreshTickets, 
    deleteTicket, 
    pagination 
  } = useTicketStore();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterSheet, setActiveFilterSheet] = useState(null); // 'status', 'priority', 'sort'

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedSort, setSelectedSort] = useState({ label: 'Newest', value: 'newest' });

  useEffect(() => {
    handleRefresh();
  }, [selectedStatus, selectedPriority, selectedSort]);

  const handleRefresh = () => {
    const params = {};
    if (selectedStatus?.value) params.status = selectedStatus.value.toLowerCase();
    if (selectedPriority?.value) params.priority = selectedPriority.value.toLowerCase();
    if (searchQuery) params.search = searchQuery;
    if (selectedSort?.value) params.sortBy = selectedSort.value;

    refreshTickets(params);
  };

  // Filter options
  const statusOptions = [
    { label: 'All', value: null },
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'inprogress' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Closed', value: 'Closed' },
  ];
  
  const priorityOptions = [
    { label: 'All', value: null },
    { label: 'Urgent', value: 'Urgent' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'createdAt:desc' },
    { label: 'Oldest First', value: 'createdAt:asc' },
  ];

  const getSheetOptions = () => {
    switch(activeFilterSheet) {
      case 'status': return { options: statusOptions, title: 'Filter by Status', selected: selectedStatus, onSelect: setSelectedStatus };
      case 'priority': return { options: priorityOptions, title: 'Filter by Priority', selected: selectedPriority, onSelect: setSelectedPriority };
      case 'sort': return { options: sortOptions, title: 'Sort Tickets', selected: selectedSort, onSelect: setSelectedSort };
      default: return { options: [], title: '', selected: null, onSelect: () => {} };
    }
  };

  const sheetData = getSheetOptions();

  return (
    <DashboardLayout 
        activeTab="Tickets" 
        onTabPress={(id) => navigation.navigate(id)}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.mainScroll}>
        <View style={styles.topHeader}>
          <View style={styles.titleWrapper}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>Tickets</Text>
            <View style={[styles.countBadge, { backgroundColor: `${colors.primary}20` }]}>
              <Text style={[styles.countText, { color: colors.primary }]}>{pagination.total}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => navigation.navigate('CreateTicket')}
            activeOpacity={0.8}
          >
            <Icon name="add-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <View style={[styles.searchBox, { backgroundColor: isDark ? colors.surfaceElevated : colors.surface, borderColor: colors.border }]}>
            <Icon name="search-outline" size={18} color={colors.textMuted} />
            <TextInput 
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search subject, description, ticket ID..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleRefresh}
              textAlignVertical="center"
              includeFontPadding={false}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => { setSearchQuery(''); handleRefresh(); }}>
                <Icon name="close-circle-outline" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: SPACING.md }}>
            <FilterButton 
              label="Sort" 
              value={selectedSort?.value === 'createdAt:desc' ? '' : selectedSort?.label} 
              isActive={!!selectedSort && selectedSort.value !== 'createdAt:desc'}
              onPress={() => setActiveFilterSheet('sort')} 
            />
            <FilterButton 
              label="Status" 
              value={selectedStatus?.label} 
              isActive={!!selectedStatus?.value}
              onPress={() => setActiveFilterSheet('status')} 
            />
            <FilterButton 
              label="Priority" 
              value={selectedPriority?.label}
              isActive={!!selectedPriority?.value} 
              onPress={() => setActiveFilterSheet('priority')} 
            />
          </ScrollView>
        </View>

        <View style={styles.listContent}>
          {loading ? (
            <SkeletonList items={4} />
          ) : tickets.length > 0 ? (
            tickets.map(ticket => (
              <TicketCard 
                key={ticket._id || ticket.id} 
                ticket={ticket} 
                onPress={() => navigation.navigate('TicketDetails', { ticket })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="cube-outline" size={48} color={colors.textMuted} style={{ marginBottom: SPACING.md }} />
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No tickets found</Text>
              <Text style={[styles.emptyStateDesc, { color: colors.textMuted }]}>Try adjusting your filters or search query.</Text>
              
              <TouchableOpacity 
                style={[styles.resetBtn, { borderColor: colors.primary }]}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedStatus(null);
                  setSelectedPriority(null);
                  handleRefresh();
                }}
              >
                <Text style={[styles.resetBtnText, { color: colors.primary }]}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <FilterDropdown 
        visible={!!activeFilterSheet}
        onClose={() => setActiveFilterSheet(null)}
        options={sheetData.options}
        title={sheetData.title}
        selectedOption={sheetData.selected}
        onSelect={(opt) => {
            sheetData.onSelect(opt);
            setActiveFilterSheet(null);
        }}
      />

    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  mainScroll: {
    paddingBottom: 100,
  },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingHorizontal: 16 },
  titleWrapper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pageTitle: { fontFamily: FONTS.bold, fontSize: 32, letterSpacing: -0.5 },
  countBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  countText: { fontFamily: FONTS.bold, fontSize: 13 },
  addBtn: { backgroundColor: COLORS.primary, width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 15, elevation: 8 },
  searchSection: { marginBottom: 16, paddingHorizontal: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 48, borderWidth: 1, borderRadius: BORDER_RADIUS.md, paddingHorizontal: 16 },
  searchInput: { flex: 1, marginLeft: 12, fontFamily: FONTS.regular, fontSize: 15, height: '100%' },
  filterSection: { marginBottom: 24, flexDirection: 'row', paddingLeft: 16 },
  filterBtn: { height: 36, borderWidth: 1, borderRadius: BORDER_RADIUS.full, paddingHorizontal: 16, justifyContent: 'center', marginRight: 12 },
  filterBtnLabel: { fontSize: 13 },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyStateTitle: { fontFamily: FONTS.bold, fontSize: 17, marginBottom: 8 },
  emptyStateDesc: { fontFamily: FONTS.regular, fontSize: 13, marginBottom: 24, textAlign: 'center' },
  resetBtn: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  resetBtnText: { fontFamily: FONTS.bold, fontSize: 14 }
});
export default TicketsScreen;

