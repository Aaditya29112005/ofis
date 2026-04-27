import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const FilterPill = ({ label, value, isActive, onPress, colors, isDark }) => (
  <TouchableOpacity 
    style={[
      styles.filterPill, 
      { 
        backgroundColor: isActive ? `${colors.primary}15` : (isDark ? colors.surfaceElevated : colors.surface),
        borderColor: isActive ? colors.primary : colors.border
      }
    ]}
    onPress={onPress}
  >
    <Text style={[styles.filterPillText, { color: isActive ? colors.primary : colors.textSecondary }]}>
      {label}{value ? `: ${value}` : ''}
    </Text>
    <ChevronDown size={14} color={isActive ? colors.primary : colors.textSecondary} style={{ marginLeft: 4 }} />
  </TouchableOpacity>
);

const ClientsFilterBar = ({ 
  typeFilter, 
  sortFilter, 
  kycFilter, 
  onTypePress, 
  onSortPress, 
  onKycPress, 
  onClearAll 
}) => {
  const { colors, isDark } = useTheme();

  const hasActiveFilters = !!typeFilter || !!sortFilter || !!kycFilter;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {hasActiveFilters && (
          <TouchableOpacity 
            style={[styles.clearPill, { borderColor: colors.error }]}
            onPress={onClearAll}
          >
            <X size={14} color={colors.error} style={{marginRight: 4}} />
            <Text style={[styles.clearText, { color: colors.error }]}>Clear</Text>
          </TouchableOpacity>
        )}

        <FilterPill 
          label="Type" 
          value={typeFilter ? typeFilter.label : ''} 
          isActive={!!typeFilter} 
          onPress={onTypePress}
          colors={colors}
          isDark={isDark}
        />

        <FilterPill 
          label="Sort" 
          value={sortFilter ? sortFilter.label : ''} 
          isActive={!!sortFilter} 
          onPress={onSortPress}
          colors={colors}
          isDark={isDark}
        />

        <FilterPill 
          label="KYC" 
          value={kycFilter ? kycFilter.label : ''} 
          isActive={!!kycFilter} 
          onPress={onKycPress}
          colors={colors}
          isDark={isDark}
        />

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    alignItems: 'center'
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 34,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1
  },
  filterPillText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs
  },
  clearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 34,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    backgroundColor: 'transparent'
  },
  clearText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs
  }
});

export default ClientsFilterBar;
