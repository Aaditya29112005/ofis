import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import { Calendar, MapPin, Users, Edit2, Trash2, ChevronRight } from 'lucide-react-native';
import StatusBadge from './StatusBadge';
import { safeRender } from '../../utils/addressUtils';

const EventCard = ({ event, onEdit, onDelete, onRSVP }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Pressable 
      onPress={() => onRSVP(event)}
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
        
        {/* Header: Title and Status */}
        <View style={styles.header}>
          <View style={styles.titleArea}>
             <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{safeRender(event.title)}</Text>
             <View style={styles.iconRow}>
                <Users size={12} color={COLORS.primary} />
                <Text style={[styles.categorySubtitle, { color: colors.textSecondary }]}>{safeRender(event.category)}</Text>
             </View>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 8 }}>
            <StatusBadge status={event.status} />
            <View style={styles.actionGroupTop}>
               <TouchableOpacity onPress={() => onEdit(event)}>
                 <Edit2 size={14} color={colors.textSecondary} />
               </TouchableOpacity>
               <TouchableOpacity onPress={() => onDelete(event.id)}>
                 <Trash2 size={14} color={COLORS.error} />
               </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Content Columns */}
        <View style={styles.contentRow}>
           <View style={styles.colLeft}>
              <View style={styles.metaInfoItem}>
                 <Calendar size={12} color={colors.textSecondary} />
                 <Text style={[styles.metaInfoText, { color: colors.text }]} numberOfLines={1}>{formatDateTime(event.start)}</Text>
              </View>
              <View style={styles.metaInfoItem}>
                 <MapPin size={12} color={colors.textSecondary} />
                 <Text style={[styles.metaInfoText, { color: colors.text }]} numberOfLines={1}>{safeRender(event.location)}</Text>
              </View>
           </View>
           
           <View style={styles.colRight}>
              <Text style={[styles.columnLabel, { color: colors.textSecondary }]}>Description</Text>
              <Text style={[styles.columnValue, { color: colors.text }]} numberOfLines={2}>{event.description}</Text>
           </View>
        </View>

        {/* Footer: RSVP Count and Main Action */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
           <View style={styles.footerLeft}>
              <View style={[styles.statusDot, { backgroundColor: event.status === 'PUBLISHED' ? COLORS.success : COLORS.warning }]} />
              <Text style={[styles.footerStatusText, { color: colors.textSecondary }]}>
                 {event.attendeeCount || 0} RSVPs
              </Text>
           </View>

           <View style={[styles.mainActionBtn, { backgroundColor: `${COLORS.primary}12` }]}>
              <Text style={[styles.mainActionBtnText, { color: COLORS.primary }]}>View Details</Text>
              <ChevronRight size={14} color={COLORS.primary} style={{ marginLeft: 6 }} />
           </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleArea: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    marginBottom: 4,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categorySubtitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
  },
  actionGroupTop: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.sm,
    opacity: 0.1,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  colLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  metaInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  metaInfoText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
  },
  colRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  columnLabel: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  columnValue: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  footerStatusText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
  },
  mainActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
  },
  mainActionBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#FFF',
  },
});

export default EventCard;
