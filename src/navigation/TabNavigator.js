import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, FadeInUp } from 'react-native-reanimated';
import DashboardScreen from '../screens/DashboardScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { FONTS } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';
import Haptics from '../utils/Haptics';

const Tab = createBottomTabNavigator();

const TabButton = ({ route, label, isFocused, onPress, isDark }) => {
    const { colors } = useTheme();
    const scale = useSharedValue(1);
    const iconScale = useSharedValue(isFocused ? 1.15 : 1);

    React.useEffect(() => {
        iconScale.value = withSpring(isFocused ? 1.15 : 1, { damping: 14, stiffness: 120 });
    }, [isFocused]);

    const pressStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconScale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: withTiming(isFocused ? 0.2 : 0, { duration: 300 }),
        transform: [{ scale: withSpring(isFocused ? 1 : 0.6) }],
    }));

    let iconName = 'grid-outline';
    if (route.name === 'Community') iconName = 'people-outline';
    if (route.name === 'Profile') iconName = 'person-outline';

    if (isFocused) {
        if (route.name === 'Dashboard') iconName = 'grid';
        if (route.name === 'Community') iconName = 'people';
        if (route.name === 'Profile') iconName = 'person';
    }

    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPressIn={() => { scale.value = withSpring(0.9, { damping: 15 }); }}
            onPressOut={() => { scale.value = withSpring(1, { damping: 12 }); }}
            onPress={() => {
                Haptics.impactLight();
                onPress();
            }}
            style={styles.tabBtn}
            activeOpacity={1}
        >
            <Animated.View style={[styles.tabContent, pressStyle]}>
                <View style={styles.iconWrapper}>
                    <Animated.View style={[styles.glow, { backgroundColor: colors.primary }, glowStyle]} />
                    <Animated.View style={iconAnimatedStyle}>
                        <Icon 
                            name={iconName} 
                            size={22} 
                            color={isFocused ? colors.primary : colors.textSecondary} 
                        />
                    </Animated.View>
                </View>
                <Text style={[
                    styles.tabText, 
                    { color: isFocused ? colors.primary : colors.textSecondary }
                ]}>
                    {label}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const FloatingTabBar = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();
    const { isDark } = useTheme();
    const bottomOffset = Math.max(insets.bottom, 16);

    return (
        <Animated.View 
            entering={FadeInUp.duration(600).delay(400)}
            style={[styles.outerContainer, { bottom: bottomOffset }]}
            pointerEvents="box-none"
        >
            <View style={[
                styles.container, 
                { 
                    backgroundColor: isDark ? 'rgba(20,20,20,0.7)' : 'rgba(255,255,255,0.9)',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
                    shadowColor: isDark ? '#000' : '#475569',
                    shadowOpacity: isDark ? 0.35 : 0.15,
                }
            ]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                            ? options.title
                            : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TabButton 
                            key={index} 
                            route={route} 
                            label={label} 
                            isFocused={isFocused} 
                            onPress={onPress} 
                            isDark={isDark}
                        />
                    );
                })}
            </View>
        </Animated.View>
    );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        left: 20,
        right: 20,
        alignItems: 'center',
        zIndex: 1000,
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

export default TabNavigator;
