import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

import SkeletonBase from '../Skeleton/SkeletonBase';

const SkeletonItem = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.left}>
        <SkeletonBase width="80%" height={16} borderRadius={4} />
        <SkeletonBase width="60%" height={12} borderRadius={4} style={{ marginTop: 8 }} />
        <SkeletonBase width="70%" height={10} borderRadius={2} style={{ marginTop: 8 }} />
      </View>
      <View style={[styles.middle, { borderColor: colors.border }]}>
        <SkeletonBase width="70%" height={14} borderRadius={4} />
        <SkeletonBase width="50%" height={10} borderRadius={4} style={{ marginTop: 8 }} />
        <SkeletonBase width="80%" height={12} borderRadius={4} style={{ marginTop: 8 }} />
      </View>
      <View style={styles.right}>
        <SkeletonBase width={60} height={20} borderRadius={10} />
        <SkeletonBase width={70} height={28} borderRadius={14} style={{ marginTop: 12 }} />
      </View>
    </View>
  );
};

const BookingSkeleton = () => (
  <View style={styles.container}>
    {[1, 2, 3, 4].map((i) => <SkeletonItem key={i} />)}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    height: 100,
    borderRadius: 24,
    marginBottom: 16,
    flexDirection: 'row',
    padding: 18,
    gap: 12,
  },
  left: { flex: 1.2, gap: 8 },
  middle: { flex: 1.3, gap: 8, paddingHorizontal: 10, borderLeftWidth: 1, borderRightWidth: 1 },
  right: { flex: 1, gap: 8, alignItems: 'flex-end' },
});

export default BookingSkeleton;
