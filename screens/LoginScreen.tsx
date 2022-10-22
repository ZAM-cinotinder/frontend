import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';


import {  GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { useState } from 'react';
import { Button } from 'react-native-paper';
import {auth, provider} from '../config/firebase';


export const LoginScreen = ({ navigation }: RootStackScreenProps<'Login'>) => {
  const [user, setUser] = useState<any | null>(null);

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
    // signInWithRedirect(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        setUser(user);
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>LOGOWANIE</Text>
      <Button onPress={signInWithGoogle} mode="contained">LOGIN with button</Button>
      <TouchableOpacity onPress={() => navigation.replace('Root')} style={styles.link}>
        <Text style={styles.linkText}>{JSON.stringify(user)}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
