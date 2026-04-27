import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import { safeRender } from '../../utils/addressUtils';

const GUESTS_THEME = {
  textSecondary: '#9CA3AF'
};

const InfoRow = ({ label, value, colors }) => (
  <View style={styles.infoRow}>
    <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    <Text style={[styles.value, { color: colors.text }]}>{value || '—'}</Text>
  </View>
);

const SectionBlock = ({ title, children, colors }) => (
  <View style={styles.sectionBlock}>
    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
    {children}
  </View>
);

const GuestDetailsModal = ({ visible, user, onClose }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 10 })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.9, duration: 200, useNativeDriver: true })
      ]).start();
    }
  }, [visible]);

  if (!visible && fadeAnim._value === 0) return null;
  if (!user) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
           <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[
          styles.modalBox, 
          { 
            backgroundColor: colors.surface,
            borderColor: colors.border,
            transform: [{ scale: scaleAnim }], 
            opacity: fadeAnim 
          }
        ]}>
          
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Guest Details</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.background }]} hitSlop={10}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
             
             <SectionBlock title="Basic Info" colors={colors}>
               <InfoRow label="Name" value={safeRender(user.name)} colors={colors} />
               <InfoRow label="Email" value={safeRender(user.email)} colors={colors} />
               <InfoRow label="Phone" value={safeRender(user.phone)} colors={colors} />
               <InfoRow label="Company" value={safeRender(user.company)} colors={colors} />
             </SectionBlock>

             <SectionBlock title="Additional Info" colors={colors}>
               <InfoRow label="Zoho Contact ID" value={user.zohoContactId} colors={colors} />
             </SectionBlock>

          </ScrollView>

          <View style={styles.footer}>
             <TouchableOpacity style={[styles.footerBtn, { borderColor: colors.border, backgroundColor: colors.background }]} onPress={onClose}>
                <Text style={[styles.footerBtnTxt, { color: colors.text }]}>Close Details</Text>
             </TouchableOpacity>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)' },
  modalBox: {
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    width: '100%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 24
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: '#FFF'
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollArea: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md
  },
  sectionBlock: {
    marginBottom: SPACING.xl
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: '#FFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    flex: 0.4
  },
  value: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: '#FFF',
    flex: 0.6,
    textAlign: 'right'
  },
  footer: {
    padding: SPACING.xl,
    paddingTop: SPACING.md
  },
  footerBtn: {
    borderWidth: 1,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerBtnTxt: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: '#FFF'
  }
});

export default GuestDetailsModal;
