import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './components/Home';
import Shared from './components/Shared';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            animation: 'fade',
            headerShown: false,
          }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Expanded_Image"
            component={Shared}
            options={{
              presentation: 'transparentModal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
