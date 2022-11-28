import { StyleSheet, Image } from 'react-native';
import { ref, set } from 'firebase/database';
import { useDatabaseValue } from '@react-query-firebase/database';

import { Text, View } from '../components/Themed';
import { database } from '../constants/firebase';

import { Button } from 'react-native-paper';
import { useMemo, useRef, useState } from 'react';

import { useAuthentication} from '../hooks/useAuthentication';
import TinderCard from 'react-tinder-card'
import { v4 as uuid } from 'uuid';
import { Dogs } from '../types/Dog';
import { Message } from '../types/Message';

// @ts-ignore
export const SwipeDogsScreen = ({ navigation }) => {
    const { user } = useAuthentication();
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const voivodeship = 'Lodz';
    const swipable = useRef(null);
    // const dbRef = ref(database, `Psy/${voivodeship}`);
    
    // const lastId = undefined;
    // // const x = query(dbRef, orderByKey(), ...(lastId ? [startAt(lastId)] : []));
    // const { isLoading, error, data } = useQuery({
    //   queryKey: ['Psy'],
    //   queryFn: () => 
    //     query(dbRef, orderByKey(), ...(lastId ? [startAt(lastId)] : [])),
    // })
    const dbRef = ref(database, `Psy/${voivodeship}`);
    const dogs = useDatabaseValue<Dogs>(["Psy"], dbRef, {
      subscribe: true,
    });
    const [currentIndex, setCurrentIndex] = useState('');
  
    const onSwipe = (direction: string) => {
      console.log('You swiped: ' + direction)
      const lastArrayIndex = Object.keys(dogs.data!).indexOf(currentIndex);
      const nextDogIndex = Object.keys(dogs.data!)[lastArrayIndex + 1];
      console.log(currentIndex, nextDogIndex);

      if (direction === 'right'){
        const messageId = uuid();
        const dog = dogs.data![currentIndex];
        const messageInDatabase: Message = {
          text: 'Utworzono czat',
          date: new Date().toISOString(),
          who: user!.uid,
        };
        
        set(
          ref(
            database,
            `Chats/${messageId}/0`
          ),
          messageInDatabase
        );
        set(
          ref(
            database,
            `users/${user!.uid}/Chats/${messageId}`
          ),
          {
            otherDogId: currentIndex,
            otherUserId: dog.userId,
            lastMessage: messageInDatabase,
            isSeen: true,
          }
        );
        set(
          ref(
            database,
            `users/${dog.userId}/Chats/${messageId}`
          ),
          {
            otherDogId: '', //  TODO SELECT DOG MODAL
            otherUserId: user!.uid,
            lastMessage: messageInDatabase,
            isSeen: false,
          }
        );
      }

      setCurrentIndex(nextDogIndex);
      // @ts-ignore
      setTimeout(swipable.current?.restoreCard, 10)
    }

    const memoizedDogCard = useMemo(() => {
      if (!dogs.data) return;

      let dogo = dogs.data[currentIndex];
      if (!dogo) {
        let [[firstKey, firstValue]] = Object.entries(dogs.data);
        dogo = firstValue;
        setCurrentIndex(firstKey);
      }

      if (!dogo) {
        return;
      }

      return (
        <TinderCard onSwipe={onSwipe} preventSwipe={['up', 'down']} ref={swipable}>
           <View style={styles.dogCard}>
                <Image style={styles.dogImage} source={{uri: 'data:image/png;base64,' + dogo.photo}} />
                <Text>{dogo.Imie} {dogo.Plec}, {dogo.Wiek}m {voivodeship}</Text>
                <Text>{dogo.opis}</Text>
            </View>
          </TinderCard>
      );
    }, [dogs.data, currentIndex]);

    return (
      <View style={styles.container}>
        {memoizedDogCard}
          <View style={styles.buttonPanel}>
            {/* @ts-ignore */}
              <Button style={styles.mainScreenButton} onPress={()=>swipable.current?.swipe('left')}>Pomiń</Button>
            {/* @ts-ignore */}
              <Button style={styles.mainScreenButton} onPress={()=>swipable.current?.swipe('right')}>Dodaj</Button>
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
      overflow: 'hidden',
    },
    buttonPanel:{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 48,
        justifyContent: 'space-evenly',
        marginTop: 36,
    },
    mainScreenButton: {
    },
    form: {
      backgroundColor: 'transparent',
      width: '80%',
      padding: 10,
    },
    backgroundImg: {
      position: 'absolute',
      bottom: '-10%',
      right: '0%',
      left: '20%',
      zIndex: -1,
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