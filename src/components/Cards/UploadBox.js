import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { UploadCloud, FileText, X } from 'lucide-react-native';
import DocumentPicker from 'react-native-document-picker';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const UploadBox = ({ onFileSelect, requiredCols = [], optionalCols = [] }) => {
  const { colors, isDark } = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePickFile = async () => {
    try {
      setLoading(true);
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.csv],
        copyTo: 'cachesDirectory',
      });
      setSelectedFile(res);
      onFileSelect(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled
      } else {
        console.error('FilePicker Error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.dashedBox, 
          { 
            borderColor: selectedFile ? colors.primary : colors.border, 
            backgroundColor: isDark ? '#111' : colors.surface,
            borderStyle: selectedFile ? 'solid' : 'dashed'
          }
        ]}
        onPress={selectedFile ? null : handlePickFile}
        activeOpacity={0.7}
      >
        {selectedFile ? (
          <View style={styles.filePreview}>
            <View style={[styles.iconWrap, { backgroundColor: isDark ? 'rgba(255, 138, 0, 0.1)' : '#FFF5EB' }]}>
              <FileText size={28} color={colors.primary} />
            </View>
            <View style={styles.fileInfo}>
              <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>
                {selectedFile.name}
              </Text>
              <Text style={[styles.fileSize, { color: colors.textSecondary }]}>
                {(selectedFile.size / 1024).toFixed(2)} KB
              </Text>
            </View>
            <TouchableOpacity onPress={handleClear} style={styles.clearBtn} hitSlop={10}>
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <View style={[styles.iconWrap, { backgroundColor: isDark ? '#222' : '#F0F0F0' }]}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <UploadCloud size={28} color={colors.primary} />
              )}
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Choose your CSV file</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Tap here to select your file to upload</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.infoWrapper}>
        <View style={styles.columnGroup}>
          <Text style={[styles.groupTitle, { color: colors.text }]}>Required Columns:</Text>
          <Text style={[styles.codeText, { color: colors.textMuted }]}>{requiredCols.join(', ')}</Text>
        </View>
        {optionalCols.length > 0 && (
          <View style={[styles.columnGroup, { marginTop: SPACING.sm }]}>
            <Text style={[styles.groupTitle, { color: colors.text }]}>Optional Columns:</Text>
            <Text style={[styles.codeText, { color: colors.textMuted }]}>{optionalCols.join(', ')}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl
  },
  dashedBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    marginBottom: 4
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12
  },
  fileInfo: {
    flex: 1
  },
  fileName: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    marginBottom: 2
  },
  fileSize: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs
  },
  clearBtn: {
    padding: 4
  },
  infoWrapper: {
    paddingHorizontal: SPACING.xs
  },
  columnGroup: {
    marginBottom: 4
  },
  groupTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    marginBottom: 4
  },
  codeText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: 18
  }
});

export default UploadBox;
