import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Image, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { 
    FadeInUp, 
    FadeOut,
    Layout, 
    useAnimatedStyle, 
    useSharedValue, 
    withSpring,
    withTiming,
    interpolateColor
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/GlassCard';
import Haptics from '../utils/Haptics';
import { safeRender } from '../utils/addressUtils';

const PrinterRequestCard = ({ fileName, client, building, status, credits, requestedDate, onViewFile, index }) => {
    const { colors, isDark } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const isCompleted = status === 'COMPLETED';

    return (
        <Animated.View 
            entering={FadeInUp.delay(index * 100).springify()}
            style={styles.cardWrapper}
        >
            <GlassCard style={[styles.requestCard, { borderColor: '#1F1F1F' }]}>
                <View style={styles.cardContent}>
                    <View style={styles.fileHeader}>
                        <Icon name="document-text" size={20} color="#FF8A00" />
                        <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>{fileName}</Text>
                    </View>

                    <View style={styles.clientSection}>
                        <Text style={[styles.clientName, { color: colors.textSecondary }]} numberOfLines={2}>
                            {safeRender(client)}
                        </Text>
                        <Text style={[styles.buildingName, { color: colors.textMuted }]} numberOfLines={1}>
                            {safeRender(building)}
                        </Text>
                    </View>

                    <View style={styles.metaRow}>
                        <View style={[styles.statusPill, { backgroundColor: isCompleted ? 'rgba(255,138,0,0.12)' : (isDark ? '#1F1F1F' : '#F1F3F5') }]}>
                            <Text style={[styles.statusPillText, { color: isCompleted ? '#FF8A00' : '#A1A1AA' }]}>{status}</Text>
                        </View>
                        <Text style={[styles.dateText, { color: colors.textMuted }]}>{requestedDate}</Text>
                    </View>

                    <Animated.View style={[styles.actionWrapper, animatedStyle]}>
                        <TouchableOpacity 
                            style={styles.viewBtn}
                            onPressIn={() => {
                                Haptics.impactLight();
                                scale.value = withSpring(0.96);
                            }}
                            onPressOut={() => (scale.value = withSpring(1))}
                            onPress={() => onViewFile(fileName)}
                        >
                            <Text style={styles.viewBtnText}>View File</Text>
                            <Icon name="arrow-forward" size={16} color={COLORS.black} />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </GlassCard>
        </Animated.View>
    );
};

const PDFViewerModal = ({ visible, onClose, fileName }) => {
    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={[styles.pdfOverlay, { backgroundColor: 'rgba(0,0,0,0.98)' }]}>
                <View style={[styles.pdfContainer, { backgroundColor: colors.surface }]}>
                    <View style={[styles.pdfHeader, { borderBottomColor: colors.border }]}>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Icon name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.pdfTitle, { color: colors.text }]} numberOfLines={1}>{fileName}</Text>
                        <TouchableOpacity style={styles.downloadBtn}>
                            <Icon name="download-outline" size={22} color="#FF8A00" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView centerContent showsVerticalScrollIndicator={false}>
                        <Image 
                            source={{ uri: 'https://ik.imagekit.io/flyde/printer_requests/PE_TM_Step_By_Step_Guide_DjvzswO2v.pdf?tr=w-1000' }}
                            style={[styles.pdfPage, { width: width - 32, height: (width - 32) * 1.4 }]}
                            resizeMode="contain"
                        />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const FilterDropdown = ({ label, value, options, isOpen, onToggle, onSelect }) => {
    const { colors } = useTheme();
    return (
        <View style={styles.filterBox}>
            <Text style={[styles.filterLabel, { color: colors.textMuted }]}>{label}</Text>
            <TouchableOpacity 
                style={[styles.filterTrigger, { backgroundColor: colors.surface, borderColor: colors.border }]} 
                onPress={onToggle}
            >
                <Text style={[styles.filterValue, { color: colors.textSecondary }]}>{value}</Text>
                <Icon name="chevron-down" size={14} color={colors.textMuted} />
            </TouchableOpacity>
            {isOpen && (
                <View style={[styles.dropdown, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
                    {options.map((opt, i) => (
                        <TouchableOpacity key={i} style={styles.dropdownItem} onPress={() => onSelect(opt)}>
                            <Text style={[styles.dropdownText, { color: value === opt ? '#FF8A00' : colors.textSecondary }]}>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const PrinterRequestsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filters, setFilters] = useState({
    building: 'All Buildings',
    status: 'All Status'
  });

  const requests = [
    { 
        fileName: 'Invoice_March_2026.pdf', 
        client: 'Global Tech Solutions Inc.', 
        building: 'Ofis Square Elite', 
        status: 'COMPLETED', 
        requestedDate: '18 Mar 2026' 
    },
    { 
        fileName: 'Project_Proposal_v2.pdf', 
        client: 'Design Craft Studio', 
        building: 'Creative Hub', 
        status: 'PENDING', 
        requestedDate: '19 Mar 2026' 
    },
  ];

  const handleViewFile = (file) => {
    setSelectedFile(file);
    setIsViewerVisible(true);
  };

  return (
    <DashboardLayout 
        activeTab="PrinterRequests" 
        onTabPress={(id) => {
            Haptics.selection();
            navigation.navigate(id);
        }}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Printer Requests</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage and oversee community print jobs</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Icon name="search-outline" size={18} color={colors.textMuted} />
            <TextInput 
                placeholder="Search by file or client..." 
                placeholderTextColor={colors.textMuted} 
                style={[styles.searchInput, { color: colors.text }]} 
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>
      </View>

      <View style={styles.filtersRow}>
        <FilterDropdown 
            label="Building"
            value={filters.building}
            options={['All Buildings', 'Elite Hub', 'Central Tower']}
            isOpen={activeDropdown === 'building'}
            onToggle={() => setActiveDropdown(activeDropdown === 'building' ? null : 'building')}
            onSelect={(val) => {
                setFilters({...filters, building: val});
                setActiveDropdown(null);
            }}
        />
        <FilterDropdown 
            label="Status"
            value={filters.status}
            options={['All Status', 'Pending', 'Completed']}
            isOpen={activeDropdown === 'status'}
            onToggle={() => setActiveDropdown(activeDropdown === 'status' ? null : 'status')}
            onSelect={(val) => {
                setFilters({...filters, status: val});
                setActiveDropdown(null);
            }}
        />
      </View>

      <View style={styles.metaRow}>
          <Text style={[styles.resultsCount, { color: colors.textMuted }]}>
            Showing {requests.length} of {requests.length} requests
          </Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {requests.map((item, index) => (
            <PrinterRequestCard 
                key={index} 
                {...item} 
                index={index} 
                onViewFile={handleViewFile} 
            />
        ))}
      </ScrollView>

      <PDFViewerModal 
        visible={isViewerVisible} 
        onClose={() => setIsViewerVisible(false)} 
        fileName={selectedFile}
      />
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginTop: 4,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontFamily: FONTS.medium,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    zIndex: 100,
  },
  filterBox: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  filterTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  filterValue: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  metaRow: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  resultsCount: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  requestCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  fileName: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    flex: 1,
  },
  clientSection: {
    marginBottom: 20,
  },
  clientName: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    lineHeight: 22,
    marginBottom: 4,
  },
  buildingName: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  actionWrapper: {
    width: '100%',
  },
  viewBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewBtnText: {
    color: COLORS.black,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  pdfOverlay: {
    flex: 1,
    justifyContent: 'center',
  },
  pdfContainer: {
    flex: 1,
  },
  pdfHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  pdfTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  pdfPage: {
    alignSelf: 'center',
    marginVertical: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
});

export default PrinterRequestsScreen;
