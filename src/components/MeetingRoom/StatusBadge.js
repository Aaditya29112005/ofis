import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../../theme/typography';

const STATUS_CONFIG = {
  booked: { label: 'Booked', bg: 'rgba(255, 138, 0, 0.15)', text: '#FF8A00' },
  completed: { label: 'Completed', bg: 'rgba(52, 199, 89, 0.15)', text: '#34C759' },
  cancelled: { label: 'Cancelled', bg: 'rgba(255, 69, 58, 0.15)', text: '#FF453A' },
  approval_pending: { label: 'Approval Pending', bg: 'rgba(255, 159, 10, 0.15)', text: '#FF9F0A' },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status.toLowerCase()] || { label: status, bg: 'rgba(255,255,255,0.1)', text: '#FFF' };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'center',
  },
  text: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default StatusBadge;
