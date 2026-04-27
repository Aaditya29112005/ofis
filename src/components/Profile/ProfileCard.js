import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { FONTS } from '../../theme/typography';
import { COLORS } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const ProfileCard = ({ name, role, email, mobile, onEdit }) => {
  const { colors, isDark } = useTheme();
  const initial = name ? name.charAt(0).toUpperCase() : '';
  const scale = useSharedValue(1);

  const handleEdit = () => {
    ReactNativeHapticFeedback.trigger('impactMedium');
    if (onEdit) onEdit();
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatarGroup}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatarGlow, { backgroundColor: COLORS.primary, opacity: isDark ? 0.25 : 0.15 }]} />
              <View style={[styles.avatar, { backgroundColor: COLORS.primary }]}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
            </View>
            <View style={styles.meta}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
              <Text style={[styles.role, { color: colors.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">{role}</Text>
            </View>
          </View>
          <TouchableOpacity 
            activeOpacity={1}
            onPressIn={() => (scale.value = withTiming(0.94))}
            onPressOut={() => (scale.value = withTiming(1))}
            onPress={handleEdit}
          >
            <Animated.View style={[styles.editBtn, animatedButtonStyle, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
              <Text style={[styles.editBtnText, { color: colors.text }]}>Edit</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={[styles.infoGrid, { backgroundColor: isDark ? colors.surfaceElevated : '#F1F3F5', borderColor: colors.border }]}>
          <View style={styles.infoBox}>
            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>EMAIL</Text>
            <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>{email}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={[styles.infoBox, { paddingLeft: 24 }]}>
            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>MOBILE</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{mobile}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  card: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  avatarContainer: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGlow: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    transform: [{ scale: 1.5 }],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatarText: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    color: '#FFF', // White on orange background — always correct
  },
  meta: {
    marginLeft: 18,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  role: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  editBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  editBtnText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  infoGrid: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  infoBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  divider: {
    width: 1.5,
    height: 24,
  },
});

export default ProfileCard;
