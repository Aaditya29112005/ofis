import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';
import Badge from '../components/Badge';
import { safeRender } from '../utils/addressUtils';

const DetailRow = ({ icon, label, value }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <View style={styles.detailLabelRow}>
        <Icon name={icon} size={16} color={colors.textMuted} style={styles.detailIcon} />
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
      </View>
      <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={2}>
        {safeRender(value) || '--'}
      </Text>
    </View>
  );
};

const TicketDetailsScreen = ({ route, navigation }) => {
  const { colors, isDark } = useTheme();
  // Safe extraction. In real app, route.params.ticket would be passed
  const ticket = route?.params?.ticket || {
    id: 'TCK-000',
    subject: 'Sample Ticket',
    description: 'This is a sample description because no data was provided.',
    priority: 'Low',
    status: 'Open',
    client: 'N/A',
    building: 'N/A',
    assignedTo: 'Unassigned',
    category: 'General',
    subcategory: 'Other',
    createdAt: 'Jan 1, 2026'
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Ticket #{ticket.id}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditTicket', { ticket })} style={styles.editBtn}>
          <Icon name="pencil-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Title Section */}
        <View style={styles.section}>
          <Text style={[styles.subject, { color: colors.text }]}>{safeRender(ticket.subject)}</Text>
          <View style={styles.badgeRow}>
            <Badge type="status" variant={ticket.status} />
            <Badge type="priority" variant={ticket.priority} />
            <Text style={[styles.dateText, { color: colors.textMuted }]}>• {safeRender(ticket.createdAt)}</Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={[styles.card, { backgroundColor: isDark ? colors.surfaceElevated : colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {safeRender(ticket.description)}
          </Text>
        </View>

        {/* Details Section */}
        <View style={[styles.card, { backgroundColor: isDark ? colors.surfaceElevated : colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: SPACING.md }]}>Information</Text>
            <DetailRow 
              icon="person-outline" 
              label="Client" 
              value={safeRender(ticket.client)} 
            />
            <DetailRow 
              icon="location-outline" 
              label="Building" 
              value={safeRender(ticket.building)} 
            />
            <DetailRow 
              icon="hardware-chip-outline" 
              label="Category" 
              value={safeRender(ticket.category) + (ticket.subcategory ? ` > ${safeRender(ticket.subcategory)}` : '')} 
            />
            <DetailRow 
              icon="person-add-outline" 
              label="Assigned To" 
              value={safeRender(ticket.assignedTo)} 
            />
        </View>

        {/* Attachment Section (Empty state representation) */}
        <View style={[styles.card, { backgroundColor: isDark ? colors.surfaceElevated : colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Attachments</Text>
            {ticket.attachments?.length ? (
              <Text style={{color: colors.text}}>Attachments map here</Text> // Render actual attachments
            ) : (
              <View style={styles.emptyAttachments}>
                <Icon name="attach-outline" size={24} color={colors.textMuted} />
                <Text style={[styles.emptyAttachText, { color: colors.textMuted }]}>No attachments provided</Text>
              </View>
            )}
        </View>

      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomBar, { backgroundColor: isDark ? colors.surfaceElevated : colors.surface, borderTopColor: colors.border }]}>
         <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary }]}>
            <Icon name="checkmark-circle-outline" size={18} color={COLORS.white} style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Change Status</Text>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
  },
  editBtn: {
    padding: SPACING.xs,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 100, // Space for bottom bar
  },
  section: {
    marginBottom: SPACING.xl,
    paddingTop: SPACING.sm,
  },
  subject: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    lineHeight: 32,
    marginBottom: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dateText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    marginLeft: SPACING.xs,
  },
  card: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg, // 18
    marginBottom: SPACING.sm,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    marginRight: SPACING.sm,
  },
  detailLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
  },
  detailValue: {
    fontFamily: FONTS.semibold,
    fontSize: FONT_SIZE.sm,
    flex: 1.5,
    textAlign: 'right',
  },
  emptyAttachments: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyAttachText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    paddingBottom: 30, // For home indicator
    borderTopWidth: 1,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
  },
  primaryBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryBtnText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: '#FFF',
  }
});

export default TicketDetailsScreen;
