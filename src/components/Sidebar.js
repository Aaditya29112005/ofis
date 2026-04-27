import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import { SPACING } from '../theme/spacing';

const NAV_ITEMS = [
  { id: 'MainTabs', label: 'Dashboard', icon: 'grid-outline' },
  { id: 'Tickets', label: 'Tickets', icon: 'ticket-outline' },
  { id: 'Reception', label: 'Reception', icon: 'business-outline' },
  { id: 'Cards', label: 'Cards', icon: 'card-outline' },
  { id: 'Clients', label: 'Clients', icon: 'people-outline' },
  { id: 'Leads', label: 'Leads', icon: 'trending-up-outline' },
  { id: 'OnDemandUsers', label: 'On-demand Users', icon: 'person-outline' },
  { id: 'Bookings', label: 'Bookings', icon: 'calendar-outline', hasSubmenu: true, subItems: [
    { id: 'BookDayPass', label: 'Day Pass' },
    { id: 'DayPassBookings', label: 'Day Pass Bookings' },
    { id: 'MeetingRoomBookings', label: 'Meeting Room Bookings' },
  ]},
  { id: 'Events', label: 'Events', icon: 'megaphone-outline' },
  { id: 'PrinterRequests', label: 'Printer Requests', icon: 'print-outline' },
  { id: 'Inventory', label: 'Inventory', icon: 'layers-outline', hasSubmenu: true, subItems: [
    { id: 'Cabins', label: 'Cabins' },
    { id: 'MeetingRoomsInventory', label: 'Meeting Rooms' },
    { id: 'CommonAreas', label: 'Common Areas' },
  ]},
];

const Sidebar = ({ activeTab, onTabPress, isCollapsed, onToggleCollapse, onLogout }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = React.useState('Bookings');

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: () => onLogout && onLogout() 
        }
      ]
    );
  };

  return (
    <View style={[
      styles.container, 
      isCollapsed && styles.containerCollapsed, 
      { 
        backgroundColor: colors.surface, 
        borderRightColor: colors.border,
        paddingTop: Math.max(insets.top, 24) 
      }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoSlot}>
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>O</Text>
          </View>
          {!isCollapsed && <Text style={[styles.logoText, { color: colors.text }]}>OFISSQUARE</Text>}
        </View>
        <TouchableOpacity 
          style={styles.collapseBtn} 
          onPress={onToggleCollapse}
        >
          <Icon name={isCollapsed ? 'chevron-forward' : 'chevron-back'} size={12} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id || 
                           (item.hasSubmenu && item.subItems?.some(sub => sub.id === activeTab)) ||
                           (item.id === 'Events' && (activeTab === 'Events' || activeTab === 'EventsList' || activeTab === 'CreateEvent' || activeTab === 'RSVPList')) ||
                           (item.id === 'PrinterRequests' && (activeTab === 'PrinterRequests' || activeTab === 'PrinterRequestsList' || activeTab === 'CreatePrinterRequest')) ||
                           (item.id === 'MeetingRoomsInventory' && (activeTab === 'MeetingRoomsInventory' || activeTab === 'MeetingRooms' || activeTab === 'CreateMeetingBooking')) ||
                           (item.id === 'Inventory' && (activeTab === 'CommonAreas' || activeTab === 'Cabins' || activeTab === 'MeetingRoomsInventory'));
          
          return (
            <View key={item.id} style={styles.itemWrapper}>
              <TouchableOpacity
                style={[
                  styles.navItem,
                  isActive && { backgroundColor: COLORS.primary + '12' },
                  isCollapsed && styles.navItemCollapsed
                ]}
                onPress={() => {
                  if (item.hasSubmenu) {
                    setExpanded(expanded === item.id ? null : item.id);
                  } else {
                    onTabPress(item.id);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, isActive && { backgroundColor: COLORS.primary + '18' }]}>
                  <Icon 
                    name={isActive ? item.icon.replace('-outline', '') : item.icon} 
                    size={18} 
                    color={isActive ? COLORS.primary : colors.textMuted} 
                  />
                </View>
                {!isCollapsed && (
                  <>
                    <Text style={[
                      styles.navLabel,
                      { color: isActive ? COLORS.primary : colors.textSecondary },
                      isActive && { fontFamily: FONTS.semibold }
                    ]}>
                      {item.label}
                    </Text>
                    {item.hasSubmenu && (
                      <Icon 
                        name={expanded === item.id ? 'remove' : 'add'} 
                        size={16} 
                        color={isActive ? COLORS.primary : colors.textMuted} 
                      />
                    )}
                  </>
                )}
              </TouchableOpacity>
              
              {!isCollapsed && item.hasSubmenu && expanded === item.id && item.subItems && (
                <View style={styles.submenu}>
                  {item.subItems.map((sub) => (
                    <TouchableOpacity 
                      key={sub.id} 
                      style={styles.submenuItem}
                      onPress={() => onTabPress(sub.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.submenuDot, { backgroundColor: activeTab === sub.id ? COLORS.primary : colors.border }]} />
                      <Text style={[
                        styles.submenuLabel, 
                        { color: activeTab === sub.id ? colors.text : colors.textSecondary }, 
                        activeTab === sub.id && { fontFamily: FONTS.semibold }
                      ]}>
                        {sub.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.logoutBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)' }]} 
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <Icon name="log-out-outline" size={18} color={colors.textSecondary} />
          {!isCollapsed && <Text style={[styles.logoutText, { color: colors.textSecondary }]}>Logout</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    borderRightWidth: 1,
    width: 280,
  },
  containerCollapsed: {
    width: 80,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  logoText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    letterSpacing: 1.5,
  },
  collapseBtn: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -12,
    zIndex: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  itemWrapper: {
    marginBottom: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  navItemCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
    marginHorizontal: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  navLabel: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    flex: 1,
  },
  submenu: {
    paddingLeft: 54,
    marginTop: 2,
    marginBottom: 6,
  },
  submenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  submenuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 10,
  },
  submenuLabel: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    borderTopWidth: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  logoutText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
});

export default Sidebar;
