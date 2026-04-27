import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';
import Icon from 'react-native-vector-icons/Ionicons';
import { safeRender } from '../utils/addressUtils';
import Badge from './Badge';

const TicketCard = ({ ticket, onPress }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[
        styles.cardContainer,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: isDark ? colors.border : 'transparent',
          borderWidth: isDark ? 1 : 0,
          shadowColor: '#000',
          shadowOffset: isDark ? { width: 0, height: 10 } : { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.3 : 0.05,
          shadowRadius: isDark ? 15 : 10,
          elevation: isDark ? 10 : 3,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        
        {/* Left Side: Details */}
        <View style={styles.leftContent}>
          <Text style={[styles.subject, { color: colors.text }]} numberOfLines={1}>
            {safeRender(ticket.subject)}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {ticket.description}
          </Text>

          <View style={styles.infoRow}>
            <Icon name="briefcase-outline" size={12} color={colors.textMuted} />
            <Text style={[styles.infoText, { color: colors.textMuted }]} numberOfLines={1}>
              {safeRender(ticket.client || 'Internal')}
            </Text>
            {ticket.building && (
              <>
                <View style={[styles.dot, { backgroundColor: colors.textMuted }]} />
                <Icon name="location-outline" size={12} color={colors.textMuted} />
                <Text style={[styles.infoText, { color: colors.textMuted }]} numberOfLines={1}>
                  {safeRender(ticket.building)}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Right Side: Badges & Arrow */}
        <View style={styles.rightContent}>
          <Badge type="status" variant={ticket.status} />
          <Badge type="priority" variant={ticket.priority} />
          <Icon name="chevron-forward-outline" size={20} color={colors.textMuted} style={{ alignSelf: 'center' }} />
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
    justifyContent: 'space-between',
  },
  subject: {
    fontFamily: FONTS.semibold,
    fontSize: FONT_SIZE.md,
    marginBottom: 4,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs,
    flexShrink: 1,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 4,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    gap: 8,
  },
});

export default TicketCard;
