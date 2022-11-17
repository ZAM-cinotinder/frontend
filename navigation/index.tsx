import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import {LoginScreen} from '../screens/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen';
import {ForgotPasswordScreen} from '../screens/ForgotPasswordScreen';
import { useAuthentication } from '../hooks/useAuthentication';
import {YourDogsListScreen} from '../screens/YourDogsListScreen';
import {AddDogScreen} from '../screens/AddDogScreen';
import {SwipeDogsScreen} from '../screens/SwipeDogsScreen';

export default function Navigation() {
  const { user } = useAuthentication();
  return user ? <UserStack /> : <AuthStack />;
}

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function UserStack() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home" useLegacyImplementation={true}>
        <Drawer.Screen name="YourDogsListScreen" component={YourDogsListScreen} options={{ headerShown: true }} />
        <Drawer.Screen name="SwipeDogsScreen" component={SwipeDogsScreen} options={{ headerShown: true }} />
        <Drawer.Screen name="AddDogScreen" component={AddDogScreen} options={{ headerShown: true }} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

function AuthStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
