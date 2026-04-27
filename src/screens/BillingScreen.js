import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS } from '../theme/typography';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/GlassCard';
import Skeleton from '../components/Skeleton';
import Haptics from '../utils/Haptics';

const { width } = Dimensions.get('window');

const TableHeader = ({ colors, isDark }) => (
    <View style={[styles.tableHeader, { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
        borderBottomColor: colors.border
    }]}>
        <Text style={[styles.columnHeader, { flex: 1.2, color: colors.textSecondary }]}>Invoice #</Text>
        <Text style={[styles.columnHeader, { flex: 1, color: colors.textSecondary }]}>Date</Text>
        <Text style={[styles.columnHeader, { flex: 1, color: colors.textSecondary }]}>Amount</Text>
        <Text style={[styles.columnHeader, { flex: 1, textAlign: 'right', color: colors.textSecondary }]}>Status</Text>
    </View>
);

const InvoiceRow = ({ id, date, amount, status, colors, isDark }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'PAID': return colors.success || '#32D74B';
            case 'PENDING': return colors.primary || '#FF8A00';
            case 'OVERDUE': return colors.error || '#FF453A';
            default: return colors.textMuted;
        }
    };

    return (
        <TouchableOpacity 
            style={[styles.tableRow, { borderBottomColor: isDark ? 'rgba(255,255,255,0.03)' : colors.border }]} 
            onPress={() => {
                Haptics.impactLight();
                // Download logic
            }}
        >
            <View style={[styles.cell, { flex: 1.2 }]}>
                <Text style={[styles.primaryText, { color: colors.text }]}>{id}</Text>
            </View>
            <View style={[styles.cell, { flex: 1 }]}>
                <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>{date}</Text>
            </View>
            <View style={[styles.cell, { flex: 1 }]}>
                <Text style={[styles.primaryText, { color: colors.text }]}>{amount}</Text>
            </View>
            <View style={[styles.cell, { flex: 1, alignItems: 'flex-end' }]}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15', borderColor: getStatusColor() + '30' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor() }]}>{status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const BillingScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const invoices = [
    { id: 'INV-2026-001', date: 'Mar 15, 2026', amount: '₹45,200', status: 'PAID' },
    { id: 'INV-2026-002', date: 'Apr 01, 2026', amount: '₹12,800', status: 'PENDING' },
    { id: 'INV-2025-098', date: 'Feb 15, 2026', amount: '₹38,000', status: 'OVERDUE' },
  ];

  return (
    <DashboardLayout 
        activeTab="Billing" 
        onTabPress={(id) => navigation.navigate(id)}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Billing & Financials</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your subscriptions and invoices</Text>
          </View>
        </View>

        <View style={styles.summaryGrid}>
            <GlassCard style={styles.summaryCard}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>OUTSTANDING</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>₹12,800</Text>
            </GlassCard>
            <GlassCard style={styles.summaryCard}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>TOTAL SPENT</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>₹8,42,000</Text>
            </GlassCard>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Invoice History</Text>
        <GlassCard style={styles.tableCard}>
          <TableHeader colors={colors} isDark={isDark} />
          {isLoading ? (
              [1,2,3].map(i => (
                  <View key={i} style={styles.skeletonRow}>
                      <Skeleton width="100%" height={60} borderRadius={12} style={{ marginBottom: 12 }} />
                  </View>
              ))
          ) : (
              invoices.map((inv, idx) => (
                  <InvoiceRow key={idx} {...inv} colors={colors} isDark={isDark} />
              ))
          )}
        </GlassCard>
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: FONTS.medium,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  summaryCard: {
    width: '49%',
    padding: 16,
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 22,
    fontFamily: FONTS.bold,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  tableCard: {
    borderRadius: 16,
    padding: 0,
    overflow: 'hidden',
    marginBottom: 40,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  columnHeader: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  cell: {
    justifyContent: 'center',
  },
  primaryText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  secondaryText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },
  skeletonRow: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});

export default BillingScreen;
