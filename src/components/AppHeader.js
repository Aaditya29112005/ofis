import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING } from '../theme/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const AppHeader = ({
  title,
  showBack = false,
  onBackPress,
  rightElement,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}>
      <View style={styles.content}>
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
              <View style={styles.backIcon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
              <View style={styles.menuIcon} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rightContainer}>{rightElement}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  leftContainer: {
    width: 40,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.secondary,
    textAlign: 'center',
    flex: 1,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  menuIcon: {
    width: 24,
    height: 2,
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    // Using shadow for burger lines trick
  },
  backIcon: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.secondary,
    transform: [{ rotate: '45deg' }],
  }
});

export default AppHeader;
