import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { UserPlus, Trash2, Image as ImageIcon } from 'lucide-react-native';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';

const SpeakerInputGroup = ({ speakers, onAdd, onRemove, onChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Speakers</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <UserPlus size={16} color="#F97316" />
          <Text style={styles.addBtnText}>Add Speaker</Text>
        </TouchableOpacity>
      </View>

      {speakers.map((speaker, index) => (
        <View key={index} style={styles.speakerCard}>
          <View style={styles.speakerHeader}>
            <Text style={styles.speakerCount}>Speaker #{index + 1}</Text>
            <TouchableOpacity onPress={() => onRemove(index)}>
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Speaker Name"
            placeholderTextColor="#64748B"
            value={speaker.name}
            onChangeText={(val) => onChange(index, 'name', val)}
          />

          <TextInput
            style={styles.input}
            placeholder="Image URL"
            placeholderTextColor="#64748B"
            value={speaker.image}
            onChangeText={(val) => onChange(index, 'image', val)}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Bio / Description"
            placeholderTextColor="#64748B"
            value={speaker.bio}
            onChangeText={(val) => onChange(index, 'bio', val)}
            multiline
          />
        </View>
      ))}

      {speakers.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No speakers added yet.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  label: { fontFamily: FONTS.bold, fontSize: 14, color: '#94A3B8', textTransform: 'uppercase' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addBtnText: { fontFamily: FONTS.bold, fontSize: 13, color: '#F97316' },
  speakerCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  speakerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  speakerCount: { fontFamily: FONTS.bold, fontSize: 12, color: '#F97316' },
  input: { height: 44, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', color: '#FFF', fontFamily: FONTS.medium, fontSize: 14, marginBottom: 12 },
  textArea: { height: 60, textAlignVertical: 'top' },
  empty: { padding: 20, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12 },
  emptyText: { fontFamily: FONTS.medium, fontSize: 12, color: '#64748B' },
});

export default SpeakerInputGroup;
