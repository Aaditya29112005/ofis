import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Search, X, CheckCircle2, Circle } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const MOCK_CLIENTS = [
  { id: '1', name: 'Acme Corp', email: 'admin@acmecorp.com' },
  { id: '2', name: 'Startup Inc', email: 'hello@startupinc.com' },
  { id: '3', name: 'Pearson Specter', email: 'hr@pearsonspecter.com' },
  { id: '4', name: 'Stark Industries', email: 'tony@stark.com' },
  { id: '5', name: 'Wayne Enterprises', email: 'bruce@wayne.com' }
];

const AssignClientModal = ({ visible, selectedCardsCount, onClose, onAssign }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      setSelectedClient(null);
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

  if (!visible && fadeAnim._value === 0) return null;

  const filteredClients = MOCK_CLIENTS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim, backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.modalBox, { backgroundColor: isDark ? '#1A1A1A' : colors.surfaceElevated, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Assign to Client</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                {selectedCardsCount} card{selectedCardsCount !== 1 ? 's' : ''} selected
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.searchBox, { backgroundColor: isDark ? colors.background : colors.surface, borderColor: colors.border }]}>
            <Search size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search company or email"
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView style={styles.listArea} showsVerticalScrollIndicator={false}>
            {filteredClients.map(client => {
              const isSelected = selectedClient?.id === client.id;
              return (
                <TouchableOpacity 
                  key={client.id}
                  style={[styles.clientRow, { borderBottomColor: colors.border }]}
                  onPress={() => setSelectedClient(client)}
                >
                  <View style={styles.clientInfo}>
                    <Text style={[styles.clientName, { color: colors.text }]}>{client.name}</Text>
                    <Text style={[styles.clientEmail, { color: colors.textMuted }]}>{client.email}</Text>
                  </View>
                  {isSelected ? (
                    <CheckCircle2 size={24} color={colors.primary} />
                  ) : (
                    <Circle size={24} color={colors.border} />
                  )}
                </TouchableOpacity>
              );
            })}
            {filteredClients.length === 0 && (
              <View style={styles.emptyState}>
                 <Text style={{color: colors.textMuted}}>No clients found</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
             <TouchableOpacity style={[styles.btn, { borderColor: colors.border, borderWidth: 1 }]} onPress={onClose}>
               <Text style={[styles.btnText, { color: colors.text }]}>Cancel</Text>
             </TouchableOpacity>
             <TouchableOpacity 
               disabled={!selectedClient}
               style={[styles.btn, { backgroundColor: selectedClient ? colors.primary : colors.textMuted }]} 
               onPress={() => onAssign(selectedClient)}
             >
               <Text style={[styles.btnText, { color: '#FFF' }]}>Assign</Text>
             </TouchableOpacity>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.md },
  backdrop: { ...StyleSheet.absoluteFillObject },
  modalBox: { width: '100%', maxHeight: '80%', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.lg },
  title: { fontFamily: FONTS.bold, fontSize: 20, marginBottom: 4 },
  subtitle: { fontFamily: FONTS.regular, fontSize: FONT_SIZE.sm },
  closeBtn: { padding: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 48, borderWidth: 1, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  searchInput: { flex: 1, marginLeft: SPACING.sm, fontFamily: FONTS.regular, fontSize: FONT_SIZE.md, height: '100%' },
  listArea: { maxHeight: 300, marginBottom: SPACING.lg },
  clientRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: StyleSheet.hairlineWidth },
  clientInfo: { flex: 1, paddingRight: SPACING.sm },
  clientName: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md, marginBottom: 2 },
  clientEmail: { fontFamily: FONTS.regular, fontSize: FONT_SIZE.sm },
  emptyState: { paddingVertical: SPACING.xl, alignItems: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.md },
  btn: { flex: 1, height: 50, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  btnText: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md }
});

export default AssignClientModal;
