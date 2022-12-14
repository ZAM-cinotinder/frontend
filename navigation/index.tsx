/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";
import { useAuthentication } from "../hooks/useAuthentication";
import { YourDogsListScreen } from "../screens/YourDogsListScreen";
import { AddDogScreen } from "../screens/AddDogScreen";
import { SwipeDogsScreen } from "../screens/SwipeDogsScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ChatListScreen } from "../screens/ChatListScreen";
import { ChatViewScreen } from "../screens/ChatViewScreen";
import { UpdateUserProfileScreen } from "../screens/UpdateUserProfileScreen";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const { user } = useAuthentication();
  return user ? (
    <UserStack colorScheme={colorScheme} />
  ) : (
    <AuthStack colorScheme={colorScheme} />
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function UserStack({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: "Oops!" }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "login!" }}
        />
        <Stack.Screen name="AddDogScreen" component={AddDogScreen} />
        <Stack.Screen name="SwipeDogsScreen" component={SwipeDogsScreen} />
        <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
        <Stack.Screen name="ChatViewScreen" component={ChatViewScreen} />
        <Stack.Screen
          name="UpdateUserProfileScreen"
          component={UpdateUserProfileScreen}
        />
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen name="Modal" component={ModalScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function AuthStack({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const Drawer = createDrawerNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Drawer.Navigator initialRouteName="TabOne">
      <Drawer.Screen
        name="SwipeDogsScreen"
        component={SwipeDogsScreen}
        options={{
          title: "Znajd????psa",
        }}
      />
      <Drawer.Screen
        name="YourDogsListScreen"
        component={YourDogsListScreen}
        options={{
          title: "Twoje psy",
        }}
      />
      <Drawer.Screen
        name="ChatListScreen"
        component={ChatListScreen}
        options={{
          title: "Wiadomo??ci",
        }}
      />
      <Drawer.Screen
        name="UpdateUserProfileScreen"
        component={UpdateUserProfileScreen}
        options={{
          title: "Edycja profilu",
        }}
      />
    </Drawer.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
