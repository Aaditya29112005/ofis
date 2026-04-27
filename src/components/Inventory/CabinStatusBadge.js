import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../../theme/typography';

const STATUS_CONFIG = {
  available: { label: 'Available', bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' }, // Orange accent
  occupied: { label: 'Occupied', bg: 'rgba(31, 41, 55, 0.8)', text: '#94A3B8' }, // Dark/Gray
  maintenance: { label: 'Maintenance', bg: 'rgba(107, 114, 128, 0.1)', text: '#6B7280' }, // Grey
};

const CabinStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status.toLowerCase()] || STATUS_CONFIG.available;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default CabinStatusBadge;
