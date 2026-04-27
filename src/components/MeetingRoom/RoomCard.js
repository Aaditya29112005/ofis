import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Building2, Users, MapPin, Layers, ChevronRight, HardDrive } from 'lucide-react-native';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import MeetingStatusBadge from './MeetingStatusBadge';
import Haptics from '../../utils/Haptics';
import { useTheme } from '../../context/ThemeContext';

const RoomCard = ({ room, onBook }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const isDisabled = room.status.toLowerCase() === 'inactive';

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }], backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TouchableOpacity 
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.content}
        disabled={isDisabled}
      >
        <View style={styles.header}>
          <View style={styles.roomInfo}>
            <Text style={[styles.roomName, { color: colors.text }]}>{room.name} • {room.floor}</Text>
            <View style={styles.buildingRow}>
               <Building2 size={12} color={colors.textSecondary} />
               <Text style={[styles.buildingText, { color: colors.textSecondary }]}>{room.building}</Text>
            </View>
          </View>
          <MeetingStatusBadge status={room.status} />
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Users size={14} color="#F97316" />
            <Text style={styles.metaText}>{room.capacity} Seats</Text>
          </View>
          <View style={styles.metaItem}>
             <HardDrive size={14} color={colors.textSecondary} />
             <Text style={[styles.metaText, { color: colors.text }]}>₹{room.hourlyRate}/hour</Text>
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity 
              style={[
                styles.bookBtn, 
                isDisabled && { backgroundColor: isDark ? colors.surfaceElevated : colors.border }
              ]} 
              onPress={() => {
                 Haptics.impactLight();
                 onBook(room);
              }}
              disabled={isDisabled}
            >
               <Text style={[styles.bookBtnText, isDisabled && { color: colors.textMuted }]}>{isDisabled ? 'Maintenance' : 'Book Now'}</Text>
               {!isDisabled && <ChevronRight size={16} color="#FFF" />}
            </TouchableOpacity>
        </View>

      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  content: { padding: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  roomName: { fontFamily: FONTS.bold, fontSize: 18, marginBottom: 4 },
  buildingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  buildingText: { fontFamily: FONTS.medium, fontSize: 13 },
  metaGrid: { flexDirection: 'row', gap: 24, marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontFamily: FONTS.bold, fontSize: 13 },
  footer: { paddingTop: 16, borderTopWidth: 1 },
  bookBtn: { 
    height: 48, 
    backgroundColor: '#F97316', 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8 
  },
  bookBtnDisabled: { opacity: 0.5 },
  bookBtnText: { fontFamily: FONTS.bold, fontSize: 14, color: '#FFF' },
});

export default RoomCard;
