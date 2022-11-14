import { StyleSheet, TouchableOpacity, Image } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import {auth} from '../constants/firebase';

import { signInWithEmailAndPassword } from "firebase/auth";
import { Button, TextInput } from 'react-native-paper';
import { useState } from 'react'; 
import { Formik } from 'formik';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Toast from 'react-native-toast-message';


export const LoginScreen = ({ navigation }: RootStackScreenProps<'Login'>) => {
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const logIn = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;

        setUser(JSON.stringify(user));
        Toast.show({
            type: 'success',
            text1: 'Logged in 🎉',
            text2: 'You are logged in',
        });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        if(errorCode === 'auth/user-not-found'){
          Toast.show({
              type: 'error',
              text1: 'User not found ❌',
              text2: 'Create an account first',
          });
        } else
         Toast.show({
            type: 'error',
            text1: 'Unknown error ❌',
            text2: error.message,
        });

        setError(JSON.stringify(error));
        // ..
      });
    }

  return (
    <View style={styles.container}>
    <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Log in</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={values => logIn(values.email, values.password)}
        >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.form}>
            <TextInput
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email} 
              style={styles.input}
              placeholder="Email"
              textContentType="emailAddress"
            />
            <TextInput
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry={secureTextEntry} 
              style={styles.input}
              placeholder="password"

              right={
                <TextInput.Icon
                  icon={secureTextEntry ? "eye" : "eye-off"}
                  onPress={() => {
                    setSecureTextEntry(!secureTextEntry);
                    return false;
                  }}
                />
              }
            />
            <Text style={styles.linkText} onPress={() => navigation.navigate('ForgotPassword')}>Forgot password?</Text>
            <Button onPress={handleSubmit} mode="contained" style={styles.button}>Log in</Button>
            <Button onPress={() => navigation.navigate('Register')} mode="contained" style={styles.button}>Create account</Button>
          </View>
        )}
        </Formik>

        <Image source={require('../assets/psy/tmpl3guvqti.png')} style={styles.backgroundImg} />
        {/* <Text style={styles.linkText}>{user}</Text>
        <Text style={styles.linkText}>{error}</Text> */}
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
  form: {
    // flex: 1,
    backgroundColor: 'transparent',
    width: '80%',
    padding: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 200,
    // height: 20,
  },
  backgroundImg: {
    position: 'absolute',
    bottom: '-10%',
    right: '-15%',
    zIndex: -1,
    opacity: 0.08,
    // width: '70%'
  },
  input: {
    width: '100%',
    margin: 3,
  },
  button: {
    margin: 3,
  },
  logo: {
    margin: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
    marginBottom: 12,
  },
});
