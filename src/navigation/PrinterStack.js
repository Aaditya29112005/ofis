import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrinterRequestsScreen from '../screens/Printer/PrinterRequestsScreen';
import CreatePrinterRequestScreen from '../screens/Printer/CreatePrinterRequestScreen';

const Stack = createNativeStackNavigator();

const PrinterStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PrinterRequestsList" component={PrinterRequestsScreen} />
      <Stack.Screen name="CreatePrinterRequest" component={CreatePrinterRequestScreen} />
    </Stack.Navigator>
  );
};

export default PrinterStack;
