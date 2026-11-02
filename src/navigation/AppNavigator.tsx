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
          backgroundColor: '#000000', 
          elevation: 0,               
          shadowOpacity: 0,           
          borderBottomWidth: 1,
          borderBottomColor: '#1a1a1a', 
        },
        headerTintColor: '#8DEAE7',     
        headerTitleStyle: { 
          fontWeight: '900',
          fontSize: 20,
        },
        cardStyle: { backgroundColor: '#000000' }, 
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'ARMWRESLING TRACKER' }} 
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
