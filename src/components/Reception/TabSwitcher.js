import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const TabSwitcher = ({ tabs, activeTab, onTabChange }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.surfaceElevated,
        borderColor: colors.border
      }
    ]}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab;
        return (
          <Pressable
            key={tab}
            style={[
              styles.tab,
              { backgroundColor: isActive ? `${colors.primary}20` : 'transparent' }
            ]}
            onPress={() => onTabChange(tab)}
          >
            <Text 
              style={[
                styles.tabText, 
                { 
                  color: isActive ? colors.primary : colors.textSecondary,
                  fontFamily: isActive ? FONTS.bold : FONTS.medium
                }
              ]}
              numberOfLines={1}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 10,
  }
});

export default TabSwitcher;
