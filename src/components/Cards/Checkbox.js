import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { BORDER_RADIUS } from '../../theme/spacing';

const Checkbox = ({ isChecked, onPress, size = 20 }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(isChecked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isChecked ? 1 : 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  }, [isChecked]);

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress} 
      style={[
        styles.container, 
        { 
          width: size, 
          height: size, 
          borderColor: isChecked ? colors.primary : colors.border,
          backgroundColor: isChecked ? colors.primary : 'transparent'
        }
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: scaleAnim }}>
        <Check size={size * 0.7} color="#FFF" strokeWidth={3} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Checkbox;
