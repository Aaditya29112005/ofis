import { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withTiming, 
    withSequence,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';

export const useAnimations = () => {
    // Pulsing effect for FAB or buttons
    const pulseValue = useSharedValue(1);
    
    const startPulse = () => {
        pulseValue.value = withSequence(
            withSpring(1.2),
            withSpring(1)
        );
    };

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseValue.value }]
    }));

    // Hover/Press Scale effect
    const pressScale = useSharedValue(1);
    
    const pressIn = () => {
        pressScale.value = withSpring(0.95);
    };
    
    const pressOut = () => {
        pressScale.value = withSpring(1);
    };

    const pressStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pressScale.value }]
    }));

    // Fade and Slide In
    const fadeInStyle = (index = 0) => {
        return useAnimatedStyle(() => ({
            opacity: withTiming(1, { duration: 500 }),
            transform: [{ translateY: withSpring(0) }]
        }));
    };

    return {
        pulseValue,
        startPulse,
        pulseStyle,
        pressIn,
        pressOut,
        pressStyle,
        fadeInStyle
    };
};
