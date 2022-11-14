import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {  ref, get } from "firebase/database";
import { useDatabaseValue } from '@react-query-firebase/database';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import {auth, database} from '../constants/firebase';

import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {Button, TextInput} from 'react-native-paper';
import { useState } from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Toast from 'react-native-toast-message';
import {useAuthentication} from '../hooks/useAuthentication';
import {Dog, Dogs} from '../types/Dog';

export const YourDogsListScreen = ({ navigation }: RootStackScreenProps<'YourDogsListScreen'>) => {
    const { user } = useAuthentication();
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const dbRef = ref(database, `users/${user?.uid ?? '*'}/Psy`);
    const dogs = useDatabaseValue<Dogs>(["Psy", user?.uid], dbRef);
  
    const renderDogCards = () =>{
      if(!dogs?.data) return null;

      return Object.entries(dogs.data).map(([id, dog]) => (
          <View style={styles.dogCard}>
            <TouchableOpacity onPress={() => navigation.push('AddDogScreen', {...dog, id})}>
              <Text style={styles.dogName}>{dog.Imie}</Text>
              <Text style={styles.dogInfo}>{dog.Rasa}</Text>
              <Text style={styles.dogInfo}>{dog.Wiek}</Text>
              <Text style={styles.dogInfo}>{dog.Plec}</Text>
            </TouchableOpacity>
          </View>
      ));
    }

    return (
      <View style={styles.container}>
        <Text>{JSON.stringify(dogs.data)}</Text>
          {renderDogCards()}
          <Image source={require('../assets/psy/tmpspemxaxj.png')} style={styles.backgroundImg} />
          <Button mode="contained" onPress={() => navigation.push('AddDogScreen')}>DODAJ PSA</Button>
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
      left: '20%',
      zIndex: -1,
      // width: '70%'
    },
    dogCard: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    dogName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    dogInfo: {
        fontSize: 12,
        color: '#000',
        marginBottom: 5,
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
  