import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventsListScreen from '../screens/Events/EventsListScreen';
import CreateEventScreen from '../screens/Events/CreateEventScreen';
import RSVPListScreen from '../screens/Events/RSVPListScreen';

const Stack = createNativeStackNavigator();

const EventsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventsList" component={EventsListScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="RSVPList" component={RSVPListScreen} />
    </Stack.Navigator>
  );
};

export default EventsStack;
