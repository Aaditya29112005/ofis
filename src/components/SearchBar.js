import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';
import { Search, X } from 'lucide-react-native';
import { FONTS } from '../theme/typography';

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState('');
  const focused = useSharedValue(0);

  useEffect(() => {
    const handler = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(handler);
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focused.value,
      [0, 1],
      ['rgba(255,255,255,0.05)', '#FF8A00']
    );
    return {
      borderColor,
      borderWidth: 1,
    };
  });

  const clearButtonStyle = useAnimatedStyle(() => ({
    opacity: value.length > 0 ? withTiming(1) : withTiming(0),
    transform: [{ translateX: value.length > 0 ? withTiming(0) : withTiming(20) }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Search size={18} color="#64748B" />
      <TextInput
        style={styles.input}
        placeholder="Search by room, member..."
        placeholderTextColor="#64748B"
        value={value}
        onChangeText={setValue}
        onFocus={() => (focused.value = withTiming(1))}
        onBlur={() => (focused.value = withTiming(0))}
      />
      <Animated.View style={clearButtonStyle}>
        <TouchableOpacity onPress={() => setValue('')}>
          <X size={16} color="#64748B" />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 22,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#FFF',
    fontFamily: FONTS.medium,
    fontSize: 14,
  }
});

export default SearchBar;
