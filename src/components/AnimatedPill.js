import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import Haptics from '../utils/Haptics';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedPill = ({ children, onPress, style }) => {
    const { colors, isDark } = useTheme();
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 200 }) }],
            opacity: withTiming(opacity.value, { duration: 150 })
        };
    });

    const handlePressIn = useCallback(() => {
        scale.value = 0.96;
        opacity.value = 0.8;
    }, []);

    const handlePressOut = useCallback(() => {
        scale.value = 1;
        opacity.value = 1;
    }, []);

    const handlePress = useCallback(() => {
        Haptics.impactLight();
        if (onPress) onPress();
    }, [onPress]);

    return (
        <AnimatedTouchableOpacity
            activeOpacity={1}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                styles.pill, 
                { 
                    backgroundColor: colors.surface,
                    borderColor: isDark ? colors.border : 'rgba(0,0,0,0.08)',
                    shadowOpacity: isDark ? 0.15 : 0.06,
                },
                animatedStyle, 
                style
            ]}
        >
            {children}
        </AnimatedTouchableOpacity>
    );
};

const styles = StyleSheet.create({
    pill: {
        borderWidth: 1,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    }
});

export default AnimatedPill;
