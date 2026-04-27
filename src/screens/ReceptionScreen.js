import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing,
  withSpring,
  FadeInUp,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/GlassCard';
import Haptics from '../utils/Haptics';
import { safeRender } from '../utils/addressUtils';

const StatusBadge = ({ status }) => {
  const isPending = status.toLowerCase().includes('pending');
  const color = isPending ? '#0A84FF' : '#32D74B';
  const bgColor = isPending ? 'rgba(10, 132, 255, 0.12)' : 'rgba(50, 215, 75, 0.12)';

  return (
    <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text style={[styles.statusBadgeText, { color: color }]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
};

const VisitorCard = ({ name, id, email, host, status, date, index }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(0.96);
    Haptics.impactLight();
  };
  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 120).springify()}
      style={styles.cardWrapper}
    >
      <TouchableOpacity 
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Animated.View style={[styles.visitorCard, { backgroundColor: colors.surface + '80', borderColor: colors.glassBorder }, animatedCardStyle]}>
          <View style={styles.cardContent}>
            {/* Left Section: Visitor Info */}
            <View style={styles.cardLeft}>
              <Text style={[styles.visitorName, { color: colors.text }]} numberOfLines={1}>{safeRender(name)}</Text>
              <Text style={[styles.visitorContact, { color: colors.textMuted }]}>{safeRender(id || email)}</Text>
            </View>

            {/* Middle Section: Host & Status */}
             <View style={[styles.infoItem, { flex: 1 }]}>
                <Icon name="person-outline" size={14} color={colors.textMuted} />
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>HOST: </Text>
                <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">{safeRender(host)}</Text>
             </View>
              <StatusBadge status={status} />

            {/* Right Section: Date & Action */}
            <View style={styles.cardRight}>
              <Text style={[styles.cardDate, { color: colors.textMuted }]}>{date}</Text>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ReceptionScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Today');
  const { width } = useWindowDimensions();

  const visitors = [
    { name: 'Devaansh Kathuria', id: '123456789', host: 'Nasir Ansari', status: 'Pending', date: '16/03/2026' },
    { name: 'test123', id: '123123', host: 'test test', status: 'Pending', date: '16/03/2026' },
    { name: 'test', id: '123', host: 'Nasir Ansari', status: 'Pending', date: '16/03/2026' },
    { name: 'test', id: '9991112323', host: 'Nasir Ansari', status: 'Pending', date: '16/03/2026' },
    { name: 'Samarth Ahuja', email: 'nasir@flyde.in', host: 'Ritik Kansal', status: 'Pending', date: '16/03/2026' },
    { name: 'Live', email: 'legal@test.com', host: 'Ritik Kansal', status: 'Pending', date: '18/03/2026' },
  ];

  const { colors } = useTheme();
  const tabWidth = 100;
  const translateX = useSharedValue(0);

  const animatedUnderlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(translateX.value, { damping: 15 }) }],
  }));

  const onTabPress = (tab, index) => {
    setActiveTab(tab);
    translateX.value = index * tabWidth;
    Haptics.selection();
  };

  const renderTabs = () => (
    <View style={[styles.tabsWrapper, { backgroundColor: colors.surface }]}>
      <Animated.View style={[styles.tabUnderline, { width: tabWidth, backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }, animatedUnderlineStyle]} />
      {['Today', 'Pending', 'All'].map((tab, index) => (
        <TouchableOpacity 
          key={tab}
          onPress={() => onTabPress(tab, index)}
          style={[styles.tabBtn, { width: tabWidth }]}
        >
            <Text style={[styles.tabText, activeTab === tab && { color: colors.text, fontFamily: FONTS.bold }]}>
              {tab === 'Today' ? "Today" : tab === 'Pending' ? "Pending" : "All"}
            </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <DashboardLayout 
        activeTab="Reception" 
        onTabPress={(id) => navigation.navigate(id)}
    >
      <View style={styles.eliteHeader}>
        <View style={[styles.headerPill, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
            <Text style={[styles.headerDate, { color: colors.textSecondary }]}>18 March 2026</Text>
            <View style={[styles.headerDivider, { backgroundColor: colors.glassBorder }]} />
            <Icon name="cloud-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.headerTemp, { color: colors.textSecondary }]}>22°C</Text>
            <View style={[styles.headerDivider, { backgroundColor: colors.glassBorder }]} />
            <View style={[styles.communityInfo, { flexShrink: 1 }]}>
                <View style={[styles.communityIconBox, { backgroundColor: colors.glassBackground }]}>
                    <Icon name="business" size={14} color={COLORS.primary} />
                </View>
                <View style={{ flexShrink: 1 }}>
                    <Text style={[styles.communityLabel, { color: colors.textMuted }]} numberOfLines={1}>COMMUNITY</Text>
                    <Text style={[styles.communityName, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">Ofis Square</Text>
                </View>
            </View>
        </View>
      </View>

      <View style={styles.titleRow}>
        <View style={styles.titleMain}>
          <View>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">Reception</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">Manage visitor check-ins and check-outs</Text>
          </View>
          <TouchableOpacity 
            style={styles.inviteBtn}
            onPress={() => {
              Haptics.impactMedium();
              navigation.navigate('InviteVisitor');
            }}
          >
            <Icon name="add" size={20} color={COLORS.white} />
            <Text style={styles.inviteBtnText}>Invite</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerActions}>
          <View style={[styles.searchContainer, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
              <Icon name="search-outline" size={18} color={colors.textMuted} />
              <TextInput 
                  placeholder="Search by name, email..." 
                  placeholderTextColor={colors.textMuted}
                  style={[styles.searchInput, { color: colors.text }]}
              />
          </View>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
              <Icon name="refresh-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterStatsRow}>
        {renderTabs()}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollArea}
      >
          {visitors.map((v, idx) => (
              <VisitorCard key={idx} index={idx} {...v} />
          ))}
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  eliteHeader: {
    marginBottom: 32,
  },
  headerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  headerDate: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  headerDivider: {
    width: 1,
    height: 16,
    marginHorizontal: 16,
  },
  headerTemp: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    marginLeft: 8,
  },
  communityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  communityIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityLabel: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  communityName: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  titleRow: {
    flexDirection: 'column',
    gap: 20,
    marginBottom: 32,
  },
  titleMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginTop: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  filterStatsRow: {
    marginBottom: 24,
  },
  tabsWrapper: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    position: 'relative',
  },
  tabUnderline: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  tabBtn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabText: {
    fontSize: 13,
    color: '#8E8E93',
    fontFamily: FONTS.medium,
  },
  scrollArea: {
    paddingBottom: 100,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  visitorCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1.5,
  },
  cardMiddle: {
    flex: 1.2,
    gap: 16,
  },
  cardRight: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 16,
  },
  visitorName: {
    fontSize: 18,
    fontFamily: FONTS.semibold,
  },
  visitorContact: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginTop: 4,
  },
  hostContainer: {
    gap: 2,
  },
  hostLabel: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hostName: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  inviteBtn: {
    backgroundColor: '#FF8A00',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  inviteBtnText: {
    color: '#FFFFFF',
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  cardDate: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  actionBtn: {
    backgroundColor: '#FF8A00',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
});

export default ReceptionScreen;

