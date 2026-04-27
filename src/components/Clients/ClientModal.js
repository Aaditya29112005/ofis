import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { X, Mail, Phone, Users } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import { formatAddress, safeRender } from '../../utils/addressUtils';

const StatusBadge = ({ isInactive }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: isInactive ? '#FDEAEA' : '#E3FBE3' }]}>
      <Text style={[styles.badgeText, { color: isInactive ? '#D93025' : '#1E8E3E' }]}>
        {isInactive ? 'INACTIVE' : 'ACTIVE'}
      </Text>
    </View>
  );
};

const ClientModal = ({ visible, client, onClose }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 0 })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.9, duration: 200, useNativeDriver: true })
      ]).start();
    }
  }, [visible]);

  if (!visible && fadeAnim._value === 0) return null;
  if (!client) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim, backgroundColor: 'rgba(0,0,0,0.6)' }]}>
           <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[
          styles.modalBox, 
          { 
            backgroundColor: isDark ? '#1A1A1A' : colors.surfaceElevated, 
            opacity: fadeAnim, 
            transform: [{ scale: scaleAnim }] 
          }
        ]}>
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <Text style={[styles.title, { color: colors.text }]}>{safeRender(client.companyName)}</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>{formatAddress(client.billingAddress)}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.sectionHeader, { borderBottomColor: colors.border }]}>
             <Users size={18} color={colors.text} />
             <Text style={[styles.sectionTitle, { color: colors.text }]}>Contacts & Members</Text>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {client.contacts && client.contacts.length > 0 ? (
              client.contacts.map((contact, idx) => (
                <View key={idx} style={[styles.contactRow, { borderBottomColor: colors.border, borderBottomWidth: idx === client.contacts.length - 1 ? 0 : StyleSheet.hairlineWidth }]}>
                  <View style={styles.contactInfo}>
                     <Text style={[styles.contactName, { color: colors.text }]}>{safeRender(contact.name)}</Text>
                     <View style={styles.iconRow}>
                       <Mail size={12} color={colors.textMuted} />
                       <Text style={[styles.contactDetail, { color: colors.textMuted }]}>{contact.email}</Text>
                     </View>
                     <View style={styles.iconRow}>
                       <Phone size={12} color={colors.textMuted} />
                       <Text style={[styles.contactDetail, { color: colors.textMuted }]}>{contact.phone}</Text>
                     </View>
                  </View>
                  <StatusBadge isInactive={contact.status === 'inactive'} />
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={{color: colors.textMuted, fontFamily: FONTS.medium}}>No members found</Text>
              </View>
            )}
          </ScrollView>

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.md },
  backdrop: { ...StyleSheet.absoluteFillObject },
  modalBox: { width: '100%', maxHeight: '85%', borderRadius: BORDER_RADIUS.xl, paddingVertical: SPACING.lg, paddingHorizontal: SPACING.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md, paddingHorizontal: SPACING.sm },
  headerTitleWrap: { flex: 1, paddingRight: SPACING.sm },
  title: { fontFamily: FONTS.bold, fontSize: 20, marginBottom: 4 },
  subtitle: { fontFamily: FONTS.regular, fontSize: FONT_SIZE.xs, lineHeight: 18 },
  closeBtn: { padding: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, paddingBottom: SPACING.sm, marginBottom: SPACING.sm, paddingHorizontal: SPACING.sm },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md, marginLeft: 8 },
  scrollArea: { paddingHorizontal: SPACING.sm },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md },
  contactInfo: { flex: 1, paddingRight: SPACING.sm },
  contactName: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md, marginBottom: 4 },
  iconRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  contactDetail: { fontFamily: FONTS.regular, fontSize: FONT_SIZE.xs, marginLeft: 6 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontFamily: FONTS.bold, fontSize: 10 },
  emptyState: { paddingVertical: SPACING.xl, alignItems: 'center' }
});

export default ClientModal;
