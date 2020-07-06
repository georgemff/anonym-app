import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Authcontext from './Authcontext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens'
import { decode, encode } from 'base-64'
import { StatusBar } from 'react-native';
import { Colors } from './colors/Colors';
import { Provider } from 'react-redux';
import { store } from './store';
export default function App() {
  console.ignoredYellowBox = ['Setting a timer'];
  if (!global.btoa) { global.btoa = encode }

  if (!global.atob) { global.atob = decode }

  console.disableYellowBox = true;
  enableScreens();
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={Colors.primary} />
      <Provider store={store} >
        <NavigationContainer>
          <Authcontext />
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>

  );
}
