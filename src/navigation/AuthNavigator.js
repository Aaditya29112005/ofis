import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import CreateAccountScreen from '../screens/Auth/CreateAccountScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import CreateTicketScreen from '../screens/CreateTicketScreen';
import InviteVisitorScreen from '../screens/InviteVisitorScreen';
import ImportRFIDScreen from '../screens/ImportRFIDScreen';
import ImportAssignmentsScreen from '../screens/ImportAssignmentsScreen';
import CreateLeadScreen from '../screens/CreateLeadScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={CreateAccountScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
      <Stack.Screen name="InviteVisitor" component={InviteVisitorScreen} />
      <Stack.Screen name="ImportRFID" component={ImportRFIDScreen} />
      <Stack.Screen name="ImportAssignments" component={ImportAssignmentsScreen} />
      <Stack.Screen name="CreateLead" component={CreateLeadScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
