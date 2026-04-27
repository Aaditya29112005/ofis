import React from 'react';
import { 
  View, Text, StyleSheet, Modal, TouchableOpacity, 
  ScrollView, Dimensions 
} from 'react-native';
import { X, Calendar, Clock, MapPin, Users, Coffee, UserPlus, Fingerprint } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';

const BookingDetailsModal = ({ visible, booking, onClose }) => {
  const { colors, isDark } = useTheme();
  if (!booking) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Booking Details</Text>
              <View style={[styles.statusBadge, { backgroundColor: booking.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 138, 0, 0.1)' }]}>
                <Text style={[styles.statusText, { color: booking.status === 'COMPLETED' ? '#10B981' : '#FF8A00' }]}>{booking.status}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { borderColor: colors.border }]}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
               <View style={styles.infoRow}>
                  <MapPin size={20} color="#64748B" />
                  <View style={styles.infoCol}>
                     <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Meeting Room</Text>
                     <Text style={[styles.infoValue, { color: colors.text }]}>{booking.roomName}</Text>
                     <Text style={[styles.infoSub, { color: colors.textMuted }]}>{booking.capacity} Persons Max</Text>
                  </View>
               </View>

               <View style={styles.infoRow}>
                  <Calendar size={20} color="#64748B" />
                  <View style={styles.infoCol}>
                     <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Schedule</Text>
                     <Text style={[styles.infoValue, { color: colors.text }]}>{booking.startTime}</Text>
                     <Text style={[styles.infoValue, { color: colors.text }]}>{booking.endTime}</Text>
                  </View>
               </View>

               <View style={styles.infoRow}>
                  <Fingerprint size={20} color="#64748B" />
                  <View style={styles.infoCol}>
                     <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Member</Text>
                     <Text style={[styles.infoValue, { color: colors.text }]}>{booking.memberName}</Text>
                     <Text style={[styles.infoSub, { color: colors.textMuted}]}>{booking.memberLocation}</Text>
                  </View>
               </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.section}>
               <Text style={[styles.sectionTitle, { color: colors.text }]}>Catering & Items</Text>
               <View style={styles.tagGrid}>
                  {booking.catering.length > 0 ? booking.catering.map((item, i) => (
                    <View key={i} style={[styles.tag, { borderColor: colors.border }]}>
                       <Coffee size={14} color="#FF8A00" />
                       <Text style={[styles.tagText, { color: colors.text }]}>{item}</Text>
                    </View>
                  )) : (
                    <Text style={styles.emptyText}>No catering assigned</Text>
                  )}
               </View>
            </View>

            <View style={styles.section}>
               <Text style={[styles.sectionTitle, { color: colors.text }]}>Visitors ({booking.visitors.length})</Text>
               {booking.visitors.length > 0 ? booking.visitors.map((v, i) => (
                 <View key={i} style={[styles.visitorItem, { borderColor: colors.border }]}>
                    <UserPlus size={16} color={colors.textMuted} />
                    <View>
                       <Text style={[styles.visitorName, { color: colors.text }]}>{v.name}</Text>
                       <Text style={[styles.visitorEmail, { color: colors.textMuted }]}>{v.email}</Text>
                    </View>
                 </View>
               )) : (
                 <Text style={styles.emptyText}>No visitors added</Text>
               )}
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
                <Text style={[styles.notesText, { color: colors.textSecondary, borderColor: colors.border }]}>{booking.notes || 'No additional notes'}</Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.accessBtn}>
             <Fingerprint size={20} color="#FFF" />
             <Text style={styles.accessBtnText}>Manage Access Permissions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
  },
  closeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  infoSub: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginBottom: 24,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  tagText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  emptyText: {
    color: '#475569',
    fontSize: 13,
    fontStyle: 'italic',
  },
  visitorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  visitorName: {
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  visitorEmail: {
    fontSize: 12,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  accessBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    height: 54,
    borderRadius: 12,
    gap: 10,
    marginTop: 10,
  },
  accessBtnText: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontSize: 16,
  }
});

export default BookingDetailsModal;
