import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';
import DashboardLayout from '../components/DashboardLayout';

const ImportAssignmentsScreen = ({ navigation }) => {
  return (
    <DashboardLayout 
        activeTab="Cards" 
        onTabPress={(id) => navigation.navigate(id)}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
        <View style={styles.header}>
            <View>
                <Text style={styles.title}>Import Card → Client Assignments</Text>
                <Text style={styles.subtitle}>Upload a CSV to assign RFID cards to clients in bulk.</Text>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity style={styles.secondaryBtn}>
                    <Text style={styles.secondaryBtnText}>Download Sample CSV</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.secondaryBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.secondaryBtnText}>Back to Cards</Text>
                </TouchableOpacity>
            </View>
        </View>

        <TouchableOpacity style={styles.uploadBox}>
            <View style={styles.uploadIconContainer}>
                <Icon name="cloud-upload-outline" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.uploadTitle}>Choose your CSV file</Text>
            <Text style={styles.uploadSubtitle}>Required columns: cardUid, client (client id or company name)</Text>
            <Text style={styles.uploadDetail}>Tip: client name matches are case-insensitive against companyName or legalName.</Text>
            
            <TouchableOpacity style={styles.chooseFileBtn}>
                <Text style={styles.chooseFileText}>Choose File</Text>
            </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>The import will:</Text>
            <View style={styles.infoList}>
                <Text style={styles.infoItem}>• Find card by cardUid</Text>
                <Text style={styles.infoItem}>• Resolve client by id or company/ legal name</Text>
                <Text style={styles.infoItem}>• Reuse existing Company Access user or create a new one for the client</Text>
                <Text style={styles.infoItem}>• Link the card's clientId and companyUserId</Text>
            </View>
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollArea: {
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  secondaryBtnText: {
    color: COLORS.text,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  uploadBox: {
    height: 340,
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  uploadIconContainer: {
    marginBottom: 20,
  },
  uploadIcon: {
    fontSize: 40,
    color: COLORS.textSecondary,
  },
  uploadTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  uploadSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginBottom: 4,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  uploadDetail: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  chooseFileBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  chooseFileText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  infoBox: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  infoTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginBottom: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
});

export default ImportAssignmentsScreen;
