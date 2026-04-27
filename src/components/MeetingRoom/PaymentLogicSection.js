import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import { CreditCard, Zap } from 'lucide-react-native';

const PaymentLogicSection = ({ method, onMethodChange, hourlyRate, discount, onDiscountChange, reason, onReasonChange }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>PAYMENT METHOD</Text>
      
      <View style={styles.methodToggle}>
        <TouchableOpacity 
          style={[styles.methodBtn, method === 'razorpay' && { backgroundColor: '#F97316', borderColor: '#F97316' }, { borderColor: isDark ? '#1F2937' : colors.border }]}
          onPress={() => onMethodChange('razorpay')}
        >
          <Zap size={16} color={method === 'razorpay' ? '#FFF' : '#64748B'} />
          <Text style={[styles.methodText, { color: method === 'razorpay' ? '#FFF' : '#64748B' }]}>Razorpay</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.methodBtn, method === 'credits' && { backgroundColor: '#F97316', borderColor: '#F97316' }, { borderColor: isDark ? '#1F2937' : colors.border }]}
          onPress={() => onMethodChange('credits')}
        >
          <CreditCard size={16} color={method === 'credits' ? '#FFF' : '#64748B'} />
          <Text style={[styles.methodText, { color: method === 'credits' ? '#FFF' : '#64748B' }]}>Credits</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.details, { backgroundColor: isDark ? '#1E293B' : '#F9FAFB', borderColor: isDark ? '#334155' : colors.border }]}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: '#94A3B8' }]}>{method === 'razorpay' ? 'Hourly Rate' : 'Value per Credit'}</Text>
          <Text style={[styles.infoVal, { color: '#FFF' }]}>{method === 'razorpay' ? `₹${hourlyRate}/hr` : '1 Cr = ₹1'}</Text>
        </View>

        {method === 'credits' && (
          <View style={styles.infoRow}>
             <Text style={[styles.infoLabel, { color: '#94A3B8' }]}>Available Credits</Text>
             <Text style={[styles.infoVal, { color: '#10B981' }]}>2,500 Cr</Text>
          </View>
        )}

        <View style={[styles.divider, { backgroundColor: isDark ? '#334155' : colors.border }]} />

        <View style={styles.inputRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: '#94A3B8' }]}>DISCOUNT (%)</Text>
            {method === 'credits' ? (
              <Text style={styles.disabledMsg}>Not applicable for credits</Text>
            ) : (
              <TextInput 
                style={[styles.input, { color: '#FFF', borderColor: '#334155' }]}
                placeholder="0"
                placeholderTextColor="#475569"
                keyboardType="numeric"
                value={discount}
                onChangeText={onDiscountChange}
              />
            )}
          </View>
          <View style={{ flex: 2, marginLeft: SPACING.md }}>
             <Text style={[styles.inputLabel, { color: '#94A3B8' }]}>REASON (OPTIONAL)</Text>
             <TextInput 
                style={[styles.input, { color: '#FFF', borderColor: '#334155' }]}
                placeholder="Marketing discount..."
                placeholderTextColor="#475569"
                value={reason}
                onChangeText={onReasonChange}
              />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: SPACING.lg },
  label: { fontFamily: FONTS.bold, fontSize: 11, letterSpacing: 1, marginBottom: SPACING.md },
  methodToggle: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  methodBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: 12, borderWidth: 1, gap: 8 },
  methodText: { fontFamily: FONTS.bold, fontSize: 13 },
  details: { padding: SPACING.lg, borderRadius: 16, borderWidth: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  infoLabel: { fontFamily: FONTS.medium, fontSize: 13 },
  infoVal: { fontFamily: FONTS.bold, fontSize: 13 },
  divider: { height: 1, marginVertical: 16 },
  inputRow: { flexDirection: 'row' },
  inputLabel: { fontFamily: FONTS.bold, fontSize: 10, marginBottom: 8 },
  input: { height: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontFamily: FONTS.bold, fontSize: 14 },
  disabledMsg: { fontFamily: FONTS.medium, fontSize: 11, color: '#64748B', paddingTop: 12 },
});

export default PaymentLogicSection;
