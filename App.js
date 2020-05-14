import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Authcontext from './Authcontext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens'
import { decode, encode } from 'base-64'
import { StatusBar } from 'react-native';
import { Colors } from './colors/Colors';


export default function App() {
  console.ignoredYellowBox = ['Setting a timer'];
  if (!global.btoa) { global.btoa = encode }

  if (!global.atob) { global.atob = decode }

  console.disableYellowBox = true;
  enableScreens();
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={Colors.primary} />
      <NavigationContainer>
        <Authcontext />
      </NavigationContainer>
    </SafeAreaProvider>

  );
}
