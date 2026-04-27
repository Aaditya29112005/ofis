import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../../theme/typography';

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: 'rgba(234, 179, 8, 0.1)', text: '#EAB308' }, // Yellow
  ready: { label: 'Ready', bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' }, // Blue
  completed: { label: 'Completed', bg: 'rgba(249, 115, 22, 0.1)', text: '#F97316' }, // Orange
  cancelled: { label: 'Cancelled', bg: 'rgba(107, 114, 128, 0.1)', text: '#6B7280' }, // Gray
};

const PrinterStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status.toLowerCase()] || STATUS_CONFIG.pending;

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
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default PrinterStatusBadge;
