import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

import CalendarDatePicker from '../components/Reception/CalendarDatePicker';
import TimePickerModal from '../components/Reception/TimePickerModal';
import FilterDropdown from '../components/FilterDropdown';

// Inline simple form components
const FormSection = ({ title, children }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View>{children}</View>
    </View>
  );
};

const FieldLabel = ({ label, required }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.labelRow}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      {required && <Text style={[styles.required, { color: colors.error }]}> *</Text>}
    </View>
  );
};

const InputField = ({ placeholder, isTextArea, value, onChangeText, keyboardType = 'default' }) => {
  const { colors, isDark } = useTheme();
  return (
    <View style={[
      styles.inputContainer, 
      isTextArea && styles.textAreaContainer, 
      { backgroundColor: isDark ? colors.surfaceElevated : colors.surface, borderColor: colors.border }
    ]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { color: colors.text }, isTextArea && styles.textArea]}
        multiline={isTextArea}
        numberOfLines={isTextArea ? 4 : 1}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const SelectField = ({ placeholder, value, onPress }) => {
  const { colors, isDark } = useTheme();
  return (
    <TouchableOpacity 
      style={[
        styles.dropdownContainer, 
        { 
          backgroundColor: isDark ? colors.surfaceElevated : colors.surface,
          borderColor: value ? colors.primary : colors.border
        }
      ]}
      onPress={onPress}
    >
      <Text style={[styles.dropdownText, { color: value ? colors.text : colors.textMuted }]}>
        {value || placeholder}
      </Text>
      <ChevronDown size={18} color={value ? colors.primary : colors.textMuted} />
    </TouchableOpacity>
  );
};

const HOST_OPTIONS = [
  { label: 'Alice Smith', value: 'Alice Smith' },
  { label: 'Bob Jones', value: 'Bob Jones' },
  { label: 'Harvey Specter', value: 'Harvey Specter' }
];

const InviteVisitorScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [purpose, setPurpose] = useState('');

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [host, setHost] = useState(null);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [hostPickerVisible, setHostPickerVisible] = useState(false);

  const isFormValid = name.trim() && email.trim() && date && time && host;

  const handleInvite = () => {
    if (isFormValid) {
      console.log('Inviting visitor', { name, email, date, time, host });
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Invite Visitor</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
        
        <FormSection title="Visitor Information">
          <View style={styles.fieldWrapper}>
            <FieldLabel label="Full Name" required />
            <InputField placeholder="John Doe" value={name} onChangeText={setName} />
          </View>
          <View style={styles.fieldWrapper}>
            <FieldLabel label="Email" required />
            <InputField placeholder="john@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
          </View>
          <View style={styles.row}>
            <View style={[styles.fieldWrapper, { flex: 1, marginRight: SPACING.md }]}>
              <FieldLabel label="Phone Number" />
              <InputField placeholder="Optional" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            </View>
            <View style={[styles.fieldWrapper, { flex: 1 }]}>
              <FieldLabel label="Company Name" />
              <InputField placeholder="Optional" value={company} onChangeText={setCompany} />
            </View>
          </View>
        </FormSection>

        <FormSection title="Visit Details">
          <View style={styles.row}>
            <View style={[styles.fieldWrapper, { flex: 1, marginRight: SPACING.md }]}>
              <FieldLabel label="Expected Visit Date" required />
              <SelectField placeholder="Select Date" value={date} onPress={() => setDatePickerVisible(true)} />
            </View>
            <View style={[styles.fieldWrapper, { flex: 1 }]}>
              <FieldLabel label="Visit Time" required />
              <SelectField placeholder="Select Time" value={time} onPress={() => setTimePickerVisible(true)} />
            </View>
          </View>
          <View style={styles.fieldWrapper}>
             <FieldLabel label="Select Host" required />
             <SelectField placeholder="Who are they visiting?" value={host?.label} onPress={() => setHostPickerVisible(true)} />
          </View>
        </FormSection>

        <FormSection title="Additional Information">
          <View style={styles.fieldWrapper}>
            <FieldLabel label="Purpose of Visit" />
            <InputField placeholder="E.g. Business meeting, Interview..." value={purpose} onChangeText={setPurpose} isTextArea />
          </View>
        </FormSection>

      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: isDark ? '#1A1A1A' : colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.submitBtn, { backgroundColor: isFormValid ? colors.primary : colors.textMuted }]}
          disabled={!isFormValid}
          onPress={handleInvite}
        >
          <Text style={styles.submitBtnText}>Invite Visitor</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <CalendarDatePicker 
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        selectedDate={date}
        onSelect={setDate}
      />

      <TimePickerModal
        visible={timePickerVisible}
        onClose={() => setTimePickerVisible(false)}
        selectedTime={time}
        onSelect={setTime}
      />

      <FilterDropdown 
        visible={hostPickerVisible}
        onClose={() => setHostPickerVisible(false)}
        options={HOST_OPTIONS}
        title="Select Host"
        selectedOption={host}
        onSelect={setHost}
        searchable
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1 },
  backBtn: { padding: SPACING.xs },
  headerTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.lg },
  scrollArea: { padding: SPACING.md, paddingBottom: 100 },
  sectionContainer: { marginBottom: SPACING.xxl },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.lg, marginBottom: SPACING.md },
  row: { flexDirection: 'row' },
  fieldWrapper: { marginBottom: SPACING.md },
  labelRow: { flexDirection: 'row', marginBottom: 8 },
  fieldLabel: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm },
  required: { fontSize: FONT_SIZE.sm },
  inputContainer: { borderRadius: BORDER_RADIUS.md, borderWidth: 1, height: 52, justifyContent: 'center', paddingHorizontal: SPACING.md },
  textAreaContainer: { height: 100, paddingVertical: 12, alignItems: 'flex-start', justifyContent: 'flex-start' },
  input: { fontFamily: FONTS.regular, fontSize: FONT_SIZE.md, width: '100%' },
  textArea: { height: '100%', textAlignVertical: 'top' },
  dropdownContainer: { borderRadius: BORDER_RADIUS.md, borderWidth: 1, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md },
  dropdownText: { fontFamily: FONTS.regular, fontSize: FONT_SIZE.md },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.md, paddingBottom: 30, borderTopWidth: StyleSheet.hairlineWidth },
  submitBtn: { height: 52, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 },
  submitBtnText: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md, color: '#FFFFFF' }
});

export default InviteVisitorScreen;
