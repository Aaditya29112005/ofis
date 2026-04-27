import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../../theme/typography';

const CommonAreaStatusBadge = ({ status }) => {
  const isActive = status?.toUpperCase() === 'ACTIVE';

  return (
    <View style={[styles.badge, { backgroundColor: isActive ? 'rgba(249, 115, 22, 0.1)' : 'rgba(107, 114, 128, 0.1)' }]}>
      <Text style={[styles.text, { color: isActive ? '#F97316' : '#94A3B8' }]}>
        {isActive ? 'Active' : 'Inactive'}
      </Text>
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

export default CommonAreaStatusBadge;
