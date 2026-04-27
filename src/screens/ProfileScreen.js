import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import Animated, { 
  FadeInDown,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { Calendar, Cloud, Building2, LogOut, ShieldCheck, FileText, Headphones, ArrowRight } from 'lucide-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { FONTS } from '../theme/typography';
import { COLORS } from '../theme/colors';
import DashboardLayout from '../components/DashboardLayout';
import ProfileCard from '../components/Profile/ProfileCard';
import PreferenceItem from '../components/Profile/PreferenceItem';
import AccountSkeleton from '../components/Profile/AccountSkeleton';
import EditProfileModal from '../modals/EditProfileModal';
import { useTheme } from '../context/ThemeContext';
import { useAuthStore } from '../store/useAuthStore';

const AccountSettingsScreen = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const logout = useAuthStore(state => state.logout);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "Nasir Ansari",
    role: "Regional Administrator",
    email: "nasir@ofissquare.com",
    mobile: "+91 98765 43210"
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    ReactNativeHapticFeedback.trigger('notificationError');
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: () => logout()
        }
      ]
    );
  };

  const handleSecurityAction = (title) => {
    ReactNativeHapticFeedback.trigger('impactLight');
    Alert.alert(
      title,
      "This section is currently under maintenance. Please check back soon.",
      [{ text: "OK" }]
    );
  };

  const renderHeader = () => (
    <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.header}>

      
      <Text style={[styles.pageTitle, { color: colors.text }]}>Account Settings</Text>
      <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>Personalize your workspace experience</Text>
    </Animated.View>
  );

  const SectionTitle = ({ title, delay }) => (
    <Animated.Text 
      entering={FadeInDown.duration(600).delay(delay)} 
      style={[styles.sectionTitle, { color: colors.textMuted }]}
    >
      {title}
    </Animated.Text>
  );

  const ActionRow = ({ icon: Icon, title, onPress, delay }) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }]
    }));

    return (
      <Animated.View entering={FadeInDown.duration(600).delay(delay)} style={animatedStyle}>
        <TouchableOpacity 
          style={styles.actionRow} 
          onPress={() => onPress ? onPress() : handleSecurityAction(title)}
          activeOpacity={1}
          onPressIn={() => (scale.value = withSpring(0.96))}
          onPressOut={() => (scale.value = withSpring(1))}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(255, 126, 21, 0.08)' : 'rgba(255, 126, 21, 0.1)', borderColor: 'rgba(255, 126, 21, 0.1)' }]}>
              <Icon size={18} color={COLORS.primary} />
            </View>
            <Text style={[styles.actionTitle, { color: colors.text }]}>{title}</Text>
          </View>
          <ArrowRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <DashboardLayout activeTab="Profile">
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {loading ? (
            <View style={{ padding: 20 }}>
              <AccountSkeleton />
            </View>
          ) : (
            <View style={styles.mainContent}>
              {renderHeader()}

              <Animated.View entering={FadeInDown.duration(600).delay(200)} layout={Layout.springify()}>
                <ProfileCard 
                  {...userData}
                  onEdit={() => setIsEditModalVisible(true)}
                />
              </Animated.View>

              <SectionTitle title="PREFERENCES" delay={300} />
              <Animated.View entering={FadeInDown.duration(600).delay(400)} style={[styles.settingsGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <PreferenceItem 
                  title="Push Notifications"
                  subtitle="Receive real-time alerts for bookings"
                  value={notifications}
                  onValueChange={setNotifications}
                />
                <View style={[styles.rowDivider, { backgroundColor: colors.divider }]} />
                <PreferenceItem 
                  title="Biometric Login"
                  subtitle="Use FaceID or TouchID to access"
                  value={biometrics}
                  onValueChange={setBiometrics}
                />
                <View style={[styles.rowDivider, { backgroundColor: colors.divider }]} />
                <PreferenceItem 
                  title="Dark Mode"
                  subtitle="Toggle application appearance"
                  value={isDark}
                  onValueChange={toggleTheme}
                />
              </Animated.View>

              <SectionTitle title="SECURITY & SUPPORT" delay={500} />
              <Animated.View entering={FadeInDown.duration(600).delay(600)} style={[styles.settingsGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <ActionRow icon={ShieldCheck} title="Password & Security" />
                <View style={[styles.rowDivider, { backgroundColor: colors.divider }]} />
                <ActionRow icon={FileText} title="Documents & Policies" />
                <View style={[styles.rowDivider, { backgroundColor: colors.divider }]} />
                <ActionRow icon={Headphones} title="Customer Support" />
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(600).delay(700)}>
                <TouchableOpacity 
                  style={[styles.logoutBtn, { backgroundColor: isDark ? 'rgba(229, 67, 57, 0.05)' : 'rgba(229, 67, 57, 0.08)', borderColor: isDark ? 'rgba(229, 67, 57, 0.15)' : 'rgba(229, 67, 57, 0.2)' }]} 
                  onPress={handleLogout}
                  activeOpacity={0.8}
                >
                  <LogOut size={20} color={COLORS.error} />
                  <Text style={[styles.logoutText, { color: COLORS.error }]}>Sign Out</Text>
                </TouchableOpacity>
              </Animated.View>

              <Text style={[styles.versionText, { color: colors.textMuted }]}>Version 2.4.0 (Build 128)</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <EditProfileModal 
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        initialData={userData}
        onSave={(newData) => setUserData({...userData, ...newData})}
      />
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollArea: {
    paddingBottom: 140,
  },
  mainContent: {
    padding: 0,
  },
  header: {
    marginBottom: 32,
  },
  topInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  infoDivider: {
    width: 1,
    height: 12,
    marginHorizontal: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    marginBottom: 16,
    marginTop: 8,
    marginLeft: 0,
  },
  settingsGroup: {
    borderRadius: 24,
    padding: 8,
    borderWidth: 1.5,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  rowDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    gap: 10,
    marginTop: 10,
  },
  logoutText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 32,
  },
});

export default AccountSettingsScreen;
