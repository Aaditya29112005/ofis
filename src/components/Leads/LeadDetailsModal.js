import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { X, FileText, CheckCircle2, Navigation } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';



const SectionHeader = ({ title }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      <View style={[styles.sectionLine, { backgroundColor: colors.border }]} />
    </View>
  );
};

const DetailRow = ({ label, value }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value || '—'}</Text>
    </View>
  );
};

const LeadDetailsModal = ({ visible, lead, onClose }) => {
  const { colors, isDark } = useTheme();
  const slideAnim = useRef(new Animated.Value(600)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 50, friction: 9 })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 800, duration: 250, useNativeDriver: true })
      ]).start();
    }
  }, [visible]);

  if (!visible && fadeAnim._value === 0) return null;
  if (!lead) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
           <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[
          styles.modalSheet, 
          { transform: [{ translateY: slideAnim }], backgroundColor: colors.background }
        ]}>
          <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
          
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={{flex: 1}}>
              <Text style={[styles.title, { color: colors.text }]}>{lead.firstName} {lead.lastName}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{lead.company || 'Independent Lead'}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surface }]}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
             
             {/* Basic Information */}
             <SectionHeader title="Basic Information" />
             <DetailRow label="First Name" value={lead.firstName} />
             <DetailRow label="Last Name" value={lead.lastName} />
             <DetailRow label="Email" value={lead.email} />
             <DetailRow label="Phone" value={lead.phone} />
             <DetailRow label="Gender" value={lead.gender} />
             <DetailRow label="Address" value={lead.address} />
             <DetailRow label="Pincode" value={lead.pincode} />

             {/* Workspace & Onboarding */}
             <SectionHeader title="Workspace & Onboarding" />
             <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Requirement</Text>
                <View style={[styles.highlightBadge, { backgroundColor: `${colors.primary}20` }]}>
                   <Text style={[styles.highlightText, { color: colors.primary }]}>{lead.purpose}</Text>
                </View>
             </View>
              <View style={styles.detailRow}>
                 <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Current Status</Text>
                 <View style={[styles.highlightBadge, { backgroundColor: isDark ? colors.surfaceElevated : colors.surface }]}>
                    <Text style={[styles.highlightText, { color: colors.textSecondary }]}>{lead.status}</Text>
                 </View>
              </View>
             <DetailRow label="Tour Booked" value={lead.tourBooked ? 'Yes' : 'No'} />

             {/* KYC Verification */}
             <SectionHeader title="KYC Verification" />
              <View style={[styles.kycBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                 <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md}}>
                    {lead.kycStatus === 'Approved' ? <CheckCircle2 size={24} color="#10B981" /> : <Navigation size={24} color="#F59E0B" />}
                    <View style={{marginLeft: 12}}>
                       <Text style={[styles.kycTitle, { color: colors.text }]}>ID VERIFICATION</Text>
                       <Text style={[styles.kycStatus, { color: lead.kycStatus === 'Approved' ? '#10B981' : '#F59E0B' }]}>
                         {lead.kycStatus === 'Approved' ? 'Verified & Approved' : 'Pending Document Upload'}
                       </Text>
                    </View>
                 </View>

                {lead.kycStatus === 'Approved' && (
                  <TouchableOpacity style={[styles.viewDocBtn, { backgroundColor: colors.surfaceElevated }]}>
                     <FileText size={16} color={colors.primary} style={{ marginRight: 8 }} />
                     <Text style={[styles.viewDocTxt, { color: colors.primary }]}>View Documents</Text>
                  </TouchableOpacity>
                )}
             </View>

          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
             <TouchableOpacity 
               style={[styles.footerBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
               onPress={onClose}
             >
               <Text style={[styles.footerBtnTxt, { color: colors.textSecondary }]}>Close Details</Text>
             </TouchableOpacity>
           </View>

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)' },
  modalSheet: {
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingTop: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 24,
    height: '85%'
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    marginBottom: 4
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: SPACING.xl
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.md
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginRight: SPACING.md
  },
  sectionLine: {
    flex: 1,
    height: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    flex: 0.4
  },
  detailValue: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    flex: 0.6,
    textAlign: 'right'
  },
  highlightBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  highlightText: {
    fontFamily: FONTS.bold,
    fontSize: 12
  },
  kycBox: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl
  },
  kycTitle: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    marginBottom: 2
  },
  kycStatus: {
    fontFamily: FONTS.medium,
    fontSize: 12
  },
  viewDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 10
  },
  viewDocTxt: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: 30,
    borderTopWidth: 1,
  },
  footerBtn: {
    borderWidth: 1,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerBtnTxt: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
  }
});

export default LeadDetailsModal;
