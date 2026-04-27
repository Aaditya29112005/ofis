import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

const FileUpload = ({ attachments = [], onUpdate }) => {
  const { colors, isDark } = useTheme();

  const handlePickDocuments = async () => {
    try {
      const results = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });

      // Filter for < 10MB
      let validFiles = [];
      let sizeError = false;
      
      for (const res of results) {
        if (res.size > 10 * 1024 * 1024) {
          sizeError = true;
        } else {
          validFiles.push(res);
        }
      }

      if (sizeError) {
        Alert.alert("File too large", "One or more files exceed the 10MB limit.");
      }

      if (validFiles.length > 0) {
        onUpdate([...attachments, ...validFiles]);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled
      } else {
        throw err;
      }
    }
  };

  const handleRemove = (indexToRemove) => {
    onUpdate(attachments.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <View style={styles.container}>
      <Pressable 
        style={({ pressed }) => [
          styles.uploadZone, 
          { 
            backgroundColor: isDark ? colors.surfaceElevated : colors.background,
            borderColor: pressed ? '#FF8A00' : colors.border,
            opacity: pressed ? 0.8 : 1
          }
        ]}
        onPress={handlePickDocuments}
      >
        {({ pressed }) => (
          <>
            <Icon name="cloud-upload-outline" size={32} color={pressed ? '#FF8A00' : '#A0A0A0'} />
            <Text style={[styles.uploadText, { color: colors.text }]}>
              Tap to upload files
            </Text>
            <Text style={[styles.subText, { color: colors.textMuted }]}>
              PNG, JPG, PDF up to 10MB
            </Text>
          </>
        )}
      </Pressable>

      {attachments.length > 0 && (
        <View style={styles.previewContainer}>
          {attachments.map((file, idx) => (
            <View 
              key={`${file.uri}-${idx}`} 
              style={[
                styles.previewBox, 
                { backgroundColor: colors.surfaceElevated, borderColor: colors.border }
              ]}
            >
              {file.type?.includes('image') ? (
                <Image source={{ uri: file.uri }} style={styles.previewImage} />
              ) : (
                <View style={styles.iconBox}>
                  <Icon name="document-text-outline" size={24} color={colors.textSecondary} />
                </View>
              )}
              <Pressable 
                style={styles.closeBtn}
                onPress={() => handleRemove(idx)}
              >
                <Icon name="close-circle-outline" size={20} color={colors.error} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  uploadZone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.sm,
  },
  subText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
  },
  previewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  previewBox: {
    width: 70,
    height: 70,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  iconBox: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
  }
});

export default FileUpload;
