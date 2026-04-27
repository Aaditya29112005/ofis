import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Pressable, TouchableOpacity } from 'react-native';
import { X, Mail, Phone, Calendar, Clock, User } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import Badge from '../Badge';
import { safeRender } from '../../utils/addressUtils';

const DetailRow = ({ icon: IconState, label, value }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.detailRow}>
      <IconState size={16} color={colors.textMuted} />
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1}>{safeRender(value) || '--'}</Text>
    </View>
  );
};

const VisitorDetailsModal = ({ visible, visitor, onClose }) => {
  const { colors, isDark } = useTheme();
  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 15, bounciness: 0 })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 400, duration: 200, useNativeDriver: true })
      ]).start();
    }
  }, [visible]);

  if (!visitor) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim, backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { backgroundColor: isDark ? '#1A1A1A' : colors.surfaceElevated, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Visitor Details</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={[styles.name, { color: colors.text }]}>{safeRender(visitor.name)}</Text>
            {visitor.company && <Text style={[styles.company, { color: colors.textSecondary }]}>{safeRender(visitor.company)}</Text>}
            
            <View style={{ marginVertical: SPACING.md }}>
               <Badge type="reception" variant={visitor.status} />
            </View>

            <View style={[styles.infoCard, { backgroundColor: isDark ? colors.background : colors.surface, borderColor: colors.border }]}>
               <DetailRow icon={Mail} label="Email" value={visitor.email} />
               <View style={[styles.sep, { backgroundColor: colors.border }]} />
               <DetailRow icon={Phone} label="Phone" value={visitor.phone} />
               <View style={[styles.sep, { backgroundColor: colors.border }]} />
               <DetailRow icon={User} label="Host" value={safeRender(visitor.host)} />
            </View>

            <View style={[styles.infoCard, { backgroundColor: isDark ? colors.background : colors.surface, borderColor: colors.border, marginTop: SPACING.md }]}>
               <DetailRow icon={Calendar} label="Date" value={visitor.visitDate} />
               <View style={[styles.sep, { backgroundColor: colors.border }]} />
               <DetailRow icon={Clock} label="Time" value={visitor.visitTime} />
            </View>

          </View>

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: { width: '100%', borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  title: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.lg },
  content: { },
  name: { fontFamily: FONTS.bold, fontSize: 22, marginBottom: 2 },
  company: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.md },
  infoCard: { borderRadius: BORDER_RADIUS.md, borderWidth: 1, padding: SPACING.md },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  detailLabel: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm, marginLeft: 8, width: 60 },
  detailValue: { fontFamily: FONTS.regular, fontSize: FONT_SIZE.sm, flex: 1, textAlign: 'right' },
  sep: { height: 1, width: '100%', marginVertical: SPACING.sm }
});

export default VisitorDetailsModal;
