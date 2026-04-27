import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, RefreshCw, ChevronDown, Menu } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import StatsCard from '../components/Reception/StatsCard';
import TabSwitcher from '../components/Reception/TabSwitcher';
import VisitorCardRow from '../components/Reception/VisitorCardRow';
import FilterDropdown from '../components/FilterDropdown';
import CalendarDatePicker from '../components/Reception/CalendarDatePicker';
import CheckInModal from '../components/Reception/CheckInModal';
import VisitorDetailsModal from '../components/Reception/VisitorDetailsModal';
import { SkeletonList, SkeletonBox } from '../components/Skeleton/SkeletonLayouts';
import { useVisitorStore } from '../store/useVisitorStore';

const FILTER_STATUSES = [
  { label: 'All', value: null },
  { label: 'Checked In', value: 'checked_in' },
  { label: 'Invited', value: 'invited' },
  { label: 'Pending Check-in', value: 'pending_checkin' },
];

const FilterBtn = ({ label, value, onPress, isActive }) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity 
        style={[
          styles.filterBtn, 
          { 
            backgroundColor: isActive ? `${COLORS.primary}15` : (isDark ? colors.surfaceElevated : colors.surface),
            borderColor: isActive ? COLORS.primary : colors.border,
            alignSelf: 'flex-start'
          }
        ]}
        onPress={onPress}
        activeOpacity={1}
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
      >
        <Text style={[
          styles.filterBtnLabel, 
          { 
            color: isActive ? COLORS.primary : colors.textSecondary,
            fontFamily: isActive ? FONTS.bold : FONTS.medium
          }
        ]}>
          {label}{value ? `: ${value}` : ''}
        </Text>
        <ChevronDown size={14} color={isActive ? COLORS.primary : colors.textSecondary} style={{marginLeft: 4}} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const ReceptionDashboardScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { 
    visitors, 
    stats, 
    loading, 
    refreshStats, 
    refreshVisitors, 
    fetchTodayVisitors,
    approveCheckin,
    checkinVisitor
  } = useVisitorStore();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState("Today's Visitors");
  
  // Filters
  const [activeFilterSheet, setActiveFilterSheet] = useState(null); // 'status'
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Modals
  const [checkInVisitor, setCheckInVisitor] = useState(null);
  const [detailsVisitor, setDetailsVisitor] = useState(null);

  useEffect(() => {
    handleRefresh();
  }, [activeTab, selectedStatus, selectedDate]);

  const handleRefresh = () => {
    refreshStats();
    const params = {};
    if (selectedStatus?.value) params.status = selectedStatus.value;
    if (selectedDate) params.date = selectedDate;
    if (searchQuery) params.search = searchQuery;

    if (activeTab === "Today's Visitors") {
        fetchTodayVisitors();
    } else {
        refreshVisitors(params);
    }
  };

  const handleFilterSelect = (setter) => (option) => {
    setter(option);
    setActiveFilterSheet(null);
  };

  const handleApprove = async (visitor) => {
    try {
        await approveCheckin(visitor._id || visitor.id);
        Alert.alert('Success', 'Check-in request approved.');
    } catch (err) {
        Alert.alert('Error', err.message || 'Failed to approve request.');
    }
  };

  const handleConfirmCheckIn = async (visitor, { badgeId, notes }) => {
    try {
        await checkinVisitor(visitor._id || visitor.id, { badgeId, notes });
        setCheckInVisitor(null);
        Alert.alert('Success', 'Visitor checked in successfully.');
    } catch (err) {
        Alert.alert('Error', err.message || 'Check-in failed.');
    }
  };

  const sheetData = {
    options: FILTER_STATUSES,
    title: 'Check-in Status',
    sel: selectedStatus,
    set: handleFilterSelect(setSelectedStatus)
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header Container */}
      <View style={styles.headerContainer}>
        <View style={styles.topHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 2 }}>
            <TouchableOpacity 
              onPress={() => navigation.openDrawer()} 
              style={[styles.menuBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
              activeOpacity={0.8}
            >
               <Menu size={22} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerTextWrap}>
              <Text style={[styles.pageTitle, { color: colors.text }]} numberOfLines={1}>Reception</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>Visitor Management</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.iconBtn, { backgroundColor: colors.surfaceElevated }]}
              onPress={handleRefresh}
              activeOpacity={0.8}
            >
               <RefreshCw size={18} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.primaryBtn, { backgroundColor: COLORS.primary }]}
              onPress={() => navigation.navigate('InviteVisitor')}
              activeOpacity={0.8}
            >
               <Plus size={18} color="#FFF" />
               <Text style={styles.primaryBtnText}>Invite</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.searchBox, { backgroundColor: isDark ? colors.surfaceElevated : colors.surface, borderColor: colors.border }]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput 
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by name, email, phone"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleRefresh}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Stats */}
        <View style={styles.statsRow}>
          {loading ? (
            <>
              <SkeletonBox width="31%" height={80} borderRadius={16} />
              <View style={{ width: SPACING.sm }} />
              <SkeletonBox width="31%" height={80} borderRadius={16} />
              <View style={{ width: SPACING.sm }} />
              <SkeletonBox width="31%" height={80} borderRadius={16} />
            </>
          ) : (
            <>
              <StatsCard title="Total" count={stats.total} />
              <View style={{ width: SPACING.sm }} />
              <StatsCard title="Invited" count={stats.invited} />
              <View style={{ width: SPACING.sm }} />
              <StatsCard title="Checked In" count={stats.checked_in} />
            </>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsWrapper}>
           <TabSwitcher 
             tabs={["Today's Visitors", "Pending Requests", "All Visitors"]} 
             activeTab={activeTab} 
             onTabChange={setActiveTab} 
           />
        </View>

        {/* Filters */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: SPACING.md }}>
            <FilterBtn 
              label="Status" 
              value={selectedStatus?.label !== 'All' ? selectedStatus?.label : ''} 
              isActive={!!selectedStatus?.value}
              onPress={() => setActiveFilterSheet('status')} 
            />
            <FilterBtn 
              label="Date" 
              value={selectedDate || ''} 
              isActive={!!selectedDate}
              onPress={() => setShowDatePicker(true)} 
            />
          </ScrollView>
        </View>

        {/* List */}
        <View style={styles.listContainer}>
          {loading ? (
            <SkeletonList items={3} />
          ) : visitors.length > 0 ? (
            visitors.map(visitor => (
              <VisitorCardRow
                key={visitor._id || visitor.id}
                visitor={visitor}
                onRowPress={setDetailsVisitor}
                onCheckIn={setCheckInVisitor}
                onApprove={handleApprove}
                onViewDetails={setDetailsVisitor}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Search size={48} color={colors.textMuted} style={{ marginBottom: SPACING.md }} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No visitors found</Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* Internal Modals */}
      <FilterDropdown 
        visible={!!activeFilterSheet} 
        onClose={() => setActiveFilterSheet(null)}
        options={sheetData.options}
        title={sheetData.title}
        selectedOption={sheetData.sel}
        onSelect={sheetData.set}
      />
      
      <CalendarDatePicker 
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      <CheckInModal 
        visible={!!checkInVisitor}
        visitor={checkInVisitor}
        onClose={() => setCheckInVisitor(null)}
        onConfirm={handleConfirmCheckIn}
      />

      <VisitorDetailsModal
        visible={!!detailsVisitor}
        visitor={detailsVisitor}
        onClose={() => setDetailsVisitor(null)}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  headerContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  headerTextWrap: { flex: 1, paddingRight: SPACING.md },
  pageTitle: { fontFamily: FONTS.bold, fontSize: 18, marginBottom: 2 },
  subtitle: { fontFamily: FONTS.medium, fontSize: 10 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', height: 34, paddingHorizontal: 12, borderRadius: 10 },
  menuBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  primaryBtnText: { color: '#FFF', fontFamily: FONTS.bold, fontSize: 11, marginLeft: 4 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 40, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12 },
  searchInput: { flex: 1, marginLeft: 8, fontFamily: FONTS.regular, fontSize: 14, height: '100%' },
  
  scrollContent: { paddingBottom: 100 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 24 },
  tabsWrapper: { paddingHorizontal: 24, marginBottom: 24 },
  filterSection: { marginBottom: 24, paddingLeft: 24 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', height: 36, borderWidth: 1, borderRadius: BORDER_RADIUS.full, paddingHorizontal: 16, marginRight: 12, alignSelf: 'flex-start' },
  filterBtnLabel: { fontSize: FONT_SIZE.sm },
  
  listContainer: { paddingHorizontal: 24 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md }
});


export default ReceptionDashboardScreen;
