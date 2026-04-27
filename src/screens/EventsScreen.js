import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { 
    FadeInUp, 
    useAnimatedStyle, 
    useSharedValue, 
    withSpring
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import DashboardLayout from '../components/DashboardLayout';
import { safeRender } from '../utils/addressUtils';
import GlassCard from '../components/GlassCard';
import Haptics from '../utils/Haptics';
import { useEventsStore } from '../store/useEventsStore';

const EventCard = ({ _id, id, title, description, category, startDate, time, location, status, rsvpCount, onEdit, onDelete, index }) => {
    const { colors, isDark } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const isPublished = status === 'published';
    const eventId = _id || id;

    const formattedDate = startDate ? new Date(startDate).toLocaleDateString('en-GB') : 'N/A';
    const formattedTime = startDate ? new Date(startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    return (
        <Animated.View 
            entering={FadeInUp.delay(index * 100).springify()}
            style={styles.cardContainer}
        >
            <GlassCard style={[styles.eventCard, { borderColor: '#1F1F1F' }]}>
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={1}>{safeRender(title)}</Text>
                        <Text style={[styles.eventDesc, { color: colors.textSecondary }]} numberOfLines={2}>{safeRender(description)}</Text>
                    </View>
                </View>

                <View style={[styles.infoRow, { flexWrap: 'wrap' }]}>
                    <View style={[styles.infoItem, { backgroundColor: isDark ? '#1F1F1F' : '#F1F3F5' }]}>
                        <Icon name="calendar-outline" size={14} color="#FF8A00" />
                        <Text style={[styles.infoText, { color: colors.text }]} numberOfLines={1}>{formattedDate} • {formattedTime}</Text>
                    </View>
                    <View style={[styles.infoItem, { backgroundColor: isDark ? '#1F1F1F' : '#F1F3F5' }]}>
                        <Icon name="location-outline" size={14} color="#FF8A00" />
                        <Text style={[styles.infoText, { color: colors.text }]} numberOfLines={1}>{safeRender(location)}</Text>
                    </View>
                </View>

                <View style={[styles.cardFooter, { borderTopColor: isDark ? '#1F1F1F' : '#E5E5EA' }]}>
                    <View style={[styles.statusPill, { backgroundColor: isPublished ? 'rgba(255,138,0,0.12)' : '#1F1F1F' }]}>
                        <Text style={[styles.statusPillText, { color: isPublished ? '#FF8A00' : '#A1A1AA' }]}>{status}</Text>
                    </View>

                    <Text style={[styles.rsvpCount, { color: colors.textMuted }]}>{rsvpCount || 0} RSVPs</Text>

                    <View style={styles.cardActions}>
                        <Animated.View style={animatedStyle}>
                            <TouchableOpacity 
                                style={[styles.editBtn, { backgroundColor: isDark ? '#1F1F1F' : '#F1F3F5' }]}
                                onPressIn={() => {
                                    Haptics.impactLight();
                                    scale.value = withSpring(0.95);
                                }}
                                onPressOut={() => (scale.value = withSpring(1))}
                                onPress={() => onEdit(eventId)}
                            >
                                <Icon name="create-outline" size={18} color="#A1A1AA" />
                            </TouchableOpacity>
                        </Animated.View>

                        <TouchableOpacity 
                            style={styles.deleteBtn}
                            onPress={() => {
                                Haptics.impactMedium();
                                onDelete(eventId);
                            }}
                        >
                            <Icon name="trash-outline" size={18} color="#FF453A" />
                        </TouchableOpacity>
                    </View>
                </View>
            </GlassCard>
        </Animated.View>
    );
};

const FilterDropdown = ({ label, value, options, isOpen, onToggle, onSelect }) => {
    const { colors } = useTheme();
    return (
        <View style={{ flex: 1, position: 'relative', zIndex: isOpen ? 100 : 1 }}>
            <Text style={[styles.filterLabel, { color: colors.textMuted }]}>{label}</Text>
            <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]} onPress={onToggle}>
                <Text style={[styles.filterText, { color: colors.textSecondary }]}>{value}</Text>
                <Text style={[styles.arrow, { color: colors.textMuted }]}>▼</Text>
            </TouchableOpacity>
            {isOpen && (
                <View style={[styles.dropdownMenu, { backgroundColor: colors.surface, borderColor: colors.glassBorder }]}>
                    {options.map((opt) => (
                        <TouchableOpacity key={opt.value || opt} style={styles.dropdownItem} onPress={() => onSelect(opt)}>
                            <Text style={[styles.dropdownItemText, { color: (value === opt.label || value === opt) ? COLORS.primary : colors.textSecondary }]}>{safeRender(opt)}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const EventsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { events, categories, loading, refreshEvents, fetchCategories, deleteEvent } = useEventsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [filters, setFilters] = useState({
    category: { label: 'All Categories', value: null },
    status: { label: 'All Status', value: null },
    sort: { label: 'Newest', value: 'startDate:desc' }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    handleRefresh();
  }, [filters]);

  const handleRefresh = () => {
    const params = {};
    if (filters.status.value) params.status = filters.status.value.toLowerCase();
    if (filters.category.value) params.categoryId = filters.category.value;
    if (filters.sort.value) params.sortBy = filters.sort.value;
    if (searchQuery) params.search = searchQuery;

    refreshEvents(params);
  };

  const toggleDropdown = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const handleSelect = (key, opt) => {
    const optionObj = typeof opt === 'string' ? { label: opt, value: opt === 'All Categories' || opt === 'All Status' ? null : opt } : opt;
    setFilters({ ...filters, [key]: optionObj });
    setActiveDropdown(null);
  };

  const handleEdit = (id) => {
      const event = events.find(e => e._id === id || e.id === id);
      navigation.navigate('CreateEvent', { event, isEdit: true });
  };

  const handleDeletePress = (id) => {
      setSelectedEventId(id);
      setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
      try {
          await deleteEvent(selectedEventId);
          setIsDeleteModalVisible(false);
          setSelectedEventId(null);
          Haptics.notificationSuccess();
      } catch (err) {
          Alert.alert('Error', err.message || 'Failed to delete event');
      }
  };

  const categoryOptions = [{ label: 'All Categories', value: null }, ...categories.map(c => ({ label: c.name, value: c._id }))];
  const statusOptions = [
      { label: 'All Status', value: null },
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
      { label: 'Completed', value: 'completed' },
      { label: 'Cancelled', value: 'cancelled' }
  ];
  const sortOptions = [
      { label: 'Newest First', value: 'startDate:desc' },
      { label: 'Oldest First', value: 'startDate:asc' }
  ];

  return (
    <DashboardLayout 
        activeTab="Events" 
        onTabPress={(id) => navigation.navigate(id)}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Events</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage community events and activities</Text>
        </View>
        <TouchableOpacity 
            style={styles.createBtn} 
            onPress={() => navigation.navigate('CreateEvent')}
        >
            <Text style={styles.createBtnText}>+ Create Event</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toolsRow}>
        <View style={[styles.searchBox, { backgroundColor: colors.surface }]}>
            <Icon name="search-outline" size={18} color={colors.textMuted} />
            <TextInput 
                placeholder="Search by title or description..." 
                placeholderTextColor={colors.textMuted} 
                style={[styles.searchTextInput, { color: colors.text }]} 
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleRefresh}
            />
        </View>
      </View>

      <View style={styles.filtersRow}>
        <FilterDropdown 
            label="Category"
            value={filters.category.label}
            options={categoryOptions}
            isOpen={activeDropdown === 'category'}
            onToggle={() => toggleDropdown('category')}
            onSelect={(val) => handleSelect('category', val)}
        />
        <FilterDropdown 
            label="Status"
            value={filters.status.label}
            options={statusOptions}
            isOpen={activeDropdown === 'status'}
            onToggle={() => toggleDropdown('status')}
            onSelect={(val) => handleSelect('status', val)}
        />
        <FilterDropdown 
            label="Sort"
            value={filters.sort.label}
            options={sortOptions}
            isOpen={activeDropdown === 'sort'}
            onToggle={() => toggleDropdown('sort')}
            onSelect={(val) => handleSelect('sort', val)}
        />
      </View>

      <View style={styles.metaRow}>
          <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
            {loading ? 'Loading events...' : events.length === 0 ? 'No events found' : `Showing ${events.length} events`}
          </Text>
          <TouchableOpacity 
            style={styles.clearAllBtn}
            onPress={() => setFilters({
                category: { label: 'All Categories', value: null },
                status: { label: 'All Status', value: null },
                sort: { label: 'Newest', value: 'startDate:desc' }
            })}
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {loading && events.length === 0 ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : (
            events.map((item, index) => (
                <EventCard 
                    key={item._id || item.id} 
                    {...item} 
                    index={index}
                    onEdit={handleEdit}
                    onDelete={handleDeletePress}
                />
            ))
        )}
      </ScrollView>

      <Modal visible={isDeleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <GlassCard style={styles.deleteModal}>
                <Text style={styles.modalEmoji}>⚠️</Text>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Delete Event?</Text>
                <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>This action cannot be undone. Are you sure you want to remove this event?</Text>
                
                <View style={styles.modalActions}>
                    <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: isDark ? '#1F1F1F' : '#F1F3F5' }]} onPress={() => setIsDeleteModalVisible(false)}>
                        <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirmBtn} onPress={confirmDelete}>
                        <Text style={styles.confirmBtnText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </GlassCard>
        </View>
      </Modal>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginTop: 4,
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    marginRight: 16,
  },
  createBtnText: {
    color: COLORS.black,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  toolsRow: {
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
  },
  searchTextInput: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 15,
    marginLeft: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    zIndex: 100,
  },
  filterLabel: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },
  filterText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  resultsText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  clearAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearAllText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  cardContainer: {
    marginBottom: 16,
  },
  eventCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  eventTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  eventDesc: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    lineHeight: 20,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,69,58,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  deleteModal: {
    width: '100%',
    padding: 32,
    alignItems: 'center',
    borderRadius: 32,
  },
  modalEmoji: {
    fontSize: 40,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    marginBottom: 12,
  },
  modalDesc: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  confirmBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FF453A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
});

export default EventsScreen;
