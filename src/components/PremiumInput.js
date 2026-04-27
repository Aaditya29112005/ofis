import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  interpolateColor,
  useSharedValue,
  interpolate,
  withSpring
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { BORDER_RADIUS, SPACING } from '../theme/spacing';
import { useTheme } from '../context/ThemeContext';

const PremiumInput = ({ 
    placeholder, 
    value, 
    onChangeText, 
    secureTextEntry, 
    keyboardType, 
    onFocus, 
    onBlur, 
    error 
}) => {
  const { colors, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const focusValue = useSharedValue(0);

  React.useEffect(() => {
    focusValue.value = withTiming(isFocused ? 1 : 0, { duration: 250 });
  }, [isFocused]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        focusValue.value,
        [0, 1],
        ['rgba(255, 255, 255, 0.1)', '#FF8A00']
      ),
      backgroundColor: '#0A0A0A',
      shadowColor: '#FF8A00',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: interpolate(focusValue.value, [0, 1], [0, 0.3]),
      shadowRadius: 10,
    };
  });

  const handleFocus = () => {
      setIsFocused(true);
      if (onFocus) onFocus();
  };

  const handleBlur = () => {
      setIsFocused(false);
      if (onBlur) onBlur();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputContainer, containerStyle]}>
        <TextInput
          style={[styles.input, { color: '#FFFFFF' }]}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
        />
        {secureTextEntry && (
            <TouchableOpacity 
                style={styles.eyeBtn}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
                <Icon 
                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color="rgba(255, 255, 255, 0.4)" 
                />
            </TouchableOpacity>
        )}
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
  },
  input: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    padding: 0,
    flex: 1,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  eyeBtn: {
      position: 'absolute',
      right: 16,
      height: '100%',
      justifyContent: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontFamily: FONTS.medium,
  }
});

export default PremiumInput;
