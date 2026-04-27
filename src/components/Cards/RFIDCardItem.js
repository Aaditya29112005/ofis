import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { UserPlus } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import Checkbox from './Checkbox';

const StatusBadge = ({ status }) => {
  const { colors } = useTheme();
  let bgColor, textColor;

  switch (status?.toLowerCase()) {
    case 'active':
      bgColor = '#E3FBE3';
      textColor = '#1E8E3E';
      break;
    case 'inactive':
      bgColor = '#FDEAEA';
      textColor = '#D93025';
      break;
    case 'unassigned':
    default:
      bgColor = '#FFF0E0';
      textColor = colors.primary;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{status?.toUpperCase() || 'UNASSIGNED'}</Text>
    </View>
  );
};

const RFIDCardItem = ({ card, isSelected, onToggleSelect, onAssignPress, onPress }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Pressable 
      onPress={() => onPress && onPress(card)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View 
        style={[
          styles.cardContainer, 
          { 
            backgroundColor: isDark ? '#1A1A1A' : colors.surface,
            borderColor: isSelected ? colors.primary : colors.border,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.leftCol}>
          <Checkbox isChecked={isSelected} onPress={() => onToggleSelect(card)} />
        </View>

        <View style={styles.centerCol}>
          <Text style={[styles.uidText, { color: colors.text }]}>{card.uid}</Text>
          <Text style={[styles.techText, { color: colors.textMuted }]}>{card.tech} • {card.type}</Text>
          
          <View style={styles.clientRow}>
             <Text style={[
               styles.clientText, 
               { color: card.client ? colors.textSecondary : colors.error, fontFamily: card.client ? FONTS.medium : FONTS.regular }
             ]}>
               {card.client || 'Unassigned'}
             </Text>
             {card.companyUser && (
               <Text style={[styles.userText, { color: colors.textMuted }]}>
                 {' '}• {card.companyUser}
               </Text>
             )}
          </View>
        </View>

        <View style={styles.rightCol}>
          <StatusBadge status={card.status} />
          <Pressable 
            style={[styles.assignBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }]} 
            onPress={() => onAssignPress(card)}
            hitSlop={15}
          >
            <UserPlus size={16} color={colors.primary} />
            <Text style={[styles.assignBtnText, { color: colors.primary }]}>Assign</Text>
          </Pressable>
        </View>

      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  leftCol: {
    marginRight: SPACING.md,
    justifyContent: 'center',
  },
  centerCol: {
    flex: 1,
    justifyContent: 'center'
  },
  uidText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    marginBottom: 2
  },
  techText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    marginBottom: 6
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  clientText: {
    fontSize: FONT_SIZE.sm
  },
  userText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: SPACING.sm,
    height: 60
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: 10
  },
  assignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
    alignSelf: 'flex-end'
  },
  assignBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    marginLeft: 4
  }
});

export default RFIDCardItem;
