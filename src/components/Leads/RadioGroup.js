import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';

const RadioGroup = ({ options, selectedValue, onSelect, horizontal = true }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, horizontal && styles.row]}>
      {options.map((opt, idx) => {
        const isSelected = selectedValue === opt.value;
        return (
          <TouchableOpacity 
            key={idx}
            style={[styles.radioItem, horizontal && { marginRight: SPACING.lg }]}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.outerCircle, 
              { borderColor: isSelected ? colors.primary : '#333' }
            ]}>
              {isSelected && <View style={[styles.innerCircle, { backgroundColor: colors.primary }]} />}
            </View>
            <Text style={[styles.label, { color: isSelected ? colors.text : colors.textSecondary }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm
  }
});

export default RadioGroup;
