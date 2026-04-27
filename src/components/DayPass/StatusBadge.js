import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../../theme/typography';

const STATUS_CONFIG = {
  payment_pending: { label: 'Payment Pending', bg: '#FEF3C7', text: '#92400E' }, // Yellow
  issued: { label: 'Issued', bg: '#DBEAFE', text: '#1E40AF' }, // Blue
  invited: { label: 'Invited', bg: '#F3E8FF', text: '#6B21A8' }, // Purple
  checked_in: { label: 'Checked In', bg: '#D1FAE5', text: '#065F46' }, // Green
  checked_out: { label: 'Checked Out', bg: '#F3F4F6', text: '#374151' }, // Gray
  cancelled: { label: 'Cancelled', bg: '#FEE2E2', text: '#991B1B' }, // Red
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { label: status, bg: '#F3F4F6', text: '#374151' };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
});

export default StatusBadge;
