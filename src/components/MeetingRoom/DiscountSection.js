import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Info, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

const DiscountSection = ({ discount, cap, useDefaultCap, onToggleCap }) => {
  const { colors, isDark } = useTheme();
  const isOverCap = parseFloat(discount || 0) > cap;

  return (
    <View style={styles.container}>
      <View style={[styles.capRow, { backgroundColor: colors.surface }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.capTitle, { color: colors.text }]}>Use building default discount cap</Text>
          <Text style={[styles.capSub, { color: colors.textMuted }]}>Current cap: {cap}%</Text>
        </View>
        <Switch 
          value={useDefaultCap} 
          onValueChange={onToggleCap}
          trackColor={{ false: isDark ? '#334155' : '#CBD5E1', true: '#F97316' }}
        />
      </View>

      {isOverCap ? (
        <View style={styles.warningBox}>
          <AlertTriangle size={18} color="#FF9F0A" />
          <Text style={styles.warningText}>
            Above cap → Approval Required. This booking will be marked as "Approval Pending".
          </Text>
        </View>
      ) : (
        <View style={styles.infoBox}>
          <Info size={18} color="#3B82F6" />
          <Text style={styles.infoText}>
            Within cap → Auto Applied.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: SPACING.lg },
  capRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12 },
  capTitle: { fontFamily: FONTS.bold, fontSize: 13 },
  capSub: { fontFamily: FONTS.medium, fontSize: 11, marginTop: 2 },
  warningBox: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'rgba(255, 159, 10, 0.1)', borderRadius: 12, marginTop: 12, gap: 12 },
  warningText: { flex: 1, fontFamily: FONTS.medium, fontSize: 12, color: '#FF9F0A', lineHeight: 18 },
  infoBox: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 12, marginTop: 12, gap: 12 },
  infoText: { flex: 1, fontFamily: FONTS.medium, fontSize: 12, color: '#60A5FA' },
});

import { SPACING } from '../../theme/spacing';
import { FONTS } from '../../theme/typography';

export default DiscountSection;
