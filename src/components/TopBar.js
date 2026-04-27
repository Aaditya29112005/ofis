import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  FadeInDown,
  Easing
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import AnimatedPill from './AnimatedPill';
import Skeleton from './Skeleton';
import Haptics from '../utils/Haptics';

import { formatTopBarDate } from '../utils/dateUtils';

const ThemeToggle = React.memo(({ isDark, onToggle }) => {
  const { colors } = useTheme();
  const rotation = useSharedValue(0);
  const glowOpacity = useSharedValue(isDark ? 0 : 0.4);

  useEffect(() => {
    rotation.value = withSpring(isDark ? 0 : 180, { damping: 14, stiffness: 100 });
    glowOpacity.value = withTiming(isDark ? 0 : 0.4, { duration: 300 });
  }, [isDark]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <AnimatedPill style={styles.iconBtn} onPress={onToggle}>
      <Animated.View style={[styles.glowRing, glowStyle]} />
      <Animated.View style={iconAnimatedStyle}>
        <Icon name={isDark ? "moon-outline" : "sunny-outline"} size={16} color={isDark ? colors.textSecondary : COLORS.primary} />
      </Animated.View>
    </AnimatedPill>
  );
});

const TopBar = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const dateString = useMemo(() => formatTopBarDate(), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = useCallback(() => {
    Haptics.impactMedium();
    toggleTheme();
  }, [toggleTheme]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <Skeleton width={130} height={38} borderRadius={24} />
            <Skeleton width={38} height={38} borderRadius={24} />
            <Skeleton width={40} height={16} borderRadius={4} />
          </View>
          <View style={styles.rightSection}>
            <Skeleton width={38} height={38} borderRadius={24} />
            <Skeleton width={80} height={30} borderRadius={4} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        
        {/* Left Section - Date, Theme, Weather */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.leftSection}>
          <AnimatedPill style={styles.datePill}>
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>{dateString}</Text>
          </AnimatedPill>
          
          <ThemeToggle isDark={isDark} onToggle={handleToggle} />
          
          <Text style={[styles.weatherText, { color: colors.textSecondary }]}>22°C</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.dividerWrap}>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        </Animated.View>

        {/* Right Section - Community Badge */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.rightSection}>
          <AnimatedPill style={styles.iconBtn}>
            <Icon name="business-outline" size={16} color={colors.textSecondary} />
          </AnimatedPill>
          
          <View style={styles.communityBadge}>
            <Text style={[styles.communitySub, { color: colors.textMuted }]} numberOfLines={1}>COMMUNITY</Text>
            <Text style={[styles.communityName, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">Ofis Square</Text>
          </View>
        </Animated.View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1.5,
    justifyContent: 'flex-end',
  },
  datePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    flexShrink: 1,
  },
  dateText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  iconBtn: {
    width: 38,
    height: 38,
    overflow: 'hidden',
  },
  glowRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 19,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  weatherText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginLeft: 2,
  },
  dividerWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  divider: {
    width: 1,
    height: 16,
  },
  communityBadge: {
    justifyContent: 'center',
    flexShrink: 1,
  },
  communitySub: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  communityName: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
});

export default React.memo(TopBar);
