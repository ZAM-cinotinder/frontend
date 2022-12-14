import {
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  
} from "react-native";
import { ref, set } from "firebase/database";
import { useDatabaseValue } from "@react-query-firebase/database";

import { Text, View } from "../components/Themed";
import { database } from "../constants/firebase";

import { Button } from "react-native-paper";
import React, { useMemo, useRef, useState } from "react";

import { useAuthentication } from "../hooks/useAuthentication";
import TinderCard from "react-tinder-card";
import { v4 as uuid } from "uuid";
import { SelectDogDialog } from "../components/SelectDogDialog";
import { Dogs } from "../types/Dog";
import { Message } from "../types/Message";

import PSIE_ZARTY from "../components/jokes";

import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { vivodeships } from "../types/WOJEWODZTWA";

// @ts-ignore
export const SwipeDogsScreen = ({ navigation }) => {
  const { user } = useAuthentication();
  const [voivodeship, setVoivodeship] = useState("Lodzkie");
  const swipable = useRef(null);
  const dbRef = ref(database, `Psy/${voivodeship}`);
  const unfilteredDogs = useDatabaseValue<Dogs>(["Psy", voivodeship], dbRef, {
    subscribe: true,
  });
  const dogs = useMemo((): Dogs => {
    if (unfilteredDogs.data && user) {
      return Object.entries(unfilteredDogs.data)
        .filter(([id, dog]) => dog.userId !== user!.uid && dog.isActive)
        .reduce((acc, [id, dog]) => ({ ...acc, [id]: dog }), {});
    }
    return {};
  }, [unfilteredDogs.data, user?.uid, voivodeship]);
  const [currentIndex, setCurrentIndex] = useState("");
  const [selectDogDialogVisible, setSelectDogDialogVisible] = useState(false);

  const zart = () => {
    alert(PSIE_ZARTY[Math.floor(Math.random()*PSIE_ZARTY.length)]);
  }

  const nextDog = () => {
    const lastArrayIndex = Object.keys(dogs).indexOf(currentIndex);
    const nextDogIndex = Object.keys(dogs)[lastArrayIndex + 1];

    setCurrentIndex(nextDogIndex);
  };

  const dawajMiTuPoprzedniegoPsa = () => {
    if (currentIndex === "") {
      return;
    }

    const dogKeys = Object.keys(dogs);
    const lastArrayIndex = dogKeys.indexOf(currentIndex);
    const nextArrayIndex =
      lastArrayIndex > 0 ? lastArrayIndex - 1 : dogKeys.length - 1;
    const nextDogUuid = dogKeys[nextArrayIndex];

    setCurrentIndex(nextDogUuid);
  };

  const onDogSelect = (dogId: string) => {
    const messageId = uuid();
    const dog = dogs[currentIndex];
    const messageInDatabase: Message = {
      text: "Utworzono czat",
      date: new Date().toISOString(),
      who: user!.uid,
    };

    set(ref(database, `Chats/${messageId}/0`), messageInDatabase);
    set(ref(database, `users/${user!.uid}/Chats/${messageId}`), {
      otherDogId: currentIndex,
      otherUserId: dog.userId,
      lastMessage: messageInDatabase,
      isSeen: true,
    });
    set(ref(database, `users/${dog.userId}/Chats/${messageId}`), {
      otherDogId: dogId,
      otherUserId: user!.uid,
      lastMessage: messageInDatabase,
      isSeen: false,
    });
    nextDog();
    // @ts-ignore
    setTimeout(swipable.current?.restoreCard, 10);
    setSelectDogDialogVisible(false);
  };

  const onModalDismiss = () => {
    nextDog();
    // @ts-ignore
    setTimeout(swipable.current?.restoreCard, 10);
    setSelectDogDialogVisible(false);
  };

  const onSwipe = (direction: string) => {
    switch (direction) {
      case "left":
        nextDog();
        // @ts-ignore
        setTimeout(swipable.current?.restoreCard, 10);
        break;
      case "right":
        setSelectDogDialogVisible(true);
        break;
    }
  };

  const memoizedDogCard = useMemo(() => {
    let dogo = dogs[currentIndex];
    if (!dogo) {
      let [firstDogo] = Object.entries(dogs);
      if (!firstDogo) {
        return;
      }

      const [firstKey, firstValue] = firstDogo;
      dogo = firstValue;

      setCurrentIndex(firstKey);
    }

    if (!dogo) {
      return;
    }

    return (
      <TinderCard
        onSwipe={onSwipe}
        preventSwipe={["up", "down"]}
        ref={swipable}
      >
        <View style={styles.dogCard}>
          <Image
            style={styles.dogImage}
            source={{ uri: "data:image/png;base64," + dogo.photo }}
          />
          <Text style={styles.dogName}>
            {dogo.Imie} {dogo.Plec}, {dogo.Wiek}m {voivodeship}
          </Text>
          <Text>{dogo.opis}</Text>
        </View>
      </TinderCard>
    );
  }, [dogs, currentIndex]);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={voivodeship}
        onValueChange={(itemValue) => setVoivodeship(itemValue)}
        style={styles.picker}
      >
        {vivodeships.map((vivodeship) => (
          <Picker.Item label={vivodeship} value={vivodeship} key={vivodeship} />
        ))}
      </Picker>
      <SelectDogDialog
        onSelect={onDogSelect}
        onDismiss={onModalDismiss}
        visible={selectDogDialogVisible}
      />
      {
        !(Object.keys(dogs)?.length) && <View style={styles.dogCard}>
          <Text style={styles.dogName}>
            Chwilowy brak psów w {voivodeship}
          </Text>
          <Text style={styles.dogName}>
            Spróbuj inne województwo!
          </Text>
        </View>
      }
      {memoizedDogCard}
      <View style={buttonStyles.buttonPanel}>
        <View style={buttonStyles.upperButtonsContainer}>
          <TouchableWithoutFeedback
            // @ts-ignore
            onPress={() => dawajMiTuPoprzedniegoPsa()}
          >
            <LinearGradient
              colors={["#9747FF", "#00D2FF"]}
              style={buttonStyles.gradient}
              end={{ x: 0.2, y: 1 }}
            >
              <AntDesign name="reload1" size={26} color="#FFF172" />
            </LinearGradient>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={zart}
          >
          <LinearGradient
            colors={["#9747FF", "#00D2FF"]}
            style={buttonStyles.gradient}
            end={{ x: 0.2, y: 1 }}
          >
            <AntDesign name="star" size={26} color="#b3c6ff" />
          </LinearGradient></TouchableWithoutFeedback>
        </View>

        <View style={buttonStyles.bottomButtonsContainer}>
          <TouchableWithoutFeedback
            // @ts-ignore
            onPress={() => swipable.current?.swipe("left")}
          >
            <LinearGradient
              colors={["#9747FF", "#00D2FF"]}
              style={buttonStyles.gradient}
              end={{ x: 0.2, y: 1 }}
            >
              <Entypo name="cross" size={40} color="#FF82BE" />
            </LinearGradient>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            // @ts-ignore
            onPress={() => swipable.current?.swipe("right")}
          >
            <LinearGradient
              colors={["#9747FF", "#00D2FF"]}
              style={buttonStyles.gradient}
              end={{ x: 0.2, y: 1 }}
            >
              <AntDesign name="heart" size={40} color="#D0FFCE" />
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <Image
        source={require("../assets/psy/tmp9mz_gec9.png")}
        style={styles.backgroundImg}
      />
    </View>
  );
};

const buttonStyles = StyleSheet.create({
  upperButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    marginTop: 20,
  },
  bottomButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "transparent",
    marginTop: 20,
  },
  buttonPanel: {
    flexDirection: "column",
    width: Dimensions.get("window").width - 100,
    justifyContent: "space-around",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  gradient: {
    padding: 15,
    borderRadius: 26,
  },
  text: {
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#ffffff",
    zIndex: 1000,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    overflow: "hidden",
  },
  backgroundImg: {
    position: "absolute",
    bottom: "-10%",
    right: "0%",
    left: "20%",
    zIndex: -1,
    opacity: 0.12,
  },
  picker: {
    width: '100%',
  },
  dogImage: {
    width: "100%",
    height: 300,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 16,
  },
  dogCard: {
    backgroundColor: "#fff",
    width: Dimensions.get("window").width - 50,
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,

    flexDirection: "column",
    flexWrap: "wrap",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  dogName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dogInfo: {
    fontSize: 12,
    color: "#000",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    margin: 3,
  },
  button: {
    margin: 3,
  },
});
