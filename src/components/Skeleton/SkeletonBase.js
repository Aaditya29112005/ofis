import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  interpolate,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';

const SkeletonBase = ({ width, height, borderRadius = 8, style, circle = false }) => {
  const { isDark } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const baseColor = isDark ? '#1A1A1A' : '#E1E9EE';
  const highlightColor = isDark ? '#2A2A2A' : '#F2F8FC';

  return (
    <View style={[
      styles.container,
      { 
        width, 
        height, 
        borderRadius: circle ? height / 2 : borderRadius,
        backgroundColor: baseColor,
      },
      style
    ]}>
      <Animated.View style={[
        StyleSheet.absoluteFill,
        { backgroundColor: highlightColor },
        animatedStyle
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default SkeletonBase;
