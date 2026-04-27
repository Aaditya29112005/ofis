import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle,
    withTiming,
    FadeInDown
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { FONTS } from '../../theme/typography';
import { COLORS } from '../../theme/colors';
import GlassCard from '../../components/GlassCard';
import PremiumButton from '../../components/PremiumButton';
import PremiumInput from '../../components/PremiumInput';
import LogoHeader from '../../components/LogoHeader';
import Haptics from '../../utils/Haptics';

const { width, height } = Dimensions.get('window');

const CreateAccountScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const bgScale = useSharedValue(1);

    React.useEffect(() => {
        bgScale.value = withTiming(1.05, { duration: 4000 });
    }, []);

    const bgAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: bgScale.value }]
    }));

    const handleCreateAccount = () => {
        Haptics.notificationSuccess();
        // navigation.navigate('Dashboard');
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            
            {/* Background Image with Zoom & Blur */}
            <Animated.View style={[StyleSheet.absoluteFill, bgAnimatedStyle]}>
                <Animated.Image 
                    source={require('../../assets/images/workspace_bg.png')}
                    style={StyleSheet.absoluteFill}
                    blurRadius={25}
                    resizeMode="cover"
                />
            </Animated.View>

            {/* Dark Overlay Tint */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />

            {/* Gradient Overlay for Depth */}
            <View style={StyleSheet.absoluteFill}>
                <Svg height="100%" width="100%">
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="black" stopOpacity="0.85" />
                            <Stop offset="0.3" stopColor="black" stopOpacity="0" />
                            <Stop offset="0.7" stopColor="black" stopOpacity="0" />
                            <Stop offset="1" stopColor="black" stopOpacity="0.95" />
                        </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#grad)" />
                </Svg>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <LogoHeader />

                    <Animated.View entering={FadeInDown.delay(200).springify()}>
                        <GlassCard style={styles.authCard}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Start your premium workspace journey</Text>

                            <View style={styles.form}>
                                <PremiumInput 
                                    placeholder="Full Name"
                                    value={name}
                                    onChangeText={setName}
                                />
                                <PremiumInput 
                                    placeholder="Email Address"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />
                                <PremiumInput 
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />

                                <PremiumButton 
                                    title="Create Account"
                                    onPress={handleCreateAccount}
                                    style={styles.button}
                                />

                                <TouchableOpacity 
                                    onPress={() => navigation.navigate('Login')}
                                    style={styles.footerLink}
                                >
                                    <Text style={styles.footerText}>
                                        Already part of community? <Text style={styles.signInText}>Sign In</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    authCard: {
        paddingTop: 32,
        paddingBottom: 24,
    },
    title: {
        fontSize: 28,
        fontFamily: FONTS.bold,
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: 'rgba(255, 255, 255, 0.4)',
        marginBottom: 32,
    },
    form: {
        width: '100%',
    },
    button: {
        marginTop: 16,
        marginBottom: 24,
    },
    footerLink: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    signInText: {
        color: '#FF8A00',
        fontFamily: FONTS.bold,
    }
});

export default CreateAccountScreen;
