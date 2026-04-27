import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate,
    Extrapolate,
    withTiming,
    interpolateColor,
    Easing,
    useDerivedValue,
    useAnimatedReaction,
    runOnJS
} from 'react-native-reanimated';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import PremiumButton from '../components/PremiumButton';
import Haptics from '../utils/Haptics';
import Logo from '../components/Onboarding/Logo';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const PAGES = [
    {
        id: '1',
        type: 'logo',
    },
    {
        id: '2',
        title: 'Manage your\nworkspace effortlessly',
        subtitle: 'Everything you need in one powerful platform.',
        type: 'text',
    },
    {
        id: '3',
        title: 'Connect with\nyour community',
        subtitle: 'Engage with members and grow your network.',
        type: 'text',
    }
];

const PaginationDot = ({ index, scrollX }) => {
    const animatedDotStyle = useAnimatedStyle(() => {
        const widthAnimation = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [8, 24, 8],
            Extrapolate.CLAMP
        );
        const opacityAnimation = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.3, 1, 0.3],
            Extrapolate.CLAMP
        );
        const colorAnimation = interpolateColor(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            ['#3A3A3C', '#FF8A00', '#3A3A3C']
        );
        
        return {
            width: widthAnimation,
            opacity: opacityAnimation,
            backgroundColor: colorAnimation
        };
    });

    return <Animated.View style={[styles.dot, animatedDotStyle]} />;
};


