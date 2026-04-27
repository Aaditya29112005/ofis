import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

import ClientCard from '../components/Clients/ClientCard';
import ClientModal from '../components/Clients/ClientModal';
import ClientsFilterBar from '../components/Clients/ClientsFilterBar';
import FilterDropdown from '../components/FilterDropdown';
import { SkeletonList } from '../components/Skeleton/SkeletonLayouts';
import memberService from '../services/memberService';

const FILTER_CONFIG = {
  type: [
    { label: 'All Types', value: null },
    { label: 'Business', value: 'business' },
    { label: 'Individual', value: 'individual' }
  ],
  kyc: [
    { label: 'All', value: null },
    { label: 'Pending', value: 'pending' },
    { label: 'Verified', value: 'verified' }
  ],
  sort: [
    { label: 'Company ↑', value: 'companyName:asc' },
    { label: 'Company ↓', value: 'companyName:desc' },
    { label: 'Created Date ↑', value: 'createdAt:asc' },
    { label: 'Created Date ↓', value: 'createdAt:desc' }
  ]
};

const ClientsScreen = () => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const [typeFilter, setTypeFilter] = useState(null);
  const [sortFilter, setSortFilter] = useState(null);
  const [kycFilter, setKycFilter] = useState(null);

  const [activeDropdown, setActiveDropdown] = useState(null); // 'type', 'sort', 'kyc'
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchData();
  }, [debouncedQuery, typeFilter, kycFilter, sortFilter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (typeFilter?.value) params.type = typeFilter.value;
      if (kycFilter?.value) params.kycStatus = kycFilter.value;
      if (sortFilter?.value) params.sortBy = sortFilter.value;
      if (debouncedQuery.trim()) params.search = debouncedQuery;

      const response = await memberService.fetchClients(params);
      
      // Robust check: look for data in the 'data' field or directly in the response if it's an array
      const clientsData = Array.isArray(response) ? response : response?.data;
      
      if (response?.success || Array.isArray(clientsData)) {
        setClients(clientsData || []);
      }
    } catch (err) {
      console.error('Fetch Clients Error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch clients';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setTypeFilter(null);
    setSortFilter(null);
    setKycFilter(null);
  };

  const getDropdownData = () => {
    switch(activeDropdown) {
      case 'type': return { title: 'Customer Type', options: FILTER_CONFIG.type, selected: typeFilter, onSelect: (opt) => setTypeFilter(opt.value ? opt : null) };
      case 'kyc': return { title: 'KYC Status', options: FILTER_CONFIG.kyc, selected: kycFilter, onSelect: (opt) => setKycFilter(opt.value ? opt : null) };
      case 'sort': return { title: 'Sort By', options: FILTER_CONFIG.sort, selected: sortFilter, onSelect: (opt) => setSortFilter(opt) };
      default: return { title: '', options: [], selected: null, onSelect: () => {} };
    }
  };

  const dropdownData = getDropdownData();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Clients & Members</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Building clients linked to your workspace</Text>
        
        <View style={[styles.searchWrap, { backgroundColor: isDark ? colors.surfaceElevated : colors.surface, borderColor: colors.border }]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput 
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by company, contact, email..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ClientsFilterBar 
        typeFilter={typeFilter}
        sortFilter={sortFilter}
        kycFilter={kycFilter}
        onTypePress={() => setActiveDropdown('type')}
        onSortPress={() => setActiveDropdown('sort')}
        onKycPress={() => setActiveDropdown('kyc')}
        onClearAll={handleClearAll}
      />

      {loading && clients.length === 0 ? (
        <View style={styles.listContent}>
           <SkeletonList items={5} />
        </View>
      ) : (
        <FlatList
          data={clients}
          keyExtractor={item => item._id || item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ClientCard client={item} onView={setSelectedClient} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Search size={48} color={colors.border} style={{marginBottom: SPACING.md}} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No clients found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Try adjusting your search or filters.</Text>
            </View>
          }
        />
      )}

      <FilterDropdown 
        visible={!!activeDropdown}
        title={dropdownData.title}
        options={dropdownData.options}
        selectedOption={dropdownData.selected || dropdownData.options[0]}
        onClose={() => setActiveDropdown(null)}
        onSelect={(opt) => { dropdownData.onSelect(opt); setActiveDropdown(null); }}
      />

      <ClientModal 
        visible={!!selectedClient}
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  title: { fontFamily: FONTS.bold, fontSize: 32, letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { fontFamily: FONTS.medium, fontSize: 13, marginBottom: 24 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', height: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16 },
  searchInput: { flex: 1, marginLeft: 12, fontFamily: FONTS.regular, fontSize: 15, height: '100%', paddingVertical: 0 },
  listContent: { paddingHorizontal: 24, paddingBottom: 100, paddingTop: 8 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 17, marginBottom: 8 },
  emptySubtitle: { fontFamily: FONTS.regular, fontSize: 13 }
});


export default ClientsScreen;
