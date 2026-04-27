import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, Dimensions, Alert } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    FadeInDown 
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import PremiumInput from '../components/PremiumInput';
import PremiumButton from '../components/PremiumButton';
import GlassCard from '../components/GlassCard';
import LogoHeader from '../components/LogoHeader';
import Haptics from '../utils/Haptics';
import authService from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const setAuth = useAuthStore(state => state.setAuth);
  const bgScale = useSharedValue(1);

  React.useEffect(() => {
    bgScale.value = withTiming(1.05, { duration: 4000 });
  }, []);

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bgScale.value }]
  }));

  const isPhoneValid = /^[0-9]{10}$/.test(phone);
  const isOtpValid = /^[0-9]{6}$/.test(otp);

  const handleSendOtp = async () => {
    const sanitizedPhone = phone.trim();
    if (!/^[0-9]{10}$/.test(sanitizedPhone)) {
        Alert.alert('Invalid Phone', 'Please enter a valid 10-digit mobile number.');
        return;
    }

    setIsLoading(true);
    try {
        await authService.sendOtp(sanitizedPhone);
        Haptics.notificationSuccess();
        setIsOtpSent(true);
    } catch (error) {
        Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const sanitizedPhone = phone.trim();
    const sanitizedOtp = otp.trim();
    if (sanitizedOtp.length < 4) {
        Alert.alert('Invalid OTP', 'Please enter the verification code sent to your phone.');
        return;
    }

    setIsLoading(true);
    try {
        const data = await authService.login(sanitizedPhone, sanitizedOtp);
        const token = data.token || data.accessToken;
        
        // Success condition: Success flag OR presence of an access token (token or accessToken)
        if (data.success || token) {
            Haptics.notificationSuccess();
            
            // Map the user data and include buildingId if provided
            const userData = data.user || { name: 'User', role: 'community' };
            if (data.buildingId) userData.buildingId = data.buildingId;
            
            setAuth(token, userData);
        } else {
            Alert.alert('Login Failed', data.message || 'Verification unsuccessful.');
        }
    } catch (error) {
        console.error('Login Error:', error);
        
        // Handle different error object structures ({message: '...'}, {error: '...'}, or string)
        let errorMsg = 'Login failed. Please check your OTP.';
        if (typeof error === 'string') {
            errorMsg = error;
        } else if (typeof error === 'object' && error !== null) {
            errorMsg = error.error || error.message || JSON.stringify(error);
        }
        
        Alert.alert('Error', errorMsg);
    } finally {
        setIsLoading(false);
    }
  };

  const handleBack = () => {
      setIsOtpSent(false);
      setOtp('');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Background Image with Zoom & Blur */}
      <Animated.View style={[StyleSheet.absoluteFill, bgAnimatedStyle]}>
        <Animated.Image 
          source={require('../assets/images/workspace_bg.png')}
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
            <GlassCard style={styles.loginCard}>
              <Text style={styles.title}>{isOtpSent ? 'Verify OTP' : 'Sign In'}</Text>
              <Text style={styles.subtitle}>
                {isOtpSent 
                  ? `Enter the 6-digit code sent to ${phone}` 
                  : 'Access your workspace dashboard using OTP'}
              </Text>

              <View style={styles.form}>
                {!isOtpSent ? (
                    <PremiumInput
                        placeholder="Mobile Number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />
                ) : (
                    <PremiumInput
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        maxLength={6}
                    />
                )}

                <PremiumButton 
                  title={isOtpSent ? "Verify & Login" : "Send Verification Code"} 
                  onPress={isOtpSent ? handleVerifyOtp : handleSendOtp} 
                  style={styles.loginBtn}
                  isLoading={isLoading}
                  disabled={!isOtpSent ? !isPhoneValid : !isOtpValid}
                />

                {isOtpSent && (
                    <TouchableOpacity 
                        style={styles.backBtn}
                        onPress={handleBack}
                    >
                        <Text style={styles.backText}>Change Phone Number</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.footer}>
                  <Text style={styles.footerText}>New to Ofis Square? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
                    <Text style={styles.linkText}>Create Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
            
            <Text style={styles.legalText}>
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </Text>
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
  loginCard: {
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
  loginBtn: {
    marginBottom: 24,
    marginTop: 8,
  },
  backBtn: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  backText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: FONTS.medium,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  linkText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  legalText: {
    marginTop: 48,
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
    fontFamily: FONTS.medium,
    alignSelf: 'center',
  }
});



export default LoginScreen;
