import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, Dimensions } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    FadeInDown 
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/typography';
import PremiumInput from '../../components/PremiumInput';
import PremiumButton from '../../components/PremiumButton';
import GlassCard from '../../components/GlassCard';
import LogoHeader from '../../components/LogoHeader';
import Haptics from '../../utils/Haptics';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const bgScale = useSharedValue(1);

  React.useEffect(() => {
    bgScale.value = withTiming(1.05, { duration: 4000 });
  }, []);

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bgScale.value }]
  }));

  const isFormValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleResetPassword = () => {
    if (isFormValid) {
      setIsLoading(true);
      Haptics.notificationSuccess();
      setTimeout(() => {
          setIsLoading(false);
          // In a real app, we'd navigate back or to a success screen
          navigation.goBack();
      }, 1500);
    }
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
            <GlassCard style={styles.card}>
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>Enter your email to reset your password</Text>

              <View style={styles.form}>
                <PremiumInput
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />

                <View style={styles.spacer} />

                <PremiumButton 
                  title="Send Reset Link" 
                  onPress={handleResetPassword} 
                  style={styles.primaryBtn}
                  isLoading={isLoading}
                  disabled={!isFormValid}
                />

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Remember your password? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}>Sign In</Text>
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
  card: {
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
  spacer: {
    height: 16,
  },
  primaryBtn: {
    marginBottom: 24,
    marginTop: 16,
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
    color: '#FF8A00',
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

export default ForgotPasswordScreen;
