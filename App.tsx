import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { View } from 'react-native';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000000', 
    card: '#000000',       
    text: '#8DEAE7',       
    border: '#1a1a1a',
  },
};

export default function App() {


  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
        <StatusBar style="light" />
        <NavigationContainer theme={MyTheme}>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
