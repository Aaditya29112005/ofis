import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ToggleSwitch from './ToggleSwitch';
import { FONTS } from '../../theme/typography';
import { useTheme } from '../../context/ThemeContext';

const PreferenceItem = ({ title, subtitle, value, onValueChange }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      <ToggleSwitch value={value} onValueChange={onValueChange} darkMode={isDark} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  content: {
    flex: 1,
    paddingRight: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    lineHeight: 18,
  },
});

export default PreferenceItem;
