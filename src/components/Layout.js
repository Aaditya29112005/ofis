import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const Layout = ({
  children,
  header,
  backgroundColor = COLORS.background,
  scrollable = true,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor || colors.background }]}>
      {header}
      <ContentWrapper
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + SPACING.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ContentWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
});

export default Layout;
