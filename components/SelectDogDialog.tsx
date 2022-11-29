import {Dialog, Portal, Button} from 'react-native-paper';
import {Dog, Dogs} from '../types/Dog';
import {ref} from 'firebase/database';
import {useDatabaseValue} from '@react-query-firebase/database';
import {database} from '../constants/firebase';
import {useAuthentication} from '../hooks/useAuthentication';
import {TouchableOpacity, Image, StyleSheet, ScrollView} from 'react-native';
import {Text, View} from './Themed';

interface Props {
    onSelect: (id: string) => void;
    onDismiss: () => void;
    visible: boolean;
}


export const SelectDogDialog = ({ onSelect, onDismiss, visible }: Props) => {
    const { user } = useAuthentication();
    const dbRef = ref(database, `users/${user?.uid ?? '*'}/Psy`);
    const dogs = useDatabaseValue<Dogs>(["Psy", user?.uid], dbRef, {
      subscribe: true,
    });
  
    const renderDogCards = () =>{
      if(!dogs?.data) return null;
      
      return Object.entries(dogs.data).map(([id, dog]) => (
        <TouchableOpacity onPress={() => onSelect(id)} style={styles.dogCard} key={id + Math.random()}>
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

    return <Portal>
        <Dialog visible={visible} onDismiss={onDismiss} style={{flex: 1}}>
            <Dialog.Content style={{flex: 1}}>
                <View style={styles.container}>
                    <Dialog.ScrollArea>
                    <ScrollView >
                                {renderDogCards()}
                    </ScrollView>
                    </Dialog.ScrollArea>
                    <Image source={require('../assets/psy/tmpxevk9x41.png')} style={styles.backgroundImg} />
                </View>
            </Dialog.Content>
        </Dialog>
    </Portal>
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
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
    left: '-20%',
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
