import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { MapPin, Users, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import { formatAddress, safeRender } from '../../utils/addressUtils';

const TypeBadge = ({ type }) => {
  const { colors } = useTheme();
  const isBusiness = type?.toLowerCase() === 'business';
  
  return (
    <View style={[
      styles.typeBadge, 
      { backgroundColor: isBusiness ? '#FFF0E0' : '#E0F0FF' }
    ]}>
      <Text style={[
        styles.typeBadgeText, 
        { color: isBusiness ? colors.primary : '#0066CC' }
      ]}>
        {type?.toUpperCase() || 'UNKNOWN'}
      </Text>
    </View>
  );
};

const ClientCard = ({ client, onView }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const primaryContact = client.contacts?.[0];
  const moreContacts = client.contacts?.length > 1 ? client.contacts.length - 1 : 0;

  return (
    <Pressable 
      onPress={() => onView(client)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[
        styles.cardContainer, 
        { 
          backgroundColor: colors.surface, 
          transform: [{ scale: scaleAnim }], 
          borderColor: colors.border,
          borderWidth: isDark ? 1.5 : 1
        }
      ]}>
        
        {/* Top Header */}
        <View style={styles.topRow}>
          <Text style={[styles.companyName, { color: colors.text }]}>{safeRender(client.companyName)}</Text>
          <TypeBadge type={client.type} />
        </View>

        {/* Contact Info */}
        {primaryContact ? (
          <View style={styles.infoRow}>
            <Users size={14} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {primaryContact.name} {moreContacts > 0 ? `(+${moreContacts})` : ''}
            </Text>
          </View>
        ) : null}

        {/* Billing Address */}
        <View style={styles.infoRow}>
          <MapPin size={14} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={1}>
            {formatAddress(client.billingAddress) || 'No billing address provided'}
          </Text>
        </View>

        {/* Footer Actions */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
           <View style={styles.kycWrap}>
             <View style={[styles.statusDot, { backgroundColor: client.kycStatus === 'verified' ? colors.success : colors.warning }]} />
             <Text style={[styles.kycText, { color: colors.textMuted }]}>
               KYC: <Text style={{fontFamily: FONTS.bold, color: colors.text}}>{client.kycStatus === 'verified' ? 'Verified' : 'Pending'}</Text>
             </Text>
           </View>

           <View style={[styles.viewBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }]}>
             <Text style={[styles.viewBtnText, { color: colors.text }]}>View</Text>
             <ChevronRight size={14} color={colors.text} style={{marginLeft: 2}} />
           </View>
        </View>

      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm
  },
  companyName: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    marginRight: SPACING.sm,
    lineHeight: 24
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  typeBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 10
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  infoText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    marginLeft: 6,
    flex: 1
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  kycWrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  kycText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md
  },
  viewBtnText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm
  }
});

export default ClientCard;
