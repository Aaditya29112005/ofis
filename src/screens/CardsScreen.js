import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, useWindowDimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/GlassCard';
import Haptics from '../utils/Haptics';
import { useRFIDStore } from '../store/useRFIDStore';

const CardsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { cards, loading, refreshCards } = useRFIDStore();

  useEffect(() => {
    refreshCards();
  }, []);

  return (
    <DashboardLayout 
        activeTab="Cards" 
        onTabPress={(id) => {
          Haptics.selection();
          navigation.navigate(id);
        }}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>RFID Cards</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage access cards and client linkage</Text>
        </View>
        <View style={styles.headerRight}>
            <TouchableOpacity 
                style={styles.importBtn}
                onPress={() => {
                  Haptics.impactMedium();
                  navigation.navigate('ImportRFID');
                }}
            >
                <Text style={styles.importBtnText}>Import RFID</Text>
            </TouchableOpacity>
        </View>
      </View>

      <GlassCard style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 2, color: colors.textSecondary }]}>CARD ID</Text>
          <Text style={[styles.headerCell, { flex: 2, color: colors.textSecondary }]}>TECH</Text>
          {!isMobile && <Text style={[styles.headerCell, { flex: 2, color: colors.textSecondary }]}>CLIENT</Text>}
          <Text style={[styles.headerCell, { flex: 1.5, color: colors.textSecondary, textAlign: 'right' }]}>STATUS</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading && cards.length === 0 ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
          ) : cards.length > 0 ? (
            cards.map((c, idx) => (
              <View key={c._id || c.id || idx} style={[styles.tableRow, { borderBottomColor: colors.glassBorder }]}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.cellTextBold, { color: colors.text }]}>{c.id || c.uid || c.cardId}</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.cellText, { color: colors.textSecondary }]}>{c.tech || c.technology || 'MIFARE'}</Text>
                </View>
                {!isMobile && (
                  <View style={{ flex: 2 }}>
                    <Text style={[styles.cellText, { color: colors.textSecondary }]}>{c.clientName || c.client?.name || 'Unassigned'}</Text>
                  </View>
                )}
                <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                  <View style={[styles.statusBadge, { backgroundColor: (c.status === 'ACTIVE' ? COLORS.primary : COLORS.error) + '15' }]}>
                    <Text style={[styles.statusBadgeText, { color: c.status === 'ACTIVE' ? COLORS.primary : COLORS.error }]}>{c.status || 'ACTIVE'}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={{ padding: 40, alignItems: 'center' }}>
                <Icon name="card-outline" size={48} color={colors.textMuted} />
                <Text style={{ color: colors.textSecondary, marginTop: 16 }}>No RFID cards found</Text>
            </View>
          )}
        </ScrollView>
      </GlassCard>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
  },
  importBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  importBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  tableCard: {
    flex: 1,
    padding: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 24,
    borderBottomWidth: 1,
  },
  headerCell: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 24,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  cellTextBold: {
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  cellText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  },

export default CardsScreen;

