import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ChevronDown, CreditCard, Info, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

import RadioPillGroup from '../components/DayPass/RadioPillGroup';
import NumberStepper from '../components/DayPass/NumberStepper';
import PriceSummaryCard from '../components/DayPass/PriceSummaryCard';
import FilterDropdown from '../components/FilterDropdown';

const MOCK_BUILDINGS = [
  { id: '1', label: 'Empire State Building', value: 'empire', price: 500 },
  { id: '2', label: 'World Trade Center', value: 'wtc', price: 750 },
  { id: '3', label: 'Silicon Valley Hub', value: 'svhub', price: 600 },
  { id: '4', label: 'London Bridge Ofis', value: 'london', price: 1200 },
];

const MOCK_CLIENTS = [
  { id: 'c1', label: 'Acme Corp', value: 'acme' },
  { id: 'c2', label: 'Wayne Enterprises', value: 'wayne' },
  { id: 'c3', label: 'Stark Industries', value: 'stark' },
];

const MOCK_MEMBERS = {
  acme: [
    { id: 'm1', label: 'John Doe', value: 'john' },
    { id: 'm2', label: 'Jane Smith', value: 'jane' },
  ],
  wayne: [
    { id: 'm3', label: 'Bruce Wayne', value: 'bruce' },
    { id: 'm4', label: 'Alfred P.', value: 'alfred' },
  ],
  stark: [
    { id: 'm5', label: 'Tony Stark', value: 'tony' },
    { id: 'm6', label: 'Pepper Potts', value: 'pepper' },
  ],
};

const BookDayPassScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  // Form State
  const [customerType, setCustomerType] = useState('client'); // 'client' | 'guest'
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [guestSearch, setGuestSearch] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [purchaseType, setPurchaseType] = useState('single'); // 'single' | 'bundle'
  const [totalPasses, setTotalPasses] = useState(1);
  const [passesYourself, setPassesYourself] = useState(0);
  const [passesOthers, setPassesOthers] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'credits'
  const [notes, setNotes] = useState('');

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState(null); // 'client' | 'member' | 'building'

  // Calculations
  const allocated = useMemo(() => passesYourself + passesOthers, [passesYourself, passesOthers]);
  const remaining = useMemo(() => Math.max(0, totalPasses - allocated), [totalPasses, allocated]);

  const pricing = useMemo(() => {
    const basePrice = selectedBuilding ? selectedBuilding.price : 0;
    const count = purchaseType === 'single' ? 1 : totalPasses;
    const subtotal = basePrice * count;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [selectedBuilding, purchaseType, totalPasses]);

  const creditBalance = 2500;
  const creditValue = 1; // 1 credit = ₹1
  const creditsRequired = pricing.total / creditValue;
  const hasSufficientCredits = creditBalance >= creditsRequired;

  // Validation
  const isValid = useMemo(() => {
    if (!selectedBuilding) return false;
    if (customerType === 'client' && !selectedClient) return false;
    if (purchaseType === 'bundle') {
      if (totalPasses <= 0) return false;
      if (allocated > totalPasses) return false;
    }
    if (paymentMethod === 'credits' && !hasSufficientCredits) return false;
    return true;
  }, [selectedBuilding, customerType, selectedClient, purchaseType, totalPasses, allocated, paymentMethod, hasSufficientCredits]);

  const handlePurchase = () => {
    if (!isValid) return;
    Alert.alert(
      'Success',
      `Day Pass ${purchaseType === 'single' ? 'purchased' : 'bundle created'} successfully for ₹${pricing.total.toLocaleString('en-IN')}`,
      [{ text: 'Great', onPress: () => navigation.goBack() }]
    );
  };

  const Section = ({ title, children, noMargin = false }) => (
    <View style={[styles.section, noMargin && { marginBottom: 0 }]}>
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#1E2430' : colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>Book Day Pass</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Purchase day passes for workspace access</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <X size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Section title="Customer Type">
            <RadioPillGroup
              options={[
                { label: 'Client / Member', value: 'client' },
                { label: 'Guest (On-demand)', value: 'guest' },
              ]}
              selectedValue={customerType}
              onSelect={(val) => {
                setCustomerType(val);
                setSelectedClient(null);
                setSelectedMember(null);
              }}
            />
          </Section>

          <Section title={customerType === 'client' ? 'Client / Member Selection' : 'Guest Search'}>
            {customerType === 'client' ? (
              <View style={styles.dropdownGrid}>
                <TouchableOpacity 
                  style={[styles.dropdownTrigger, { backgroundColor: isDark ? '#151922' : '#F3F4F6', borderColor: isDark ? '#1E2430' : colors.border }]}
                  onPress={() => setActiveDropdown('client')}
                >
                  <Text style={[styles.dropdownValue, { color: selectedClient ? colors.text : colors.textSecondary }]}>
                    {selectedClient ? selectedClient.label : 'Select Client'}
                  </Text>
                  <ChevronDown size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                {selectedClient && (
                  <TouchableOpacity 
                    style={[styles.dropdownTrigger, { backgroundColor: isDark ? '#151922' : '#F3F4F6', borderColor: isDark ? '#1E2430' : colors.border, marginTop: SPACING.md }]}
                    onPress={() => setActiveDropdown('member')}
                  >
                    <Text style={[styles.dropdownValue, { color: selectedMember ? colors.text : colors.textSecondary }]}>
                      {selectedMember ? selectedMember.label : 'Select Member (Optional)'}
                    </Text>
                    <ChevronDown size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={[styles.inputContainer, { backgroundColor: isDark ? '#151922' : '#F3F4F6', borderColor: isDark ? '#1E2430' : colors.border }]}>
                <TextInput
                  placeholder="Search by name, email or phone"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { color: colors.text }]}
                  value={guestSearch}
                  onChangeText={setGuestSearch}
                  textAlignVertical="center"
                  includeFontPadding={false}
                />
              </View>
            )}
          </Section>

          <Section title="Building Selection">
            <TouchableOpacity 
              style={[styles.dropdownTrigger, { backgroundColor: isDark ? '#151922' : '#F3F4F6', borderColor: isDark ? '#1E2430' : colors.border }]}
              onPress={() => setActiveDropdown('building')}
            >
              <View>
                <Text style={[styles.dropdownValue, { color: selectedBuilding ? colors.text : colors.textSecondary }]}>
                  {selectedBuilding ? selectedBuilding.label : 'Select Building'}
                </Text>
                {selectedBuilding && <Text style={[styles.priceTag, { color: colors.primary }]}>₹{selectedBuilding.price}/day</Text>}
              </View>
              <ChevronDown size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </Section>

          <Section title="Purchase Type">
            <RadioPillGroup
              options={[
                { label: 'Single Pass', value: 'single' },
                { label: 'Bundle', value: 'bundle' },
              ]}
              selectedValue={purchaseType}
              onSelect={setPurchaseType}
            />

            {purchaseType === 'single' ? (
              <View style={[styles.infoBanner, { backgroundColor: isDark ? '#1E2430' : '#E0F2FE' }]}>
                <Info size={18} color={isDark ? '#3B82F6' : '#0369A1'} />
                <Text style={[styles.infoText, { color: isDark ? '#BFDBFE' : '#0C4A6E' }]}>
                  Visit date and visitor details will be added later
                </Text>
              </View>
            ) : (
              <View style={styles.bundleWrap}>
                <NumberStepper 
                  label="Total Passes"
                  value={totalPasses}
                  onValueChange={setTotalPasses}
                  min={1}
                />
                
                <View style={styles.stepperRow}>
                  <NumberStepper 
                    label="For Yourself"
                    value={passesYourself}
                    onValueChange={setPassesYourself}
                    max={totalPasses - passesOthers}
                  />
                  <View style={{ width: SPACING.md }} />
                  <NumberStepper 
                    label="For Others"
                    value={passesOthers}
                    onValueChange={setPassesOthers}
                    max={totalPasses - passesYourself}
                  />
                </View>

                {allocated > totalPasses && (
                  <View style={styles.errorBanner}>
                    <AlertCircle size={16} color="#EF4444" />
                    <Text style={styles.errorText}>Allocation exceeds total passes</Text>
                  </View>
                )}

                <View style={[styles.calcRow, { borderTopColor: isDark ? '#1E2430' : colors.border }]}>
                   <View style={styles.calcCol}>
                      <Text style={styles.calcLabel}>Allocated</Text>
                      <Text style={[styles.calcValue, { color: colors.text }]}>{allocated}</Text>
                   </View>
                   <View style={styles.calcCol}>
                      <Text style={styles.calcLabel}>Remaining</Text>
                      <Text style={[styles.calcValue, { color: remaining > 0 ? '#10B981' : colors.textSecondary }]}>{remaining}</Text>
                   </View>
                </View>
              </View>
            )}
          </Section>

          <Section title="Payment Method">
            <RadioPillGroup
              options={[
                { label: 'Card / UPI', value: 'card' },
                { label: 'Credits', value: 'credits' },
              ]}
              selectedValue={paymentMethod}
              onSelect={setPaymentMethod}
            />

            {paymentMethod === 'credits' && (
              <View style={[styles.creditCard, { backgroundColor: isDark ? '#1A1D23' : '#FDF2F8', borderColor: isDark ? '#1E2430' : '#FBCFE8' }]}>
                <View style={styles.creditHeader}>
                   <CreditCard size={20} color={colors.primary} />
                   <Text style={[styles.creditTitle, { color: colors.text }]}>Credit Wallet Balance</Text>
                </View>
                <View style={styles.creditStats}>
                   <View>
                      <Text style={styles.creditSub}>Available</Text>
                      <Text style={styles.creditVal}>{creditBalance} Cr</Text>
                   </View>
                   <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.creditSub}>Required</Text>
                      <Text style={[styles.creditVal, !hasSufficientCredits && { color: '#EF4444' }]}>{creditsRequired} Cr</Text>
                   </View>
                </View>
                {!hasSufficientCredits && (
                  <View style={styles.insufficientRow}>
                     <AlertCircle size={14} color="#EF4444" />
                     <Text style={styles.insufficientText}>Insufficient credits. Please top up or use Card.</Text>
                  </View>
                )}
              </View>
            )}
          </Section>

          <Section title="Notes (Optional)">
            <View style={[styles.notesContainer, { backgroundColor: isDark ? '#151922' : '#F3F4F6', borderColor: isDark ? '#1E2430' : colors.border }]}>
               <TextInput 
                 multiline
                 numberOfLines={3}
                 placeholder="Add any specific requirements..."
                 placeholderTextColor={colors.textSecondary}
                 style={[styles.notesInput, { color: colors.text }]}
                 value={notes}
                 onChangeText={setNotes}
               />
            </View>
          </Section>

          <PriceSummaryCard 
             subtotal={pricing.subtotal}
             tax={pricing.tax}
             total={pricing.total}
          />

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer Actions */}
      <View style={[styles.footer, { borderTopColor: isDark ? '#1E2430' : colors.border }]}>
         <TouchableOpacity 
           style={[styles.purchaseBtn, { backgroundColor: colors.primary }, !isValid && { opacity: 0.5 }]}
           disabled={!isValid}
           onPress={handlePurchase}
         >
            <Text style={styles.purchaseBtnText}>Purchase Pass</Text>
         </TouchableOpacity>
      </View>

      {/* Dropdowns */}
      <FilterDropdown 
        visible={!!activeDropdown}
        title={activeDropdown === 'client' ? 'Select Client' : activeDropdown === 'member' ? 'Select Member' : 'Select Building'}
        options={activeDropdown === 'client' ? MOCK_CLIENTS : activeDropdown === 'member' ? MOCK_MEMBERS[selectedClient?.value] || [] : MOCK_BUILDINGS}
        selectedOption={null}
        onClose={() => setActiveDropdown(null)}
        onSelect={(opt) => {
          if (activeDropdown === 'client') {
            setSelectedClient(opt);
            setSelectedMember(null);
          } else if (activeDropdown === 'member') {
            setSelectedMember(opt);
          } else if (activeDropdown === 'building') {
            setSelectedBuilding(opt);
          }
          setActiveDropdown(null);
        }}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 22,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  closeBtn: {
    padding: 8,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  dropdownValue: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.md,
  },
  priceTag: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    marginTop: 2,
  },
  inputContainer: {
    height: 56,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    justifyContent: 'center',
  },
  input: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.md,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
  },
  infoText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    marginLeft: 10,
    flex: 1,
  },
  bundleWrap: {
    marginTop: SPACING.sm,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calcRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
  },
  calcCol: {
    flex: 1,
  },
  calcLabel: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  calcValue: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    marginTop: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: '#EF4444',
    marginLeft: 6,
  },
  creditCard: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    marginTop: SPACING.sm,
  },
  creditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  creditTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    marginLeft: 10,
  },
  creditStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  creditSub: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  creditVal: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: '#FFF',
    marginTop: 2,
  },
  insufficientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(239, 68, 68, 0.2)',
  },
  insufficientText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: '#EF4444',
    marginLeft: 8,
  },
  notesContainer: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    minHeight: 100,
  },
  notesInput: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.md,
    textAlignVertical: 'top',
    includeFontPadding: false,
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  purchaseBtn: {
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseBtnText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: '#FFF',
  },
});

export default BookDayPassScreen;
