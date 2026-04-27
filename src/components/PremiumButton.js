import React, { useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { BORDER_RADIUS, SPACING } from '../theme/spacing';
import Haptics from '../utils/Haptics';

import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const PremiumButton = ({ title, onPress, style, isLoading = false, disabled = false }) => {
  const scale = useSharedValue(1);

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value, { damping: 12, stiffness: 200 }) }],
      opacity: disabled ? 0.6 : 1,
    };
  });

  const handlePressIn = () => {
    if (isLoading || disabled) return;
    scale.value = 0.96;
  };

  const handlePressOut = () => {
    scale.value = 1;
  };

  const handlePress = () => {
      if (isLoading || disabled) return;
      Haptics.impactMedium();
      if (onPress) onPress();
  };

  return (
    <AnimatedTouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isLoading || disabled}
      style={[styles.button, reanimatedStyle, style]}
    >
      <View style={StyleSheet.absoluteFill}>
          <Svg height="100%" width="100%">
              <Defs>
                  <LinearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="0">
                      <Stop offset="0" stopColor={COLORS.primaryGradient[0]} />
                      <Stop offset="1" stopColor={COLORS.primaryGradient[1]} />
                  </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" rx={28} fill="url(#btnGrad)" />
          </Svg>
      </View>
      
      {isLoading ? (
          <ActivityIndicator color={COLORS.white} />
      ) : (
          <Text style={styles.text}>{title}</Text>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52, // Refined height for better mobile feel
    borderRadius: 26, // Perfect pill
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
  },
  text: {
    fontSize: 15, // Matching FONT_SIZE.base
    fontFamily: FONTS.bold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
});

export default PremiumButton;
