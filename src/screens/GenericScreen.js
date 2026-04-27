import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/GlassCard';

const GenericListScreen = ({ navigation, route }) => {
  const { title } = route.params || { title: 'Screen' };
  
  return (
    <DashboardLayout 
        activeTab={route.name} 
        onTabPress={(id) => navigation.navigate(id)}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Full UI implementation in progress</Text>
      </View>

      <GlassCard style={styles.placeholderCard}>
        <View style={styles.emptyIconBox}>
            <Icon name="construct-outline" size={28} color={COLORS.primary} />
        </View>
        <Text style={styles.emptyTitle}>{title} Modules</Text>
        <Text style={styles.emptyDesc}>
            This module is currently being finalized to match the OSPL world-class standards.
        </Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </GlassCard>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  placeholderCard: {
    padding: 40,
    alignItems: 'center',
    borderRadius: 24,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,138,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 12,
  },
  emptyDesc: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  backBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
});

export default GenericListScreen;
