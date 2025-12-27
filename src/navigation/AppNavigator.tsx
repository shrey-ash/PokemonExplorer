/**
 * Main navigation container and stack configuration.
 * Uses React Navigation's native stack for type-safe navigation.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PokemonListScreen, PokemonDetailScreen } from '../screens';
import { RootStackParamList } from '../types';
import Colors from '../utils/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * AppNavigator - Main navigation container and stack configuration
 * 
 * Screens:
 * - PokemonList: Main list screen (initial route)
 * - PokemonDetail: Detail view for selected Pokemon
 */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PokemonList"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background ?? '#0D1B2A',
          },
        }}
      >
        <Stack.Screen
          name="PokemonList"
          component={PokemonListScreen}
          options={{
            title: 'Pokédex',
          }}
        />

        <Stack.Screen
          name="PokemonDetail"
          component={PokemonDetailScreen}
          options={{
            title: 'Pokemon Details',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

