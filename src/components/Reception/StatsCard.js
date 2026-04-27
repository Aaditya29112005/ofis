import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const StatsCard = ({ title, count }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: isDark ? '#1A1A1A' : colors.surfaceElevated,
        borderColor: colors.border,
      }
    ]}>
      <Text style={[styles.count, { color: colors.primary }]}>{count}</Text>
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  count: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    marginBottom: 4,
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
  }
});

export default StatsCard;
