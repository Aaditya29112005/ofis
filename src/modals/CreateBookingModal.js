import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Modal, TouchableOpacity, 
  ScrollView, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { X, Calendar, Clock, Users, FileText, Plus } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import { SPACING } from '../theme/spacing';
import { useTheme } from '../context/ThemeContext';

const CreateBookingModal = ({ visible, onClose, onSubmit }) => {
  const { colors, isDark } = useTheme();
  const [formData, setFormData] = useState({
    room: '',
    member: '',
    date: '',
    start: '',
    end: '',
    attendees: '',
    notes: ''
  });

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Create New Booking</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Room</Text>
              <TextInput 
                style={styles.input}
                placeholder="Select a meeting room"
                placeholderTextColor="#64748B"
                value={formData.room}
                onChangeText={(text) => setFormData({...formData, room: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Member</Text>
              <TextInput 
                style={styles.input}
                placeholder="Search member"
                placeholderTextColor="#64748B"
                value={formData.member}
                onChangeText={(text) => setFormData({...formData, member: text})}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Date</Text>
                <View style={styles.rowInput}>
                  <Calendar size={18} color="#64748B" />
                  <TextInput 
                    style={styles.innerInput}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#64748B"
                    value={formData.date}
                    onChangeText={(text) => setFormData({...formData, date: text})}
                  />
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Attendees</Text>
                <View style={styles.rowInput}>
                  <Users size={18} color="#64748B" />
                  <TextInput 
                    style={styles.innerInput}
                    placeholder="Count"
                    placeholderTextColor="#64748B"
                    keyboardType="numeric"
                    value={formData.attendees}
                    onChangeText={(text) => setFormData({...formData, attendees: text})}
                  />
                </View>
              </View>
            </View>

            <View style={styles.row}>
               <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Start Time</Text>
                <View style={styles.rowInput}>
                  <Clock size={18} color="#64748B" />
                  <TextInput 
                    style={styles.innerInput}
                    placeholder="00:00 AM"
                    placeholderTextColor="#64748B"
                    value={formData.start}
                    onChangeText={(text) => setFormData({...formData, start: text})}
                  />
                </View>
              </View>
               <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>End Time</Text>
                <View style={styles.rowInput}>
                  <Clock size={18} color="#64748B" />
                  <TextInput 
                    style={styles.innerInput}
                    placeholder="00:00 PM"
                    placeholderTextColor="#64748B"
                    value={formData.end}
                    onChangeText={(text) => setFormData({...formData, end: text})}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput 
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Additional instructions..."
                placeholderTextColor="#64748B"
                multiline
                value={formData.notes}
                onChangeText={(text) => setFormData({...formData, notes: text})}
              />
            </View>

            <View style={styles.extraSection}>
               <TouchableOpacity style={styles.extraBtn}>
                  <Plus size={16} color="#FF8A00" />
                  <Text style={styles.extraBtnText}>Add Catering</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.extraBtn}>
                  <Plus size={16} color="#FF8A00" />
                  <Text style={styles.extraBtnText}>Add Visitors</Text>
               </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Create Booking</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '90%',
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
  },
  form: {
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2430',
    paddingHorizontal: 16,
    height: 48,
    color: '#FFF',
    fontFamily: FONTS.medium,
  },
  row: {
    flexDirection: 'row',
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2430',
    paddingHorizontal: 16,
    height: 48,
  },
  innerInput: {
    flex: 1,
    marginLeft: 10,
    color: '#FFF',
    fontFamily: FONTS.medium,
  },
  extraSection: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 10,
  },
  extraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 138, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  extraBtnText: {
    color: '#FF8A00',
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  submitBtn: {
    backgroundColor: '#FF8A00',
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitBtnText: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontSize: 16,
  }
});

export default CreateBookingModal;
