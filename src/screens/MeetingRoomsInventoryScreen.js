import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { 
    FadeInUp, 
    FadeOut,
    Layout, 
    useAnimatedStyle, 
    useSharedValue, 
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/GlassCard';
import Haptics from '../utils/Haptics';
import { SkeletonLargeCard } from '../components/Skeleton/SkeletonLayouts';

const MeetingRoomCard = ({ name, floor, building, capacity, rate, status, index }) => {
    const { colors } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const isActive = status === 'ACTIVE';

    return (
        <Animated.View 
            entering={FadeInUp.delay(index * 100).springify()}
            style={styles.cardWrapper}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={() => (scale.value = withSpring(0.97))}
                onPressOut={() => (scale.value = withSpring(1))}
                onPress={() => Haptics.impactLight()}
            >
                <Animated.View style={animatedStyle}>
                    <GlassCard style={[styles.roomCard, { borderColor: colors.border }, isActive && styles.activeCardGlow]}>
                        <View style={styles.cardHeader}>
                            <Text style={[styles.roomName, { color: colors.text }]} numberOfLines={1}>{name}</Text>
                            <View style={[styles.statusBadge, { 
                                backgroundColor: isActive ? '#FF8A00' : 'transparent',
                                borderColor: isActive ? '#FF8A00' : '#1F1F1F',
                                borderWidth: 1
                            }]}>
                                <Text style={[styles.statusText, { color: isActive ? COLORS.black : colors.textMuted }]}>{status}</Text>
                            </View>
                        </View>

                        <View style={styles.cardBody}>
                            <Text style={[styles.buildingName, { color: colors.textSecondary }]} numberOfLines={1}>{building}</Text>
                            <Text style={[styles.locationInfo, { color: colors.textMuted }]}>Suite • {floor}</Text>
                        </View>

                        <View style={styles.metaContainer}>
                            <View style={styles.metaItem}>
                                <Icon name="people-outline" size={14} color="#FF8A00" />
                                <Text style={[styles.metaValue, { color: colors.textSecondary }]}>{capacity} seats</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.metaItem}>
                                <Icon name="flash-outline" size={14} color="#FF8A00" />
                                <Text style={[styles.metaValue, { color: colors.textSecondary }]}>{rate}</Text>
                            </View>
                        </View>
                    </GlassCard>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const FilterDropdown = ({ label, value, options, isOpen, onToggle, onSelect }) => {
    const { colors } = useTheme();
    return (
        <View style={styles.filterBox}>
            <TouchableOpacity 
                style={[styles.filterTrigger, { backgroundColor: colors.surface, borderColor: colors.border }]} 
                onPress={onToggle}
            >
                <Text style={[styles.filterValue, { color: colors.textSecondary }]} numberOfLines={1}>{value}</Text>
                <Icon name="chevron-down" size={12} color={colors.textMuted} />
            </TouchableOpacity>
            {isOpen && (
                <View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <ScrollView bounces={false} style={{ maxHeight: 200 }}>
                        {options.map((opt, i) => (
                            <TouchableOpacity key={i} style={styles.dropdownItem} onPress={() => onSelect(opt)}>
                                <Text style={[styles.dropdownText, { color: value === opt ? '#FF8A00' : colors.textSecondary }]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const MeetingRoomsInventoryScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  const [filters, setFilters] = useState({
    building: 'All Buildings',
    type: 'All Types'
  });

  const rooms = [
    { name: 'Executive Suite 01', floor: '12th Floor', building: 'Sohna Road Gurugram', capacity: 12, rate: '₹2200/hr', status: 'ACTIVE' },
    { name: 'Meeting room 18', floor: '10th Floor', building: 'Sohna Road Gurugram', capacity: 10, rate: '₹1800/hr', status: 'INACTIVE' },
    { name: 'Meeting room 17', floor: '10th Floor', building: 'Sohna Road Gurugram', capacity: 10, rate: '₹1800/hr', status: 'ACTIVE' },
    { name: 'Meeting room 16', floor: '10th Floor', building: 'Sohna Road Gurugram', capacity: 10, rate: '₹1800/hr', status: 'ACTIVE' },
  ];

  return (
    <DashboardLayout 
        activeTab="MeetingRoomsInventory" 
        onTabPress={(id) => {
            Haptics.selection();
            navigation.navigate(id);
        }}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.mainScroll}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Boardroom Suite</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Premium meeting spaces and collaborative suites</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Icon name="search-outline" size={18} color={colors.textMuted} />
              <TextInput 
                  placeholder="Find a room..." 
                  placeholderTextColor={colors.textMuted} 
                  style={[styles.searchInput, { color: colors.text }]} 
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  textAlignVertical="center"
                  includeFontPadding={false}
              />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
              <FilterDropdown 
                  value={filters.building}
                  options={['All Buildings', 'Sohna Road', 'Udyog Vihar']}
                  isOpen={activeDropdown === 'building'}
                  onToggle={() => setActiveDropdown(activeDropdown === 'building' ? null : 'building')}
                  onSelect={(val) => { setFilters({...filters, building: val}); setActiveDropdown(null); }}
              />
              <FilterDropdown 
                  value={filters.type}
                  options={['All Types', 'Standard', 'Premium']}
                  isOpen={activeDropdown === 'type'}
                  onToggle={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
                  onSelect={(val) => { setFilters({...filters, type: val}); setActiveDropdown(null); }}
              />
          </ScrollView>
        </View>

        <View style={styles.metaRow}>
            <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
              Showing <Text style={styles.highlightText}>{rooms.length}</Text> of {rooms.length} rooms
            </Text>
        </View>

        <View style={styles.listContent}>
          {loading ? (
            <View>
              <SkeletonLargeCard />
              <SkeletonLargeCard />
              <SkeletonLargeCard />
            </View>
          ) : (
            rooms.map((item, index) => (
              <MeetingRoomCard key={index} {...item} index={index} />
            ))
          )}
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  mainScroll: {
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginTop: 4,
  },
  searchContainer: {
    marginBottom: 24,
    zIndex: 100,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontFamily: FONTS.medium,
  },
  filtersScroll: {
    gap: 12,
  },
  filterBox: {
    width: 140,
  },
  filterTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  filterValue: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  dropdown: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    borderRadius: 16,
    borderWidth: 1,
    padding: 6,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  metaRow: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  resultsCount: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  highlightText: {
    fontFamily: FONTS.bold,
    color: '#FF8A00',
  },
  listContent: {
    paddingBottom: 40,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  roomCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  activeCardGlow: {
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  roomName: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
  },
  cardBody: {
    marginBottom: 20,
  },
  buildingName: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  locationInfo: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 12,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaValue: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(128,128,128,0.3)',
  },
});

export default MeetingRoomsInventoryScreen;
