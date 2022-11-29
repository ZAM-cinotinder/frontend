import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {  ref, set } from "firebase/database";
import { useDatabaseValue } from '@react-query-firebase/database';
import { useQueryClient } from 'react-query';
import * as ImagePicker from 'expo-image-picker';

import { Text, View } from '../components/Themed';
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
import {UserInfo} from '../types/UserInfo';

import {Picker} from '@react-native-picker/picker';
import {RootStackScreenProps} from '../types';
import {vivodeships} from '../types/WOJEWODZTWA';

const UpdateUserProfileScheme = Yup.object().shape({
  name: Yup.string().required('Required'),
  surename: Yup.string().required('Required'),
});

export const UpdateUserProfileScreen = ({ route, navigation }: RootStackScreenProps<'UpdateUserProfileScreen'>) => {
  const { user } = useAuthentication();
  const queryClient = useQueryClient()
  const dbRef = ref(database, `users/${user?.uid ?? '*'}/userInfo`);
  const userInfo = useDatabaseValue<UserInfo>(
    ["userInfo", user?.uid],
    dbRef,
    {
      subscribe: true,
    }
  );

  const pushToDatabase = (imie:string,nazwisko:string,opis:string,wojewodztwo:string) =>{

      Toast.show({
          type: 'error',
          text1: 'Błąd sesji',
      });
      if(!user) {return;}

      const userInfoInDatabase: UserInfo = {
        surname: nazwisko,
        name: imie,
        description: opis,
        vivodeship: wojewodztwo
      }

      set(ref(database, `users/${user.uid}/userInfo`), userInfoInDatabase);

      // navigation.navigate('AddDogScreen');
      //  navigation.pop();
      Toast.show({
          type: 'success',
          text1: 'Sukces',
      });
  }

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ 
            name: userInfo?.data?.name ?? '', 
            surname: userInfo?.data?.surname ?? '', 
            description: userInfo?.data?.description ?? '', 
            voivodeship: userInfo?.data?.vivodeship ?? '',
        }}
        onSubmit={({name, surname, description, voivodeship}) => pushToDatabase(name, surname, description, voivodeship)}
        validationSchema={UpdateUserProfileScheme}
        enableReinitialize
        >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View style={styles.form}>
            <TextInput
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name} 
              style={styles.input}
              placeholder="imie"
            />
            {errors.name && touched.name && <Text style={styles.error}>{errors.name}</Text>}

            <TextInput
              onChangeText={handleChange('surname')}
              onBlur={handleBlur('surname')}
              value={values.surname} 
              style={styles.input}
              placeholder="nazwisko"
            />
            {errors.surname && touched.surname && <Text style={styles.error}>{errors.surname}</Text>}
            
            <TextInput
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description} 
              style={styles.input}
              placeholder="opis"
            />
            {errors.description && touched.description && <Text style={styles.error}>{errors.description}</Text>}
            {/*<TextInput
              onChangeText={handleChange('voivodeship')}
              onBlur={handleBlur('voivodeship')}
              value={values.voivodeship} 
              style={styles.input}
              placeholder="voivodeship"
            />
            {errors.voivodeship && touched.voivodeship && <Text style={styles.error}>{errors.voivodeship}</Text>}*/}
            <Picker
              selectedValue={values.voivodeship}
              onValueChange={(itemValue, itemIndex) =>
                setFieldValue('voivodeship', itemValue)
              }>
                <Picker.Item label="Puste" value="" />
                {vivodeships
                  .map((vivodeship) => (
                    <Picker.Item label={vivodeship} value={vivodeship} key={vivodeship} />
                    ))}
            </Picker>

            <Button onPress={handleSubmit} mode="contained" style={styles.firstButton}>Zapisz</Button>
          </View>
        )}
      </Formik>
        <Image source={require('../assets/psy/tmp3wr48z3d.png')} style={styles.backgroundImg} />
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
  dogoImage: {
    width: 100,
    height: 100,
    margin: 16,
    alignSelf: 'center',
    borderRadius: 8,
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
