import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Download } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

import UploadBox from '../../components/Cards/UploadBox';
import InfoBox from '../../components/Cards/InfoBox';

const ImportAssignmentsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
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
        `Successfully imported ${selectedFile.name}. RFID assignments have been updated.`,
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
          <Text style={[styles.title, { color: colors.text }]}>Import Assignments</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Upload CSV to assign RFID cards to clients in bulk
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
          requiredCols={['cardUid', 'client']} 
          optionalCols={[]}
          onFileSelect={setSelectedFile}
        />

        <InfoBox>
           <Text style={[styles.infoText, { color: colors.textSecondary }]}>
             When you upload a CSV, we will automatically:
           </Text>
           <View style={{ marginTop: 8 }}>
              <Text style={[styles.infoBullet, { color: colors.text }]}>• Find card by <Text style={{fontFamily:FONTS.bold}}>cardUid</Text></Text>
              <Text style={[styles.infoBullet, { color: colors.text }]}>• Resolve client by ID or name</Text>
              <Text style={[styles.infoBullet, { color: colors.text }]}>• Reuse or create company access user</Text>
              <Text style={[styles.infoBullet, { color: colors.text }]}>• Link card to client seamlessly</Text>
           </View>
        </InfoBox>

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
  
  infoText: { fontFamily: FONTS.regular, fontSize: FONT_SIZE.sm },
  infoBullet: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm, marginBottom: 4 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.md, paddingBottom: 30, borderTopWidth: StyleSheet.hairlineWidth },
  submitBtn: { height: 50, borderRadius: BORDER_RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  submitBtnTxt: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md, color: '#FFF' }
});

export default ImportAssignmentsScreen;
