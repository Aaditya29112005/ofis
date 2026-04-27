import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, TouchableOpacity } from 'react-native';
import { Eye, CheckCircle, UserCheck, ChevronRight, User, Mail, Calendar as CalendarIcon, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import { COLORS } from '../../theme/colors';
import Badge from '../Badge';
import GlassCard from '../GlassCard';
import { safeRender } from '../../utils/addressUtils';

const VisitorCardRow = ({ visitor, onRowPress, onCheckIn, onApprove, onViewDetails }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { 
      toValue: 0.96, 
      useNativeDriver: true, 
      tension: 100,
      friction: 10 
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { 
      toValue: 1, 
      useNativeDriver: true,
      tension: 100,
      friction: 10
    }).start();
  };

  const isPending = visitor.status === 'pending_checkin' || visitor.status === 'pending';

  return (
    <Pressable
      onPress={() => onRowPress(visitor)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <GlassCard style={styles.card}>
          {/* Header: Name and Status */}
          <View style={styles.header}>
            <View style={styles.nameSection}>
              <View style={[styles.avatarShort, { backgroundColor: isDark ? colors.surfaceElevated : '#F1F3F5' }]}>
                <User size={18} color={COLORS.primary} />
              </View>
              <View>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                  {safeRender(visitor.name)}
                </Text>
                <View style={styles.emailRow}>
                   <Mail size={12} color={colors.textSecondary} />
                   <Text style={[styles.email, { color: colors.textSecondary }]} numberOfLines={1}>
                     {safeRender(visitor.email)}
                   </Text>
                </View>
              </View>
            </View>
            <Badge type="reception" variant={visitor.status} />
          </View>

          {/* Body: Host and Date */}
          <View style={[styles.body, { borderColor: colors.border }]}>
             <View style={[styles.infoItem, { flex: 1 }]}>
                <UserCheck size={14} color={colors.textMuted} />
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>HOST: </Text>
                <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">{safeRender(visitor.host)}</Text>
             </View>
            <View style={styles.infoItem}>
               <CalendarIcon size={14} color={colors.textMuted} />
               <Text style={[styles.infoLabel, { color: colors.textMuted }]}>DATE: </Text>
               <Text style={[styles.infoValue, { color: colors.text }]}>{safeRender(visitor.visitDate)}</Text>
            </View>
          </View>

          {/* Footer: Actions */}
          <View style={styles.footer}>
            <View style={styles.actionRow}>
              {isPending && (
                <TouchableOpacity 
                  onPress={() => onApprove(visitor)} 
                  style={[styles.actionBtn, { backgroundColor: `${COLORS.success}10`, borderColor: `${COLORS.success}30` }]}
                >
                   <CheckCircle size={16} color={COLORS.success} />
                   <Text style={[styles.actionBtnText, { color: COLORS.success }]}>Approve</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                onPress={() => onCheckIn(visitor)} 
                style={[styles.actionBtn, { backgroundColor: `${COLORS.primary}10`, borderColor: `${COLORS.primary}30` }]}
              >
                 <ArrowRight size={16} color={COLORS.primary} />
                 <Text style={[styles.actionBtnText, { color: COLORS.primary }]}>Check In</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={() => onViewDetails(visitor)} style={styles.detailsBtn}>
               <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </GlassCard>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm,
  },
  avatarShort: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    letterSpacing: -0.2,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  email: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
  },
  body: {
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoLabel: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flex: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    gap: 6,
  },
  actionBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
  },
  detailsBtn: {
    padding: 8,
  }
});

export default VisitorCardRow;
