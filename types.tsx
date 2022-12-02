/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Dog, DogWithId } from "./types/Dog";
import { ChatScreenProps } from "./types/Chat";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  Login: undefined;
  Register: undefined;
  YourDogsListScreen: undefined;
  ForgotPassword: undefined;
  AddDogScreen: DogWithId | undefined;
  MainSwipeDogsScreen: undefined;
  SwipeDogsScreen: undefined;
  ChatListScreen: undefined;
  ChatViewScreen: ChatScreenProps;
  UpdateUserProfileScreen: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
  YourDogsListScreen: undefined;
  MainSwipeDogsScreen: undefined;
  SwipeDogsScreen: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ChatListScreen: undefined;
  ChatViewScreen: ChatScreenProps;
  UpdateUserProfileScreen: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
