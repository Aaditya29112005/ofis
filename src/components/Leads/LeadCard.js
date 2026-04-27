import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Mail, Phone, Building2, MoveRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const LEADS_THEME = {
  bg: '#000000',
  card: '#151922',
  border: '#1E2430',
  textSecondary: '#9CA3AF'
};

const StatusBadge = ({ status }) => {
  const { colors, isDark } = useTheme();
  const lower = status?.toLowerCase() || '';

  let bgColor = colors.surfaceElevated;
  let textColor = colors.textSecondary;
 
  if (lower === 'new') {
    bgColor = isDark ? '#2A2D35' : '#E5E7EB';
    textColor = colors.textSecondary;
  } else if (lower === 'approved' || lower === 'qualified') {
    bgColor = `${colors.primary}20`; // 20% opacity
    textColor = colors.primary;
  } else if (lower === 'contacted') {
    bgColor = '#E0F0FF20';
    textColor = '#3B82F6';
  } else if (lower === 'converted') {
    bgColor = '#10B98120';
    textColor = '#10B981';
  } else if (lower === 'lost') {
    bgColor = '#EF444420';
    textColor = '#EF4444';
  }

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{status?.toUpperCase() || 'NEW'}</Text>
    </View>
  );
};

const LeadCard = ({ lead, onView }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Pressable 
      onPress={() => onView(lead)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[
        styles.cardContainer, 
        { 
          backgroundColor: isDark ? colors.surface : colors.surface, 
          borderColor: colors.border, 
          transform: [{ scale: scaleAnim }] 
        }
      ]}>
        
        {/* Top Header */}
        <View style={styles.header}>
           <View style={{flex: 1, paddingRight: 8}}>
              <Text style={[styles.name, { color: colors.text }]}>{lead.firstName} {lead.lastName}</Text>
              {lead.company ? (
                <View style={styles.iconRow}>
                   <Building2 size={12} color={colors.textSecondary} />
                   <Text style={[styles.companyText, { color: colors.textSecondary }]}>{lead.company}</Text>
                </View>
              ) : null}
           </View>
           <StatusBadge status={lead.status} />
        </View>

        <View style={styles.divider} />

        {/* Contact Info Table */}
        <View style={styles.contentRow}>
           <View style={styles.col}>
              <View style={styles.iconRow}>
                <Mail size={12} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.text }]} numberOfLines={1}>{lead.email}</Text>
              </View>
              <View style={styles.iconRow}>
                <Phone size={12} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.text }]}>{lead.phone}</Text>
              </View>
           </View>
           
           <View style={[styles.col, {alignItems: 'flex-end', justifyContent: 'center'}]}>
              <Text style={[styles.labelText, { color: colors.textSecondary }]}>Purpose</Text>
              <Text style={[styles.purposeText, { color: colors.text }]}>{lead.purpose}</Text>
           </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
           <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={[styles.kycDot, { backgroundColor: lead.kycStatus === 'Approved' ? '#10B981' : '#F59E0B' }]} />
              <Text style={[styles.kycText, { color: colors.textSecondary }]}>KYC: {lead.kycStatus === 'Approved' ? 'Verified' : 'Pending'}</Text>
            </View>

           <View style={[styles.viewBtn, { backgroundColor: colors.primary }]}>
             <Text style={styles.viewBtnText}>View Details</Text>
             <MoveRight size={14} color="#FFF" style={{marginLeft: 6}} />
           </View>
        </View>

      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    marginBottom: 4
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  companyText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    marginLeft: 6
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.1)',
    marginVertical: SPACING.sm
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm
  },
  col: {
    flex: 1
  },
  detailText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    marginLeft: 6
  },
  labelText: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  purposeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs
  },
  kycDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6
  },
  kycText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: LEADS_THEME.textSecondary
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full
  },
  viewBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#FFF'
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    letterSpacing: 0.5
  }
});

export default LeadCard;
