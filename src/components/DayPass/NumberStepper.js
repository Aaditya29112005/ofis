import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const NumberStepper = ({ label, value, onValueChange, min = 0, max = 99, disabled = false }) => {
  const { colors, isDark } = useTheme();

  const handleDecrement = () => {
    if (value > min) onValueChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onValueChange(value + 1);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
      <View style={[styles.stepperContainer, { backgroundColor: isDark ? '#151922' : '#F3F4F6', borderColor: isDark ? '#1E2430' : '#E5E7EB' }]}>
        <TouchableOpacity
          onPress={handleDecrement}
          disabled={value <= min || disabled}
          style={[styles.btn, (value <= min || disabled) && { opacity: 0.3 }]}
        >
          <Minus size={18} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.valueWrap}>
          <Text style={[styles.valueText, { color: colors.text }]}>{value}</Text>
        </View>

        <TouchableOpacity
          onPress={handleIncrement}
          disabled={value >= max || disabled}
          style={[styles.btn, (value >= max || disabled) && { opacity: 0.3 }]}
        >
          <Plus size={18} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: SPACING.md,
  },
  label: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    marginBottom: 6,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    height: 48,
    overflow: 'hidden',
  },
  btn: {
    width: 44,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  valueText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
  },
});

export default NumberStepper;
