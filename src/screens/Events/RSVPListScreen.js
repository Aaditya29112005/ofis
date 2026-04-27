import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Search, User, Users, Mail, Phone, Briefcase } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import { useEventsStore } from '../../store/useEventsStore';

const RSVPListScreen = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const { eventId, eventTitle } = route.params;
  const { rsvps } = useEventsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const eventRSVPs = useMemo(() => {
    let result = rsvps.filter(r => r.eventId === eventId);
    
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.email.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [debouncedQuery, rsvps, eventId]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titleArea}>
          <Text style={[styles.title, { color: colors.text }]}>RSVPs</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>{eventTitle}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{eventRSVPs.length}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput 
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search attendees..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* List */}
      <FlatList 
        data={eventRSVPs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.rsvpCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.rsvpHeader}>
              <View style={styles.avatar}>
                <User size={20} color={colors.primary} />
              </View>
              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.role, { color: colors.textSecondary }]}>{item.role} @ {item.company}</Text>
              </View>
            </View>
            
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Mail size={12} color={colors.textMuted} />
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>{item.email}</Text>
              </View>
              <View style={styles.detailItem}>
                <Phone size={12} color={colors.textMuted} />
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>{item.phone}</Text>
              </View>
            </View>

            <View style={[styles.clientTag, { borderTopColor: colors.border }]}>
               <Briefcase size={12} color={colors.primary} />
               <Text style={[styles.clientText, { color: colors.primary }]}>Client: {item.client}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Users size={48} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No RSVPs yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>When people register for this event, they will appear here.</Text>
          </View>
        }
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, gap: 16 },
  backBtn: { padding: 4 },
  titleArea: { flex: 1 },
  title: { fontFamily: FONTS.bold, fontSize: 20 },
  subtitle: { fontFamily: FONTS.medium, fontSize: 13, marginTop: 2 },
  badge: { backgroundColor: 'rgba(249, 115, 22, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontFamily: FONTS.bold, fontSize: 14, color: '#F97316' },
  searchSection: { paddingHorizontal: SPACING.lg, marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 44, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: FONTS.medium, fontSize: 14 },
  listContent: { padding: SPACING.lg, paddingBottom: 100 },
  rsvpCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  rsvpHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(249, 115, 22, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  name: { fontFamily: FONTS.bold, fontSize: 16 },
  role: { fontFamily: FONTS.medium, fontSize: 12, marginTop: 2 },
  detailsRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontFamily: FONTS.medium, fontSize: 12 },
  clientTag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12, borderTopWidth: 1 },
  clientText: { fontFamily: FONTS.bold, fontSize: 11, textTransform: 'uppercase' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 18, color: '#FFF', marginTop: 16 },
  emptySubtitle: { fontFamily: FONTS.medium, fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 8 },
});

export default RSVPListScreen;
