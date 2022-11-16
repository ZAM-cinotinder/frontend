import { StyleSheet, Image, ImageStyle } from 'react-native';
import {  ref, get, equalTo, orderByKey, startAt  } from "firebase/database";
import { useDatabaseValue } from '@react-query-firebase/database';
import { useQuery } from 'react-query';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import {auth, database} from '../constants/firebase';

import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {Button, TextInput} from 'react-native-paper';
import { useState } from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';

import { getDatabase, query, orderByChild } from "firebase/database";
import Toast from 'react-native-toast-message';
import {useAuthentication} from '../hooks/useAuthentication';
import {Dog, Dogs} from '../types/Dog';


export const MainSwipeDogsScreen = ({ navigation }: RootStackScreenProps<'MainSwipeDogsScreen'>) => {
    const { user } = useAuthentication();
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const voivodeship = 'Lodz';
    const dbRef = ref(database, `Psy/${voivodeship}`);
    
    const lastId = undefined;
    // const x = query(dbRef, orderByKey(), ...(lastId ? [startAt(lastId)] : []));
    const { isLoading, error, data } = useQuery({
      queryKey: ['Psy'],
      queryFn: () =>
        query(dbRef, orderByKey(), ...(lastId ? [startAt(lastId)] : [])),
    })
    


    return (
        <View style={styles.container}>
            <View style={styles.dogCard}>
                <Image style={styles.mainCard as ImageStyle} source={require('')} />
                <Text>, 26m {voivodeship}</Text>
                <Text>Golden Retriever, very playful</Text>
            </View>
            <View style={styles.buttonPanel}>
                <Button style={styles.mainScreenButton}> a</Button>
                <Button style={styles.mainScreenButton}> b</Button>
                <Button style={styles.mainScreenButton}> c</Button>
                <Button style={styles.mainScreenButton}> f</Button>
            </View>
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
    buttonPanel:{
        flexDirection: "row",
        flexWrap: "wrap",
    },
    mainScreenButton: {
        backgroundColor:'blue',
        width:'50px',
        height:'50px',
        borderRadius: 25,
        marginTop:20,
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

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
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
    mainCard :{
        width: '90%',
        height: '300px',
    }
  });
  