const OnboardingScreen = ({ navigation }) => {
    const scrollRef = useRef(null);
    const [buttonTitle, setButtonTitle] = useState('Continue');
    const scrollX = useSharedValue(0);
    const bgScale = useSharedValue(1);

    React.useEffect(() => {
        bgScale.value = withTiming(1.05, { duration: 3000 });
    }, []);

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const bgAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: bgScale.value }]
    }));

    const handleNext = () => {
        const currentIndex = Math.round(scrollX.value / width);
        if (currentIndex < PAGES.length - 1) {
            scrollRef.current?.scrollTo({
                x: (currentIndex + 1) * width,
                animated: true
            });
            Haptics.impactLight();
        } else {
            handleGetStarted();
        }
    };

    const handleGetStarted = () => {
        Haptics.impactMedium();
        navigation.replace('Login');
    };

    const handleSkip = () => {
        Haptics.impactLight();
        navigation.replace('Login');
    };

    useAnimatedReaction(
        () => scrollX.value,
        (value) => {
            const isLast = value >= (PAGES.length - 1.5) * width;
            if (isLast) {
                runOnJS(setButtonTitle)('Get Started');
            } else {
                runOnJS(setButtonTitle)('Continue');
            }
        }
    );

    const buttonStyle = useAnimatedStyle(() => {
        const lastPageX = (PAGES.length - 1) * width;
        // Delayed scale pop: 0.9 -> 1
        const scale = interpolate(
            scrollX.value,
            [lastPageX - width * 0.15, lastPageX],
            [0.9, 1],
            Extrapolate.CLAMP
        );
        const opacity = interpolate(
            scrollX.value,
            [lastPageX - width * 0.1, lastPageX],
            [0, 1],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ scale }],
            opacity
        };
    });

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            
            {/* Skip Button */}
            <TouchableOpacity 
                style={styles.skipButton} 
                onPress={handleSkip}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            
            <Animated.View style={[StyleSheet.absoluteFill, bgAnimatedStyle]}>
                <Animated.Image 
                    source={require('../assets/images/workspace_bg.png')}
                    style={StyleSheet.absoluteFill}
                    blurRadius={25}
                    resizeMode="cover"
                />
            </Animated.View>

            {/* Dark Overlay Tint */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.65)' }]} />

            {/* Gradient Overlay using SVG */}
            <View style={StyleSheet.absoluteFill}>
                <Svg height="100%" width="100%">
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="black" stopOpacity="0.8" />
                            <Stop offset="0.3" stopColor="black" stopOpacity="0" />
                            <Stop offset="0.7" stopColor="black" stopOpacity="0" />
                            <Stop offset="1" stopColor="black" stopOpacity="0.9" />
                        </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#grad)" />
                </Svg>
            </View>
            
            <Animated.ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                bounces={false}
            >
                {PAGES.map((page, index) => {
                    const animatedStyle = useAnimatedStyle(() => {
                        const input = [(index - 1) * width, index * width, (index + 1) * width];
                        const opacity = interpolate(scrollX.value, input, [0, 1, 0], Extrapolate.CLAMP);
                        // Deep cinematic entry: 80 -> 0
                        const translateY = interpolate(scrollX.value, input, [80, 0, -80], Extrapolate.CLAMP);
                        
                        return { 
                            opacity,
                            transform: [{ translateY }]
                        };
                    });

                    const logoStyle = useAnimatedStyle(() => {
                        if (index !== 0) return {};
                        // Square Logo Specs: scale 1 -> 0.85, translateY 0 -> -60
                        const scale = interpolate(scrollX.value, [0, width * 0.6], [1, 0.85], Extrapolate.CLAMP);
                        const translateY = interpolate(scrollX.value, [0, width * 0.6], [0, -60], Extrapolate.CLAMP);
                        const opacity = interpolate(scrollX.value, [0, width * 0.4], [1, 0], Extrapolate.CLAMP);
                        return { 
                            opacity,
                            transform: [{ scale }, { translateY }] 
                        };
                    });

                    const textStaggerStyle = useAnimatedStyle(() => {
                        const staggerX = index * width;
                        // 100ms equivalent delay in scroll space
                        const opacity = interpolate(
                            scrollX.value,
                            [staggerX - width * 0.2, staggerX],
                            [0, 1],
                            Extrapolate.CLAMP
                        );
                        return { opacity };
                    });

                    return (
                        <View key={page.id} style={styles.page}>
                            {page.type === 'logo' ? (
                                <Animated.View style={[logoStyle]}>
                                    <Logo />
                                </Animated.View>
                            ) : (
                                <Animated.View style={[styles.textContainer, animatedStyle]}>
                                    <Animated.Text style={[styles.title, textStaggerStyle]}>{page.title}</Animated.Text>
                                    <Animated.Text style={[styles.subtitle, textStaggerStyle, { color: COLORS.white + '80' }]}>
                                        {page.subtitle}
                                    </Animated.Text>
                                </Animated.View>
                            )}
                        </View>
                    );
                })}
            </Animated.ScrollView>

            <View style={styles.paginationContainer}>
                {PAGES.map((_, index) => (
                    <PaginationDot key={index} index={index} scrollX={scrollX} />
                ))}
            </View>

            <View style={styles.footer}>
                <View style={styles.buttonWrapper}>
                    <PremiumButton 
                        title={buttonTitle} 
                        onPress={handleNext}
                        style={[styles.actionBtn, buttonStyle]}
                    />
                </View>
                
                <TouchableOpacity 
                    style={styles.signInLink} 
                    onPress={handleGetStarted}
                >
                    <Text style={styles.signInText}>
                        Already have an account? <Text style={styles.signInTextBold}>Sign In</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    page: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        width,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontFamily: FONTS.bold,
        color: COLORS.white,
        textAlign: 'center',
        letterSpacing: -0.8,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 24,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 180,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    buttonWrapper: {
        width: '100%',
        height: 58,
        marginBottom: 24,
    },
    actionBtn: {
        height: 58,
        width: '100%',
    },
    skipButton: {
        position: 'absolute',
        top: 60,
        right: 24,
        zIndex: 10,
    },
    skipText: {
        color: COLORS.white + '80',
        fontSize: 16,
        fontFamily: FONTS.medium,
    },
    signInLink: {
        marginTop: 4,
    },
    signInText: {
        color: COLORS.white + '60',
        fontSize: 14,
        fontFamily: FONTS.regular,
    },
    signInTextBold: {
        color: '#FF8A00',
        fontFamily: FONTS.bold,
    }
});

export default OnboardingScreen;
