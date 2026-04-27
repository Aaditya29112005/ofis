import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UploadCloud, FileCheck } from 'lucide-react-native';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';

const UploadBox = ({ fileName, onPick }) => {
  return (
    <TouchableOpacity style={[styles.container, fileName && styles.containerActive]} onPress={onPick}>
      <View style={[styles.iconArea, fileName && styles.iconAreaActive]}>
        {fileName ? (
          <FileCheck size={32} color="#FFF" />
        ) : (
          <UploadCloud size={32} color="#A0A4AE" />
        )}
      </View>
      <View style={styles.textInfo}>
        <Text style={[styles.title, fileName && { color: '#FFF' }]}>
          {fileName ? 'File Selected' : 'Upload Document'}
        </Text>
        <Text style={styles.subtitle}>
          {fileName ? fileName : 'Tap to browse PDF, DOCX, or Images'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { height: 160, borderRadius: 20, borderWidth: 2, borderStyle: 'dashed', borderColor: '#232734', backgroundColor: 'rgba(255,255,255,0.02)', alignItems: 'center', justifyContent: 'center', gap: 12 },
  containerActive: { borderColor: '#F97316', backgroundColor: 'rgba(249, 115, 22, 0.05)', borderStyle: 'solid' },
  iconArea: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  iconAreaActive: { backgroundColor: '#F97316' },
  textInfo: { alignItems: 'center', gap: 4 },
  title: { fontFamily: FONTS.bold, fontSize: 16, color: '#A0A4AE' },
  subtitle: { fontFamily: FONTS.medium, fontSize: 13, color: '#64748B' },
});

export default UploadBox;
