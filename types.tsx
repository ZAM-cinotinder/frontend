/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {Dog, DogWithId} from './types/Dog';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootDrawerParamList {}
    // interface RootParamList extends RootStackParamList {}
  }
}

export type RootDrawerParamList = {
  Login: undefined;
// <<<<<<< Updated upstream
//   Register: undefined;
//   YourDogsListScreen: undefined;
//   ForgotPassword: undefined;
//   AddDogScreen: DogWithId | undefined;
//   MainSwipeDogsScreen: undefined;
//   SwipeDogsScreen: undefined;
// };
//
// export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
//   RootStackParamList,
//   Screen
// >;
//
// export type RootTabParamList = {
//   TabOne: undefined;
//   TabTwo: undefined;
//   YourDogsListScreen: undefined;
//   MainSwipeDogsScreen: undefined;
//   SwipeDogsScreen: undefined;
//   Login: undefined;
//   ForgotPassword: undefined;
// };
// =======
  Register: undefined;
  AddDogScreen: undefined;
  SwipeDogsScreen: undefined;
  YourDogsListScreen: undefined;
  ForgotPassword: undefined;
}

// export type RootStackParamList = {
//   Root: NavigatorScreenParams<RootTabParamList> | undefined;
//   Modal: undefined;
//   NotFound: undefined;
//   Login: undefined;
//   Register: undefined;
//   YourDogsListScreen: undefined;
//   ForgotPassword: undefined;
//   AddDogScreen: DogWithId | undefined;
// };
//
// export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
//   RootStackParamList,
//   Screen
// >;
//
// export type RootTabParamList = {
//   TabOne: undefined;
//   TabTwo: undefined;
//   YourDogsListScreen: undefined;
//   Login: undefined;
//   ForgotPassword: undefined;
// };
// >>>>>>> Stashed changes

// export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
//   BottomTabScreenProps<RootTabParamList, Screen>,
//   NativeStackScreenProps<RootStackParamList>
// >;
