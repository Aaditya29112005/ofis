import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Building2, Layers, Cpu, MoreVertical, Edit2, Trash2, Power } from 'lucide-react-native';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import CommonAreaStatusBadge from './CommonAreaStatusBadge';
import Haptics from '../../utils/Haptics';
import { useTheme } from '../../context/ThemeContext';
import { safeRender } from '../../utils/addressUtils';

const CommonAreaCard = ({ area, onEdit, onDelete, onToggleStatus, onRSVP }) => {
  const { colors } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Pressable 
      onPress={() => onRSVP ? onRSVP(area) : null}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[
        styles.card, 
        { 
          backgroundColor: colors.surface, 
          borderColor: colors.border,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <View style={styles.header}>
          <View style={styles.areaInfo}>
            <Text style={[styles.name, { color: colors.text }]}>{safeRender(area.name)}</Text>
            <View style={styles.typeRow}>
               <Layers size={12} color={colors.textSecondary} />
               <Text style={[styles.typeText, { color: colors.textSecondary }]}>{safeRender(area.type)}</Text>
            </View>
          </View>
          <CommonAreaStatusBadge status={area.status} />
        </View>

        <View style={styles.body}>
           <View style={styles.metaItem}>
             <Building2 size={14} color={colors.primary} />
             <Text style={[styles.metaText, { color: colors.text }]}>{safeRender(area.building)}</Text>
           </View>
           <View style={styles.metaItem}>
             <Cpu size={14} color={colors.textSecondary} />
             <Text style={[styles.metaText, { color: colors.text }]}>{area.devices?.length || 0} Devices</Text>
           </View>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
           <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(area)}>
              <Edit2 size={16} color={colors.textMuted} />
              <Text style={[styles.actionText, { color: colors.textMuted }]}>Edit</Text>
           </TouchableOpacity>
           <View style={[styles.divider, { backgroundColor: colors.border }]} />
           <TouchableOpacity style={styles.actionBtn} onPress={() => onToggleStatus(area.id)}>
              <Power size={16} color={area.status === 'ACTIVE' ? colors.primary : colors.textMuted} />
              <Text style={[styles.actionText, { color: colors.textMuted }]}>Status</Text>
           </TouchableOpacity>
           <View style={[styles.divider, { backgroundColor: colors.border }]} />
           <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(area.id)}>
              <Trash2 size={16} color="#EF4444" />
              <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
           </TouchableOpacity>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  name: { fontFamily: FONTS.bold, fontSize: 18, marginBottom: 4 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeText: { fontFamily: FONTS.medium, fontSize: 13 },
  body: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontFamily: FONTS.bold, fontSize: 13 },
  footer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingTop: 16, 
    borderTopWidth: 1, 
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  actionText: { fontFamily: FONTS.bold, fontSize: 12 },
  divider: { width: 1, height: 16 },
});

export default CommonAreaCard;
