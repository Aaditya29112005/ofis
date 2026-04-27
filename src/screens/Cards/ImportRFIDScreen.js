import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Download, ChevronDown } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

import UploadBox from '../../components/Cards/UploadBox';
import FilterDropdown from '../../components/FilterDropdown';

const IMPORT_MODES = [
  { label: 'Upsert (Insert or Update by cardUid)', value: 'upsert' },
  { label: 'Insert Only (Skip duplicates)', value: 'insert' }
];

const BUILDINGS = [
  { label: 'Main Tower', value: 'Main Tower' },
  { label: 'North Wing', value: 'North Wing' }
];

const ImportRFIDScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  const [mode, setMode] = useState(IMPORT_MODES[0]);
  const [building, setBuilding] = useState(BUILDINGS[0]);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'mode' | 'building' | null
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    // Simulate API call
    setTimeout(() => {
      setIsUploading(false);
      Alert.alert(
        'Success', 
        `Successfully imported ${selectedFile.name}. RFID cards are being processed.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Import RFID Cards</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Upload CSV to bulk create/update RFID cards
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.actionRow}>
           <TouchableOpacity style={[styles.downloadBtn, { backgroundColor: isDark ? '#2A2A2A' : '#E0E0E0' }]}>
             <Download size={16} color={colors.text} />
             <Text style={[styles.downloadTxt, { color: colors.text }]}>Sample CSV</Text>
           </TouchableOpacity>
        </View>

        <UploadBox 
          requiredCols={['cardUid', 'building']} 
          optionalCols={['facilityCode', 'technology', 'cardType', 'status', 'expiresAt', 'issuedAt', 'activatedAt']}
          onFileSelect={setSelectedFile}
        />

        <View style={styles.formSection}>
          <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Import Mode</Text>
          <TouchableOpacity 
            style={[styles.dropdownTrigger, { backgroundColor: isDark ? colors.surfaceElevated : colors.surface, borderColor: colors.border }]}
            onPress={() => setActiveDropdown('mode')}
          >
            <Text style={[styles.dropdownText, { color: colors.text }]}>{mode.label}</Text>
            <ChevronDown size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <Text style={[styles.formLabel, { color: colors.textSecondary, marginTop: SPACING.lg }]}>Assigned Building</Text>
          <TouchableOpacity 
            style={[styles.dropdownTrigger, { backgroundColor: isDark ? colors.surfaceElevated : colors.surface, borderColor: colors.border }]}
            onPress={() => setActiveDropdown('building')}
          >
            <Text style={[styles.dropdownText, { color: colors.text }]}>{building.label}</Text>
            <ChevronDown size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: isDark ? '#111' : colors.surface }]}>
         <TouchableOpacity 
           style={[
             styles.submitBtn, 
             { backgroundColor: selectedFile && !isUploading ? colors.primary : colors.border }
           ]}
           onPress={handleUpload}
           disabled={!selectedFile || isUploading}
         >
           {isUploading ? (
             <ActivityIndicator size="small" color="#FFF" />
           ) : (
             <Text style={styles.submitBtnTxt}>Upload CSV</Text>
           )}
         </TouchableOpacity>
      </View>

      <FilterDropdown 
        visible={activeDropdown === 'mode'}
        title="Select Import Mode"
        options={IMPORT_MODES}
        selectedOption={mode}
        onClose={() => setActiveDropdown(null)}
        onSelect={(opt) => setMode(opt)}
      />

      <FilterDropdown 
        visible={activeDropdown === 'building'}
        title="Select Building"
        options={BUILDINGS}
        selectedOption={building}
        onClose={() => setActiveDropdown(null)}
        onSelect={(opt) => setBuilding(opt)}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  backBtn: { marginRight: SPACING.sm },
  title: { fontFamily: FONTS.bold, fontSize: 22 },
  subtitle: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.xs, paddingLeft: 32 },
  content: { padding: SPACING.md, paddingBottom: 100 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: SPACING.lg },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: BORDER_RADIUS.md },
  downloadTxt: { fontFamily: FONTS.bold, fontSize: 12, marginLeft: 6 },
  
  formSection: { marginTop: SPACING.xl },
  formLabel: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.sm, marginBottom: 8 },
  dropdownTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48, borderRadius: BORDER_RADIUS.md, borderWidth: 1, paddingHorizontal: SPACING.md },
  dropdownText: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.md },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.md, paddingBottom: 30, borderTopWidth: StyleSheet.hairlineWidth },
  submitBtn: { height: 50, borderRadius: BORDER_RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  submitBtnTxt: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md, color: '#FFF' }
});

export default ImportRFIDScreen;
