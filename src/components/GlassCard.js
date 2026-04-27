import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const GlassCard = ({ children, style }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[
      styles.glassContainer,
      { 
        backgroundColor: colors.card, 
        borderColor: colors.border,
        borderWidth: 1,
        shadowColor: isDark ? '#000' : '#475569',
        shadowOffset: { width: 0, height: isDark ? 20 : 10 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: isDark ? 40 : 15,
        elevation: isDark ? 10 : 3
      },
      style
    ]}>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  glassContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  content: {
    padding: 24,
  },
});

export default GlassCard;
