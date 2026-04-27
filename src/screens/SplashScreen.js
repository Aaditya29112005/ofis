import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    withDelay,
    withSequence,
    Easing,
    runOnJS
} from 'react-native-reanimated';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import OfisLogo from '../components/OfisLogo';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const logoScale = useSharedValue(0.85);
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(10);
  const textOpacity = useSharedValue(0);
  
  // Exit animations
  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);

  const navigateToNext = () => {
      navigation.replace('Onboarding');
  };

  useEffect(() => {
    // 1. Logo Entry (500ms ease-out)
    logoScale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    logoOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    logoTranslateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });

    // 2. Text Reveal (fade in after 150ms)
    textOpacity.value = withDelay(150, withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }));

    // 3. Exit Sequence after 2 seconds
    const exitTimer = setTimeout(() => {
        containerOpacity.value = withTiming(0, { duration: 400 });
        containerScale.value = withTiming(0.96, { duration: 400 }, (finished) => {
            if (finished) {
                runOnJS(navigateToNext)();
            }
        });
    }, 2200);

    return () => clearTimeout(exitTimer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
      opacity: logoOpacity.value,
      transform: [
          { scale: logoScale.value },
          { translateY: logoTranslateY.value }
      ]
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
      opacity: textOpacity.value
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
      opacity: containerOpacity.value,
      transform: [{ scale: containerScale.value }]
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      
      {/* Subtle Radial Glow effect using absolute positioning and opacity */}
      <View style={styles.glowCanvas}>
          <View style={styles.radialGlow} />
      </View>

      <View style={styles.content}>
        <Animated.View style={logoAnimatedStyle}>
          <OfisLogo scale={1.2} />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Strict Black
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCanvas: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 0,
  },
  radialGlow: {
      width: width * 1.5,
      height: width * 1.5,
      borderRadius: width,
      backgroundColor: '#FF8A00',
      opacity: 0.04, // Very subtle
      top: -height * 0.1,
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoSquare: {
    width: 80,
    height: 80,
    backgroundColor: '#FF8A00', // Orange Accent
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  logoInitial: {
    color: COLORS.white,
    fontSize: 40,
    fontFamily: FONTS.bold,
  },
  brandText: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.bold,
    letterSpacing: 6, // Slight letter spacing
  },
});

export default SplashScreen;
