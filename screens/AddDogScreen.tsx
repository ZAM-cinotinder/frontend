import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {  ref, set } from "firebase/database";
import { useDatabaseValue } from '@react-query-firebase/database';
import { useQueryClient } from 'react-query';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import {auth, database} from '../constants/firebase';

import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {Button, TextInput} from 'react-native-paper';
import { useState } from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

import Toast from 'react-native-toast-message';
import {useAuthentication} from '../hooks/useAuthentication';
import {Dog} from '../types/Dog';

const AddDogScheme = Yup.object().shape({
  imie: Yup.string().required('Required'),
  plec: Yup.string().required('Required'),
  rasa: Yup.string().required('Required'),
  wiek: Yup.string().matches(/^\d+$/, 'WIEK TO LICZBA').required('Required'),
});


export const AddDogScreen = ({ route, navigation }: RootStackScreenProps<'AddDogScreen'>) => {
  const { user } = useAuthentication();
  const queryClient = useQueryClient()
  const Dog = route.params;
    const pushToDatabase = (name:string,gender:string,breed:string,age:string) =>{

        Toast.show({
            type: 'error',
            text1: 'Błąd sesji',
        });
        if(!user) {return;}

        const dogInDatabase: Dog = {
          userId: user.uid,
          Imie: name,
          Plec: gender,
          Rasa: breed,
          Wiek: Number.parseInt(age)
        }

        const dogId = Dog?.id ?? uuid();
        queryClient.invalidateQueries(["Psy", user?.uid]);

        set(ref(database, `users/${user.uid}/Psy/${dogId}`), dogInDatabase);
        set(ref(database, `Psy/Lodz/${dogId}`), dogInDatabase);

        navigation.pop();
        Toast.show({
            type: 'success',
            text1: 'Sukces',
        });
    }

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ 
            imie: Dog?.Imie ?? '', 
            plec: Dog?.Plec ?? '', 
            rasa: Dog?.Rasa ?? '', 
            wiek: String(Dog?.Wiek)
        }}
        onSubmit={({imie, plec, rasa, wiek}) => pushToDatabase(imie, plec ,rasa , wiek)}
        validationSchema={AddDogScheme}
        >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              onChangeText={handleChange('imie')}
              onBlur={handleBlur('imie')}
              value={values.imie} 
              style={styles.input}
              placeholder="imie"
            />
            {errors.imie && touched.imie && <Text style={styles.error}>{errors.imie}</Text>}
            <TextInput
              onChangeText={handleChange('plec')}
              onBlur={handleBlur('plec')}
              value={values.plec} 
              style={styles.input}
              placeholder="plec"
            />
            {errors.plec && touched.plec && <Text style={styles.error}>{errors.plec}</Text>}
            <TextInput
              onChangeText={handleChange('rasa')}
              onBlur={handleBlur('rasa')}
              value={values.rasa} 
              style={styles.input}
              placeholder="rasa"
            />
            {errors.rasa && touched.rasa && <Text style={styles.error}>{errors.rasa}</Text>}
            <TextInput
              onChangeText={handleChange('wiek')}
              onBlur={handleBlur('wiek')}
              value={values.wiek} 
              style={styles.input}
              placeholder="wiek"
            />
            {errors.wiek && touched.wiek && <Text style={styles.error}>{errors.wiek}</Text>}
            <Button onPress={handleSubmit} mode="contained" style={styles.firstButton}>{Dog ? 'Edit' : 'Create'} psa</Button>
          </View>
        )}
      </Formik>
        <Image source={require('../assets/psy/pies28.png')} style={styles.backgroundImg} />
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
