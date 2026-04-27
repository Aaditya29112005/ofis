import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { X, CreditCard, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const AssignCardModal = ({ visible, onClose, booking }) => {
  const { colors, isDark } = useTheme();
  const [cardNumber, setCardNumber] = useState('');

  const handleAssign = () => {
    if (!cardNumber) return Alert.alert('Error', 'Please enter a card number');
    Alert.alert('Success', `Card ${cardNumber} assigned to ${booking.member}'s guest.`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: isDark ? '#111827' : colors.card, borderColor: isDark ? '#1F2937' : colors.border }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: '#FFF' }]}>Assign Access Card</Text>
            <TouchableOpacity onPress={onClose}><X size={20} color="#64748B" /></TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.iconCircle}>
              <CreditCard size={32} color="#F97316" />
            </View>
            <Text style={styles.instruction}>Scan or enter the RFID card number to link with this booking.</Text>
            
            <TextInput 
              style={[styles.input, { color: '#FFF', borderColor: isDark ? '#1F2937' : '#E2E8F0' }]}
              placeholder="Card Number (e.g. 102938)"
              placeholderTextColor="#64748B"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.assignBtn} onPress={handleAssign}>
              <Text style={styles.assignBtnText}>Link Card</Text>
              <ChevronRight size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  card: { width: '85%', borderRadius: 24, borderWidth: 1, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontFamily: FONTS.bold, fontSize: 18 },
  body: { alignItems: 'center' },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(249, 115, 22, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  instruction: { fontFamily: FONTS.medium, fontSize: 13, color: '#94A3B8', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  input: { width: '100%', height: 52, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, fontFamily: FONTS.bold, fontSize: 16, marginBottom: 24, textAlign: 'center' },
  assignBtn: { width: '100%', height: 52, borderRadius: 12, backgroundColor: '#F97316', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  assignBtnText: { fontFamily: FONTS.bold, fontSize: 14, color: '#FFF' },
});

export default AssignCardModal;
