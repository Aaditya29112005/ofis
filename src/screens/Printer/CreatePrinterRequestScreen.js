import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ChevronDown, CheckCircle, HardDrive, Building2 } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import { usePrinterStore } from '../../store/usePrinterStore';

import UploadBox from '../../components/Printer/UploadBox';
import FilterDropdown from '../../components/FilterDropdown';



const CreatePrinterRequestScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { buildings, addRequest } = usePrinterStore();
  
  const [fileName, setFileName] = useState('');
  const [clientName, setClientName] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState(buildings[1]); // Default to first real building
  const [credits, setCredits] = useState('10');
  const [showBuildingPicker, setShowBuildingPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handlePickFile = () => {
    // In a real app, use react-native-document-picker
    // Mocking file selection
    setFileName(`Print_Job_${Math.floor(Math.random() * 1000)}.pdf`);
    Alert.alert('File Selected', 'Mock file attached successfully');
  };

  const handleSubmit = () => {
    if (!fileName || !clientName || !selectedBuilding) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newRequest = {
        fileName,
        clientName,
        building: selectedBuilding.label,
        status: 'pending',
        credits: parseInt(credits),
        requestedDate: new Date().toISOString(),
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      };

      addRequest(newRequest);
      setIsUploading(false);
      Alert.alert('Success', 'Print request submitted successfully');
      navigation.goBack();
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>New Print Request</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          <UploadBox fileName={fileName} onPick={handlePickFile} />

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Client Name *</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="Enter client or member name"
                placeholderTextColor={colors.textMuted}
                value={clientName}
                onChangeText={setClientName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Building *</Text>
              <TouchableOpacity style={[styles.picker, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => setShowBuildingPicker(true)}>
                <View style={styles.pickerLeft}>
                  <Building2 size={18} color="#FF8A00" />
                  <Text style={[styles.pickerText, { color: colors.text }]}>{selectedBuilding.label}</Text>
                </View>
                <ChevronDown size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Estimated Credits</Text>
              <View style={styles.inputWithIcon}>
                <HardDrive size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput 
                  style={[styles.input, { paddingLeft: 44, backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  keyboardType="numeric"
                  value={credits}
                  onChangeText={setCredits}
                />
              </View>
              <Text style={[styles.hintText, { color: colors.textMuted }]}>Approx. 1 credit per page (Black & White)</Text>
            </View>

          </View>

        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.submitBtn, (!fileName || isUploading) && styles.submitBtnDisabled]} 
            onPress={handleSubmit}
            disabled={!fileName || isUploading}
          >
            {isUploading ? (
              <Text style={styles.submitBtnText}>Submitting...</Text>
            ) : (
              <>
                <CheckCircle size={20} color="#FFF" />
                <Text style={styles.submitBtnText}>Submit Print Request</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <FilterDropdown 
          visible={showBuildingPicker}
          title="Select Building"
          options={buildings.filter(b => b.value !== null)}
          selectedOption={selectedBuilding}
          onClose={() => setShowBuildingPicker(false)}
          onSelect={(opt) => {
            setSelectedBuilding(opt);
            setShowBuildingPicker(false);
          }}
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg },
  title: { fontFamily: FONTS.bold, fontSize: 18 },
  content: { flex: 1, padding: SPACING.lg },
  form: { marginTop: 32, gap: 24 },
  inputGroup: { gap: 8 },
  label: { fontFamily: FONTS.bold, fontSize: 13, textTransform: 'uppercase' },
  input: { height: 52, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, fontFamily: FONTS.medium, fontSize: 15 },
  inputWithIcon: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 16, top: 17, zIndex: 1 },
  picker: { height: 52, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pickerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pickerText: { fontFamily: FONTS.medium, fontSize: 15 },
  hintText: { fontFamily: FONTS.medium, fontSize: 12, marginLeft: 4 },
  footer: { padding: SPACING.lg, paddingBottom: 40, borderTopWidth: 1 },
  submitBtn: { height: 56, backgroundColor: '#FF8A00', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { fontFamily: FONTS.bold, fontSize: 16, color: '#FFF' },
});

export default CreatePrinterRequestScreen;
