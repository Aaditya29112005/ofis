import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import DocumentPicker from 'react-native-document-picker';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import DashboardLayout from '../components/DashboardLayout';
import Haptics from '../utils/Haptics';

const BuildingItem = ({ name, index }) => {
  const { colors } = useTheme();
  
  const copyToClipboard = () => {
    Haptics.impactLight();
    // Logic for copy can be added here
  };

  return (
    <Animated.View 
      entering={FadeInUp.delay(400 + index * 100).springify()}
      style={[styles.buildingCard, { backgroundColor: colors.surface + '40', borderColor: colors.glassBorder }]}
    >
      <Text style={[styles.buildingName, { color: colors.text }]}>{name}</Text>
      <TouchableOpacity 
        style={[styles.copyIconBtn, { backgroundColor: colors.glassBackground }]}
        onPress={copyToClipboard}
      >
        <Icon name="copy-outline" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const ImportRFIDScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onUploadPressIn = () => {
    if (isUploading) return;
    scale.value = withSpring(0.97);
    Haptics.impactLight();
  };

  const onUploadPressOut = () => {
    scale.value = withSpring(1);
  };

  const handleFilePick = async () => {
      try {
          const res = await DocumentPicker.pickSingle({
              type: [DocumentPicker.types.csv, DocumentPicker.types.plainText, DocumentPicker.types.allFiles],
          });
          
          setSelectedFile(res);
          setIsUploading(true);
          setUploadSuccess(false);

          // Simulate Network Upload Delay
          setTimeout(() => {
              setIsUploading(false);
              setUploadSuccess(true);
              Haptics.success();
          }, 1500);

      } catch (err) {
          if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker
          } else {
              throw err;
          }
      }
  };

  const animatedUploadStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <DashboardLayout 
        activeTab="Cards" 
        onTabPress={(id) => navigation.navigate(id)}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <View style={styles.headerTitleContainer}>
                <Text style={[styles.title, { color: colors.text }]}>Import RFID Cards</Text>
                <Text style={[styles.subtitle, { color: colors.textMuted }]}>Upload a CSV to bulk create or update RFID cards</Text>
            </View>
            <View style={styles.headerActions}>
                <TouchableOpacity 
                    style={[styles.eliteBtn, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}
                    onPress={() => Haptics.impactLight()}
                >
                    <Icon name="download-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.eliteBtnText, { color: colors.textSecondary }]}>Sample CSV</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.iconBtn, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}
                    onPress={() => {
                        Haptics.impactLight();
                        navigation.goBack();
                    }}
                >
                    <Icon name="close" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).springify()}>
            <TouchableOpacity 
                activeOpacity={1}
                onPress={handleFilePick}
                onPressIn={onUploadPressIn}
                onPressOut={onUploadPressOut}
                disabled={isUploading}
            >
                <Animated.View style={[
                    styles.uploadCard, 
                    { 
                        backgroundColor: uploadSuccess ? 'rgba(50, 215, 75, 0.05)' : colors.surface + '80', 
                        borderColor: uploadSuccess ? 'rgba(50, 215, 75, 0.3)' : colors.glassBorder 
                    }, 
                    animatedUploadStyle
                ]}>
                    <View style={[styles.uploadIconBox, { backgroundColor: uploadSuccess ? 'rgba(50, 215, 75, 0.1)' : colors.glassBackground }]}>
                        {isUploading ? (
                            <ActivityIndicator color={COLORS.primary} size="large" />
                        ) : (
                            <Icon name={uploadSuccess ? "checkmark-circle" : "cloud-upload-outline"} size={32} color={uploadSuccess ? COLORS.success : COLORS.primary} />
                        )}
                    </View>

                    <Text style={[styles.uploadTitle, { color: uploadSuccess ? COLORS.success : colors.text }]}>
                        {isUploading ? 'Uploading Document...' : uploadSuccess ? 'Upload Successful' : 'Choose your CSV file'}
                    </Text>
                    
                    <View style={styles.uploadInfoRow}>
                        {selectedFile ? (
                            <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                            </Text>
                        ) : (
                            <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>
                                Required: <Text style={{ fontFamily: FONTS.bold }}>cardUid, building</Text>
                            </Text>
                        )}
                    </View>

                    {!uploadSuccess && !isUploading && (
                        <Text style={[styles.uploadDetail, { color: colors.textMuted }]}>Supports standard CSV encoding</Text>
                    )}
                    
                    {!uploadSuccess && !isUploading && (
                        <View style={styles.chooseFileBtn}>
                            <Text style={styles.chooseFileText}>Choose File</Text>
                        </View>
                    )}
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.formSection}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>IMPORT MODE</Text>
            <TouchableOpacity style={[styles.premiumInput, { backgroundColor: colors.surface + '80', borderColor: colors.glassBorder }]}>
                <View style={styles.inputLeft}>
                    <Icon name="git-branch-outline" size={18} color={COLORS.primary} style={{ marginRight: 12 }} />
                    <Text style={[styles.dropdownText, { color: colors.textSecondary }]}>Upsert (insert or update by cardUid)</Text>
                </View>
                <Icon name="chevron-down" size={18} color={colors.textMuted} />
            </TouchableOpacity>
            <Text style={[styles.helperText, { color: colors.textMuted }]}>
                <Icon name="information-circle-outline" size={12} color={colors.textMuted} /> Upsert safely loads repeated files without duplication errors.
            </Text>
        </Animated.View>

        <View style={styles.buildingsSection}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted, marginBottom: 16 }]}>VALID BUILDINGS</Text>
            <View style={styles.buildingsGrid}>
                {['Test Ofis Square', 'Ofis Test', 'Test Building', 'Sohna Road Gurugram'].map((b, i) => (
                    <BuildingItem key={i} name={b} index={i} />
                ))}
            </View>
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollArea: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginTop: 6,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  eliteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  eliteBtnText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  uploadCard: {
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  uploadIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  uploadInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  uploadSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  uploadDetail: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: 24,
  },
  chooseFileBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  chooseFileText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  formSection: {
    marginBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    marginBottom: 12,
  },
  premiumInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
  },
  inputLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: FONTS.semibold,
  },
  helperText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 10,
    lineHeight: 18,
  },
  buildingsSection: {
    marginBottom: 40,
  },
  buildingsGrid: {
    gap: 12,
  },
  buildingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  buildingName: {
    fontSize: 14,
    fontFamily: FONTS.semibold,
  },
  copyIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default ImportRFIDScreen;
