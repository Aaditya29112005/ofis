import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import StatusBadge from './StatusBadge';

const BookingCard = ({ item, onView }) => {
  const { colors, isDark } = useTheme();

  // Format date helper: "18 Mar 2026, 5:30 AM"
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'AM' : 'PM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  };

  const buildingParts = item.building.split(',');
  const bldgMain = buildingParts[0].trim();
  const bldgSub = buildingParts.slice(1).join(',').trim();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#151922' : colors.card, borderColor: isDark ? '#1E2430' : colors.border }]}>
      
      {/* Left Section: Building */}
      <View style={styles.leftSection}>
        <Text style={[styles.bldgMain, { color: colors.text }]}>{bldgMain}</Text>
        <Text style={[styles.bldgSub, { color: colors.textSecondary }]}>{bldgSub}</Text>
      </View>

      {/* Center Section: Customer Info */}
      <View style={styles.centerSection}>
        <Text style={[styles.customerName, { color: colors.text }]}>{item.customerName}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]} numberOfLines={1}>{item.email}</Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(item.date)}</Text>
      </View>

      {/* Right Section: Status & Actions */}
      <View style={styles.rightSection}>
        <StatusBadge status={item.status} />
        <Text style={[styles.invoice, { color: colors.textSecondary }]}>{item.invoice || '—'}</Text>
        <TouchableOpacity 
          style={[styles.viewBtn, { backgroundColor: colors.primary }]}
          onPress={() => onView(item)}
        >
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  leftSection: {
    flex: 1.2,
    paddingRight: SPACING.sm,
  },
  bldgMain: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
  },
  bldgSub: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    marginTop: 2,
  },
  centerSection: {
    flex: 2,
    paddingRight: SPACING.sm,
  },
  customerName: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
  },
  email: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    marginTop: 2,
  },
  date: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    marginTop: 4,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 8,
  },
  invoice: {
    fontFamily: FONTS.medium,
    fontSize: 10,
  },
  viewBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
  },
  viewBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#FFF',
  },
});

export default BookingCard;
