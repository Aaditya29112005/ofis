import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const RadioPillGroup = ({ options, selectedValue, onSelect, label }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>{label}</Text>}
      <View style={[styles.pillContainer, { backgroundColor: isDark ? '#151922' : '#F3F4F6', borderColor: isDark ? '#1E2430' : '#E5E7EB' }]}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.8}
              style={[
                styles.pill,
                isSelected && { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 }
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: isSelected ? '#FFF' : colors.textSecondary },
                  isSelected && { fontFamily: FONTS.bold }
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  groupLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillContainer: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.full,
    padding: 4,
    borderWidth: 1,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.full,
  },
  pillText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
  },
});

export default RadioPillGroup;
