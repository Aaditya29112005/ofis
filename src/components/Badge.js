import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { BORDER_RADIUS } from '../theme/spacing';
import { safeRender } from '../utils/addressUtils';

const Badge = ({ text, type = 'status', variant = 'Open' }) => {
  const { colors } = useTheme();

  const displayValue = safeRender(text || variant);

  // Helper to get color based on variant
  const getBadgeColor = () => {
    const v = displayValue?.toLowerCase();
    if (type === 'reception') {
      switch (v) {
        case 'pending check-in':
        case 'pending': return '#0A84FF'; // Blue
        case 'checked-in':
        case 'checked_in': return colors.success || '#32D74B';
        case 'no-show':
        case 'no_show': return colors.warning || '#FF9F0A';
        default: return colors.primary;
      }
    } else if (type === 'priority') {
      switch (v) {
        case 'urgent': return colors.error || '#FF453A';
        case 'high': return colors.warning || '#FF9F0A';
        case 'medium': return colors.primary || '#FF8A00';
        case 'low': return colors.success || '#32D74B';
        default: return colors.primary;
      }
    } else {
      // type === 'status'
      switch (v) {
        case 'open': return colors.primary || '#FF8A00';
        case 'in progress': return colors.warning || '#FF9F0A';
        case 'pending': return colors.textSecondary || '#888888';
        case 'resolved': return colors.success || '#32D74B';
        case 'closed': return colors.textMuted || '#636366';
        default: return colors.primary;
      }
    }
  };

  const badgeColor = getBadgeColor();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: `${badgeColor}15`, 
        borderColor: `${badgeColor}30`,
      }
    ]}>
      <Text style={[styles.text, { color: badgeColor }]}>
        {displayValue}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs,
    textTransform: 'capitalize',
  },
});

export default Badge;
