import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../../theme/typography';

const STATUS_CONFIG = {
  draft: { label: 'Draft', bg: '#F3F4F6', text: '#374151' }, // Grey
  published: { label: 'Published', bg: '#D1FAE5', text: '#065F46' }, // Green
  completed: { label: 'Completed', bg: '#DBEAFE', text: '#1E40AF' }, // Blue
  cancelled: { label: 'Cancelled', bg: '#FEE2E2', text: '#991B1B' }, // Red
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status.toLowerCase()] || { label: status, bg: '#F3F4F6', text: '#374151' };

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

export default StatusBadge;
