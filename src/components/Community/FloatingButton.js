import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withRepeat, 
    withSpring, 
    withSequence,
    withTiming,
    interpolate
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../theme/colors';
import Haptics from '../../utils/Haptics';

const FloatingButton = ({ onPress }) => {
    const scale = useSharedValue(1);
    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1500 }),
                withTiming(1, { duration: 1500 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value * pulse.value }],
        shadowOpacity: interpolate(pulse.value, [1, 1.1], [0.3, 0.5])
    }));


    const handlePressIn = () => {
        scale.value = withSpring(0.9);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => {
                    Haptics.impactMedium();
                    onPress && onPress();
                }}
                style={styles.button}
            >
                <Icon name="add" size={32} color={COLORS.white} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 140,
        right: 20,
        zIndex: 1000,
        shadowColor: '#FF8A00',
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 15,
        elevation: 10,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF8A00',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default FloatingButton;
