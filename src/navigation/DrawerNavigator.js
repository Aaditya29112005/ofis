import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuthStore } from '../store/useAuthStore';
import TabNavigator from './TabNavigator';
import TicketsScreen from '../screens/TicketsScreen';
import ReceptionDashboardScreen from '../screens/ReceptionDashboardScreen';
import RFIDCardsScreen from '../screens/Cards/RFIDCardsScreen';
import ClientsScreen from '../screens/ClientsScreen';
import LeadsScreen from '../screens/LeadsScreen';
import OnDemandUsersScreen from '../screens/OnDemandUsersScreen';
import BookDayPassScreen from '../screens/BookDayPassScreen';
import DayPassBookingsScreen from '../screens/DayPassBookingsScreen';
import MeetingRoomBookingsScreen from '../screens/MeetingRoomBookingsScreen';
import CreateMeetingBookingScreen from '../screens/MeetingRoom/CreateMeetingBookingScreen';
import MeetingRoomsScreen from '../screens/MeetingRoom/MeetingRoomsScreen';
import CommonAreasScreen from '../screens/CommonAreasScreen';
import EventsStack from './EventsStack';
import PrinterStack from './PrinterStack';
import PrinterRequestsScreen from '../screens/PrinterRequestsScreen'; // Old one, keeping for safety if referenced
import CabinsScreen from '../screens/CabinsScreen';
import GenericScreen from '../screens/GenericScreen';
import { COLORS } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { colors } = useTheme();
  const logout = useAuthStore(state => state.logout);
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <Sidebar 
          activeTab={props.state.routes[props.state.index].name} 
          onTabPress={(id) => {
              if (id === 'MainTabs') {
                  props.navigation.navigate('MainTabs', { screen: 'Dashboard' });
              } else {
                  props.navigation.navigate(id);
              }
          }} 
          onLogout={() => logout()}
        />
      )}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.grey,
        drawerStyle: {
          backgroundColor: colors.background,
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="Tickets" component={TicketsScreen} />
      <Drawer.Screen name="Reception" component={ReceptionDashboardScreen} />
      <Drawer.Screen name="Cards" component={RFIDCardsScreen} />
      <Drawer.Screen name="Clients" component={ClientsScreen} />
      <Drawer.Screen name="Leads" component={LeadsScreen} />
      <Drawer.Screen name="OnDemandUsers" component={OnDemandUsersScreen} options={{ title: 'On-demand Users' }} />
      <Drawer.Screen name="BookDayPass" component={BookDayPassScreen} options={{ title: 'Day Pass' }} />
      <Drawer.Screen name="DayPassBookings" component={DayPassBookingsScreen} options={{ title: 'Day Pass Bookings' }} />
      <Drawer.Screen name="MeetingRoomBookings" component={MeetingRoomBookingsScreen} options={{ title: 'Meeting Room Bookings' }} />
      <Drawer.Screen name="CreateMeetingBooking" component={CreateMeetingBookingScreen} options={{ title: 'New Meeting Booking', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="Bookings" component={GenericScreen} initialParams={{ title: 'Bookings' }} />
      <Drawer.Screen name="Events" component={EventsStack} options={{ title: 'Events Management' }} />
      <Drawer.Screen name="PrinterRequests" component={PrinterStack} options={{ title: 'Printer Requests' }} />
      <Drawer.Screen name="Inventory" component={GenericScreen} initialParams={{ title: 'Inventory' }} />
      <Drawer.Screen name="Reports" component={GenericScreen} initialParams={{ title: 'Reports & Analytics' }} />
      <Drawer.Screen name="Cabins" component={CabinsScreen} />
      <Drawer.Screen name="MeetingRoomsInventory" component={MeetingRoomsScreen} options={{ title: 'Meeting Rooms' }} />
      <Drawer.Screen name="CommonAreas" component={CommonAreasScreen} options={{ title: 'Common Areas' }} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
