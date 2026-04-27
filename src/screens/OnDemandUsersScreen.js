import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

import UserRowCard from '../components/Guests/UserRowCard';
import GuestDetailsModal from '../components/Guests/GuestDetailsModal';
import PaginationBar from '../components/Guests/PaginationBar';
import { SkeletonList } from '../components/Skeleton/SkeletonLayouts';
import memberService from '../services/memberService';

const OnDemandUsersScreen = () => {
  const { colors } = useTheme();

  const [guests, setGuests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, [debouncedQuery, currentPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      if (currentPage !== 1) setCurrentPage(1); 
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await memberService.fetchOnDemandUsers({
        search: debouncedQuery,
        page: currentPage,
        limit: 10
      });
      if (response.success) {
        setGuests(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Fetch On-Demand Users Error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch guests';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchBtn = () => {
    setDebouncedQuery(searchQuery);
    setCurrentPage(1);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
         <View style={styles.headerTop}>
            <View style={{flex: 1}}>
              <Text style={[styles.title, { color: colors.text }]}>On-demand Users (Guests)</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Search and manage one-time/guest users</Text>
            </View>
         </View>

         {/* Search Filter input group */}
         <View style={styles.searchRow}>
            <View style={[styles.searchInputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
               <Search size={18} color={colors.textSecondary} />
               <TextInput 
                 style={[styles.searchInput, { color: colors.text }]}
                 placeholder="Search by name, email..."
                 placeholderTextColor={colors.textSecondary}
                 value={searchQuery}
                 onChangeText={setSearchQuery}
                 autoCorrect={false}
                 returnKeyType="search"
                 onSubmitEditing={handleSearchBtn}
               />
            </View>
            <TouchableOpacity 
              style={[styles.searchBtn, { backgroundColor: colors.primary }]}
              onPress={handleSearchBtn}
            >
               <Text style={styles.searchBtnTxt}>Search</Text>
            </TouchableOpacity>
         </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        {loading && guests.length === 0 ? (
          <View style={styles.listContent}>
             <SkeletonList items={5} />
          </View>
        ) : (
          <FlatList 
            data={guests}
            keyExtractor={item => item._id || item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <UserRowCard user={item} onView={setSelectedUser} />
            )}
            ListEmptyComponent={
               <View style={styles.emptyContainer}>
                <Search size={48} color={colors.textMuted} style={{marginBottom: SPACING.md}} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No guests found</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Try adjusting your search criteria.</Text>
              </View>
            }
          />
        )}

        {/* Pagination Sticky Bottom */}
        <View style={styles.paginationWrap}>
          <PaginationBar 
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage(p => Math.max(1, p - 1))}
            onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          />
        </View>
      </KeyboardAvoidingView>

      <GuestDetailsModal 
        visible={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.md },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xl },
  title: { fontFamily: FONTS.bold, fontSize: 24, marginBottom: 2 },
  subtitle: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm },
  searchRow: { flexDirection: 'row', gap: SPACING.sm },
  searchInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, height: 48, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: FONTS.regular, fontSize: FONT_SIZE.md, height: '100%' },
  searchBtn: { height: 48, paddingHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.md, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  searchBtnTxt: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.sm, color: '#FFF' },
  listContent: { paddingHorizontal: SPACING.md, paddingBottom: 20 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.lg, marginBottom: 4 },
  emptySubtitle: { fontFamily: FONTS.regular, fontSize: FONT_SIZE.sm },
  paginationWrap: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl }
});


export default OnDemandUsersScreen;
