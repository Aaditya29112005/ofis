import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Animated, 
  Pressable, 
  Dimensions, 
  ScrollView 
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import StatusBadge from './StatusBadge';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SectionBlock = ({ title, children }) => {
  const { colors, isDark } = useTheme();
  return (
    <View style={styles.sectionBlock}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: isDark ? '#1A1E26' : '#F9FAFB' }]}>
        {children}
      </View>
    </View>
  );
};

const InfoRow = ({ label, value, isStatus = false }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
      {isStatus ? (
        <StatusBadge status={value} />
      ) : (
        <Text style={[styles.infoValue, { color: colors.text }]}>{value || '—'}</Text>
      )}
    </View>
  );
};

const BookingDetailsModal = ({ visible, booking, onClose }) => {
  const { colors, isDark } = useTheme();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 12,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible]);

  if (!booking && !visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View 
          style={[
            styles.sheet, 
            { 
              backgroundColor: isDark ? '#151922' : colors.card,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: isDark ? '#1E2430' : colors.border }]}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Booking Details</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>ID: #{booking?.id}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <SectionBlock title="🧾 Booking Info">
              <InfoRow label="Building" value={booking?.building} />
              <InfoRow label="Customer" value={booking?.customerName} />
              <InfoRow label="Email" value={booking?.email} />
              <InfoRow label="Date" value={booking?.date && new Date(booking.date).toLocaleString()} />
              <InfoRow label="Status" value={booking?.status} isStatus />
              <InfoRow label="Invoice" value={booking?.invoice} />
            </SectionBlock>

            <SectionBlock title="🧠 Additional Info">
              <InfoRow label="Pass Type" value="Bundle (10 Passes)" />
              <InfoRow label="Payment Mode" value="Credit Card" />
              <InfoRow label="Notes" value="Looking for quiet workspace near windows." />
            </SectionBlock>

            <View style={{ height: 40 }} />
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: isDark ? '#1E2430' : colors.border }]}>
            <Pressable 
              style={[styles.closeAction, { backgroundColor: isDark ? '#1E2430' : '#E5E7EB' }]}
              onPress={onClose}
            >
              <Text style={[styles.closeActionText, { color: colors.text }]}>Close View</Text>
            </Pressable>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  sheet: {
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.85,
    minHeight: SCREEN_HEIGHT * 0.6,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 8,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  sectionBlock: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  sectionContent: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  infoValue: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  closeAction: {
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeActionText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
  },
});

export default BookingDetailsModal;
