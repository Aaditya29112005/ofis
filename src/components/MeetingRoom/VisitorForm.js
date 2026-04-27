import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { X, User, Mail, Phone, Briefcase } from 'lucide-react-native';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import { useTheme } from '../../context/ThemeContext';

const VisitorForm = ({ visitor, onUpdate, onRemove }) => {
  const { colors, isDark } = useTheme();
  const handleChange = (field, val) => {
    onUpdate({ ...visitor, [field]: val });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <User size={16} color={colors.textSecondary} />
        <Text style={[styles.title, { color: colors.text }]}>Visitor Information</Text>
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
          <X size={16} color="#F43F5E" />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <View style={[styles.inputBox, { backgroundColor: isDark ? colors.surfaceElevated : colors.background }]}>
          <Mail size={14} color={colors.textMuted} style={styles.icon} />
          <TextInput 
            placeholder="Email Address"
            placeholderTextColor={colors.textMuted}
            value={visitor.email}
            onChangeText={(v) => handleChange('email', v)}
            style={[styles.input, { color: colors.text }]}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputBox, { backgroundColor: isDark ? colors.surfaceElevated : colors.background }]}>
          <Phone size={14} color={colors.textMuted} style={styles.icon} />
          <TextInput 
            style={[styles.input, { color: colors.text }]}
            placeholder="Phone Number"
            placeholderTextColor={colors.textMuted}
            value={visitor.phone}
            keyboardType="phone-pad"
            onChangeText={(v) => handleChange('phone', v)}
          />
        </View>

        <View style={[styles.inputBox, { width: '100%', backgroundColor: isDark ? colors.surfaceElevated : colors.background }]}>
          <Briefcase size={14} color={colors.textMuted} style={styles.icon} />
          <TextInput 
            style={[styles.input, { color: colors.text }]}
            placeholder="Company Name"
            placeholderTextColor={colors.textMuted}
            value={visitor.company}
            onChangeText={(v) => handleChange('company', v)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    borderRadius: 16, 
    borderWidth: 1, 
    padding: 16,
    marginBottom: 12,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  title: { fontFamily: FONTS.bold, fontSize: 13, flex: 1 },
  removeBtn: { padding: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  inputBox: { 
    width: '48%', 
    height: 44, 
    borderRadius: 10, 
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontFamily: FONTS.medium, fontSize: 13 },
});

export default VisitorForm;
