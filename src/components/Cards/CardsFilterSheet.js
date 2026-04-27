import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Pressable, TouchableOpacity, Dimensions } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CardsFilterSheet = ({ visible, title, options, selectedValue, onClose, onSelect }) => {
  const { colors, isDark } = useTheme();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true })
      ]).start();
    }
  }, [visible]);

  if (!visible && fadeAnim._value === 0) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View 
          style={[
            styles.sheetContent, 
            { 
              backgroundColor: isDark ? '#1A1A1A' : colors.surfaceElevated,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.dragHandleWrap}>
            <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
             {options.map((opt, idx) => {
               const isSelected = selectedValue === opt.value;
               return (
                 <TouchableOpacity 
                   key={idx}
                   style={[styles.optionRow, { borderBottomColor: colors.border, borderBottomWidth: idx === options.length - 1 ? 0 : StyleSheet.hairlineWidth }]}
                   onPress={() => { onSelect(opt); onClose(); }}
                 >
                    <Text style={[styles.optionLabel, { 
                      color: isSelected ? colors.primary : colors.text,
                      fontFamily: isSelected ? FONTS.bold : FONTS.medium 
                    }]}>
                       {opt.label}
                    </Text>
                    {isSelected && <Check size={20} color={colors.primary} />}
                 </TouchableOpacity>
               )
             })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheetContent: {
    width: '100%',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingBottom: SPACING.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20
  },
  dragHandleWrap: { width: '100%', alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  dragHandle: { width: 40, height: 4, borderRadius: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md },
  title: { fontFamily: FONTS.bold, fontSize: 18 },
  optionsList: { paddingHorizontal: SPACING.md },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.lg, paddingHorizontal: SPACING.md },
  optionLabel: { fontSize: FONT_SIZE.md }
});

export default CardsFilterSheet;
