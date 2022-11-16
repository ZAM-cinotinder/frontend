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
    const dogs = useDatabaseValue<Dogs>(["Psy", user?.uid], dbRef, {
      subscribe: true,
    });
  
    const renderDogCards = () =>{
      if(!dogs?.data) return null;
      
      return Object.entries(dogs.data).map(([id, dog]) => (
        <TouchableOpacity onPress={() => navigation.push('AddDogScreen', {...dog, id})} style={styles.dogCard} key={id}>
          <View style={{flex: 1}}>
            <Text style={styles.dogName}>{dog.Imie}, {dog.Rasa} {dog.Wiek}m</Text>
            <Text style={styles.dogPlec}>{dog.Plec}</Text>
            <Text style={styles.dogOpis}>{dog.opis}</Text>
            <Text style={styles.dogVoivodeship}>{dog.voivodeship}</Text>
      
          </View>
          <Image style={styles.dogImage} source={{uri: 'data:image/png;base64,' + dog.photo}}/>
        </TouchableOpacity>
      ));
    }

    return (
      <View style={styles.container}>
          <Button mode="contained" onPress={() => navigation.push('AddDogScreen')} style={{marginBottom: 16}}>Add new dog</Button>
          {renderDogCards()}
          <Image source={require('../assets/psy/tmpspemxaxj.png')} style={styles.backgroundImg} />
          {/* <Text style={styles.linkText}>{user}</Text>
          <Text style={styles.linkText}>{error}</Text> */}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
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
    dogImage: {
      width: 100, 
      height: 100, 
      borderWidth: 1,
      borderRadius: 16,
    },
    dogCard: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,

        flexDirection: "row",
        flexWrap: "wrap",

        justifyContent: "space-between",
        
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        
        elevation: 3,
    },
    dogName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    dogOpis: {
        fontSize: 16,
        color: '#000',
    },
    dogVoivodeship: {
      fontSize: 12,
      color: '#000',
      marginBottom: 5,
      marginTop: -3,
    },
    dogPlec: {
        fontSize: 12,
        color: '#000',
        marginBottom: 5,
        marginTop: -3,
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
  