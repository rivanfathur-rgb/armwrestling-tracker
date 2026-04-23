import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ProgramDetailScreen } from '../screens/ProgramDetailScreen';
import { ExerciseDetailScreen } from '../screens/ExerciseDetailScreen';

export type RootStackParamList = {
  Home: undefined;
  ProgramDetail: { programId: string; programName: string };
  ExerciseDetail: { programId: string; exerciseId: string; exerciseName: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000000', // Hitam murni untuk Header
          elevation: 0,               // Hilangkan bayangan di Android
          shadowOpacity: 0,           // Hilangkan bayangan di iOS
          borderBottomWidth: 1,
          borderBottomColor: '#1a1a1a', // Garis bawah sangat tipis agar tidak kontras
        },
        headerTintColor: '#8DEAE7',     // Teks header jadi Emas
        headerTitleStyle: { 
          fontWeight: '900',
          fontSize: 20,
        },
        cardStyle: { backgroundColor: '#000000' }, // Hitam murni untuk semua layar
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'ARMWRESLING TRACKER' }} // Judul lebih gahar
      />
      <Stack.Screen 
        name="ProgramDetail" 
        component={ProgramDetailScreen} 
        options={({ route }) => ({ title: route.params.programName })} 
      />
      <Stack.Screen 
        name="ExerciseDetail" 
        component={ExerciseDetailScreen} 
        options={({ route }) => ({ title: route.params.exerciseName })} 
      />
    </Stack.Navigator>
  );
};