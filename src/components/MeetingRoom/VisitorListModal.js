import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { X, User, CheckCircle, Mail, Phone } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const VisitorListModal = ({ visible, onClose, visitors, bookingTitle }) => {
  const { colors, isDark } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Visitors</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>{bookingTitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {visitors && visitors.length > 0 ? (
              visitors.map((v, idx) => (
                <View key={idx} style={[styles.visitorRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.avatar, { backgroundColor: `${colors.primary}15` }]}>
                    <User size={18} color={colors.primary} />
                  </View>
                  <View style={styles.info}>
                    <Text style={[styles.name, { color: colors.text }]}>{v.name}</Text>
                    <View style={styles.meta}>
                      <Mail size={10} color={colors.textSecondary} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>{v.email || 'No email'}</Text>
                    </View>
                  </View>
                  <View style={[styles.status, { backgroundColor: v.status === 'checked_in' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(249, 115, 22, 0.1)' }]}>
                     <Text style={[styles.statusText, { color: v.status === 'checked_in' ? '#10B981' : '#F97316' }]}>{v.status}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No visitors found for this booking.</Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity style={[styles.closeAction, { backgroundColor: colors.surfaceElevated }]} onPress={onClose}>
            <Text style={[styles.closeActionText, { color: colors.text }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  card: { width: '90%', maxHeight: '70%', borderRadius: 24, borderWidth: 1, padding: 0, overflow: 'hidden' },
  header: { padding: 20, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: FONTS.bold, fontSize: 18 },
  subtitle: { fontFamily: FONTS.medium, fontSize: 12, marginTop: 2 },
  closeBtn: { padding: 4 },
  list: { padding: 20 },
  visitorRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(249, 115, 22, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  name: { fontFamily: FONTS.bold, fontSize: 14 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  metaText: { fontFamily: FONTS.medium, fontSize: 11 },
  status: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontFamily: FONTS.bold, fontSize: 9, textTransform: 'uppercase' },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { fontFamily: FONTS.medium, fontSize: 14 },
  closeAction: { margin: 20, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  closeActionText: { fontFamily: FONTS.bold, fontSize: 14 },
});

export default VisitorListModal;
