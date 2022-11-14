import { StyleSheet, TouchableOpacity, Image } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import {auth} from '../constants/firebase';

import { signInWithEmailAndPassword } from "firebase/auth";
import { Button, TextInput, Snackbar } from 'react-native-paper';
import { useState } from 'react'; 
import { Formik } from 'formik';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

const ValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

export const ForgotPasswordScreen = ({ navigation }: RootStackScreenProps<'ForgotPassword'>) => {
    const [user, setUser] = useState('');
    const [error, setError] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const resetPassword = (email: string) => {
        sendPasswordResetEmail(auth, email)
          .then(() => {
            Toast.show({
                type: 'success',
                text1: 'Email sent 📨',
                text2: 'Check your inbox to reset your password',
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if(errorCode === 'auth/user-not-found'){
                Toast.show({
                    type: 'error',
                    text1: 'User not found ❌',
                });
            } else
            Toast.show({
               type: 'error',
               text1: 'Unknown error ❌',
               text2: error.message,
           });
            
            // ..
            setError(JSON.stringify(error));
          });
        }
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Forgot password</Text>
        <Formik
          initialValues={{ email: '' }}
          onSubmit={values => resetPassword(values.email)}
          validationSchema={ValidationSchema}
          >
          {({ handleChange, handleBlur, handleSubmit, values,  errors, touched }) => (
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
              
              <Button onPress={handleSubmit} mode="contained" style={styles.firstButton}>Send reset email</Button>
              <Button onPress={() => navigation.navigate('Login')} mode="contained" style={styles.button}>Log in</Button>
            </View>
          )}
          </Formik>
  
          <Image source={require('../assets/psy/tmp3wr48z3d.png')} style={styles.backgroundImg} />
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
          left: '-15%',
          zIndex: -1,
          opacity: 0.08,
          // width: '70%'
        },
        input: {
          width: '100%',
          margin: 3,
        },
        error: {
            color: 'red',
        },
        button: {
          margin: 3,
        },
        firstButton: {
            margin: 3,
            marginTop: 12,
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