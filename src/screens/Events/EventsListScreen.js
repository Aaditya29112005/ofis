import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Plus, Filter, ChevronDown, Calendar, SlidersHorizontal, Menu } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import { useEventsStore } from '../../store/useEventsStore';

import EventCard from '../../components/Events/EventCard';
import FilterDropdown from '../../components/FilterDropdown';
import { SkeletonLargeCard } from '../../components/Skeleton/SkeletonLayouts';



const CATEGORIES = [
  { label: 'All Categories', value: null },
  { label: 'Networking', value: 'Networking' },
  { label: 'Education', value: 'Education' },
  { label: 'Social', value: 'Social' },
  { label: 'Workshop', value: 'Workshop' },
];

const STATUS_OPTS = [
  { label: 'All Status', value: null },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const SORT_OPTS = [
  { label: 'Date (Newest First)', value: 'date_desc' },
  { label: 'Date (Oldest First)', value: 'date_asc' },
  { label: 'Title (A-Z)', value: 'title_asc' },
  { label: 'Title (Z-A)', value: 'title_desc' },
];

const EventsListScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { events, deleteEvent } = useEventsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTS[0]);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTS[0]);

  const [activeFilter, setActiveFilter] = useState(null); // 'category', 'status', 'sort'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory.value) {
      result = result.filter(e => e.category === selectedCategory.value);
    }

    if (selectedStatus.value) {
      result = result.filter(e => e.status === selectedStatus.value);
    }

    result.sort((a, b) => {
      switch (selectedSort.value) {
        case 'date_desc': return new Date(b.start) - new Date(a.start);
        case 'date_asc': return new Date(a.start) - new Date(b.start);
        case 'title_asc': return a.title.localeCompare(b.title);
        case 'title_desc': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

    return result;
  }, [debouncedQuery, selectedCategory, selectedStatus, selectedSort, events]);

  const handleDelete = (id) => {
    Alert.alert('Delete Event', 'Are you sure you want to permanently remove this event?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteEvent(id) }
    ]);
  };

  const handleEdit = (event) => {
    navigation.navigate('CreateEvent', { edit: true, event });
  };

  const handleRSVP = (event) => {
    navigation.navigate('RSVPList', { eventId: event.id, eventTitle: event.title });
  };

  const renderFilterItem = (label, value, onPress) => (
    <TouchableOpacity style={[styles.filterChip, { borderColor: colors.border }]} onPress={onPress}>
      <Text style={[styles.filterChipLabel, { color: colors.textSecondary }]}>{label}</Text>
      <ChevronDown size={14} color={colors.textMuted} />
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
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>Events</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>Manage your community events</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.createBtn, { backgroundColor: '#f97316' }]}
            onPress={() => navigation.navigate('CreateEvent')}
          >
            <Plus size={20} color="#FFF" />
            <Text style={styles.createBtnText} numberOfLines={1} ellipsizeMode="tail">Create Event</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput 
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by title, description..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filtersRow}>
          {renderFilterItem(selectedCategory.label, selectedCategory.value, () => setActiveFilter('category'))}
          {renderFilterItem(selectedStatus.label, selectedStatus.value, () => setActiveFilter('status'))}
          <TouchableOpacity style={[styles.filterChip, { borderColor: colors.border }]} onPress={() => setActiveFilter('sort')}>
             <SlidersHorizontal size={14} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.listContent}>
           <SkeletonLargeCard />
           <SkeletonLargeCard />
        </View>
      ) : (
        <FlatList 
          data={filteredEvents}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <EventCard 
              event={item} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              onRSVP={handleRSVP}
            />
          )}
          contentContainerStyle={[
            styles.listContent, 
            { backgroundColor: colors.background, flexGrow: 1 }
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Calendar size={48} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No events found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Try adjusting your filters or search.</Text>
            </View>
          }
        />
      )}

      {/* Dropdowns */}
      <FilterDropdown 
        visible={!!activeFilter}
        title={activeFilter === 'sort' ? 'Sort By' : `Select ${activeFilter}`}
        options={activeFilter === 'category' ? CATEGORIES : activeFilter === 'status' ? STATUS_OPTS : SORT_OPTS}
        selectedOption={activeFilter === 'category' ? selectedCategory : activeFilter === 'status' ? selectedStatus : selectedSort}
        onClose={() => setActiveFilter(null)}
        onSelect={(opt) => {
          if (activeFilter === 'category') setSelectedCategory(opt);
          else if (activeFilter === 'status') setSelectedStatus(opt);
          else setSelectedSort(opt);
          setActiveFilter(null);
        }}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: { paddingVertical: SPACING.lg, paddingHorizontal: 16, gap: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  title: { fontFamily: FONTS.bold, fontSize: 28 },
  subtitle: { fontFamily: FONTS.medium, fontSize: 13, marginTop: 4 },
  menuBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  createBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 44, borderRadius: 12, gap: 8, maxWidth: '55%', flexShrink: 1 },
  createBtnText: { fontFamily: FONTS.bold, fontSize: 14, color: '#FFF' },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 48, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: FONTS.medium, fontSize: 14 },
  filtersRow: { flexDirection: 'row', gap: 10 },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 36, borderRadius: 18, borderWidth: 1, gap: 6 },
  filterChipLabel: { fontFamily: FONTS.bold, fontSize: 12 },
  listContent: { padding: SPACING.lg, paddingBottom: 100 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 18, marginTop: 16 },
  emptySubtitle: { fontFamily: FONTS.medium, fontSize: 14, marginTop: 4 },
});

export default EventsListScreen;
