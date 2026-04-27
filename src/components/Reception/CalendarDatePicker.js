import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarDatePicker = ({ visible, onClose, onSelect, selectedDate }) => {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Simple state for currently viewed month (mocked for simplicity, using real Date object)
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 0, speed: 12 })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true })
      ]).start();
    }
  }, [visible]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const handleSelectDay = (day) => {
    const d = new Date(year, month, day);
    onSelect(d.toISOString().split('T')[0]); // YYYY-MM-DD
    onClose();
  };

  const handleToday = () => {
    const d = new Date();
    onSelect(d.toISOString().split('T')[0]);
    onClose();
  };

  // Render blanks for first row
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalSlots = [...blanks, ...days];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim, backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { backgroundColor: colors.surface, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Select Date</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Calendar Controls */}
          <View style={styles.monthRow}>
            <TouchableOpacity onPress={prevMonth} style={styles.arrowBtn}>
               <ChevronLeft size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.monthText, { color: colors.text }]}>
               {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.arrowBtn}>
               <ChevronRight size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Days Header */}
          <View style={styles.daysRow}>
            {DAYS.map(d => (
              <Text key={d} style={[styles.dayHeaderLabel, { color: colors.textMuted }]}>{d}</Text>
            ))}
          </View>

          {/* Grid */}
          <View style={styles.grid}>
            {totalSlots.map((dayObj, index) => {
              if (dayObj === null) return <View key={`blank-${index}`} style={styles.dayCell} />;
              
              const isSelectedText = selectedDate === new Date(year, month, dayObj).toISOString().split('T')[0];
              
              return (
                <TouchableOpacity 
                  key={`day-${dayObj}`} 
                  style={[styles.dayCell, isSelectedText && { backgroundColor: colors.primary }]}
                  onPress={() => handleSelectDay(dayObj)}
                >
                  <Text style={[
                      styles.dayText, 
                      { 
                        color: isSelectedText ? '#FFF' : colors.text,
                        fontFamily: isSelectedText ? FONTS.bold : FONTS.regular
                      }
                    ]}>
                    {dayObj}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer Actions */}
          <View style={styles.footerRow}>
             <TouchableOpacity style={styles.footerBtn} onPress={() => { onSelect(null); onClose(); }}>
                <Text style={[styles.footerBtnText, { color: colors.error }]}>Clear</Text>
             </TouchableOpacity>
             <TouchableOpacity style={[styles.footerBtn, { backgroundColor: `${colors.primary}15` }]} onPress={handleToday}>
                <Text style={[styles.footerBtnText, { color: colors.primary }]}>Today</Text>
             </TouchableOpacity>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: { width: '100%', borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, paddingTop: SPACING.lg, paddingHorizontal: SPACING.md, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  title: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.lg },
  monthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  monthText: { fontFamily: FONTS.semibold, fontSize: FONT_SIZE.md },
  arrowBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  dayHeaderLabel: { flex: 1, textAlign: 'center', fontFamily: FONTS.medium, fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  dayText: { fontSize: FONT_SIZE.sm },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.lg },
  footerBtn: { flex: 1, marginHorizontal: SPACING.xs, paddingVertical: 12, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  footerBtnText: { fontFamily: FONTS.semibold, fontSize: FONT_SIZE.sm }
});

export default CalendarDatePicker;
