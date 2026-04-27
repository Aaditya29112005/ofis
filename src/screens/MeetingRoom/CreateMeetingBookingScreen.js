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
  LayoutAnimation
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ChevronDown, UserPlus, Clock, Building, Plus, CreditCard, HardDrive, Info, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import { useMeetingRoomStore } from '../../store/useMeetingRoomStore';

import FilterDropdown from '../../components/FilterDropdown';
import VisitorForm from '../../components/MeetingRoom/VisitorForm';
import Haptics from '../../utils/Haptics';



const CreateMeetingBookingScreen = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const { rooms, addBooking } = useMeetingRoomStore();
  const preSelectedRoom = route.params?.room;

  // Form State
  const [selectedRoom, setSelectedRoom] = useState(preSelectedRoom || null);
  const [customerType, setCustomerType] = useState('Member');
  const [clientName, setClientName] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-03-20');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState('');
  const [useDefaultCap, setUseDefaultCap] = useState(true);

  // UI State
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = useMemo(() => {
    if (!selectedRoom) return 0;
    const base = selectedRoom.hourlyRate;
    const discEffect = (parseFloat(discount || 0) / 100) * base;
    return base - discEffect;
  }, [selectedRoom, discount]);

  const handleAddVisitor = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setVisitors([...visitors, { email: '', phone: '', company: '' }]);
  };

  const handleCreate = () => {
    if (!selectedRoom || !clientName) return Alert.alert('Error', 'Please fill required fields (Room, Client)');
    
    setIsSubmitting(true);
    Haptics.impactMedium();

    setTimeout(() => {
      const newBooking = {
        id: Math.random().toString(36).substr(2, 9),
        room: selectedRoom.name,
        member: clientName,
        building: selectedRoom.building,
        start: `${bookingDate}T09:00:00`,
        status: 'booked',
        visitors
      };

      addBooking(newBooking);
      setIsSubmitting(false);
      Alert.alert('Success', 'Booking created successfully.');
      navigation.goBack();
    }, 1200);
  };

  const Section = ({ title, children, icon: IconComp }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {IconComp && <IconComp size={16} color="#F97316" style={{ marginRight: 8 }} />}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Create Meeting Booking</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Section title="MEETING ROOM" icon={Building}>
            <TouchableOpacity 
              style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              onPress={() => setActiveDropdown('room')}
            >
              <Text style={[styles.inputValue, { color: selectedRoom ? colors.text : colors.textMuted }]}>
                {selectedRoom ? selectedRoom.name : 'Select Room'}
              </Text>
              <ChevronDown size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </Section>

          <View style={styles.row}>
             <View style={{ flex: 1 }}>
                <Section title="CUSTOMER TYPE">
                   <View style={[styles.toggleRow, { backgroundColor: isDark ? colors.surfaceElevated : colors.background }]}>
                      {['Client', 'Member'].map(type => (
                        <TouchableOpacity 
                          key={type}
                          style={[styles.toggleBtn, customerType === type && styles.toggleBtnActive]}
                          onPress={() => setCustomerType(type)}
                        >
                           <Text style={[styles.toggleText, customerType === type && { color: '#FFF' }]}>{type}</Text>
                        </TouchableOpacity>
                      ))}
                   </View>
                </Section>
             </View>
             <View style={{ width: 16 }} />
             <View style={{ flex: 1.2 }}>
                <Section title={customerType.toUpperCase()}>
                   <TextInput 
                     style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                     placeholder={`Enter ${customerType} name`}
                     placeholderTextColor={colors.textMuted}
                     value={clientName}
                     onChangeText={setClientName}
                   />
                </Section>
             </View>
          </View>

          <Section title="DATE & TIME SLOT" icon={Clock}>
             <View style={styles.row}>
                <TouchableOpacity style={[styles.inputBox, { flex: 1, backgroundColor: colors.surface, borderColor: colors.border }]}>
                   <Text style={{ color: colors.text, fontFamily: FONTS.bold }}>{bookingDate}</Text>
                </TouchableOpacity>
                <View style={{ width: 12 }} />
                <TouchableOpacity style={[styles.inputBox, { flex: 1, backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => setActiveDropdown('slot')}>
                   <Text style={{ color: colors.textMuted, fontFamily: FONTS.medium }}>Select Slot</Text>
                   <ChevronDown size={18} color={colors.textMuted} />
                </TouchableOpacity>
             </View>
          </Section>

          <Section title="VISITORS" icon={UserPlus}>
            {visitors.map((v, idx) => (
              <VisitorForm 
                key={idx} 
                visitor={v} 
                onUpdate={(up) => {
                  const newV = [...visitors];
                  newV[idx] = up;
                  setVisitors(newV);
                }}
                onRemove={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setVisitors(visitors.filter((_, i) => i !== idx));
                }}
              />
            ))}
            <TouchableOpacity style={styles.addVisitorBtn} onPress={handleAddVisitor}>
               <Plus size={16} color={colors.primary} />
               <Text style={styles.addVisitorText}>Add Visitor</Text>
            </TouchableOpacity>
          </Section>

          <Section title="PAYMENT DETAILS" icon={CreditCard}>
             <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Payment Method</Text>
                <TouchableOpacity style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => setActiveDropdown('payment')}>
                   <Text style={{ color: colors.text, fontFamily: FONTS.bold }}>{paymentMethod}</Text>
                   <ChevronDown size={18} color={colors.textMuted} />
                </TouchableOpacity>
             </View>

             <View style={styles.row}>
                <View style={{ flex: 1 }}>
                   <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Discount %</Text>
                   <TextInput 
                     style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                     placeholder="0"
                     placeholderTextColor={colors.textMuted}
                     keyboardType="numeric"
                     value={discount}
                     onChangeText={setDiscount}
                   />
                </View>
                <View style={{ width: 12 }} />
                 <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Currency</Text>
                    <View style={[styles.inputBox, { backgroundColor: isDark ? colors.surfaceElevated : colors.background }]}>
                       <Text style={{ color: colors.textSecondary }}>INR (₹)</Text>
                    </View>
                 </View>
             </View>
          </Section>

          <Section title="NOTES">
             <TextInput 
               style={[styles.inputBox, { height: 80, textAlignVertical: 'top', paddingTop: 12, backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
               placeholder="Additional comments..."
               placeholderTextColor={colors.textMuted}
               multiline
               value={notes}
               onChangeText={setNotes}
             />
          </Section>

          {/* Detailed Summary */}
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
             <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Hourly Rate</Text>
                <Text style={[styles.summaryVal, { color: colors.text }]}>₹{selectedRoom?.hourlyRate || 0}</Text>
             </View>
             <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Discount Applied</Text>
                <Text style={[styles.summaryVal, { color: '#10B981' }]}>- ₹{((parseFloat(discount || 0) / 100) * (selectedRoom?.hourlyRate || 0)).toFixed(2)}</Text>
             </View>
             <View style={[styles.summaryRow, { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }]}>
                <Text style={[styles.summaryLabel, { color: colors.text }]}>Final Amount</Text>
                <Text style={[styles.summaryVal, { color: '#F97316', fontSize: 20 }]}>₹{totalAmount.toLocaleString()}</Text>
             </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
         <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.surface }]} onPress={() => navigation.goBack()}>
            <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
         </TouchableOpacity>
         <TouchableOpacity 
           style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} 
           onPress={handleCreate}
           disabled={isSubmitting}
         >
            {isSubmitting ? (
              <Text style={styles.submitText}>Processing...</Text>
            ) : (
              <>
                <CheckCircle size={18} color="#FFF" />
                <Text style={styles.submitText}>Create Booking</Text>
              </>
            )}
         </TouchableOpacity>
      </View>

      <FilterDropdown 
        visible={!!activeDropdown}
        title={`Select ${activeDropdown}`}
        options={
          activeDropdown === 'room' ? rooms.map(r => ({ label: r.name, value: r.id, ...r })) :
          activeDropdown === 'payment' ? [{ label: 'Razorpay', value: 'Razorpay' }, { label: 'Credits', value: 'Credits' }] :
          [{ label: '09:00 AM - 10:00 AM', value: '1' }, { label: '11:00 AM - 12:00 PM', value: '2' }]
        }
        onClose={() => setActiveDropdown(null)}
        onSelect={(opt) => {
          if (activeDropdown === 'room') setSelectedRoom(opt);
          else if (activeDropdown === 'payment') setPaymentMethod(opt.label);
          else setSelectedSlot(opt.label);
          setActiveDropdown(null);
        }}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg },
  title: { fontFamily: FONTS.bold, fontSize: 18 },
  scrollContent: { padding: SPACING.lg, paddingBottom: 60 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionLabel: { fontFamily: FONTS.bold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  inputBox: { 
    height: 52, 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    borderWidth: 1, 
    fontFamily: FONTS.medium, 
    fontSize: 14,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  inputValue: { fontFamily: FONTS.bold, fontSize: 14 },
  row: { flexDirection: 'row', marginBottom: 16 },
  toggleRow: { flexDirection: 'row', height: 44, borderRadius: 10, padding: 4, gap: 4 },
  toggleBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  toggleBtnActive: { backgroundColor: '#F97316' },
  toggleText: { fontFamily: FONTS.bold, fontSize: 12, color: '#64748B' },
  addVisitorBtn: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(249, 115, 22, 0.2)', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 8 },
  addVisitorText: { fontFamily: FONTS.bold, fontSize: 13, color: '#F97316' },
  fieldLabel: { fontFamily: FONTS.bold, fontSize: 12, marginBottom: 8, marginLeft: 4 },
  summaryCard: { borderRadius: 18, padding: 16, borderLeftWidth: 4, borderLeftColor: '#F97316', marginBottom: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontFamily: FONTS.medium, fontSize: 14 },
  summaryVal: { fontFamily: FONTS.bold, fontSize: 14 },
  footer: { padding: 20, paddingBottom: 40, borderTopWidth: 1, flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontFamily: FONTS.bold, fontSize: 15 },
  submitBtn: { flex: 2, height: 56, borderRadius: 16, backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  submitText: { fontFamily: FONTS.bold, fontSize: 15, color: '#FFF' },
});

export default CreateMeetingBookingScreen;
