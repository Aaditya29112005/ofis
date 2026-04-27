import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { FileText, Building2, Calendar, HardDrive, Eye, CheckCircle, Clock } from 'lucide-react-native';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import PrinterStatusBadge from './PrinterStatusBadge';
import { useTheme } from '../../context/ThemeContext';

const RequestCard = ({ request, onUpdateStatus, onViewFile }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString([], { day: '2-digit', month: 'short' }) + ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }], backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TouchableOpacity 
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.fileIconArea}>
            <FileText size={20} color="#F97316" />
          </View>
          <View style={styles.titleInfo}>
            <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>{request.fileName}</Text>
            <PrinterStatusBadge status={request.status} />
          </View>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Building2 size={14} color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{request.building}</Text>
          </View>
          <View style={styles.metaItem}>
            <Calendar size={14} color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{formatDate(request.requestedDate)}</Text>
          </View>
          <View style={styles.metaItem}>
            <HardDrive size={14} color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{request.credits} Credits</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.clientLabel, { color: colors.textMuted }]}>By: </Text>
            <Text style={styles.clientName}>{request.clientName}</Text>
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity style={[styles.viewBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]} onPress={() => onViewFile(request)}>
            <Eye size={16} color={colors.textSecondary} />
            <Text style={[styles.viewBtnText, { color: colors.textSecondary }]}>View File</Text>
          </TouchableOpacity>

          {request.status === 'pending' && (
            <TouchableOpacity style={styles.primaryBtn} onPress={() => onUpdateStatus(request.id, 'ready')}>
              <Clock size={16} color="#FFF" />
              <Text style={styles.primaryBtnText}>Mark Ready</Text>
            </TouchableOpacity>
          )}

          {request.status === 'ready' && (
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#F97316' }]} onPress={() => onUpdateStatus(request.id, 'completed')}>
              <CheckCircle size={16} color="#FFF" />
              <Text style={styles.primaryBtnText}>Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  content: { padding: SPACING.lg },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  fileIconArea: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(249, 115, 22, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  titleInfo: { flex: 1, gap: 4 },
  fileName: { fontFamily: FONTS.bold, fontSize: 16 },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontFamily: FONTS.medium, fontSize: 12 },
  clientLabel: { fontFamily: FONTS.medium, fontSize: 12 },
  clientName: { fontFamily: FONTS.bold, fontSize: 12, color: '#F97316' },
  footer: { flexDirection: 'row', gap: 12, paddingTop: 16, borderTopWidth: 1 },
  viewBtn: { flex: 1, height: 44, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.03)' },
  viewBtnText: { fontFamily: FONTS.bold, fontSize: 13 },
  primaryBtn: { flex: 1.5, height: 44, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#3B82F6' },
  primaryBtnText: { fontFamily: FONTS.bold, fontSize: 13, color: '#FFF' },
});

export default RequestCard;
