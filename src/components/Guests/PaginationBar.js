import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

// Replaced GUESTS_THEME with global theme tokens
const PaginationBar = ({ currentPage, totalPages, onPrev, onNext }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: colors.surface, borderColor: colors.border }, currentPage === 1 && styles.btnDisabled]} 
        disabled={currentPage === 1}
        onPress={onPrev}
      >
        <ChevronLeft size={16} color={currentPage === 1 ? colors.textMuted : colors.text} />
        <Text style={[styles.btnText, { color: colors.text }, currentPage === 1 && { color: colors.textMuted }]}>Prev</Text>
      </TouchableOpacity>

      <Text style={[styles.pageText, { color: colors.textSecondary }]}>
        Page <Text style={{color: colors.primary, fontFamily: FONTS.bold}}>{currentPage}</Text> of {totalPages}
      </Text>

      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: colors.surface, borderColor: colors.border }, currentPage === totalPages && styles.btnDisabled]} 
        disabled={currentPage === totalPages}
        onPress={onNext}
      >
        <Text style={[styles.btnText, { color: colors.text }, currentPage === totalPages && { color: colors.textMuted }]}>Next</Text>
        <ChevronRight size={16} color={currentPage === totalPages ? colors.textMuted : colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    marginTop: SPACING.sm
  },
  pageText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  btnDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'transparent'
  },
  btnText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    marginHorizontal: 4
  }
});

export default PaginationBar;
