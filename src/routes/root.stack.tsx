import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import { BottomTabNavigator } from './bottom-tabs.routes';

import CategoriaFormScreen from '@screens/CategoriaFormScreen';
import BancoDadosScreen from '@screens/BancoDadosScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabNavigator} />
      <Stack.Screen name="CategoriaForm" component={CategoriaFormScreen} />
      <Stack.Screen name="BancoDados" component={BancoDadosScreen} />
    </Stack.Navigator>
  );
}
