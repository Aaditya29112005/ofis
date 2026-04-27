import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const ShimmerLine = ({ width = '100%', height = 20, borderRadius = 4, style }) => {
  const { colors, isDark } = useTheme();
  const shimmerBg = isDark ? '#1A1A1A' : '#E9ECEF';
  return (
    <View style={[styles.shimmer, { width, height, borderRadius, backgroundColor: isDark ? colors.surface : '#F1F3F5' }, style]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: shimmerBg }]} />
    </View>
  );
};

const AccountSkeleton = () => {
  const { colors, isDark } = useTheme();
  return (
    <View style={styles.container}>
      {/* Profile Card Skeleton */}
      <View style={[styles.cardSkeleton, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.headerSkeleton}>
          <ShimmerLine width={64} height={64} borderRadius={22} />
          <View style={styles.metaSkeleton}>
            <ShimmerLine width="60%" height={24} style={{ marginBottom: 8 }} />
            <ShimmerLine width="40%" height={14} />
          </View>
        </View>
        <ShimmerLine width="100%" height={80} borderRadius={20} />
      </View>

      {/* Preferences Skeleton */}
      <ShimmerLine width="30%" height={12} style={{ marginVertical: 24, marginLeft: 4 }} />
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.itemSkeleton}>
          <View style={{ flex: 1 }}>
            <ShimmerLine width="50%" height={16} style={{ marginBottom: 8 }} />
            <ShimmerLine width="80%" height={12} />
          </View>
          <ShimmerLine width={48} height={28} borderRadius={14} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shimmer: {
    overflow: 'hidden',
  },
  cardSkeleton: {
    padding: 24,
    borderRadius: 28,
    borderWidth: 1.5,
    marginBottom: 32,
  },
  headerSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  metaSkeleton: {
    marginLeft: 20,
    flex: 1,
  },
  itemSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 4,
  },
});

export default AccountSkeleton;
