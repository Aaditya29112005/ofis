import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/useAuthStore';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import CreateAccountScreen from '../screens/Auth/CreateAccountScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import DrawerNavigator from './DrawerNavigator';
import CreateTicketScreen from '../screens/CreateTicketScreen';
import TicketDetailsScreen from '../screens/TicketDetailsScreen';
import EditTicketScreen from '../screens/EditTicketScreen';
import InviteVisitorScreen from '../screens/InviteVisitorScreen';
import ImportRFIDScreen from '../screens/Cards/ImportRFIDScreen';
import ImportAssignmentsScreen from '../screens/Cards/ImportAssignmentsScreen';
import CreateLeadScreen from '../screens/CreateLeadScreen';
import CreateEventScreen from '../screens/Events/CreateEventScreen';
import PrinterStack from './PrinterStack';
import BillingScreen from '../screens/BillingScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={CreateAccountScreen} />
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
          <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
          <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} />
          <Stack.Screen name="EditTicket" component={EditTicketScreen} />
          <Stack.Screen name="InviteVisitor" component={InviteVisitorScreen} />
          <Stack.Screen name="ImportRFID" component={ImportRFIDScreen} />
          <Stack.Screen name="ImportAssignments" component={ImportAssignmentsScreen} />
          <Stack.Screen name="CreateLead" component={CreateLeadScreen} />
          <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
          <Stack.Screen name="PrinterStack" component={PrinterStack} />
          <Stack.Screen name="Billing" component={BillingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
