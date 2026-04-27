import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolateColor,
  interpolate
} from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const ToggleSwitch = ({ value, onValueChange, darkMode = true }) => {
  const switchAnim = useSharedValue(value ? 1 : 0);
  const trackScale = useSharedValue(1);
  const thumbScale = useSharedValue(1);

  const offColor = darkMode ? '#2A2A2A' : '#E9ECEF';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

  useEffect(() => {
    switchAnim.value = withSpring(value ? 1 : 0, { 
      damping: 18, 
      stiffness: 150,
      mass: 0.6
    });
  }, [value]);

  const handleToggle = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    onValueChange(!value);
  };

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      switchAnim.value,
      [0, 1],
      [offColor, '#FF8A00']
    );
    return {
      backgroundColor,
      transform: [{ scale: trackScale.value }],
      borderColor: borderColor
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(switchAnim.value, [0, 1], [2, 22]);
    return {
      transform: [
        { translateX },
        { scale: thumbScale.value }
      ]
    };
  });

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      onPress={handleToggle}
      onPressIn={() => {
        trackScale.value = withTiming(0.95);
        thumbScale.value = withTiming(1.1);
      }}
      onPressOut={() => {
        trackScale.value = withTiming(1);
        thumbScale.value = withTiming(1);
      }}
    >
      <Animated.View style={[styles.track, trackAnimatedStyle]}>
        <Animated.View style={[styles.thumb, thumbAnimatedStyle]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 3,
  },
});

export default ToggleSwitch;
