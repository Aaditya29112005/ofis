import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

import RadioGroup from '../components/Leads/RadioGroup';



const FormInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default', required, colors }) => (
  <View style={styles.inputWrap}>
    <Text style={[styles.label, { color: colors.textSecondary }]}>{label} {required && <Text style={{color: '#EF4444'}}>*</Text>}</Text>
    <TextInput
      style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      keyboardType={keyboardType}
    />
  </View>
);

const CreateLeadScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  // Form State
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    gender: 'Male',
    address: '',
    pincode: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleContinue = () => {
    // Basic Validation
    const req = ['firstName', 'lastName', 'email', 'phone'];
    let valid = true;
    let newErrors = {};

    req.forEach(r => {
      if (!form[r].trim()) {
        valid = false;
        newErrors[r] = true;
      }
    });

    if (!valid) {
      setErrors(newErrors);
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    setErrors({});
    // Pseudo Success
    Alert.alert('Success', 'Lead information saved! Proceeding to next step.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{flex: 1}}>
           <Text style={[styles.title, { color: colors.text }]}>Create Lead</Text>
           <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Step 1: Initial Enquiry</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <ScrollView style={styles.formArea} showsVerticalScrollIndicator={false}>
           
           <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.row}>
                <View style={{flex: 1, marginRight: SPACING.sm}}>
                  <FormInput label="First Name" required value={form.firstName} onChangeText={(v) => handleChange('firstName', v)} placeholder="John" colors={colors} />
                </View>
                <View style={{flex: 1, marginLeft: SPACING.sm}}>
                  <FormInput label="Last Name" required value={form.lastName} onChangeText={(v) => handleChange('lastName', v)} placeholder="Doe" colors={colors} />
                </View>
              </View>
              
              <FormInput label="Email Address" required value={form.email} onChangeText={(v) => handleChange('email', v)} placeholder="john@example.com" keyboardType="email-address" colors={colors} />
              <FormInput label="Phone Number" required value={form.phone} onChangeText={(v) => handleChange('phone', v)} placeholder="+1 555-0000" keyboardType="phone-pad" colors={colors} />
              <FormInput label="Company Name" value={form.company} onChangeText={(v) => handleChange('company', v)} placeholder="Acme Corp" colors={colors} />
              
              <View style={styles.inputWrap}>
                 <Text style={styles.label}>Gender</Text>
                 <RadioGroup 
                   options={[
                     { label: 'Male', value: 'Male' },
                     { label: 'Female', value: 'Female' },
                     { label: 'Other', value: 'Other' }
                   ]}
                   selectedValue={form.gender}
                   onSelect={(v) => handleChange('gender', v)}
                 />
              </View>

              <FormInput label="Address" value={form.address} onChangeText={(v) => handleChange('address', v)} placeholder="Enter full address" colors={colors} />
              <FormInput label="Pincode" value={form.pincode} onChangeText={(v) => handleChange('pincode', v)} placeholder="000000" keyboardType="numeric" colors={colors} />
              
           </View>

        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
           <TouchableOpacity style={[styles.btn, styles.cancelBtn, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={() => navigation.goBack()}>
             <Text style={[styles.cancelTxt, { color: colors.text }]}>Cancel</Text>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.btn, styles.continueBtn, { backgroundColor: colors.primary }]} onPress={handleContinue}>
             <Text style={styles.continueTxt}>Continue</Text>
           </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md
  },
  title: { fontFamily: FONTS.bold, fontSize: 20, marginBottom: 2 },
  subtitle: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.xs },
  
  formArea: { flex: 1, padding: SPACING.md },
  card: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: 40
  },
  row: { flexDirection: 'row' },
  inputWrap: { marginBottom: SPACING.lg },
  label: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    marginBottom: 8
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.md,
  },
  
  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    paddingBottom: 30,
    borderTopWidth: 1,
    gap: SPACING.md
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelBtn: {
    borderWidth: 1,
  },
  cancelTxt: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md },
  continueBtn: {},
  continueTxt: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md, color: '#FFF' }
});

export default CreateLeadScreen;
