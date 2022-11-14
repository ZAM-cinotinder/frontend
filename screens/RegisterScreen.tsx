import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {  ref, set } from "firebase/database";

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import {auth, database} from '../constants/firebase';

import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {Button, TextInput} from 'react-native-paper';
import { useState } from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Toast from 'react-native-toast-message';

const SignupSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Too Short!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});


export const RegisterScreen = ({ navigation }: RootStackScreenProps<'Register'>) => {
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const pushToDatabase = (email:string,userId:string) =>{
    const userInDatabase = {
      email: email,
    }
    set(ref(database, 'users/' + userId), userInDatabase);
  }

  const signUpIn = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;

        setUser(JSON.stringify(user));
        Toast.show({
            type: 'success',
            text1: 'Account created 🎉',
        });

        pushToDatabase(email, user.uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if(errorCode === 'auth/email-already-in-use'){
          Toast.show({
              type: 'error',
              text1: 'Email already exist ❌',
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
      <Text style={styles.title}>Sign up</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={values => signUpIn(values.email, values.password)}
        validationSchema={SignupSchema}
        >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email} 
              style={styles.input}
              placeholder="Email"
              error={Boolean(errors.email && touched.email)}
            />
            {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}
            <TextInput
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry={secureTextEntry} 
              style={styles.input}
              placeholder="password"
              error={Boolean(errors.password && touched.password)}

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
            {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}
            <Button onPress={handleSubmit} mode="contained" style={styles.firstButton}>Create account</Button>
            <Button onPress={() => navigation.navigate('Login')} mode="contained" style={styles.button}>Log in</Button>
          </View>
        )}
        </Formik>

        <Image source={require('../assets/psy/tmpkteo13bp.png')} style={styles.backgroundImg} />
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
    right: '0%',
    left: '0%',
    zIndex: -1,
    // width: '70%'
  },
  input: {
    width: '100%',
    margin: 3,
  },
  firstButton: {
      margin: 3,
      marginTop: 12,
  },
  error: {
    color: 'red',
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
