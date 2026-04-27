import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withTiming,
    Easing,
    FadeInUp
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { FONTS } from '../theme/typography';
import Haptics from '../utils/Haptics';

const { width } = Dimensions.get('window');

const TabButton = ({ tab, isActive, onPress }) => {
    const { colors } = useTheme();
    const scale = useSharedValue(1);
    const iconScale = useSharedValue(isActive ? 1.15 : 1);

    React.useEffect(() => {
        iconScale.value = withSpring(isActive ? 1.15 : 1, { damping: 14, stiffness: 120 });
    }, [isActive]);

    const pressStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconScale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: withTiming(isActive ? 0.2 : 0, { duration: 300 }),
        transform: [{ scale: withSpring(isActive ? 1 : 0.6) }],
    }));

    return (
        <TouchableOpacity 
            onPressIn={() => { scale.value = withSpring(0.9, { damping: 15 }); }}
            onPressOut={() => { scale.value = withSpring(1, { damping: 12 }); }}
            onPress={() => {
                Haptics.impactLight();
                onPress(tab.id);
            }}
            style={styles.tabBtn}
            activeOpacity={1}
        >
            <Animated.View style={[styles.tabContent, pressStyle]}>
                <View style={styles.iconWrapper}>
                    <Animated.View style={[styles.glow, { backgroundColor: '#FF8A00' }, glowStyle]} />
                    <Animated.View style={iconAnimatedStyle}>
                        <Icon 
                            name={isActive ? tab.activeIcon : tab.icon} 
                            size={22} 
                            color={isActive ? '#FF8A00' : colors.textMuted} 
                        />
                    </Animated.View>
                </View>
                <Text style={[
                    styles.tabText, 
                    { color: isActive ? '#FF8A00' : colors.textMuted }
                ]}>
                    {tab.id}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const BottomTabs = ({ activeTab, onTabPress }) => {
    const { isDark } = useTheme();

    const tabs = [
        { id: 'Dashboard', icon: 'grid-outline', activeIcon: 'grid' },
        { id: 'Community', icon: 'people-outline', activeIcon: 'people' },
        { id: 'Profile', icon: 'person-outline', activeIcon: 'person' }
    ];

    return (
        <Animated.View 
            entering={FadeInUp.duration(600).delay(400)}
            style={styles.outerContainer}
        >
            <View style={[
                styles.container, 
                { 
                    backgroundColor: isDark ? 'rgba(18,18,20,0.92)' : 'rgba(255,255,255,0.92)',
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
                }
            ]}>
                {tabs.map(tab => (
                    <TabButton 
                        key={tab.id} 
                        tab={tab} 
                        isActive={activeTab === tab.id}
                        onPress={onTabPress}
                    />
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 28 : 16,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    container: {
        flexDirection: 'row',
        height: 68,
        borderRadius: 34,
        borderWidth: 1,
        paddingHorizontal: 8,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 12,
    },
    tabBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        width: 36,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glow: {
        position: 'absolute',
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    tabText: {
        fontSize: 10,
        fontFamily: FONTS.bold,
        marginTop: 3,
        letterSpacing: 0.2,
    }
});

export default BottomTabs;
