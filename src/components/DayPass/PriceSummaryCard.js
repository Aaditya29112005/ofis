import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const PriceSummaryCard = ({ subtotal, tax, total }) => {
  const { colors, isDark } = useTheme();

  const Row = ({ label, value, isTotal = false }) => (
    <View style={[styles.row, isTotal && { borderTopWidth: 1, borderTopColor: isDark ? '#1E2430' : '#E5E7EB', paddingTop: SPACING.md, marginTop: SPACING.sm }]}>
      <Text style={[styles.label, { color: isTotal ? colors.text : colors.textSecondary }, isTotal && { fontSize: FONT_SIZE.md }]}>
        {label}
      </Text>
      <Text style={[styles.value, { color: isTotal ? colors.primary : colors.text }, isTotal && { fontSize: 20 }]}>
        ₹{value.toLocaleString('en-IN')}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#151922' : '#F9FAFB', borderColor: isDark ? '#1E2430' : '#E5E7EB' }]}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>Price Summary</Text>
      
      <Row label="Subtotal" value={subtotal} />
      <Row label="Tax (18% GST)" value={tax} />
      <Row label="Total Amount" value={total} isTotal={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    marginBottom: 40,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
  },
  value: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
  },
});

export default PriceSummaryCard;
