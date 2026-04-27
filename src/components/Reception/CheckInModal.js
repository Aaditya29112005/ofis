import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

import { safeRender } from '../../utils/addressUtils';

const CheckInModal = ({ visible, visitor, onClose, onConfirm }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [badgeId, setBadgeId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (visible) {
      setBadgeId('');
      setNotes('');
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 0 })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.9, duration: 200, useNativeDriver: true })
      ]).start();
    }
  }, [visible]);

  if (!visitor) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim, backgroundColor: 'rgba(0,0,0,0.6)' }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.modalBox, { backgroundColor: isDark ? '#1A1A1A' : colors.surfaceElevated, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Check-in {safeRender(visitor.name)}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Badge ID (Optional)</Text>
            <TextInput 
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: isDark ? colors.background : colors.surface }]} 
              placeholder="e.g. B-1049"
              placeholderTextColor={colors.textMuted}
              value={badgeId}
              onChangeText={setBadgeId}
            />

            <Text style={[styles.label, { color: colors.textSecondary, marginTop: SPACING.md }]}>Notes (Optional)</Text>
            <TextInput 
              style={[styles.input, styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: isDark ? colors.background : colors.surface }]} 
              placeholder="Any specific instructions..."
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>

          <View style={styles.footer}>
             <TouchableOpacity style={[styles.btn, { borderColor: colors.border, borderWidth: 1 }]} onPress={onClose}>
               <Text style={[styles.btnText, { color: colors.text }]}>Cancel</Text>
             </TouchableOpacity>
             <TouchableOpacity style={[styles.btn, { backgroundColor: colors.success }]} onPress={() => onConfirm(visitor, { badgeId, notes })}>
               <Text style={[styles.btnText, { color: '#FFF' }]}>Confirm Check-in</Text>
             </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  backdrop: { ...StyleSheet.absoluteFillObject },
  modalBox: { width: '100%', borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  title: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.lg },
  content: { marginBottom: SPACING.xl },
  label: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm, marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, height: 48, fontFamily: FONTS.regular, fontSize: FONT_SIZE.md },
  textArea: { height: 80, paddingTop: 12, textAlignVertical: 'top' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.sm },
  btn: { flex: 1, height: 48, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  btnText: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.sm }
});

export default CheckInModal;
