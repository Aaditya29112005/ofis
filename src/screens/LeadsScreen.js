import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, SlidersHorizontal, ChevronDown } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

import LeadCard from '../components/Leads/LeadCard';
import LeadDetailsModal from '../components/Leads/LeadDetailsModal';
import FilterDropdown from '../components/FilterDropdown';
import { SkeletonList } from '../components/Skeleton/SkeletonLayouts';



const MOCK_LEADS = [
  {
    id: '1', firstName: 'Sarah', lastName: 'Connor', email: 'sarah@skynet.com', phone: '+1 555-0899', gender: 'Female',
    company: 'Cyberdyne Systems', address: '1200 Tech Blvd', pincode: '90210',
    purpose: 'Private Office', status: 'New', tourBooked: false, kycStatus: 'Pending'
  },
  {
    id: '2', firstName: 'Bruce', lastName: 'Wayne', email: 'bruce@wayne.com', phone: '+1 555-0100', gender: 'Male',
    company: 'Wayne Enterprises', address: '1007 Mountain Drive, Gotham', pincode: '10001',
    purpose: 'Coworking Space', status: 'Qualified', tourBooked: true, kycStatus: 'Approved'
  },
  {
    id: '3', firstName: 'Diana', lastName: 'Prince', email: 'diana@themyscira.gov', phone: '+1 555-0199', gender: 'Female',
    company: 'Antiquities Dept', address: 'Louvre Museum', pincode: '75001',
    purpose: 'Meeting Room', status: 'Contacted', tourBooked: false, kycStatus: 'Pending'
  },
  {
    id: '4', firstName: 'Clark', lastName: 'Kent', email: 'clark@dailyplanet.com', phone: '+1 555-0200', gender: 'Male',
    company: 'Daily Planet', address: '344 Clinton St, Metropolis', pincode: '10011',
    purpose: 'Virtual Office', status: 'Converted', tourBooked: true, kycStatus: 'Approved'
  },
  {
    id: '5', firstName: 'Barry', lastName: 'Allen', email: 'barry@ccpd.gov', phone: '+1 555-0300', gender: 'Male',
    company: 'CCPD Labs', address: 'Central City', pincode: '60001',
    purpose: 'Single Desk', status: 'Lost', tourBooked: false, kycStatus: 'Pending'
  }
];

const STATUS_OPTS = [
  { label: 'All Status', value: null },
  { label: 'New', value: 'New' },
  { label: 'Contacted', value: 'Contacted' },
  { label: 'Qualified', value: 'Qualified' },
  { label: 'Converted', value: 'Converted' },
  { label: 'Lost', value: 'Lost' }
];

const PURPOSE_OPTS = [
  { label: 'All Purpose', value: null },
  { label: 'Coworking Space', value: 'Coworking Space' },
  { label: 'Day Pass', value: 'Day Pass' },
  { label: 'Meeting Room', value: 'Meeting Room' },
  { label: 'Private Office', value: 'Private Office' },
  { label: 'Virtual Office', value: 'Virtual Office' },
  { label: 'Event Space', value: 'Event Space' },
  { label: 'Single Desk', value: 'Single Desk' },
  { label: 'Private Cabin', value: 'Private Cabin' }
];

const LeadsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  const [statusFilter, setStatusFilter] = useState(null);
  const [purposeFilter, setPurposeFilter] = useState(null);
  
  const [activeSheet, setActiveSheet] = useState(null); // 'status' | 'purpose'
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredLeads = useMemo(() => {
    let result = MOCK_LEADS;

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(l => 
        l.firstName.toLowerCase().includes(q) ||
        l.lastName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.company && l.company.toLowerCase().includes(q))
      );
    }

    if (statusFilter?.value) result = result.filter(l => l.status === statusFilter.value);
    if (purposeFilter?.value) result = result.filter(l => l.purpose === purposeFilter.value);

    return result;
  }, [debouncedQuery, statusFilter, purposeFilter]);

  const getSheetData = () => {
    if (activeSheet === 'status') return { title: 'Filter by Status', opts: STATUS_OPTS, sel: statusFilter, set: setStatusFilter };
    if (activeSheet === 'purpose') return { title: 'Filter by Purpose', opts: PURPOSE_OPTS, sel: purposeFilter, set: setPurposeFilter };
    return { title: '', opts: [], sel: null, set: () => {} };
  };

  const activeSheetData = getSheetData();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
         <View style={styles.headerTop}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Leads</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage and track all leads</Text>
            </View>
            <TouchableOpacity 
              style={[styles.createBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('CreateLead')}
            >
              <Plus size={16} color="#FFF" />
              <Text style={styles.createBtnTxt}>Create Lead</Text>
            </TouchableOpacity>
         </View>

         <View style={[styles.searchWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Search size={18} color={colors.textSecondary} />
            <TextInput 
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by name, email, phone, company..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
         </View>

         <View style={styles.filterRow}>
            <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => setActiveSheet('status')}>
               <SlidersHorizontal size={14} color={colors.textSecondary} />
               <Text style={[styles.filterBtnTxt, { color: colors.text }]}>{statusFilter ? statusFilter.label : 'All Status'}</Text>
               <ChevronDown size={14} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => setActiveSheet('purpose')}>
               <SlidersHorizontal size={14} color={colors.textSecondary} />
               <Text style={[styles.filterBtnTxt, { color: colors.text }]}>{purposeFilter ? purposeFilter.label : 'All Purpose'}</Text>
               <ChevronDown size={14} color={colors.textSecondary} />
            </TouchableOpacity>
         </View>
      </View>

      {loading ? (
        <View style={styles.listContent}>
           <SkeletonList horizontal items={5} />
        </View>
      ) : (
        <FlatList 
          data={filteredLeads}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <LeadCard lead={item} onView={setSelectedLead} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Search size={48} color={colors.textMuted} style={{marginBottom: SPACING.md}} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No leads found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Try adjusting your search or filters.</Text>
            </View>
          }
        />
      )}

      <FilterDropdown 
        visible={!!activeSheet}
        title={activeSheetData.title}
        options={activeSheetData.opts}
        selectedOption={activeSheetData.sel || activeSheetData.opts[0]}
        onClose={() => setActiveSheet(null)}
        onSelect={(opt) => { activeSheetData.set(opt.value ? opt : null); setActiveSheet(null); }}
      />

      <LeadDetailsModal 
        visible={!!selectedLead}
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.lg },
  title: { fontFamily: FONTS.bold, fontSize: 26, marginBottom: 2 },
  subtitle: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.xs },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.full
  },
  createBtnTxt: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.sm, color: '#FFF', marginLeft: 6 },
  
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md
  },
  searchInput: { flex: 1, marginLeft: 8, fontFamily: FONTS.regular, fontSize: FONT_SIZE.md, height: '100%' },
  
  filterRow: { flexDirection: 'row', gap: SPACING.sm },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 38,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md
  },
  filterBtnTxt: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.xs, marginHorizontal: 6 },

  listContent: { paddingHorizontal: SPACING.md, paddingBottom: 100, paddingTop: SPACING.sm },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.lg, marginBottom: 4 },
  emptySubtitle: { fontFamily: FONTS.regular, fontSize: FONT_SIZE.sm }
});

export default LeadsScreen;
